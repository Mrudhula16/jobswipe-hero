
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

// LinkedIn API endpoints
const LINKEDIN_AUTH_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const LINKEDIN_JOB_SEARCH_URL = "https://api.linkedin.com/v2/jobSearch";

// Get LinkedIn access token (would typically use a stored token for a user)
async function getLinkedInAccessToken() {
  try {
    // For demo, we're using client credentials flow
    // In production, you'd use the authorization code flow with user consent
    const formData = new URLSearchParams();
    formData.append("grant_type", "client_credentials");
    formData.append("client_id", linkedinClientId);
    formData.append("client_secret", linkedinClientSecret);
    
    const response = await fetch(LINKEDIN_AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });
    
    if (!response.ok) {
      throw new Error(`LinkedIn auth failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error getting LinkedIn access token:", error);
    return null;
  }
}

// Search LinkedIn jobs with the given parameters
async function searchLinkedInJobs(params: any, accessToken: string) {
  try {
    const { query = "", location = "", count = 10, lastJobId } = params;
    
    let url = `${LINKEDIN_JOB_SEARCH_URL}?keywords=${encodeURIComponent(query)}`;
    
    if (location) {
      url += `&location=${encodeURIComponent(location)}`;
    }
    
    url += `&count=${count}`;
    
    // Add more filters based on the filters parameter
    if (params.filters) {
      if (params.filters.jobType?.length > 0) {
        url += `&jobType=${encodeURIComponent(params.filters.jobType[0])}`;
      }
      
      if (params.filters.experienceLevel?.length > 0) {
        url += `&experience=${encodeURIComponent(params.filters.experienceLevel[0])}`;
      }
      
      if (params.filters.datePosted?.length > 0) {
        const datePosted = params.filters.datePosted[0];
        // Map our date posted filters to LinkedIn time ranges
        if (datePosted === "past24h") {
          url += "&timePosted=past-24h";
        } else if (datePosted === "past3d") {
          url += "&timePosted=past-3d";
        } else if (datePosted === "pastWeek") {
          url += "&timePosted=past-week";
        } else if (datePosted === "pastMonth") {
          url += "&timePosted=past-month";
        }
      }
    }
    
    // Pagination using lastJobId
    if (lastJobId) {
      url += `&start=${lastJobId}`;
    }
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
    });
    
    if (!response.ok) {
      throw new Error(`LinkedIn job search failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform LinkedIn's response to our Job format
    const jobs = data.elements.map((job: any) => ({
      id: job.entityUrn.split(":").pop(),
      title: job.title,
      company: job.companyName,
      location: job.formattedLocation || job.location,
      description: job.description || "",
      requirements: job.skills || [],
      posted: job.listedAt || new Date().toISOString(),
      type: job.jobState || "ACTIVE",
      salary: job.salary || "Not specified",
      logo: job.companyLogo || "",
      isNew: true,
      url: `https://www.linkedin.com/jobs/view/${job.entityUrn.split(":").pop()}`,
      applicationUrl: job.applyMethod?.companyApplyUrl || `https://www.linkedin.com/jobs/view/${job.entityUrn.split(":").pop()}`,
      source: "linkedin",
      sourceId: job.entityUrn
    }));
    
    return jobs;
  } catch (error) {
    console.error("Error searching LinkedIn jobs:", error);
    return null;
  }
}

// Generate mock LinkedIn jobs when API is not available or for testing
function generateMockLinkedInJobs(params: any) {
  const { query = "", location = "", count = 10, filters = {} } = params;
  console.log(`Generating ${count} LinkedIn jobs with filters`, { filtersApplied: Object.keys(filters) });
  
  const mockCompanies = [
    "Google", "Microsoft", "Amazon", "Apple", "Facebook", "Twitter", "LinkedIn", "Netflix", "Airbnb",
    "Uber", "Lyft", "Stripe", "Spotify", "Adobe", "Salesforce", "Oracle", "IBM", "Intel", "Cisco"
  ];
  
  const mockLocations = [
    "San Francisco, CA", "New York, NY", "Seattle, WA", "Los Angeles, CA", "Austin, TX",
    "Boston, MA", "Chicago, IL", "Denver, CO", "Atlanta, GA", "Remote"
  ];
  
  const mockJobTypes = [
    "Full-time", "Part-time", "Contract", "Temporary", "Internship"
  ];
  
  const mockTitles = [
    "Software Engineer", "Product Manager", "UX Designer", "Data Scientist", "DevOps Engineer",
    "Frontend Developer", "Backend Developer", "Full Stack Developer", "Machine Learning Engineer",
    "Marketing Manager", "Sales Representative", "Customer Success Manager", "Financial Analyst"
  ];
  
  // Use filters and query parameters to make the mock data more relevant
  let filteredTitles = mockTitles;
  let filteredLocations = mockLocations;
  let filteredJobTypes = mockJobTypes;
  
  if (query) {
    filteredTitles = mockTitles.filter(title => 
      title.toLowerCase().includes(query.toLowerCase())
    );
    if (filteredTitles.length === 0) filteredTitles = mockTitles;
  }
  
  if (location) {
    filteredLocations = mockLocations.filter(loc => 
      loc.toLowerCase().includes(location.toLowerCase())
    );
    if (filteredLocations.length === 0) filteredLocations = mockLocations;
  }
  
  if (filters.jobType?.length > 0) {
    filteredJobTypes = mockJobTypes.filter(type => 
      filters.jobType.some((filter: string) => 
        type.toLowerCase().includes(filter.toLowerCase())
      )
    );
    if (filteredJobTypes.length === 0) filteredJobTypes = mockJobTypes;
  }
  
  const jobs = Array.from({ length: count }, (_, i) => {
    const company = mockCompanies[Math.floor(Math.random() * mockCompanies.length)];
    const title = filteredTitles[Math.floor(Math.random() * filteredTitles.length)];
    const loc = filteredLocations[Math.floor(Math.random() * filteredLocations.length)];
    const jobType = filteredJobTypes[Math.floor(Math.random() * filteredJobTypes.length)];
    
    // Generate salary based on job title and type
    let salary = "";
    if (title.includes("Engineer") || title.includes("Developer")) {
      salary = "$100,000 - $150,000";
    } else if (title.includes("Manager")) {
      salary = "$120,000 - $180,000";
    } else if (title.includes("Designer")) {
      salary = "$90,000 - $120,000";
    } else if (title.includes("Intern")) {
      salary = "$20 - $30 per hour";
    } else {
      salary = "$80,000 - $120,000";
    }
    
    // Adjust for part-time and contract
    if (jobType === "Part-time") {
      salary = salary.replace(/\$(\d+),000/g, (_, num) => `$${Math.floor(parseInt(num) * 0.6)},000`);
    } else if (jobType === "Contract") {
      salary = salary.replace(/\$(\d+),000/g, (_, num) => `$${Math.floor(parseInt(num) * 1.2)},000`);
    }
    
    // Generate mock requirements based on job title
    const requirements = [];
    if (title.includes("Engineer") || title.includes("Developer")) {
      requirements.push("JavaScript", "TypeScript", "React", "Node.js");
      if (title.includes("Frontend")) {
        requirements.push("CSS", "HTML", "UI/UX");
      } else if (title.includes("Backend")) {
        requirements.push("API Design", "Databases", "Cloud Infrastructure");
      } else if (title.includes("Full Stack")) {
        requirements.push("Frontend", "Backend", "DevOps");
      }
    } else if (title.includes("Designer")) {
      requirements.push("Figma", "Adobe Creative Suite", "UI/UX", "Prototyping");
    } else if (title.includes("Data")) {
      requirements.push("Python", "SQL", "Machine Learning", "Data Visualization");
    } else if (title.includes("Manager")) {
      requirements.push("Leadership", "Communication", "Project Management", "Team Building");
    }
    
    // Convert requirements to strings
    const stringRequirements = requirements.map(req => req.toString());
    
    const postedDate = new Date();
    postedDate.setDate(postedDate.getDate() - Math.floor(Math.random() * 14)); // Random date within last 2 weeks
    
    return {
      id: `linkedin-job-${Date.now()}-${i}`,
      title,
      company,
      location: loc,
      salary,
      description: `${title} position at ${company}. We're looking for a talented professional to join our team. The ideal candidate will have experience in ${requirements.join(", ")}.`,
      requirements: stringRequirements,
      posted: postedDate.toISOString(),
      type: jobType,
      logo: `https://logo.clearbit.com/${company.toLowerCase().replace(/\s+/g, "")}.com`, // Use Clearbit for logos
      isNew: Math.random() > 0.7, // 30% chance of being marked as new
      url: `https://www.linkedin.com/jobs/view/linkedin-job-${Date.now()}-${i}`,
      applicationUrl: `https://www.linkedin.com/jobs/view/linkedin-job-${Date.now()}-${i}/apply`,
      source: "linkedin",
      sourceId: `linkedin-job-${Date.now()}-${i}`
    };
  });
  
  return jobs;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { filters = {}, count = 10, lastJobId, source = "generic", query, location } = await req.json();
    console.log(`Received job search request. Source: ${source}, Filters:`, filters);
    
    // For LinkedIn jobs, try to use the LinkedIn API
    if (source === "linkedin") {
      const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
      
      // Try to get a LinkedIn access token
      const accessToken = await getLinkedInAccessToken();
      
      if (accessToken) {
        // If we have an access token, search for jobs using the LinkedIn API
        const params = { 
          query: query || filters.job_function?.[0] || filters.jobType?.[0] || "", 
          location: location || filters.location || "",
          count,
          lastJobId,
          filters
        };
        
        const linkedInJobs = await searchLinkedInJobs(params, accessToken);
        
        if (linkedInJobs && linkedInJobs.length > 0) {
          return new Response(
            JSON.stringify({ jobs: linkedInJobs }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
      
      // If LinkedIn API fails or returns no results, fall back to mock data
      const mockParams = { 
        query: query || filters.job_function?.[0] || filters.jobType?.[0] || "", 
        location: location || filters.location || "",
        count,
        filters
      };
      
      const mockJobs = generateMockLinkedInJobs(mockParams);
      
      return new Response(
        JSON.stringify({ jobs: mockJobs }),
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
