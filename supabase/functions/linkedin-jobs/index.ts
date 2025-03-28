
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
    } else {
      console.log('Filters applied: none');
    }
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    try {
      console.log(`Fetching LinkedIn jobs for query: ${query}, location: ${location}, count: ${count}`);
      
      // In a real implementation, you would:
      // 1. Call LinkedIn API with the query, location, and filters
      // 2. Transform the response to our Job format
      // 3. Return the results
      
      // For now, let's simulate the LinkedIn API response
      const linkedInJobs = await fetchLinkedInJobs(query, location, filters);
      
      if (linkedInJobs.length === 0) {
        console.log("No jobs found in LinkedIn API response, falling back to simulated data");
        // Generate simulated data if no jobs are found
        const simulatedJobs = generateSimulatedJobs(query, location, count);
        return new Response(
          JSON.stringify({ jobs: simulatedJobs }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ jobs: linkedInJobs }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (apiError) {
      console.error("Error calling LinkedIn API:", apiError);
      
      // Generate simulated data as fallback
      console.log(`Generating ${count} simulated LinkedIn jobs for query: ${query}, location: ${location}`);
      const simulatedJobs = generateSimulatedJobs(query, location, count);
      
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

// Simulated function to fetch LinkedIn jobs
async function fetchLinkedInJobs(query, location, filters) {
  // In a production environment, you would use the LinkedIn API here
  // For now, return an empty array to trigger our fallback
  return [];
}

// Generate simulated LinkedIn job listings
function generateSimulatedJobs(query, location, count) {
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
  
  const jobTitles = [
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
  
  const locations = location ? [location] : [
    "San Francisco, CA", 
    "New York, NY", 
    "Seattle, WA", 
    "Austin, TX", 
    "Remote",
    "Boston, MA",
    "Chicago, IL",
    "Los Angeles, CA",
    "Denver, CO",
    "Atlanta, GA"
  ];
  
  const jobTypes = [
    "Full-time", 
    "Part-time", 
    "Contract", 
    "Remote", 
    "Hybrid"
  ];
  
  const salaryRanges = [
    "$80,000 - $100,000",
    "$100,000 - $130,000",
    "$130,000 - $160,000",
    "$160,000 - $200,000",
    "$200,000+"
  ];
  
  const simulatedJobs = [];
  
  // For pagination simulation, use the following array to ensure consistent IDs
  const jobIds = [
    "11b3abcd-1234-5678-90ab-cdef01234567",
    "22b3abcd-1234-5678-90ab-cdef01234567",
    "33b3abcd-1234-5678-90ab-cdef01234567",
    "44b3abcd-1234-5678-90ab-cdef01234567",
    "55b3abcd-1234-5678-90ab-cdef01234567",
    "66b3abcd-1234-5678-90ab-cdef01234567",
    "77b3abcd-1234-5678-90ab-cdef01234567",
    "88b3abcd-1234-5678-90ab-cdef01234567",
    "99b3abcd-1234-5678-90ab-cdef01234567",
    "10b3abcd-1234-5678-90ab-cdef01234567",
    "11c3abcd-1234-5678-90ab-cdef01234567",
    "12c3abcd-1234-5678-90ab-cdef01234567",
    "13c3abcd-1234-5678-90ab-cdef01234567",
    "14c3abcd-1234-5678-90ab-cdef01234567",
    "15c3abcd-1234-5678-90ab-cdef01234567",
  ];
  
  for (let i = 0; i < count; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const title = query || jobTitles[Math.floor(Math.random() * jobTitles.length)];
    const jobLocation = locations[Math.floor(Math.random() * locations.length)];
    const jobType = jobTypes[Math.floor(Math.random() * jobTypes.length)];
    const salaryRange = salaryRanges[Math.floor(Math.random() * salaryRanges.length)];
    
    // Calculate a date within the last 30 days
    const postedDate = new Date();
    postedDate.setDate(postedDate.getDate() - Math.floor(Math.random() * 30));
    
    const isNew = (new Date().getTime() - postedDate.getTime()) / (1000 * 3600 * 24) < 3; // Is it less than 3 days old?
    
    // Generate LinkedIn application URL
    const jobSlug = title.toLowerCase().replace(/\s+/g, '-');
    const companySlug = company.name.toLowerCase().replace(/\s+/g, '-');
    const applicationUrl = `https://www.linkedin.com/jobs/view/${companySlug}-${jobSlug}-${Math.floor(Math.random() * 1000000)}`;
    
    // Generate random requirements
    const requirements = [
      "Bachelor's degree in Computer Science or related field",
      "3+ years of professional software development experience",
      "Proficiency in JavaScript and TypeScript",
      "Experience with React and modern frontend frameworks",
      "Strong problem-solving skills",
      "Excellent communication and teamwork abilities"
    ];
    
    // Generate a detailed job description
    const description = `
${company.name} is seeking a talented ${title} to join our team. This is an exciting opportunity to work on cutting-edge technology that impacts millions of users worldwide.

As a ${title} at ${company.name}, you will be responsible for designing, developing, and maintaining high-quality software solutions. You will collaborate with cross-functional teams to deliver innovative products and features.

Key Responsibilities:
- Design and implement robust, scalable, and maintainable code
- Collaborate with product managers, designers, and other engineers
- Participate in code reviews and technical discussions
- Debug and fix issues in existing applications
- Write automated tests to ensure code quality

Requirements:
- ${requirements[0]}
- ${requirements[1]}
- ${requirements[2]}
- ${requirements[3]}
- ${requirements[4]}
- ${requirements[5]}

We offer:
- Competitive salary (${salaryRange})
- Comprehensive benefits package
- Flexible work arrangements
- Professional development opportunities
- Collaborative and innovative work environment

${company.name} is an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees.
`;
    
    simulatedJobs.push({
      id: jobIds[i % jobIds.length], // Use consistent IDs for pagination simulation
      title,
      company: company.name,
      location: jobLocation,
      salary: salaryRange,
      description,
      requirements,
      posted: postedDate.toISOString(),
      type: jobType,
      logo: company.logo,
      isNew,
      url: applicationUrl,
      applicationUrl,
      source: "linkedin",
      sourceId: `linkedin-${Math.floor(Math.random() * 1000000)}`
    });
  }
  
  return simulatedJobs;
}
