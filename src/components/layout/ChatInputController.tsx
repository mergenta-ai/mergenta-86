import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * CHAT INPUT CONTROLLER HOOK
 * Custom hook for managing chat input state and behavior
 * Provides scoped refs and eliminates global DOM queries
 */

export interface ChatInputState {
  input: string;
  height: number;
  isRecording: boolean;
  showModelDropdown: boolean;
  showTTS: boolean;
}

export interface ChatInputControllerProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  initialValue?: string;
  placeholder?: string;
  lastResponse?: string;
  onFocus?: () => void;
  onHeightChange?: (height: number) => void;
  className?: string;
}

export interface ChatInputControllerReturn {
  // State
  state: ChatInputState;
  setState: React.Dispatch<React.SetStateAction<ChatInputState>>;
  
  // Refs
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  modelDropdownRef: React.RefObject<HTMLDivElement>;
  
  // Handlers
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleActionButtonClick: () => void;
  handleClearInput: () => void;
  
  // Props passthrough
  onFocus?: () => void;
  isLoading: boolean;
  placeholder: string;
  lastResponse?: string;
  className: string;
}

export function useChatInputController({
  onSendMessage,
  isLoading = false,
  initialValue = '',
  placeholder = 'Ask Mergenta...',
  lastResponse,
  onFocus,
  onHeightChange,
  className = '',
}: ChatInputControllerProps): ChatInputControllerReturn {
  // Scoped state management
  const [state, setState] = useState<ChatInputState>({
    input: initialValue,
    height: 24, // var(--chat-input-min-height) in pixels
    isRecording: false,
    showModelDropdown: false,
    showTTS: false,
  });

  // Scoped refs - no global DOM queries
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver>();
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  // Reliable textarea resizing with ResizeObserver
  const updateTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to get accurate scrollHeight
    textarea.style.height = 'auto';
    
    // Calculate new height within constraints
    const minHeight = 24; // var(--chat-input-min-height)
    const maxHeight = 120; // var(--chat-input-max-height)
    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
    
    // Apply new height
    textarea.style.height = `${newHeight}px`;
    
    // Update state and notify parent if height changed
    if (newHeight !== state.height) {
      setState(prev => ({ ...prev, height: newHeight }));
      onHeightChange?.(newHeight);
    }
  }, [state.height, onHeightChange]);

  // Initialize ResizeObserver for reliable height tracking
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Create ResizeObserver instance
    resizeObserverRef.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newHeight = entry.contentRect.height;
        if (newHeight !== state.height) {
          setState(prev => ({ ...prev, height: newHeight }));
          onHeightChange?.(newHeight);
        }
      }
    });

    // Start observing
    resizeObserverRef.current.observe(textarea);

    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, [state.height, onHeightChange]);

  // Handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState(prev => ({ ...prev, input: e.target.value }));
    // Trigger height update on next frame
    requestAnimationFrame(updateTextareaHeight);
  }, [updateTextareaHeight]);

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (state.input.trim() && !isLoading) {
      onSendMessage(state.input.trim());
      setState(prev => ({ ...prev, input: '' }));
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = '24px';
        setState(prev => ({ ...prev, height: 24 }));
        onHeightChange?.(24);
      }
    }
  }, [state.input, isLoading, onSendMessage, onHeightChange]);

  // Handle keyboard events
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  // Handle action button click (send/record)
  const handleActionButtonClick = useCallback(() => {
    if (state.isRecording) {
      setState(prev => ({ ...prev, isRecording: false }));
    } else if (state.input.trim()) {
      onSendMessage(state.input.trim());
      setState(prev => ({ ...prev, input: '' }));
      if (textareaRef.current) {
        textareaRef.current.style.height = '24px';
        setState(prev => ({ ...prev, height: 24 }));
        onHeightChange?.(24);
      }
    } else {
      setState(prev => ({ ...prev, isRecording: true }));
    }
  }, [state.isRecording, state.input, onSendMessage, onHeightChange]);

  // Handle clear input
  const handleClearInput = useCallback(() => {
    setState(prev => ({ ...prev, input: '' }));
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px';
      textareaRef.current.focus();
      setState(prev => ({ ...prev, height: 24 }));
      onHeightChange?.(24);
    }
  }, [onHeightChange]);

  // Update input when initialValue changes
  useEffect(() => {
    setState(prev => ({ ...prev, input: initialValue }));
    requestAnimationFrame(updateTextareaHeight);
  }, [initialValue, updateTextareaHeight]);

  // Handle outside clicks for model dropdown
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setState(prev => ({ ...prev, showModelDropdown: false }));
      }
    };

    if (state.showModelDropdown) {
      // Use pointer events for better touch/mouse compatibility
      document.addEventListener('pointerdown', handlePointerDown);
      document.addEventListener('touchstart', handlePointerDown as any);
    }

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown as any);
    };
  }, [state.showModelDropdown]);

  return {
    // State
    state,
    setState,
    
    // Refs
    textareaRef,
    containerRef,
    modelDropdownRef,
    
    // Handlers
    handleInputChange,
    handleSubmit,
    handleKeyDown,
    handleActionButtonClick,
    handleClearInput,
    
    // Props passthrough
    onFocus,
    isLoading,
    placeholder,
    lastResponse,
    className,
  };
}

export default useChatInputController;