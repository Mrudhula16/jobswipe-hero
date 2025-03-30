
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const linkedinClientId = Deno.env.get("LINKEDIN_CLIENT_ID") || "";
const linkedinClientSecret = Deno.env.get("LINKEDIN_CLIENT_SECRET") || "";

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
    
    const { action, authCode, redirectUri, query, location, filters } = await req.json();
    
    if (!action) {
      return new Response(
        JSON.stringify({ error: 'Bad Request', message: 'Action is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Handle different action types
    let result;
    
    if (action === 'authorize') {
      // Generate LinkedIn authorization URL
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=random_state_string&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
      
      result = { authUrl };
    } else if (action === 'exchange_token') {
      // Exchange authorization code for access token
      if (!authCode || !redirectUri) {
        return new Response(
          JSON.stringify({ error: 'Bad Request', message: 'Auth code and redirect URI are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: authCode,
          redirect_uri: redirectUri,
          client_id: linkedinClientId,
          client_secret: linkedinClientSecret,
        }),
      });
      
      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        console.error('LinkedIn token exchange error:', error);
        throw new Error('Failed to exchange LinkedIn auth code for token');
      }
      
      const tokenData = await tokenResponse.json();
      
      // Store the LinkedIn credentials in the database
      const { error: credentialsError } = await supabase
        .from('linkedin_credentials')
        .upsert({
          user_id: user.id,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || null,
          expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
        });
      
      if (credentialsError) {
        console.error('Error storing LinkedIn credentials:', credentialsError);
        throw credentialsError;
      }
      
      result = { success: true, message: 'LinkedIn account connected successfully' };
    } else if (action === 'search_jobs') {
      // Search for jobs using LinkedIn API, first check if user has valid credentials
      const { data: credentials, error: credentialsError } = await supabase
        .from('linkedin_credentials')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (credentialsError && credentialsError.code !== 'PGRST116') {
        console.error('Error fetching LinkedIn credentials:', credentialsError);
        throw credentialsError;
      }
      
      if (!credentials || new Date(credentials.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized', message: 'LinkedIn account not connected or token expired' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // For now, we'll use the existing linkedin-jobs function for actual job search
      // This ensures we maintain compatibility with the rest of the app
      const { data: jobsData, error: jobsError } = await supabase.functions
        .invoke('linkedin-jobs', {
          body: {
            action: 'search',
            query: query || '',
            location: location || '',
            filters: filters || {},
          }
        });
      
      if (jobsError) {
        console.error('Error searching for jobs:', jobsError);
        throw jobsError;
      }
      
      result = jobsData;
    } else if (action === 'one_click_apply') {
      // Implement one-click apply using LinkedIn's API
      // This is a placeholder - in a real implementation, we would use LinkedIn's API
      // to submit the application on behalf of the user
      
      const { jobId, resumeId } = await req.json();
      
      if (!jobId) {
        return new Response(
          JSON.stringify({ error: 'Bad Request', message: 'Job ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Record the application in our database
      const { data: application, error: applicationError } = await supabase
        .from('job_applications')
        .insert({
          user_id: user.id,
          job_id: jobId,
          status: 'applied',
          auto_applied: true,
          resume_id: resumeId,
          notes: 'Applied via LinkedIn integration'
        })
        .select()
        .single();
      
      if (applicationError) {
        console.error('Error recording application:', applicationError);
        throw applicationError;
      }
      
      result = { success: true, application_id: application.id };
    } else {
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
    console.error('Error in linkedin-integration function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
