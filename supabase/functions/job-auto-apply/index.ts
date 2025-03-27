
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const { jobDetails, userId } = await req.json();

    console.log('Received application request for job:', jobDetails.title);
    
    // In a real-world implementation, this is where you would:
    // 1. Parse the job application page
    // 2. Fill out the application form
    // 3. Submit the application
    // 4. Parse the response to determine success
    
    // For this demo, we'll simulate the application process
    
    // Record the job application attempt
    const { data: applicationData, error: applicationError } = await supabase
      .from('job_applications')
      .insert({
        user_id: userId,
        job_title: jobDetails.title,
        company: jobDetails.company,
        job_url: jobDetails.applicationUrl || jobDetails.url,
        status: 'pending',
        auto_applied: true,
        notes: `Auto-applied via AI Job Agent on ${new Date().toLocaleString()}`
      })
      .select()
      .single();

    if (applicationError) {
      console.error('Error recording job application:', applicationError);
      throw applicationError;
    }

    // Simulate the application process
    // In a real implementation, this is where you would use techniques like:
    // - Headless browsers (Playwright/Puppeteer) for form filling
    // - OAuth integrations with LinkedIn API
    // - Resume parsing and matching
    
    console.log('Successfully recorded application, id:', applicationData.id);
    
    // Simulate application success (80% success rate)
    const isSuccessful = Math.random() < 0.8;
    
    if (isSuccessful) {
      // Update application status to applied
      const { error: updateError } = await supabase
        .from('job_applications')
        .update({ status: 'applied' })
        .eq('id', applicationData.id);
        
      if (updateError) {
        console.error('Error updating application status:', updateError);
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Successfully applied to ${jobDetails.title} at ${jobDetails.company}`,
          applicationId: applicationData.id 
        }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } else {
      // Update application status to failed
      const { error: updateError } = await supabase
        .from('job_applications')
        .update({ 
          status: 'failed',
          notes: `${applicationData.notes}\n\nApplication failed: Could not complete the application process automatically.`
        })
        .eq('id', applicationData.id);
        
      if (updateError) {
        console.error('Error updating application failure:', updateError);
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Could not complete application to ${jobDetails.title}. The job has been saved for manual application.`,
          applicationId: applicationData.id 
        }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error('Error in job-auto-apply function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || 'Failed to auto-apply to job' 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
