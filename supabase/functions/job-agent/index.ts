
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
    
    const { action, parameters } = await req.json();
    let result;
    
    switch (action) {
      case 'toggle':
        // Call the toggle_job_agent function
        const { data, error } = await supabase.rpc('toggle_job_agent', {
          is_active: parameters?.is_active
        });
        
        if (error) throw error;
        result = data;
        break;
        
      case 'status':
        // Get the current status of the job agent
        const { data: statusData, error: statusError } = await supabase
          .from('job_agent_configs')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (statusError) throw statusError;
        result = statusData || { is_active: false, message: 'Job Agent not configured' };
        break;
        
      case 'ml_integration':
        // Handle ML model integration
        const { model_type, endpoint_url, params } = parameters || {};
        
        if (!model_type) {
          return new Response(
            JSON.stringify({ error: 'Bad Request', message: 'Model type is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Check if ML config exists
        const { data: existingConfig, error: configError } = await supabase
          .from('ml_model_configs')
          .select('id')
          .eq('user_id', user.id)
          .eq('model_type', model_type)
          .maybeSingle();
          
        if (configError) throw configError;
        
        let configResult;
        
        if (existingConfig) {
          // Update existing ML config
          const { data: updateData, error: updateError } = await supabase
            .from('ml_model_configs')
            .update({
              endpoint_url,
              parameters: params || {},
              updated_at: new Date()
            })
            .eq('id', existingConfig.id)
            .select()
            .single();
            
          if (updateError) throw updateError;
          configResult = updateData;
        } else {
          // Create new ML config
          const { data: insertData, error: insertError } = await supabase
            .from('ml_model_configs')
            .insert({
              user_id: user.id,
              model_type,
              endpoint_url,
              parameters: params || {}
            })
            .select()
            .single();
            
          if (insertError) throw insertError;
          configResult = insertData;
        }
        
        result = {
          success: true,
          message: 'ML model configuration saved successfully',
          config: configResult
        };
        break;
        
      case 'process_job':
        // This new action processes a job using the ML model
        const { job_id, job_data } = parameters || {};
        
        if (!job_id || !job_data) {
          return new Response(
            JSON.stringify({ error: 'Bad Request', message: 'Job ID and data are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Get user's ML model configuration
        const { data: mlConfig, error: mlConfigError } = await supabase
          .from('ml_model_configs')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (mlConfigError) throw mlConfigError;
        
        if (!mlConfig || !mlConfig.endpoint_url) {
          return new Response(
            JSON.stringify({ error: 'Configuration Error', message: 'ML model not configured' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Get user's resume and preferences
        const { data: userProfile, error: profileError } = await Promise.all([
          supabase
            .from('resumes')
            .select('content')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from('job_preferences')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle()
        ]).then(([resumeResult, preferencesResult]) => {
          if (resumeResult.error) throw resumeResult.error;
          if (preferencesResult.error) throw preferencesResult.error;
          
          return {
            data: {
              resume: resumeResult.data?.content || "",
              preferences: preferencesResult.data || {}
            },
            error: null
          };
        });
        
        if (profileError) throw profileError;
        
        // Prepare data to send to ML model
        const mlRequestData = {
          job: job_data,
          user: userProfile,
          parameters: mlConfig.parameters
        };
        
        console.log('Sending data to ML model at:', mlConfig.endpoint_url);
        
        // Call the ML model endpoint
        try {
          const mlResponse = await fetch(mlConfig.endpoint_url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${mlConfig.parameters.api_key || ''}`
            },
            body: JSON.stringify(mlRequestData)
          });
          
          if (!mlResponse.ok) {
            throw new Error(`ML model returned status ${mlResponse.status}`);
          }
          
          const mlResult = await mlResponse.json();
          
          // Record the activity
          const { data: activityData, error: activityError } = await supabase
            .from('job_agent_activities')
            .insert({
              user_id: user.id,
              job_id: job_id,
              action: mlResult.recommendation || 'analyze',
              status: 'complete',
              result: mlResult
            })
            .select()
            .single();
            
          if (activityError) throw activityError;
          
          result = {
            success: true,
            message: 'Job processed successfully',
            ml_result: mlResult,
            activity: activityData
          };
        } catch (mlError) {
          console.error('Error calling ML model:', mlError);
          
          // Record the failed activity
          await supabase
            .from('job_agent_activities')
            .insert({
              user_id: user.id,
              job_id: job_id,
              action: 'analyze',
              status: 'failed',
              result: { error: mlError.message }
            });
            
          throw mlError;
        }
        break;
        
      case 'get_activities':
        // Get user's job agent activities
        const { data: activities, error: activitiesError } = await supabase
          .from('job_agent_activities')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(parameters?.limit || 10);
          
        if (activitiesError) throw activitiesError;
        
        result = activities;
        break;
        
      default:
        return new Response(
          JSON.stringify({ error: 'Bad Request', message: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in job-agent function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
