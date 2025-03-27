
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, chatHistory } = await req.json();
    
    if (!openAIApiKey) {
      throw new Error("Missing OpenAI API key");
    }

    // Construct messages array with system prompt and chat history
    const messages = [
      { 
        role: 'system', 
        content: `You are a helpful customer service assistant for Employed, an AI-powered job search platform. 
        Your goal is to assist users with their questions about the platform, help them troubleshoot issues, 
        and collect feedback or bug reports.
        
        Be friendly, concise, and helpful. If a user reports a technical issue that you can't solve directly, 
        thank them for reporting it and let them know the team will look into it.
        
        Some common features of our platform include:
        - Job search and filtering
        - Job application tracking
        - Resume and cover letter creation
        - AI agent for job application assistance
        - User profiles
        
        If asked about something you don't know about, be honest and suggest the user contact support@employed.com for further assistance.`
      }
    ];
    
    // Add chat history if provided
    if (chatHistory && Array.isArray(chatHistory)) {
      messages.push(...chatHistory);
    }
    
    // Add the current user message
    messages.push({ role: 'user', content: message });

    console.log("Sending request to OpenAI with messages:", JSON.stringify(messages));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const botResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      response: botResponse,
      usage: data.usage
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in customer-service-bot function:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error occurred' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
