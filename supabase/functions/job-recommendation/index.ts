
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const openAIApiKey = Deno.env.get("OPENAI_API_KEY") || "";

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
    // Create a Supabase client with the Admin key
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    // Get auth token from the request
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    
    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Error authenticating user:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'User authentication failed' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { job, action } = await req.json();
    
    if (!job) {
      return new Response(
        JSON.stringify({ error: 'Bad Request', message: 'Job data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get user's most recent resume for skills analysis
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (resumeError && resumeError.code !== 'PGRST116') {
      console.error('Error fetching resume:', resumeError);
      return new Response(
        JSON.stringify({ error: 'Database Error', message: 'Failed to fetch user resume' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Structure data for the OpenAI API
    const jobData = {
      title: job.title,
      company: job.company,
      description: job.description,
      requirements: Array.isArray(job.requirements) ? job.requirements.join(", ") : job.requirements,
      location: job.location
    };
    
    const userData = {
      resume: resume?.content || "Not provided",
      skills: resume?.skills || []
    };
    
    let systemPrompt = "You are an AI job assistant that helps users evaluate whether a job posting matches their skills and experience.";
    let userPrompt = "";
    
    if (action === 'evaluate') {
      systemPrompt += " Evaluate the job based on the user's resume and skills. Provide a match percentage and specific feedback.";
      userPrompt = `Please analyze this job posting for me and tell me how well it matches my profile:
      
      Job Details:
      - Title: ${jobData.title}
      - Company: ${jobData.company}
      - Location: ${jobData.location}
      - Description: ${jobData.description}
      - Requirements: ${jobData.requirements}
      
      My Resume:
      ${userData.resume}
      
      My Skills:
      ${JSON.stringify(userData.skills)}
      
      Provide:
      1. A match percentage (0-100%)
      2. Key reasons why this job matches or doesn't match my profile
      3. Advice on how I could position myself for this role
      `;
    } else if (action === 'tailor_resume') {
      systemPrompt += " Help the user tailor their resume for this specific job posting.";
      userPrompt = `Help me tailor my resume for this job posting:
      
      Job Details:
      - Title: ${jobData.title}
      - Company: ${jobData.company}
      - Description: ${jobData.description}
      - Requirements: ${jobData.requirements}
      
      My Current Resume:
      ${userData.resume}
      
      Please provide:
      1. Specific sections of my resume I should update
      2. Keywords from the job posting I should include
      3. Skills I should emphasize
      4. A draft of 2-3 bullet points I could add to highlight relevant experience
      `;
    } else {
      systemPrompt += " Provide general advice about whether to apply for this position.";
      userPrompt = `Should I apply for this job?
      
      Job Details:
      - Title: ${jobData.title}
      - Company: ${jobData.company}
      - Location: ${jobData.location}
      - Description: ${jobData.description}
      - Requirements: ${jobData.requirements}
      
      My Resume:
      ${userData.resume}
      
      My Skills:
      ${JSON.stringify(userData.skills)}
      
      Provide your recommendation with reasons.`;
    }
    
    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      throw new Error("Failed to get response from AI service");
    }
    
    const aiResponse = await response.json();
    const recommendation = aiResponse.choices[0].message.content;
    
    // Log the activity
    await supabase
      .from('job_agent_activities')
      .insert({
        user_id: user.id,
        job_id: job.id || 'manual_evaluation',
        action: action || 'evaluate',
        status: 'completed',
        result: {
          ai_response: recommendation,
          job_data: jobData,
          timestamp: new Date().toISOString()
        }
      });
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        recommendation,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in job-recommendation function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
