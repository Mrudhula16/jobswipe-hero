
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
    
    const { action, authCode, redirectUri, state } = await req.json();
    
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
      // Using the OAuth 2.0 flow with publicly available scopes
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=r_liteprofile%20r_emailaddress`;
      
      result = { authUrl };
    } else if (action === 'exchange_token') {
      // Exchange authorization code for access token
      if (!authCode || !redirectUri) {
        return new Response(
          JSON.stringify({ error: 'Bad Request', message: 'Auth code and redirect URI are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log("Exchanging auth code for token with LinkedIn API");
      
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
      console.log("Received token from LinkedIn", { expires_in: tokenData.expires_in });
      
      // Get user profile data
      const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'cache-control': 'no-cache',
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });
      
      if (!profileResponse.ok) {
        console.error('LinkedIn profile fetch error:', await profileResponse.text());
        throw new Error('Failed to fetch LinkedIn profile');
      }
      
      const profileData = await profileResponse.json();
      console.log("Retrieved LinkedIn profile", { id: profileData.id, name: `${profileData.localizedFirstName} ${profileData.localizedLastName}` });
      
      // Store the LinkedIn credentials in the database
      const { error: credentialsError } = await supabase
        .from('linkedin_credentials')
        .upsert({
          user_id: user.id,
          access_token: tokenData.access_token,
          expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
          profile_data: {
            linkedin_id: profileData.id,
            first_name: profileData.localizedFirstName,
            last_name: profileData.localizedLastName
          }
        });
      
      if (credentialsError) {
        console.error('Error storing LinkedIn credentials:', credentialsError);
        throw credentialsError;
      }
      
      result = { 
        success: true, 
        message: 'LinkedIn account connected successfully',
        profile: {
          name: `${profileData.localizedFirstName} ${profileData.localizedLastName}`,
          id: profileData.id
        }
      };
    } else if (action === 'check_connection') {
      // Check if user has valid LinkedIn credentials
      const { data: credentials, error: credentialsError } = await supabase
        .from('linkedin_credentials')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (credentialsError && credentialsError.code !== 'PGRST116') {
        console.error('Error fetching LinkedIn credentials:', credentialsError);
        throw credentialsError;
      }
      
      const isConnected = credentials && new Date(credentials.expires_at) > new Date();
      result = { 
        isConnected, 
        profile: credentials?.profile_data || null,
        expires_at: credentials?.expires_at || null
      };
    } else if (action === 'disconnect') {
      // Remove LinkedIn connection
      const { error: deleteError } = await supabase
        .from('linkedin_credentials')
        .delete()
        .eq('user_id', user.id);
        
      if (deleteError) {
        console.error('Error disconnecting LinkedIn account:', deleteError);
        throw deleteError;
      }
      
      result = { success: true, message: 'LinkedIn account disconnected successfully' };
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
