
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

    // Record the job application attempt
    const { data: applicationData, error: applicationError } = await supabase
      .from('job_applications')
      .insert({
        user_id: userId,
        job_title: jobDetails.title,
        company: jobDetails.company,
        job_url: jobDetails.applicationUrl || jobDetails.url,
        status: 'pending',
        auto_applied: true
      })
      .select()
      .single();

    if (applicationError) throw applicationError;

    // Simulate auto-application (this would be replaced with actual LinkedIn/job site automation)
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
