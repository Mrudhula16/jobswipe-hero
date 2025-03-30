
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const linkedinApiKey = Deno.env.get("LINKEDIN_API_KEY") || "";
const linkedinApiSecret = Deno.env.get("LINKEDIN_API_SECRET") || "";

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
    const { action, query, location, count = 5, filters = {}, lastJobId } = await req.json();
    
    if (action !== 'search') {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Only "search" is supported.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    console.log(`LinkedIn job search: query=${query}, location=${location}, count=${count}`);
    
    // Log filters if present
    if (Object.keys(filters).length > 0) {
      console.log('Filters applied:', filters);
    }
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    try {
      // Build filter query for LinkedIn API
      const filterParams = buildLinkedInFilterParams(filters);
      
      // Try to fetch real jobs from LinkedIn
      const linkedInJobs = await fetchJobsFromLinkedIn(query, location, count, filterParams, lastJobId);
      
      if (linkedInJobs.length > 0) {
        // Store jobs in database for future reference
        await storeJobsInDatabase(supabase, linkedInJobs);
        
        return new Response(
          JSON.stringify({ jobs: linkedInJobs }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // If no jobs found or API not available, generate simulated data
      console.log("No jobs found in LinkedIn API response, falling back to simulated data");
      const simulatedJobs = generateSimulatedJobs(query, location, count, filters);
      
      return new Response(
        JSON.stringify({ jobs: simulatedJobs }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (apiError) {
      console.error("Error calling LinkedIn API:", apiError);
      
      // Generate simulated data as fallback
      console.log(`Generating ${count} simulated LinkedIn jobs for query: ${query}, location: ${location}`);
      const simulatedJobs = generateSimulatedJobs(query, location, count, filters);
      
      return new Response(
        JSON.stringify({ jobs: simulatedJobs }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Build LinkedIn API filter parameters
function buildLinkedInFilterParams(filters: any) {
  const params = new URLSearchParams();
  
  if (filters.jobType?.length > 0) {
    params.append('f_JT', filters.jobType[0]);
  }
  
  if (filters.experienceLevel?.length > 0) {
    params.append('f_E', filters.experienceLevel[0]);
  }
  
  if (filters.datePosted?.length > 0) {
    params.append('f_TPR', filters.datePosted[0]);
  }
  
  if (filters.salary) {
    params.append('f_SB', filters.salary);
  }
  
  return params.toString();
}

// Function to fetch jobs from LinkedIn API
async function fetchJobsFromLinkedIn(query: string, location: string, count: number, filters: string, lastJobId?: string) {
  // If LinkedIn API key is not set, return empty array to trigger fallback
  if (!linkedinApiKey || !linkedinApiSecret) {
    console.log("LinkedIn API keys not configured, falling back to simulated data");
    return [];
  }
  
  try {
    // First, get an access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': linkedinApiKey,
        'client_secret': linkedinApiSecret,
        'scope': 'r_liteprofile r_emailaddress w_member_social r_ads r_ads_reporting'
      })
    });
    
    if (!tokenResponse.ok) {
      console.error("LinkedIn API token error:", await tokenResponse.text());
      return [];
    }
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    // Now use the access token to search for jobs
    // Note: This is using LinkedIn's Marketing API to search for jobs
    // The exact endpoint may change based on LinkedIn's documentation
    const searchUrl = new URL('https://api.linkedin.com/v2/jobSearch');
    
    // Add basic parameters
    searchUrl.searchParams.append('keywords', query);
    if (location) {
      searchUrl.searchParams.append('location', location);
    }
    searchUrl.searchParams.append('count', count.toString());
    
    // Add any additional filters
    if (filters) {
      searchUrl.search += '&' + filters;
    }
    
    // Add pagination if lastJobId is provided
    if (lastJobId) {
      searchUrl.searchParams.append('start', lastJobId);
    }
    
    const response = await fetch(searchUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error("LinkedIn API search error:", await response.text());
      return [];
    }
    
    const data = await response.json();
    
    // Transform LinkedIn API response to our job format
    // Note: This transformation will depend on the actual structure of LinkedIn's API response
    return data.elements.map((job: any) => ({
      id: `linkedin-${job.id}`,
      title: job.title,
      company: job.company.name,
      location: job.locationName,
      salary: job.salary?.range || "Not specified",
      description: job.description,
      requirements: job.skills || [],
      posted: job.postedAt,
      type: job.employmentType || "Full-time",
      logo: job.company.logoUrl,
      isNew: new Date(job.postedAt) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Posted in last 3 days
      url: job.applyUrl,
      applicationUrl: job.applyUrl,
      source: "linkedin",
      sourceId: job.id
    }));
  } catch (error) {
    console.error("LinkedIn API error:", error);
    return [];
  }
}

// Store jobs in Supabase database for future reference
async function storeJobsInDatabase(supabase: any, jobs: any[]) {
  try {
    for (const job of jobs) {
      // Check if job already exists
      const { data: existingJobs } = await supabase
        .from('jobs')
        .select('id')
        .eq('title', job.title)
        .eq('company', job.company)
        .limit(1);
      
      // Skip if job exists
      if (existingJobs && existingJobs.length > 0) {
        continue;
      }
      
      // Convert job object to database format
      const dbJob = {
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        description: job.description,
        requirements: job.requirements,
        type: job.type,
        logo: job.logo,
        is_new: job.isNew,
        posted: job.posted
      };
      
      // Insert job
      await supabase.from('jobs').insert([dbJob]);
    }
  } catch (error) {
    console.error("Error storing jobs in database:", error);
  }
}

// Generate simulated LinkedIn job listings
function generateSimulatedJobs(query: string, location: string, count: number, filters: any) {
  const companies = [
    { name: "Google", logo: "https://logo.clearbit.com/google.com" },
    { name: "Microsoft", logo: "https://logo.clearbit.com/microsoft.com" },
    { name: "Amazon", logo: "https://logo.clearbit.com/amazon.com" },
    { name: "Meta", logo: "https://logo.clearbit.com/meta.com" },
    { name: "Apple", logo: "https://logo.clearbit.com/apple.com" },
    { name: "Netflix", logo: "https://logo.clearbit.com/netflix.com" },
    { name: "Spotify", logo: "https://logo.clearbit.com/spotify.com" },
    { name: "Salesforce", logo: "https://logo.clearbit.com/salesforce.com" },
    { name: "Twitter", logo: "https://logo.clearbit.com/twitter.com" },
    { name: "LinkedIn", logo: "https://logo.clearbit.com/linkedin.com" }
  ];
  
  // Filter job titles based on query
  let jobTitles = [
    "Software Engineer", 
    "Senior Developer", 
    "Product Manager", 
    "UX Designer", 
    "Data Scientist",
    "Frontend Developer",
    "Backend Engineer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Machine Learning Engineer"
  ];
  
  if (query) {
    jobTitles = jobTitles.filter(title => 
      title.toLowerCase().includes(query.toLowerCase())
    );
    if (jobTitles.length === 0) {
      jobTitles = ["Software Engineer"]; // Default if no matches
    }
  }
  
  // Handle location filtering
  const locations = location ? [location] : [
    "San Francisco, CA", 
    "New York, NY", 
    "Seattle, WA", 
    "Austin, TX", 
    "Remote",
    "Boston, MA",
    "Chicago, IL",
    "Los Angeles, CA"
  ];
  
  // Apply filters from request
  const jobTypes = filters.jobType?.length > 0 
    ? filters.jobType.map((t: string) => t.charAt(0).toUpperCase() + t.slice(1))
    : ["Full-time", "Part-time", "Contract", "Remote", "Hybrid"];
  
  const simulatedJobs = [];
  
  for (let i = 0; i < count; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
    const jobLocation = locations[Math.floor(Math.random() * locations.length)];
    const jobType = jobTypes[Math.floor(Math.random() * jobTypes.length)];
    
    // Generate salary based on job title
    let salary;
    if (title.includes("Senior") || title.includes("Lead")) {
      salary = "$120,000 - $180,000";
    } else if (title.includes("Engineer") || title.includes("Developer")) {
      salary = "$90,000 - $140,000";
    } else {
      salary = "$70,000 - $110,000";
    }
    
    // Calculate posting date (random within last 30 days)
    const postedDate = new Date();
    postedDate.setDate(postedDate.getDate() - Math.floor(Math.random() * 30));
    
    // Determine if job is "new" (posted in last 3 days)
    const isNew = (new Date().getTime() - postedDate.getTime()) / (1000 * 3600 * 24) < 3;
    
    // Generate random requirements based on job title
    const requirements = ["JavaScript", "React", "Node.js", "TypeScript", "CSS", "HTML", "SQL", "Git"];
    if (title.includes("Backend")) {
      requirements.push("Express", "MongoDB", "PostgreSQL", "API Design");
    } else if (title.includes("Frontend")) {
      requirements.push("CSS-in-JS", "Webpack", "Redux", "UI/UX");
    } else if (title.includes("Full Stack")) {
      requirements.push("Express", "MongoDB", "Redux", "REST APIs");
    }
    
    // Generate application URL
    const applicationUrl = `https://www.linkedin.com/jobs/view/${i}-${title.toLowerCase().replace(/\s+/g, '-')}`;
    
    simulatedJobs.push({
      id: `linkedin-job-${Date.now()}-${i}`,
      title,
      company: company.name,
      location: jobLocation,
      salary,
      description: `We are looking for a talented ${title} to join our team at ${company.name}. This is a ${jobType.toLowerCase()} position where you will be working on exciting projects with cutting-edge technologies.`,
      requirements,
      posted: postedDate.toISOString(),
      type: jobType,
      logo: company.logo,
      isNew,
      url: applicationUrl,
      applicationUrl,
      source: "linkedin",
      sourceId: `linkedin-job-${Date.now()}-${i}`
    });
  }
  
  return simulatedJobs;
}
