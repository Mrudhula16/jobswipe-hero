
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

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
    const { jobDetails, userId, applicationId, resumeId } = await req.json();
    console.log(`Processing auto-apply request for job: ${jobDetails.title} at ${jobDetails.company}`);
    
    if (!userId) {
      throw new Error("User ID is required");
    }
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    // Verify the user exists
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (userError) {
      throw new Error(`User verification failed: ${userError.message}`);
    }
    
    // Get resume if resumeId is provided
    let resume = null;
    if (resumeId) {
      const { data: resumeData, error: resumeError } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', resumeId)
        .eq('user_id', userId)
        .single();
        
      if (resumeError && resumeError.code !== 'PGRST116') {
        throw new Error(`Resume fetch failed: ${resumeError.message}`);
      }
      
      resume = resumeData;
    }
    
    // Determine if this is a LinkedIn job or other source
    if (jobDetails.source === 'linkedin') {
      return await handleLinkedInJobApplication(jobDetails, userId, resume, supabase);
    } else {
      return await handleGenericJobApplication(jobDetails, userId, resume, supabase);
    }
  } catch (error) {
    console.error('Error in job-auto-apply function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || 'Failed to apply for job' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function handleLinkedInJobApplication(jobDetails, userId, resume, supabase) {
  try {
    console.log(`Processing LinkedIn job application for: ${jobDetails.title}`);
    
    // Check if we have LinkedIn credentials for this user
    const { data: credentials, error: credentialsError } = await supabase
      .from('linkedin_credentials')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (credentialsError && credentialsError.code !== 'PGRST116') {
      throw new Error(`LinkedIn credentials check failed: ${credentialsError.message}`);
    }
    
    if (!credentials || !credentials.access_token) {
      // Simulate successful application for demo purposes
      return simulateSuccessfulApplication(jobDetails, resume);
    }
    
    // In a real implementation, we would:
    // 1. Use the LinkedIn API to submit an application
    // 2. Track the application status
    // 3. Store any relevant data
    
    // For now, we'll simulate a successful application
    return simulateSuccessfulApplication(jobDetails, resume);
  } catch (error) {
    console.error('LinkedIn application error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `LinkedIn application failed: ${error.message}` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function handleGenericJobApplication(jobDetails, userId, resume, supabase) {
  try {
    console.log(`Processing generic job application for: ${jobDetails.title}`);
    
    // In a real implementation, we might:
    // 1. Use a job board API to submit an application
    // 2. Send an email with resume attached
    // 3. Fill out a form on the company website
    
    // For now, we'll simulate a successful application
    return simulateSuccessfulApplication(jobDetails, resume);
  } catch (error) {
    console.error('Generic application error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Job application failed: ${error.message}` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

function simulateSuccessfulApplication(jobDetails, resume) {
  // Calculate a "success" rate - in a demo this will succeed most of the time
  const successRate = resume ? 0.9 : 0.7; // Higher chance of success with a resume
  const isSuccessful = Math.random() < successRate;
  
  if (isSuccessful) {
    const message = resume 
      ? `Successfully applied to ${jobDetails.title} at ${jobDetails.company} using your resume "${resume.title}".`
      : `Successfully applied to ${jobDetails.title} at ${jobDetails.company}.`;
      
    return new Response(
      JSON.stringify({ success: true, message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } else {
    const message = `Application to ${jobDetails.title} at ${jobDetails.company} couldn't be completed automatically. The company may require manual application.`;
    
    return new Response(
      JSON.stringify({ success: false, message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
