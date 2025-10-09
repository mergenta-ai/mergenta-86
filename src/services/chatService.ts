import { supabase } from "@/integrations/supabase/client";

export interface ChatRequest {
  prompt: string;
  contentType?: string;
  formData?: Record<string, any>;
  intentType?: 'creative' | 'knowledge' | 'research' | 'user_search' | 'experience_studio';
  userId: string;
  preferredModel?: string;
}

export interface ChatResponse {
  response: string;
  sources?: Array<{
    id: string;
    type: 'google' | 'rss';
    title: string;
    url: string;
    snippet: string;
  }>;
  quotaRemaining?: number;
  fallbackUsed?: boolean;
  error?: string;
  message?: string;
}

export class ChatService {
  private static instance: ChatService;
  
  private constructor() {}
  
  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  /**
   * Route a chat request through the new LLM routing system
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      console.log('Routing chat request:', { 
        intentType: request.intentType, 
        contentType: request.contentType 
      });

      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Authentication required');
      }

      // Route through chat-router edge function
      const { data, error } = await supabase.functions.invoke('chat-router', {
        body: {
          prompt: request.prompt,
          contentType: request.contentType,
          formData: request.formData,
          intentType: request.intentType,
          userId: session.user.id,
          preferredModel: request.preferredModel
        }
      });

      if (error) {
        console.error('Chat router error:', error);
        
        // Handle quota exceeded specifically
        if (error.message?.includes('Quota exceeded') || error.message?.includes('429')) {
          return {
            response: '',
            error: 'Quota exceeded',
            message: data?.message || 'You have reached your usage limit. Please try again later or upgrade your plan.'
          };
        }
        
        throw new Error(error.message || 'Failed to get response');
      }

      console.log('Chat router response:', data);

      return {
        response: data.response || '',
        sources: data.sources,
        quotaRemaining: data.quotaRemaining,
        fallbackUsed: data.fallbackUsed || false
      };

    } catch (error) {
      console.error('Chat service error:', error);
      
      return {
        response: '',
        error: 'Service error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'
      };
    }
  }

  /**
   * Generate structured prompt using existing prompt-engine-consolidated
   */
  async generateStructuredPrompt(contentType: string, formData: Record<string, any>): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('prompt-engine-consolidated', {
        body: {
          contentType,
          formData
        }
      });

      if (error) {
        console.error('Prompt engine error:', error);
        throw new Error('Failed to generate prompt');
      }

      return data.prompt || '';
    } catch (error) {
      console.error('Generate structured prompt error:', error);
      throw error;
    }
  }

  /**
   * Determine intent type based on content type and context
   */
  determineIntentType(contentType?: string, isSearch: boolean = false): 'creative' | 'knowledge' | 'research' | 'user_search' | 'experience_studio' {
    if (isSearch) {
      return 'user_search';
    }

    if (!contentType) {
      return 'creative';
    }

    // Knowledge-based content types
    const knowledgeTypes = ['brainstorm', 'scenario', 'mentor', 'devils_advocate'];
    if (knowledgeTypes.includes(contentType)) {
      return 'knowledge';
    }

    // Research-based content types
    const researchTypes = ['research', 'analysis', 'deep_dive'];
    if (researchTypes.includes(contentType)) {
      return 'research';
    }

    // Experience studio types
    const experienceTypes = ['snapshot', 'pov_lab', 'future_pathways', 'roleplay', 'reality_check', 'proto_run'];
    if (experienceTypes.includes(contentType)) {
      return 'experience_studio';
    }

    // Default to creative for all letter types and creative writing
    return 'creative';
  }

  /**
   * Check if user has sufficient quota for request
   */
  async checkQuota(userId: string, intentType: string): Promise<{ hasQuota: boolean; message?: string }> {
    try {
      // This would ideally be a separate endpoint, but for now we'll let chat-router handle it
      return { hasQuota: true };
    } catch (error) {
      console.error('Quota check error:', error);
      return { hasQuota: true }; // Fail open
    }
  }

  /**
   * Handle prompt generation from workflow cards
   */
  async handleWorkflowPrompt(contentType: string, formData: Record<string, any>): Promise<ChatResponse> {
    try {
      // First generate the structured prompt
      const structuredPrompt = await this.generateStructuredPrompt(contentType, formData);
      
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Authentication required');
      }

      // Determine intent type
      const intentType = this.determineIntentType(contentType);

      // Route through the chat system
      return await this.sendMessage({
        prompt: structuredPrompt,
        contentType,
        formData,
        intentType,
        userId: session.user.id
      });

    } catch (error) {
      console.error('Workflow prompt error:', error);
      return {
        response: '',
        error: 'Workflow error',
        message: error instanceof Error ? error.message : 'Failed to process workflow request'
      };
    }
  }

  /**
   * Handle direct user search or chat
   */
  async handleDirectMessage(message: string, preferredModel?: string, isFollowUp: boolean = false): Promise<ChatResponse> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Authentication required');
      }

      // Only trigger search for new queries, not follow-ups
      const isSearch = !isFollowUp && this.looksLikeSearch(message);
      const intentType = isSearch ? 'user_search' : 'creative';

      return await this.sendMessage({
        prompt: message,
        intentType,
        userId: session.user.id,
        preferredModel
      });

    } catch (error) {
      console.error('Direct message error:', error);
      return {
        response: '',
        error: 'Message error',
        message: error instanceof Error ? error.message : 'Failed to process message'
      };
    }
  }

  /**
   * Simple heuristic to determine if a message looks like a search query
   */
  private looksLikeSearch(message: string): boolean {
    const searchKeywords = [
      'what is', 'how to', 'why does', 'when did', 'where is',
      'tell me about', 'explain', 'research', 'find information',
      'latest news', 'current', 'recent', 'update on'
    ];

    const lowerMessage = message.toLowerCase();
    return searchKeywords.some(keyword => lowerMessage.includes(keyword)) ||
           message.endsWith('?') ||
           message.split(' ').length <= 5; // Short queries likely searches
  }
}

export const chatService = ChatService.getInstance();