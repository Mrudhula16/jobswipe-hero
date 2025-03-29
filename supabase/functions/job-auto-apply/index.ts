
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
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
    const { action, jobDetails, userId } = await req.json();
    
    if (!action || !jobDetails || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    if (action === 'apply') {
      console.log(`Auto-applying to job ${jobDetails.id} for user ${userId}`);
      
      // Get user profile and resume data
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      // Get user's latest resume
      const { data: userResumes } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      const userResume = userResumes && userResumes.length > 0 ? userResumes[0] : null;
      
      // Log application to database
      const { data: application, error: applicationError } = await supabase
        .from('job_applications')
        .insert([{
          user_id: userId,
          job_id: jobDetails.id,
          job_title: jobDetails.title,
          company: jobDetails.company,
          job_url: jobDetails.url || jobDetails.applicationUrl,
          status: 'applied',
          auto_applied: true,
          resume_id: userResume?.id,
          notes: `Auto-applied via JobSwipe AI Agent on ${new Date().toISOString()}`
        }])
        .select()
        .single();
      
      if (applicationError) {
        throw applicationError;
      }
      
      // Log agent activity
      await supabase
        .from('job_agent_activities')
        .insert([{
          user_id: userId,
          job_id: jobDetails.id,
          action: 'apply',
          status: 'completed',
          result: {
            success: true,
            application_id: application.id,
            timestamp: new Date().toISOString(),
            job_details: {
              title: jobDetails.title,
              company: jobDetails.company
            }
          }
        }]);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Job application submitted successfully',
          application_id: application.id
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in job-auto-apply function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to process job application' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
