
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sample job data generator with LinkedIn-like structure
const generateJobs = (filters: any) => {
  const companies = [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png" },
    { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/1200px-Meta_Platforms_Inc._logo.svg.png" },
    { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1200px-Netflix_2015_logo.svg.png" },
    { name: "Airbnb", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_logo_B%C3%A9lo.svg/1200px-Airbnb_logo_B%C3%A9lo.svg.png" },
    { name: "Uber", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/1200px-Uber_logo_2018.svg.png" },
    { name: "LinkedIn", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/800px-LinkedIn_logo_initials.png" }
  ];
  
  const locations = [
    "San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX", 
    "Chicago, IL", "Boston, MA", "Los Angeles, CA", "Denver, CO", "Remote"
  ];
  
  const jobTitles = [
    "Software Engineer", "Frontend Developer", "Backend Developer", "Product Manager",
    "UX Designer", "Data Scientist", "DevOps Engineer", "Machine Learning Engineer",
    "Technical Product Manager", "Full Stack Developer", "Mobile Developer"
  ];
  
  const skills = [
    "JavaScript", "React", "TypeScript", "Python", "Node.js", "AWS", "SQL", "Java",
    "Docker", "Kubernetes", "GraphQL", "CI/CD", "Git", "REST APIs", "HTML/CSS"
  ];

  const jobTypes = ["Full-time", "Part-time", "Contract", "Remote", "Hybrid"];

  // Apply filters if provided
  let filteredTitles = [...jobTitles];
  let filteredLocations = [...locations];
  let filteredCompanies = [...companies];
  let filteredJobTypes = [...jobTypes];
  
  if (filters) {
    // Filter by job title/function
    if (filters.jobFunction) {
      const searchTerms = Array.isArray(filters.jobFunction) ? filters.jobFunction : [filters.jobFunction];
      filteredTitles = jobTitles.filter(title => 
        searchTerms.some(term => title.toLowerCase().includes(term.toLowerCase()))
      );
    }
    
    // Filter by location or remote
    if (filters.location) {
      filteredLocations = locations.filter(loc => loc.toLowerCase().includes(filters.location.toLowerCase()));
    }
    
    if (filters.isRemote) {
      filteredLocations = ["Remote"];
    }
    
    // Filter by job type
    if (filters.jobType && Array.isArray(filters.jobType) && filters.jobType.length > 0) {
      filteredJobTypes = jobTypes.filter(type => 
        filters.jobType.some((jt: string) => type.toLowerCase().includes(jt.toLowerCase()))
      );
    }
  }
  
  // Generate random jobs based on filtered options
  const count = Math.min(10, Math.max(3, Math.floor(Math.random() * 10) + 3));
  const jobs = [];
  
  for (let i = 0; i < count; i++) {
    const company = filteredCompanies[Math.floor(Math.random() * filteredCompanies.length)];
    const title = filteredTitles[Math.floor(Math.random() * filteredTitles.length)];
    const location = filteredLocations[Math.floor(Math.random() * filteredLocations.length)];
    const jobType = filteredJobTypes[Math.floor(Math.random() * filteredJobTypes.length)];
    
    // Generate random skills required for the job
    const requiredSkills = [];
    const skillCount = Math.floor(Math.random() * 5) + 3;
    const shuffledSkills = [...skills].sort(() => 0.5 - Math.random());
    requiredSkills.push(...shuffledSkills.slice(0, skillCount));
    
    // Generate random years of experience
    const minYears = Math.floor(Math.random() * 3) + 1;
    const maxYears = minYears + Math.floor(Math.random() * 5) + 2;
    requiredSkills.push(`${minYears}-${maxYears} years experience`);
    
    // Generate random posted date
    const daysAgo = Math.floor(Math.random() * 14) + 1;
    const postedDate = new Date();
    postedDate.setDate(postedDate.getDate() - daysAgo);
    
    // Generate salary range
    const baseSalary = Math.floor(Math.random() * 100) + 60;
    const salaryRange = `$${baseSalary}k - $${baseSalary + 40}k`;
    
    // Generate application URL
    const applicationUrl = `https://linkedin.com/jobs/view/${Math.floor(Math.random() * 1000000)}`;
    
    // Generate job description
    const descriptionParts = [
      `Join our team as a ${title} at ${company.name}!`,
      `We're looking for a talented professional to help build and scale our products.`,
      `You'll work closely with our engineering, design, and product teams to deliver exceptional experiences.`,
      `In this role, you'll be responsible for designing, developing, and maintaining key features.`,
      `The ideal candidate has experience with ${requiredSkills.slice(0, 3).join(", ")}.`
    ];
    
    jobs.push({
      id: crypto.randomUUID(),
      title,
      company: company.name,
      location,
      logo: company.logo,
      salary: salaryRange,
      description: descriptionParts.join(" "),
      requirements: requiredSkills,
      posted: daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`,
      type: jobType,
      applicationUrl,
      isNew: daysAgo <= 3,
      url: applicationUrl
    });
  }
  
  return jobs;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const { filters, lastJobId } = await req.json();

    // Generate jobs based on filters
    const jobs = generateJobs(filters);
    
    // If this is a "load more" request and we have a lastJobId,
    // we'd filter out the already seen jobs here
    // (In a real implementation with a database, we would do proper pagination)
    
    // For demonstration purposes, we'll just save these jobs to the database
    // so they can be referred to later when applying
    try {
      const { error } = await supabase
        .from('jobs')
        .upsert(jobs.map(job => ({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          description: job.description,
          requirements: job.requirements,
          posted: new Date(),
          type: job.type,
          logo: job.logo,
          is_new: job.isNew
        })));
        
      if (error) {
        console.error('Error saving jobs to database:', error);
      }
    } catch (dbError) {
      console.error('Error in database operation:', dbError);
    }

    return new Response(
      JSON.stringify({ success: true, jobs }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in job-search function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || 'Failed to search jobs' 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
