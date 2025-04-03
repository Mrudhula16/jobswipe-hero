
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
    const { filters = {}, count = 10, lastJobId, source = "generic" } = await req.json();
    console.log(`Received job search request. Source: ${source}, Filters:`, filters);
    
    // For LinkedIn jobs, use our linkedin-jobs function
    if (source === "linkedin") {
      const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
      
      // Extract query and location from filters
      const query = filters.job_function?.[0] || filters.jobType?.[0] || "";
      const location = filters.location || "";
      
      const { data, error } = await supabase.functions.invoke('linkedin-jobs', {
        body: { 
          action: 'search', 
          query, 
          location,
          lastJobId,
          count
        }
      });
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify({ jobs: data?.jobs || [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // For any other source, use the database
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    // Build the query
    let query = supabase.from('jobs').select('*');
    
    // Apply filters
    if (filters.jobTitle) {
      query = query.ilike('title', `%${filters.jobTitle}%`);
    }
    
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    
    if (filters.company) {
      query = query.ilike('company', `%${filters.company}%`);
    }
    
    if (filters.jobType && filters.jobType.length > 0) {
      // Handle array of job types
      const jobTypeConditions = filters.jobType.map((type) => 
        `type.ilike.%${type}%`
      );
      query = query.or(jobTypeConditions.join(','));
    }
    
    // Pagination using lastJobId
    if (lastJobId) {
      const { data: lastJob } = await supabase
        .from('jobs')
        .select('created_at')
        .eq('id', lastJobId)
        .single();
        
      if (lastJob) {
        query = query.lt('created_at', lastJob.created_at);
      }
    }
    
    // Execute the query
    const { data: jobs, error } = await query
      .order('created_at', { ascending: false })
      .limit(count);
      
    if (error) {
      throw error;
    }
    
    console.log(`Retrieved ${jobs?.length || 0} database jobs`);
    
    return new Response(
      JSON.stringify({ jobs: jobs || [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in job-search function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to retrieve jobs' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
