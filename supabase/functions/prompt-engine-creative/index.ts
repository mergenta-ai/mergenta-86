import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PromptRequest {
  contentType: string;
  formData: Record<string, any>;
}

const creativePrompts = {
  essay: (data: any) => {
    return `You are an expert essay writer with advanced degrees in literature and composition. You specialize in creating compelling, well-structured academic and creative essays.

**Assignment Details:**
- Title: "${data.essayTitle || 'Untitled Essay'}"
- Key Points: ${data.keyPoints || 'Not specified'}
- Word Count: ${data.wordCount || 'Not specified'}
- Tone: ${data.tone || 'Academic'}
- Audience: ${data.audience || 'General'}

**Instructions:**
Create a comprehensive, engaging essay that:
1. Opens with a compelling hook that draws the reader in
2. Presents a clear, arguable thesis statement
3. Develops each key point with supporting evidence and analysis
4. Uses smooth transitions between paragraphs
5. Maintains the specified tone throughout
6. Concludes with a memorable ending that reinforces the main argument

**Quality Guidelines:**
- Use varied sentence structures for engaging prose
- Include specific examples and evidence
- Ensure logical flow from introduction to conclusion
- Maintain academic rigor while keeping it accessible to the target audience
- Proofread for grammar, clarity, and coherence

Begin writing the essay now.`;
  },

  story: (data: any) => {
    return `You are a master storyteller with expertise in crafting compelling narratives across all genres. You understand character development, plot structure, and the art of engaging readers from the first sentence.

**Story Parameters:**
- Title: "${data.title || data.storyTitle || 'Untitled Story'}"
- Genre: ${data.genre || 'Not specified'}
- Key Details: ${data.keyDetails || 'Not specified'}
- Word Count: ${data.wordCount || 'Not specified'}
- Tone: ${data.tone || 'Engaging'}
- Audience: ${data.audience || 'General'}

**Creative Instructions:**
Write an captivating story that:
1. Establishes compelling characters with clear motivations
2. Creates an engaging opening that hooks the reader immediately
3. Develops a well-paced plot with rising action, climax, and resolution
4. Uses vivid, sensory descriptions to bring scenes to life
5. Incorporates dialogue that reveals character and advances the plot
6. Maintains consistent tone and voice throughout
7. Delivers a satisfying conclusion that resolves the story's central conflict

**Storytelling Guidelines:**
- Show, don't tell - use action and dialogue to reveal information
- Create emotional connection between readers and characters
- Use specific, concrete details rather than vague descriptions
- Vary sentence length and structure for rhythm and pacing
- Include conflict and tension to maintain reader interest

Begin crafting the story now.`;
  },

  flash_fiction: (data: any) => {
    return `You are a skilled flash fiction writer who excels at creating powerful, complete stories in minimal word counts. You understand how to maximize impact through precise language and compressed storytelling.

**Flash Fiction Parameters:**
- Title: "${data.title || 'Untitled Flash Fiction'}"
- Theme: ${data.theme || 'Not specified'}
- Key Elements: ${data.keyElements || 'Not specified'}
- Word Count: ${data.wordCount || '500 words or less'}
- Mood: ${data.mood || 'Evocative'}
- Style: ${data.style || 'Literary'}

**Flash Fiction Instructions:**
Create a complete, impactful story that:
1. Begins in medias res with immediate engagement
2. Focuses on a single moment, scene, or revelation
3. Uses every word purposefully - no wasted language
4. Creates a complete emotional arc despite brevity
5. Leaves a lasting impression on the reader
6. May end with a twist, revelation, or moment of clarity

**Craft Guidelines:**
- Choose precise, evocative words over lengthy descriptions
- Imply backstory rather than explaining it
- Use subtext and suggestion effectively
- Create one powerful scene rather than multiple smaller ones
- End with resonance - something that lingers in the reader's mind

Begin writing the flash fiction piece now.`;
  },

  poetry: (data: any) => {
    return `You are a accomplished poet with deep understanding of various poetic forms, meter, rhythm, and the power of language to evoke emotion and imagery.

**Poetry Parameters:**
- Title: "${data.title || 'Untitled Poem'}"
- Theme: ${data.theme || 'Not specified'}
- Form: ${data.form || 'Free verse'}
- Mood: ${data.mood || 'Contemplative'}
- Number of Lines: ${data.numberOfLines || 'Not specified'}
- Audience: ${data.audience || 'General'}

**Poetic Instructions:**
Create an evocative poem that:
1. Captures the essence of the theme through vivid imagery
2. Uses sound devices (alliteration, assonance, rhyme) effectively
3. Employs metaphor and symbolism to deepen meaning
4. Creates emotional resonance with carefully chosen words
5. Maintains consistent voice and tone
6. Follows the specified form while allowing for creative expression

**Poetry Guidelines:**
- Choose words for both meaning and sound
- Use line breaks and stanza breaks purposefully
- Create strong visual and sensory images
- Layer meaning through literary devices
- Consider rhythm and flow when reading aloud
- End with impact - a memorable final image or thought

Begin composing the poem now.`;
  },

  script: (data: any) => {
    return `You are a skilled screenwriter and script writer with expertise in dialogue, character development, and visual storytelling across various formats and genres.

**Script Parameters:**
- Title: "${data.title || 'Untitled Script'}"
- Format: ${data.format || 'Not specified'}
- Genre: ${data.genre || 'Not specified'}
- Length: ${data.length || 'Not specified'}
- Characters: ${data.characters || 'Not specified'}
- Setting: ${data.setting || 'Not specified'}

**Script Writing Instructions:**
Create a compelling script that:
1. Uses proper screenplay/script formatting conventions
2. Develops distinct, memorable characters with unique voices
3. Writes natural, purposeful dialogue that advances story
4. Includes clear, concise action lines and scene descriptions
5. Maintains proper pacing and dramatic structure
6. Creates visual storytelling opportunities

**Script Guidelines:**
- Show character through action and dialogue, not exposition
- Keep action lines concise and in present tense
- Write dialogue that sounds natural when spoken aloud
- Use proper script formatting (INT./EXT., character names, etc.)
- Create clear scene transitions and visual flow
- Balance dialogue with visual storytelling elements

Begin writing the script now.`;
  },

  speech: (data: any) => {
    return `You are an expert speechwriter and public speaking coach with experience crafting memorable, impactful speeches for various occasions and audiences.

**Speech Details:**
- Topic/Occasion: ${data.topic || 'Not specified'}
- Audience: ${data.audience || 'General audience'}
- Length: ${data.length || 'Not specified'}
- Tone: ${data.tone || 'Engaging and appropriate'}
- Key Messages: ${data.keyMessages || 'Not specified'}
- Call to Action: ${data.callToAction || 'Not specified'}

**Speech Writing Instructions:**
Create a powerful, memorable speech that:
1. Opens with a strong hook that captures attention immediately
2. Clearly states the main message or purpose early
3. Organizes key points logically with smooth transitions
4. Uses rhetorical devices effectively (repetition, metaphor, etc.)
5. Includes stories, examples, or evidence to support points
6. Builds to a climactic moment and memorable conclusion
7. Ends with a clear, inspiring call to action

**Public Speaking Guidelines:**
- Write for the ear, not the eye - use conversational language
- Include pauses and emphasis cues for delivery
- Use short, punchy sentences mixed with longer, flowing ones
- Repeat key messages for emphasis and memorability
- Include emotional appeals alongside logical arguments
- Test phrases for how they sound when spoken aloud

Begin writing the speech now.`;
  },

  blog: (data: any) => {
    return `You are an expert blog writer and content creator who understands how to engage online audiences with informative, entertaining, and shareable content.

**Blog Post Details:**
- Topic: ${data.blogTitle || data.topic || 'Not specified'}
- Target Audience: ${data.audience || 'General readers'}
- Tone: ${data.tone || 'Engaging and informative'}
- Length: ${data.length || 'Medium-form (800-1200 words)'}
- Word Count: ${data.wordCount || 'Not specified'}
- SEO Keywords: ${data.keywords || 'Not specified'}

**Blog Writing Instructions:**
Create an engaging blog post that:
1. Uses a compelling headline that promises value
2. Opens with a hook that draws readers in immediately
3. Provides clear, actionable value to the target audience
4. Uses subheadings to break up text and improve scannability
5. Includes examples, stories, or data to support points
6. Maintains conversational, accessible tone throughout
7. Ends with engagement (question, call to action, or discussion prompt)

**Content Guidelines:**
- Write scannable content with bullet points and short paragraphs
- Include relevant keywords naturally throughout
- Add personal anecdotes or case studies where appropriate
- Use active voice and direct language
- Provide actionable takeaways for readers
- Include a clear call to action at the end

Begin writing the blog post now.`;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Creative Content Engine: Processing request');
    const { contentType, formData }: PromptRequest = await req.json();
    
    console.log(`Creative Content Engine: Content type: ${contentType}`);
    console.log(`Creative Content Engine: Form data:`, formData);

    // Check if we have a prompt generator for this content type
    if (!creativePrompts[contentType as keyof typeof creativePrompts]) {
      console.error(`Creative Content Engine: Unknown content type: ${contentType}`);
      return new Response(
        JSON.stringify({ 
          error: `Content type "${contentType}" is not supported by Creative Content Engine` 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate the prompt
    const promptGenerator = creativePrompts[contentType as keyof typeof creativePrompts];
    const generatedPrompt = promptGenerator(formData);

    console.log(`Creative Content Engine: Generated prompt for ${contentType}`);
    console.log(`Creative Content Engine: Prompt length: ${generatedPrompt.length} characters`);

    return new Response(
      JSON.stringify({ 
        success: true,
        prompt: generatedPrompt,
        contentType: contentType
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Creative Content Engine: Error processing request:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate prompt',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});