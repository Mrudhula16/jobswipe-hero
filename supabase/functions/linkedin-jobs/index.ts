
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Mock job data while our scraper is being implemented
const generateMockJobs = (count = 10) => {
  const jobTitles = [
    "Senior Frontend Engineer", "Full Stack Developer", "UI/UX Designer",
    "Product Manager", "DevOps Engineer", "Data Scientist",
    "Machine Learning Engineer", "Software Engineer", "Backend Developer",
    "Mobile App Developer", "Cloud Architect", "QA Engineer"
  ];
  
  const companies = [
    "Google", "Microsoft", "Apple", "Amazon", "Meta", 
    "Netflix", "Airbnb", "Spotify", "Uber", "Slack",
    "Twitter", "LinkedIn", "Adobe", "Stripe", "Square"
  ];
  
  const locations = [
    "San Francisco, CA", "New York, NY", "Seattle, WA", 
    "Austin, TX", "Boston, MA", "Chicago, IL", 
    "Los Angeles, CA", "Denver, CO", "Atlanta, GA",
    "Remote"
  ];
  
  const descriptions = [
    "We are looking for an experienced engineer to join our team...",
    "Join our fast-paced environment and work on cutting-edge technologies...",
    "Help us build the next generation of our product...",
    "Work with a diverse team of professionals to solve complex problems...",
    "Contribute to our mission of transforming the industry..."
  ];
  
  const skills = [
    "JavaScript", "TypeScript", "React", "Node.js", "Python",
    "AWS", "Docker", "Kubernetes", "SQL", "NoSQL",
    "GraphQL", "REST API", "Git", "CI/CD", "Agile",
    "CSS", "HTML", "Vue.js", "Angular", "Java",
    "Spring Boot", "Go", "Ruby on Rails", "PHP", "Laravel"
  ];
  
  const salaryRanges = [
    "$80K - $100K", "$100K - $130K", "$130K - $160K",
    "$160K - $200K", "$200K - $250K", "Competitive"
  ];
  
  const jobs = [];
  
  for (let i = 0; i < count; i++) {
    const randomSkills = [...skills]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 5) + 3);
      
    const location = locations[Math.floor(Math.random() * locations.length)];
    const isRemote = location.toLowerCase().includes('remote') || Math.random() > 0.7;
    
    jobs.push({
      id: `job-${i}-${Date.now()}`,
      title: jobTitles[Math.floor(Math.random() * jobTitles.length)],
      company: companies[Math.floor(Math.random() * companies.length)],
      location: location,
      isRemote: isRemote,
      salary: salaryRanges[Math.floor(Math.random() * salaryRanges.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      posted: `${Math.floor(Math.random() * 30) + 1}d ago`,
      type: Math.random() > 0.2 ? "Full-time" : "Contract",
      requirements: randomSkills,
      logo: `https://logo.clearbit.com/${companies[Math.floor(Math.random() * companies.length)].toLowerCase().replace(/\s/g, '')}.com`,
      applicationUrl: `https://example.com/jobs/${i}`,
      source: "linkedin"
    });
  }
  
  return jobs;
};

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
    const { action, query, location, count = 5, lastJobId, filters } = await req.json();
    console.log(`LinkedIn jobs function called with action: ${action}`);
    
    if (action === 'search') {
      // Generate mock jobs
      // In a real implementation, this would call a scraper or API
      const mockJobs = generateMockJobs(count);
      
      return new Response(
        JSON.stringify({ jobs: mockJobs }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'apply') {
      const { jobDetails, userId } = await req.json();
      console.log(`Applying to job: ${jobDetails?.title} for user ${userId}`);
      
      // Simulate job application
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return new Response(
        JSON.stringify({ success: true, message: "Application submitted successfully" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in LinkedIn jobs function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
