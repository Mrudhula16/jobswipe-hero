
// Follow Deno and Edge Function conventions
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get credentials from environment variables
    const LINKEDIN_EMAIL = Deno.env.get("LINKEDIN_EMAIL");
    const LINKEDIN_PASSWORD = Deno.env.get("LINKEDIN_PASSWORD");
    
    if (!LINKEDIN_EMAIL || !LINKEDIN_PASSWORD) {
      return new Response(
        JSON.stringify({
          error: "LinkedIn credentials not configured",
          success: false
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Parse request data
    const { jobDetails, userId } = await req.json();
    
    if (!jobDetails || !userId) {
      return new Response(
        JSON.stringify({
          error: "Missing required parameters",
          success: false
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Log the application attempt
    console.log(`Attempting to apply for job: ${jobDetails.title} at ${jobDetails.company}`);
    
    // Create a supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Record the application attempt in the database
    const { data, error } = await supabase
      .from('job_applications')
      .insert({
        user_id: userId,
        job_title: jobDetails.title,
        company: jobDetails.company,
        job_url: jobDetails.applicationUrl || jobDetails.url,
        status: 'pending',
        auto_applied: true
      });
      
    if (error) {
      console.error("Error recording application:", error);
    }
    
    // In a real implementation, this is where you would execute the browser automation
    // using Playwright or Puppeteer for Deno. For this demo, we'll simulate a successful application
    
    // Simple simulation of success/failure (80% success rate)
    const isSuccessful = Math.random() < 0.8;
    
    // Update the application status
    if (isSuccessful) {
      await supabase
        .from('job_applications')
        .update({ status: 'applied' })
        .eq('user_id', userId)
        .eq('job_title', jobDetails.title)
        .eq('company', jobDetails.company);
    } else {
      await supabase
        .from('job_applications')
        .update({ status: 'failed', notes: 'Application process failed' })
        .eq('user_id', userId)
        .eq('job_title', jobDetails.title)
        .eq('company', jobDetails.company);
    }
    
    return new Response(
      JSON.stringify({
        success: isSuccessful,
        message: isSuccessful 
          ? `Successfully applied to ${jobDetails.title} at ${jobDetails.company}` 
          : `Failed to apply to ${jobDetails.title}. Job may require manual application.`,
        jobDetails
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error("Error in auto-apply function:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
