
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
    console.log('Job source:', jobDetails.source || 'generic');
    
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
        notes: `Auto-applied via AI Job Agent on ${new Date().toLocaleString()} (Source: ${jobDetails.source || 'generic'})`
      })
      .select()
      .single();

    if (applicationError) {
      console.error('Error recording job application:', applicationError);
      throw applicationError;
    }

    // Additional handling for LinkedIn jobs
    let isSuccessful = false;
    let applicationMessage = '';
    
    if (jobDetails.source === 'linkedin') {
      console.log('Processing LinkedIn job application');
      
      // LinkedIn-specific application logic would go here
      // This is a placeholder for actual LinkedIn integration
      // In a real implementation, this would use LinkedIn API or automated browser interactions
      
      // Simulate LinkedIn application process (80% success rate for demo)
      isSuccessful = Math.random() < 0.8;
      applicationMessage = isSuccessful 
        ? `Successfully applied to ${jobDetails.title} at ${jobDetails.company} via LinkedIn`
        : `Could not complete application to ${jobDetails.title} on LinkedIn. The job has been saved for manual application.`;
    } else {
      // Generic application process (same as before)
      isSuccessful = Math.random() < 0.8;
      applicationMessage = isSuccessful 
        ? `Successfully applied to ${jobDetails.title} at ${jobDetails.company}`
        : `Could not complete application to ${jobDetails.title}. The job has been saved for manual application.`;
    }
    
    // Update application status based on result
    if (isSuccessful) {
      // Update application status to applied
      const { error: updateError } = await supabase
        .from('job_applications')
        .update({ status: 'applied' })
        .eq('id', applicationData.id);
        
      if (updateError) {
        console.error('Error updating application status:', updateError);
      }
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
    }
    
    return new Response(
      JSON.stringify({ 
        success: isSuccessful, 
        message: applicationMessage,
        applicationId: applicationData.id 
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
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
