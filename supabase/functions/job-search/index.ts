
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock LinkedIn job data generator with realistic details
function generateLinkedInJobs(filters: any = {}, count: number = 10) {
  const companies = [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png" },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/2560px-Meta_Platforms_Inc._logo.svg.png" },
    { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png" },
    { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png" },
    { name: "Tesla", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/2560px-Tesla_Motors.svg.png" },
    { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png" },
    { name: "Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/2560px-Salesforce.com_logo.svg.png" },
    { name: "Adobe", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Adobe_Systems_logo_and_wordmark.svg/1280px-Adobe_Systems_logo_and_wordmark.svg.png" }
  ];
  
  const locations = ["San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX", "Boston, MA", "Chicago, IL", "Los Angeles, CA", "Remote"];
  
  const jobTypes = [
    { title: "Software Engineer", requirements: ["JavaScript", "React", "Node.js", "TypeScript", "AWS"] },
    { title: "Product Manager", requirements: ["Product Strategy", "User Research", "Roadmapping", "Agile", "Data Analysis"] },
    { title: "Data Scientist", requirements: ["Python", "SQL", "Machine Learning", "Statistics", "Data Visualization"] },
    { title: "UX Designer", requirements: ["Figma", "User Research", "Prototyping", "UI Design", "User Testing"] },
    { title: "DevOps Engineer", requirements: ["Kubernetes", "Docker", "CI/CD", "Cloud Platforms", "Infrastructure as Code"] },
    { title: "Frontend Developer", requirements: ["HTML", "CSS", "JavaScript", "React", "Vue.js"] },
    { title: "Backend Developer", requirements: ["Node.js", "Python", "Java", "Databases", "API Design"] },
    { title: "Full Stack Developer", requirements: ["JavaScript", "React", "Node.js", "MongoDB", "AWS"] },
    { title: "Machine Learning Engineer", requirements: ["Python", "TensorFlow", "PyTorch", "Computer Vision", "NLP"] },
    { title: "iOS Developer", requirements: ["Swift", "Objective-C", "UIKit", "CoreData", "REST APIs"] }
  ];
  
  const employmentTypes = ["Full-time", "Part-time", "Contract", "Remote"];
  
  const salaryRanges = ["$120K - $150K", "$90K - $120K", "$150K - $180K", "$80K - $100K", "$180K - $220K"];
  
  const timePeriods = [
    "Posted 2 hours ago", 
    "Posted today", 
    "Posted yesterday", 
    "Posted 2 days ago", 
    "Posted 3 days ago", 
    "Posted 1 week ago"
  ];

  // Filter logic
  const filteredJobs = [];
  
  for (let i = 0; i < count; i++) {
    const randomCompany = companies[Math.floor(Math.random() * companies.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const randomJobType = jobTypes[Math.floor(Math.random() * jobTypes.length)];
    const randomEmploymentType = employmentTypes[Math.floor(Math.random() * employmentTypes.length)];
    const randomSalary = salaryRanges[Math.floor(Math.random() * salaryRanges.length)];
    const randomTimePeriod = timePeriods[Math.floor(Math.random() * timePeriods.length)];
    
    const linkedInId = `li-${crypto.randomUUID().slice(0, 8)}`;
    const jobDesc = `We are looking for a talented ${randomJobType.title} to join our team. You will work on exciting projects and collaborate with cross-functional teams to build innovative solutions. The ideal candidate has experience with ${randomJobType.requirements.slice(0, 3).join(", ")}.`;
    
    // Generate LinkedIn URL and application URL
    const linkedInBaseUrl = "https://www.linkedin.com/jobs/view/";
    const jobUrl = `${linkedInBaseUrl}${linkedInId}`;
    const applicationUrl = `${linkedInBaseUrl}${linkedInId}/apply`;
    
    // Create job object
    const job = {
      id: crypto.randomUUID(),
      title: randomJobType.title,
      company: randomCompany.name,
      location: randomLocation,
      salary: randomSalary,
      description: jobDesc,
      requirements: randomJobType.requirements,
      posted: randomTimePeriod,
      type: randomEmploymentType,
      logo: randomCompany.logo,
      isNew: Math.random() > 0.7, // 30% chance of being marked as new
      url: jobUrl,
      applicationUrl: applicationUrl,
      source: "linkedin",
      sourceId: linkedInId
    };
    
    // Apply filters if they exist
    let matchesFilters = true;
    
    if (filters) {
      // Filter by job title
      if (filters.jobTitle && !job.title.toLowerCase().includes(filters.jobTitle.toLowerCase())) {
        matchesFilters = false;
      }
      
      // Filter by location
      if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
        matchesFilters = false;
      }
      
      // Filter by company
      if (filters.company && !job.company.toLowerCase().includes(filters.company.toLowerCase())) {
        matchesFilters = false;
      }
      
      // Filter by employment type
      if (filters.employmentType && job.type !== filters.employmentType) {
        matchesFilters = false;
      }
      
      // Filter by skills/requirements
      if (filters.skills && filters.skills.length > 0) {
        const hasRequiredSkills = filters.skills.some((skill: string) => 
          job.requirements.some(req => req.toLowerCase().includes(skill.toLowerCase()))
        );
        if (!hasRequiredSkills) {
          matchesFilters = false;
        }
      }
    }
    
    if (matchesFilters) {
      filteredJobs.push(job);
    }
  }
  
  return filteredJobs;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { filters = {}, count = 10, lastJobId, source = "generic" } = await req.json();
    console.log(`Received job search request. Source: ${source}, Filters:`, filters);
    
    // For LinkedIn jobs, use our mock generator
    if (source === "linkedin") {
      const jobs = generateLinkedInJobs(filters, count);
      console.log(`Generated ${jobs.length} LinkedIn jobs`);
      
      return new Response(
        JSON.stringify({ jobs }),
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
    
    if (filters.employmentType) {
      query = query.eq('type', filters.employmentType);
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
