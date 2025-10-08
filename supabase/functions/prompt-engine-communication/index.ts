import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PromptRequest {
  contentType: string;
  formData: Record<string, any>;
}

const communicationPrompts = {
  love_letter: (data: any) => {
    return `You are an expert letter writer specializing in heartfelt, romantic correspondence. You understand how to express deep emotions with sincerity, elegance, and personal touch.

**Letter Details:**
- To: ${data.to || '[Recipient]'}
- From: ${data.from || '[Sender]'}
- Core Message: ${data.coreMessage || 'Expression of love and affection'}
- Final Touch: ${data.finalTouch || 'Not specified'}
- Sign Off: ${data.signOff || 'With all my love'}

**Love Letter Instructions:**
Write a beautiful, heartfelt love letter that:
1. Opens with warmth and sets an intimate, loving tone
2. Expresses genuine feelings and specific qualities you adore
3. Includes personal memories or shared experiences
4. Uses romantic but authentic language - avoid clichés
5. Shows vulnerability and sincerity
6. Closes with a meaningful declaration of love and commitment

**Writing Guidelines:**
- Be specific about what makes this person special to you
- Include sensory details and vivid memories
- Use "I" statements to express your feelings directly
- Balance passion with tenderness
- Write as if speaking directly to your beloved
- End with anticipation for the future together

Begin writing the love letter now.`;
  },

  apology_letter: (data: any) => {
    return `You are an expert in writing sincere, effective apology letters that acknowledge wrongdoing, take responsibility, and work toward reconciliation.

**Apology Details:**
- To: ${data.to || '[Recipient]'}
- From: ${data.from || '[Sender]'}
- Situation: ${data.coreMessage || 'Not specified'}
- Resolution Offer: ${data.finalTouch || 'Not specified'}
- Sign Off: ${data.signOff || 'Sincerely'}

**Apology Letter Instructions:**
Write a genuine, effective apology letter that:
1. Acknowledges the specific wrong or hurt caused
2. Takes full responsibility without making excuses
3. Expresses genuine remorse and understanding of impact
4. Offers concrete steps to make amends
5. Commits to changed behavior going forward
6. Respects the recipient's feelings and timeline for forgiveness

**Apology Guidelines:**
- Avoid defensive language or blame-shifting
- Be specific about what you did wrong
- Express empathy for how your actions affected them
- Don't minimize the hurt or rush the healing process
- Focus on their feelings, not your guilt
- Offer actionable solutions, not just words

Begin writing the apology letter now.`;
  },

  appreciation_letter: (data: any) => {
    return `You are skilled at writing heartfelt letters of appreciation that recognize others' contributions, express gratitude genuinely, and strengthen relationships.

**Appreciation Details:**
- To: ${data.to || '[Recipient]'}
- From: ${data.from || '[Sender]'}
- Reason for Appreciation: ${data.coreMessage || 'Their valuable contributions'}
- Specific Examples: ${data.finalTouch || 'Not specified'}
- Sign Off: ${data.signOff || 'With gratitude'}

**Appreciation Letter Instructions:**
Write a meaningful appreciation letter that:
1. Opens with clear statement of gratitude
2. Specifies exactly what you're appreciating
3. Explains the positive impact of their actions
4. Includes specific examples or moments
5. Expresses how their actions affected you personally
6. Closes with warm acknowledgment of their value

**Appreciation Guidelines:**
- Be specific rather than general in your praise
- Focus on their actions, character, or contributions
- Explain the difference their efforts made
- Use warm, genuine language
- Include concrete examples when possible
- Make them feel truly seen and valued

Begin writing the appreciation letter now.`;
  },

  general_letter: (data: any) => {
    return `You are an expert letter writer capable of crafting professional, personal, and formal correspondence for any purpose with appropriate tone and structure.

**Letter Details:**
- To: ${data.to || '[Recipient]'}
- From: ${data.from || '[Sender]'}
- Subject: ${data.subject || 'General Correspondence'}
- Core Message: ${data.coreMessage || 'Not specified'}
- Final Touch: ${data.finalTouch || 'Not specified'}
- Sign Off: ${data.signOff || 'Sincerely'}

**General Letter Instructions:**
Write a well-structured, appropriate letter that:
1. Uses proper letter formatting and etiquette
2. Opens with clear purpose and appropriate greeting
3. Develops the main message logically and clearly
4. Maintains consistent, appropriate tone throughout
5. Addresses the recipient's needs and interests
6. Closes professionally with clear next steps if needed

**Letter Writing Guidelines:**
- Choose tone based on relationship and purpose
- Organize thoughts logically with clear paragraphs
- Be concise while covering all necessary points
- Use appropriate level of formality
- Proofread for grammar and clarity
- End with appropriate call to action if needed

Begin writing the letter now.`;
  },

  thank_you_letter: (data: any) => {
    return `You are an expert at writing sincere, impactful thank you letters that express genuine gratitude and strengthen relationships.

**Thank You Letter Details:**
- To: ${data.to || '[Recipient]'}
- From: ${data.from || '[Sender]'}
- Reason for Thanks: ${data.coreMessage || 'Their kindness and support'}
- Specific Impact: ${data.finalTouch || 'Not specified'}
- Sign Off: ${data.signOff || 'With heartfelt thanks'}

**Thank You Letter Instructions:**
Write a heartfelt thank you letter that:
1. Opens with sincere expression of gratitude
2. Clearly states what you're thanking them for
3. Explains how their actions made a difference
4. Shows the personal impact of their kindness
5. Expresses appreciation for their character or thoughtfulness
6. Closes with warm wishes for the future

**Gratitude Guidelines:**
- Be specific about what they did
- Explain the positive impact on you or others
- Use warm, genuine language
- Show how their actions reflected their good character
- Express hope for continued relationship
- Keep focus on them, not yourself

Begin writing the thank you letter now.`;
  },

  welcome_letter: (data: any) => {
    return `You are skilled at writing warm, engaging welcome letters that make recipients feel valued, informed, and excited about new opportunities or relationships.

**Welcome Letter Details:**
- To: ${data.to || '[New Member/Employee/Participant]'}
- From: ${data.from || '[Organization/Team]'}
- Context: ${data.coreMessage || 'Welcoming to new role/community'}
- Next Steps: ${data.finalTouch || 'Not specified'}
- Sign Off: ${data.signOff || 'Welcome aboard'}

**Welcome Letter Instructions:**
Write an engaging welcome letter that:
1. Opens with enthusiastic, genuine welcome
2. Explains why you're excited to have them
3. Provides helpful information about what to expect
4. Offers support and resources for their transition
5. Highlights opportunities and benefits they'll enjoy
6. Closes with invitation for questions and engagement

**Welcome Guidelines:**
- Strike a balance between professional and warm
- Provide practical information they need
- Express confidence in their success
- Offer specific ways to get help or connect
- Set positive expectations for the experience
- End with an open door for communication

Begin writing the welcome letter now.`;
  },

  congratulatory_letter: (data: any) => {
    return `You are expert at writing celebratory, uplifting congratulatory letters that acknowledge achievements and express genuine happiness for others' success.

**Congratulations Details:**
- To: ${data.to || '[Recipient]'}
- From: ${data.from || '[Sender]'}
- Achievement: ${data.coreMessage || 'Their recent accomplishment'}
- Personal Note: ${data.finalTouch || 'Not specified'}
- Sign Off: ${data.signOff || 'Congratulations'}

**Congratulatory Letter Instructions:**
Write an enthusiastic congratulatory letter that:
1. Opens with genuine excitement and congratulations
2. Specifically acknowledges their achievement
3. Recognizes the effort and dedication required
4. Expresses admiration for their accomplishment
5. Highlights what makes this achievement special
6. Closes with best wishes for continued success

**Celebration Guidelines:**
- Be specific about what you're congratulating them for
- Acknowledge the hard work behind their success
- Express genuine happiness for their achievement
- Use enthusiastic but sincere language
- Mention the positive impact of their accomplishment
- Wish them well for future endeavors

Begin writing the congratulatory letter now.`;
  },

  condolence_letter: (data: any) => {
    return `You are compassionate at writing sensitive, supportive condolence letters that offer comfort during difficult times while respecting grief and loss.

**Condolence Details:**
- To: ${data.to || '[Grieving Person]'}
- From: ${data.from || '[Sender]'}
- Loss/Situation: ${data.coreMessage || 'Their recent loss'}
- Support Offer: ${data.finalTouch || 'Not specified'}
- Sign Off: ${data.signOff || 'With deepest sympathy'}

**Condolence Letter Instructions:**
Write a compassionate condolence letter that:
1. Opens with sincere expression of sympathy
2. Acknowledges their loss with sensitivity
3. Shares a positive memory if appropriate
4. Offers specific, practical support
5. Avoids platitudes and respects their grief process
6. Closes with ongoing care and availability

**Compassion Guidelines:**
- Use gentle, respectful language
- Avoid saying you understand their pain unless you've experienced similar loss
- Don't try to find silver linings or reasons
- Offer specific help rather than vague offers
- Keep focus on them and their loved one
- Express ongoing support beyond the immediate moment

Begin writing the condolence letter now.`;
  },

  complaint_letter: (data: any) => {
    return `You are skilled at writing effective complaint letters that clearly communicate problems, remain professional, and work toward satisfactory resolution.

**Complaint Details:**
- To: ${data.to || '[Company/Individual]'}
- From: ${data.from || '[Sender]'}
- Issue: ${data.coreMessage || 'Service/product problem'}
- Desired Resolution: ${data.finalTouch || 'Not specified'}
- Sign Off: ${data.signOff || 'Sincerely'}

**Complaint Letter Instructions:**
Write a professional complaint letter that:
1. Clearly states the problem and when it occurred
2. Provides relevant details and documentation references
3. Explains the impact or inconvenience caused
4. Maintains respectful but firm tone throughout
5. Requests specific action or resolution
6. Sets reasonable timeline for response

**Professional Guidelines:**
- Stay factual and avoid emotional language
- Include specific dates, names, and reference numbers
- Be clear about what went wrong
- Explain how it affected you
- State exactly what resolution you want
- Keep records of all correspondence

Begin writing the complaint letter now.`;
  },

  invitation_letter: (data: any) => {
    return `You are expert at writing compelling invitation letters that provide clear information, create excitement, and encourage attendance at events or participation in opportunities.

**Invitation Details:**
- To: ${data.to || '[Invitee]'}
- From: ${data.from || '[Host/Organization]'}
- Event/Opportunity: ${data.coreMessage || 'Special event'}
- Event Details: ${data.finalTouch || 'Not specified'}
- Sign Off: ${data.signOff || 'Hope to see you there'}

**Invitation Letter Instructions:**
Write an engaging invitation letter that:
1. Opens with warm invitation and excitement
2. Clearly describes the event or opportunity
3. Provides all essential details (date, time, location)
4. Explains why their presence is valued
5. Includes any special instructions or requirements
6. Closes with clear RSVP information and enthusiasm

**Invitation Guidelines:**
- Make them feel specially chosen and valued
- Provide all practical information they need
- Create excitement about the event
- Be clear about expectations and requirements
- Make it easy for them to respond
- Express genuine hope for their attendance

Begin writing the invitation letter now.`;
  },

  farewell_letter: (data: any) => {
    return `You are skilled at writing heartfelt farewell letters that express gratitude, share memories, and maintain connections while acknowledging transitions and endings.

**Farewell Details:**
- To: ${data.to || '[Colleagues/Friends]'}
- From: ${data.from || '[Departing Person]'}
- Reason for Departure: ${data.coreMessage || 'Moving to new opportunity'}
- Memories to Share: ${data.finalTouch || 'Not specified'}
- Sign Off: ${data.signOff || 'Stay in touch'}

**Farewell Letter Instructions:**
Write a meaningful farewell letter that:
1. Opens with appreciation for shared experiences
2. Acknowledges the difficulty of saying goodbye
3. Highlights positive memories and relationships
4. Expresses gratitude for support and friendship
5. Shares excitement about new chapter while honoring the past
6. Closes with contact information and invitation to stay connected

**Farewell Guidelines:**
- Focus on positive memories and growth
- Express genuine gratitude for relationships
- Acknowledge what you'll miss most
- Share your contact information for future connection
- Keep tone hopeful while acknowledging sadness
- End with optimism about staying in touch

Begin writing the farewell letter now.`;
  },

  leave_application: (data: any) => {
    return `You are expert at writing professional, clear leave application letters that request time off while providing necessary information and maintaining workplace professionalism.

**Leave Application Details:**
- To: ${data.to || '[Supervisor/HR]'}
- From: ${data.from || '[Employee]'}
- Type of Leave: ${data.coreMessage || 'Time off request'}
- Dates and Coverage: ${data.finalTouch || 'Not specified'}
- Sign Off: ${data.signOff || 'Thank you for consideration'}

**Leave Application Instructions:**
Write a professional leave application that:
1. Clearly states the purpose and dates of requested leave
2. Provides adequate notice per company policy
3. Explains the reason if required or appropriate
4. Addresses work coverage and responsibilities
5. Demonstrates consideration for workplace impact
6. Closes with appreciation and professional courtesy

**Professional Guidelines:**
- Be direct and clear about your request
- Follow company procedures and timeline requirements
- Provide adequate information without over-sharing
- Show you've planned for work coverage
- Maintain professional tone throughout
- Express appreciation for consideration

Begin writing the leave application now.`;
  },

  permission_letter: (data: any) => {
    return `You are skilled at writing persuasive permission letters that clearly state requests, provide compelling rationale, and demonstrate responsibility and consideration.

**Permission Request Details:**
- To: ${data.to || '[Authority Figure]'}
- From: ${data.from || '[Requester]'}
- Permission Sought: ${data.coreMessage || 'Specific request'}
- Justification: ${data.finalTouch || 'Not specified'}
- Sign Off: ${data.signOff || 'Thank you for consideration'}

**Permission Letter Instructions:**
Write a compelling permission letter that:
1. Clearly states what permission you're seeking
2. Provides strong justification for the request
3. Demonstrates responsibility and maturity
4. Addresses potential concerns proactively
5. Shows consideration for rules and policies
6. Closes with respect for their decision-making authority

**Persuasion Guidelines:**
- Be clear and specific about your request
- Provide compelling reasons that benefit all parties
- Show you understand and respect existing rules
- Demonstrate responsibility and trustworthiness
- Address potential objections beforehand
- Express gratitude regardless of the outcome

Begin writing the permission letter now.`;
  },

  publication_request: (data: any) => {
    return `You are expert at writing professional publication request letters that pitch ideas effectively, demonstrate expertise, and follow submission guidelines appropriately.

**Publication Request Details:**
- To: ${data.to || '[Editor/Publisher]'}
- From: ${data.from || '[Author]'}
- Proposed Content: ${data.coreMessage || 'Article/content proposal'}
- Credentials/Angle: ${data.finalTouch || 'Not specified'}
- Sign Off: ${data.signOff || 'Looking forward to hearing from you'}

**Publication Request Instructions:**
Write a professional publication request that:
1. Opens with compelling hook about your proposed content
2. Clearly describes your article/content idea
3. Demonstrates your expertise and unique perspective
4. Shows familiarity with their publication style
5. Provides relevant credentials and writing samples
6. Closes with professional follow-up expectations

**Publishing Guidelines:**
- Research their publication style and audience
- Pitch ideas that fit their editorial needs
- Demonstrate your unique angle or expertise
- Be concise but comprehensive in your proposal
- Include relevant credentials without boasting
- Follow their submission guidelines exactly

Begin writing the publication request now.`;
  },

  recommendation_letter: (data: any) => {
    return `You are expert at writing powerful recommendation letters that effectively advocate for candidates while providing specific, credible evidence of their qualifications and character.

**Recommendation Details:**
- For: ${data.to || '[Candidate Name]'}
- From: ${data.from || '[Recommender]'}
- Purpose: ${data.coreMessage || 'Job/academic application'}
- Key Qualities: ${data.finalTouch || 'Not specified'}
- Sign Off: ${data.signOff || 'Highest recommendation'}

**Recommendation Letter Instructions:**
Write a compelling recommendation letter that:
1. Establishes your credibility and relationship to candidate
2. Clearly states your strong endorsement
3. Provides specific examples of their achievements
4. Highlights relevant skills and character qualities
5. Compares them favorably to others when appropriate
6. Closes with unqualified recommendation and contact offer

**Advocacy Guidelines:**
- Provide concrete examples rather than vague praise
- Focus on achievements relevant to their goal
- Use specific metrics and outcomes when possible
- Address any potential concerns honestly
- Show enthusiasm for their potential
- Offer availability for follow-up questions

Begin writing the recommendation letter now.`;
  },

  appointment_request: (data: any) => {
    return `You are skilled at writing professional appointment request letters that clearly communicate scheduling needs while being respectful of others' time and availability.

**Appointment Request Details:**
- To: ${data.to || '[Professional/Contact]'}
- From: ${data.from || '[Requester]'}
- Purpose: ${data.coreMessage || 'Meeting request'}
- Preferred Times: ${data.finalTouch || 'Flexible with schedule'}
- Sign Off: ${data.signOff || 'Thank you for your time'}

**Appointment Request Instructions:**
Write a professional appointment request that:
1. Clearly states the purpose of requested meeting
2. Explains why their time and expertise is valued
3. Provides specific agenda items or topics to discuss
4. Offers flexible scheduling options
5. Estimates duration and suggests format (in-person/virtual)
6. Closes with appreciation and easy response options

**Scheduling Guidelines:**
- Be clear about meeting purpose and agenda
- Show respect for their time by being specific
- Offer multiple scheduling options
- Keep initial request concise but informative
- Make it easy for them to accept or propose alternatives
- Express genuine appreciation for their consideration

Begin writing the appointment request now.`;
  },

  request_letter: (data: any) => {
    return `You are expert at writing persuasive request letters that clearly communicate needs, provide compelling justification, and maintain professional courtesy throughout.

**Request Details:**
- To: ${data.to || '[Decision Maker]'}
- From: ${data.from || '[Requester]'}
- Request: ${data.coreMessage || 'Specific need or favor'}
- Justification: ${data.finalTouch || 'Not specified'}
- Sign Off: ${data.signOff || 'Thank you for consideration'}

**Request Letter Instructions:**
Write a persuasive request letter that:
1. Opens with clear statement of your request
2. Provides compelling reasons for the request
3. Demonstrates mutual benefit when possible
4. Shows consideration for their constraints
5. Offers to provide additional information if needed
6. Closes with gratitude and professional courtesy

**Request Guidelines:**
- Be direct about what you're asking for
- Explain why granting the request makes sense
- Show you understand their perspective and limitations
- Provide supporting information or documentation
- Make it easy for them to say yes
- Express appreciation regardless of outcome

Begin writing the request letter now.`;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Communication Engine: Processing request');
    const { contentType, formData }: PromptRequest = await req.json();
    
    console.log(`Communication Engine: Content type: ${contentType}`);
    console.log(`Communication Engine: Form data:`, formData);

    // Check if we have a prompt generator for this content type
    if (!communicationPrompts[contentType as keyof typeof communicationPrompts]) {
      console.error(`Communication Engine: Unknown content type: ${contentType}`);
      return new Response(
        JSON.stringify({ 
          error: `Content type "${contentType}" is not supported by Communication Engine` 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate the prompt
    const promptGenerator = communicationPrompts[contentType as keyof typeof communicationPrompts];
    const generatedPrompt = promptGenerator(formData);

    console.log(`Communication Engine: Generated prompt for ${contentType}`);
    console.log(`Communication Engine: Prompt length: ${generatedPrompt.length} characters`);

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
    console.error('Communication Engine: Error processing request:', error);
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