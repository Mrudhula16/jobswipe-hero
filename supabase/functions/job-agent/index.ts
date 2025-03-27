
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
          .single();
          
        if (statusError && statusError.code !== 'PGRST116') throw statusError;
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
