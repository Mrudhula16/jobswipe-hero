
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to scrape LinkedIn job listings
async function getLinkedInJobs(query: string, location: string, count: number = 10) {
  console.log(`Fetching LinkedIn jobs for query: ${query}, location: ${location}`);
  
  // This is a simulation of LinkedIn job fetching
  // In a real implementation, you would use one of these approaches:
  // 1. LinkedIn API (requires approval)
  // 2. RSS Feed parsing from LinkedIn
  // 3. A third-party job search API that includes LinkedIn data
  
  // For now, we'll generate realistic LinkedIn job data
  const companies = [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png" },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/2560px-Meta_Platforms_Inc._logo.svg.png" },
    { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png" },
    { name: "Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/2560px-Salesforce.com_logo.svg.png" },
    { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png" },
    { name: "Oracle", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/2560px-Oracle_logo.svg.png" },
    { name: "Intel", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Intel_logo_%282006-2020%29.svg/1005px-Intel_logo_%282006-2020%29.svg.png" },
    { name: "Adobe", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Adobe_Systems_logo_and_wordmark.svg/1280px-Adobe_Systems_logo_and_wordmark.svg.png" },
  ];

  const jobTitles = [
    "Software Engineer",
    "Senior Software Engineer",
    "Full Stack Developer",
    "Product Manager",
    "Data Scientist",
    "UX Designer",
    "DevOps Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Machine Learning Engineer",
    "AI Engineer",
    "Cloud Architect",
    "Project Manager",
    "QA Engineer",
    "Technical Program Manager"
  ];
  
  const locations = location ? [location] : ["San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX", "Boston, MA", "Remote"];
  
  const requirements = [
    ["JavaScript", "React", "Node.js", "TypeScript", "AWS", "REST APIs", "Git"],
    ["Python", "Django", "Flask", "SQL", "Docker", "Kubernetes"],
    ["Java", "Spring Boot", "Microservices", "Cloud Computing", "CI/CD"],
    ["UI/UX Design", "Figma", "Adobe XD", "User Research", "Prototyping"],
    ["Data Science", "Machine Learning", "SQL", "Python", "TensorFlow", "PyTorch"],
    ["Go", "Rust", "C++", "Systems Programming", "Distributed Systems"],
    ["Cloud Services", "AWS", "Azure", "GCP", "Serverless", "Terraform"]
  ];
  
  const salaryRanges = ["$120K - $150K", "$90K - $120K", "$150K - $180K", "$160K - $200K", "$200K - $250K"];
  
  const jobs = [];
  
  for (let i = 0; i < count; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const titleIndex = Math.floor(Math.random() * jobTitles.length);
    const title = query ? `${query} ${titleIndex % 2 === 0 ? 'Senior' : ''}` : jobTitles[titleIndex];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const requirementSet = requirements[Math.floor(Math.random() * requirements.length)];
    const salary = salaryRanges[Math.floor(Math.random() * salaryRanges.length)];
    
    // Generate a LinkedIn-like URL and application URL
    const jobId = crypto.randomUUID().substring(0, 8);
    const linkedInJobUrl = `https://www.linkedin.com/jobs/view/linkedin-${jobId}`;
    
    const description = `
      We are looking for a talented ${title} to join our team at ${company.name}. 
      In this role, you will be responsible for developing and maintaining high-quality software solutions.
      You will work closely with cross-functional teams to deliver innovative products that meet business requirements.

      Key Responsibilities:
      - Design, develop, and maintain software applications
      - Collaborate with product managers, designers, and other stakeholders
      - Write clean, efficient, and maintainable code
      - Participate in code reviews and technical discussions
      - Troubleshoot and fix software defects

      Required Skills:
      ${requirementSet.slice(0, 4).join(', ')}

      Preferred Skills:
      ${requirementSet.slice(4).join(', ')}

      We offer a competitive salary and benefits package, as well as opportunities for professional growth and development.
    `;
    
    jobs.push({
      id: `linkedin-${jobId}`,
      title: title,
      company: company.name,
      location: location,
      salary: salary,
      description: description,
      requirements: requirementSet,
      posted: `Posted ${Math.floor(Math.random() * 14) + 1} days ago`,
      type: ["Full-time", "Part-time", "Contract", "Remote"][Math.floor(Math.random() * 4)],
      logo: company.logo,
      isNew: Math.random() > 0.7, // 30% chance of being marked as new
      url: linkedInJobUrl,
      applicationUrl: `${linkedInJobUrl}/apply`,
      source: "linkedin",
      sourceId: `linkedin-${jobId}`
    });
  }
  
  return jobs;
}

// Handle auto-application to LinkedIn jobs
async function simulateLinkedInApplication(jobDetails: any, userId: string) {
  console.log(`Attempting to auto-apply for LinkedIn job: ${jobDetails.title} at ${jobDetails.company}`);
  
  // Simulate a success rate of 70% for LinkedIn job applications
  const isSuccessful = Math.random() < 0.7;
  
  // Simulate application process timing
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  if (isSuccessful) {
    return {
      success: true,
      message: `Successfully applied to ${jobDetails.title} at ${jobDetails.company} via LinkedIn`,
      applicationDetails: {
        jobId: jobDetails.id,
        userId: userId,
        appliedAt: new Date().toISOString(),
        status: 'applied'
      }
    };
  } else {
    return {
      success: false,
      message: `Could not complete application to ${jobDetails.title} on LinkedIn. The job has been saved for manual application.`,
      applicationDetails: {
        jobId: jobDetails.id,
        userId: userId,
        appliedAt: new Date().toISOString(),
        status: 'failed'
      }
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, query, location, count, jobDetails, userId } = await req.json();
    
    // Handle different actions
    if (action === 'search') {
      console.log(`LinkedIn job search: query=${query}, location=${location}, count=${count}`);
      const jobs = await getLinkedInJobs(query, location, count || 10);
      
      return new Response(
        JSON.stringify({ jobs }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    else if (action === 'apply') {
      console.log(`Processing LinkedIn job application: ${jobDetails?.title}`);
      
      if (!jobDetails || !userId) {
        throw new Error('Missing job details or user ID');
      }
      
      const result = await simulateLinkedInApplication(jobDetails, userId);
      
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    else {
      throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error in linkedin-jobs function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred processing the LinkedIn job request'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
