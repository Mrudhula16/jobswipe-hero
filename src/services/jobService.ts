
// Mock service that simulates fetching jobs from an API
// This can be replaced with actual API calls when integrated with a backend

// Job type definition for better type safety
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  posted: string;
  type: string;
  logo?: string;
  isNew?: boolean;
}

// Sample job data - would come from API in production
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior UX Designer",
    company: "Apple",
    location: "Cupertino, CA",
    salary: "$120k - $150k",
    description: "Join our team to help design the next generation of innovative products. Looking for a experienced designer who can create beautiful, intuitive interfaces.",
    requirements: ["5+ years experience", "Figma", "User Research", "Prototyping", "UI Design"],
    posted: "2 days ago",
    type: "Full-time",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    isNew: true
  },
  {
    id: "2",
    title: "Frontend Developer",
    company: "Google",
    location: "Remote",
    salary: "$100k - $130k",
    description: "Work on cutting-edge web applications using the latest technologies. We're seeking a talented frontend developer to join our growing team.",
    requirements: ["React", "TypeScript", "CSS", "Next.js", "Testing"],
    posted: "1 week ago",
    type: "Full-time",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
  },
  {
    id: "3",
    title: "Product Manager",
    company: "Spotify",
    location: "New York, NY",
    salary: "$110k - $140k",
    description: "Lead product development initiatives and work closely with design, engineering, and marketing teams to deliver exceptional user experiences.",
    requirements: ["3+ years experience", "Agile", "Data Analysis", "User Stories", "Roadmapping"],
    posted: "3 days ago",
    type: "Full-time",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png"
  },
  {
    id: "4",
    title: "Machine Learning Engineer",
    company: "Netflix",
    location: "Remote",
    salary: "$140k - $180k",
    description: "Build and optimize machine learning models to enhance our recommendation system and improve user experience across the platform.",
    requirements: ["Python", "TensorFlow", "PyTorch", "Data Science", "NLP"],
    posted: "5 days ago",
    type: "Full-time",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1200px-Netflix_2015_logo.svg.png",
    isNew: true
  },
  {
    id: "5",
    title: "DevOps Engineer",
    company: "Microsoft",
    location: "Seattle, WA",
    salary: "$115k - $145k",
    description: "Implement and maintain CI/CD pipelines, infrastructure as code, and cloud services to support our development teams.",
    requirements: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD"],
    posted: "1 day ago",
    type: "Full-time",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png"
  },
  {
    id: "6",
    title: "Full Stack Developer",
    company: "Airbnb",
    location: "San Francisco, CA",
    salary: "$130k - $160k",
    description: "Join our engineering team to build and improve features across our platform. We're looking for someone who is passionate about creating exceptional user experiences.",
    requirements: ["JavaScript", "React", "Node.js", "SQL", "AWS"],
    posted: "3 days ago",
    type: "Full-time",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_logo_B%C3%A9lo.svg/1200px-Airbnb_logo_B%C3%A9lo.svg.png",
    isNew: true
  },
  {
    id: "7",
    title: "Data Scientist",
    company: "Tesla",
    location: "Austin, TX",
    salary: "$125k - $155k",
    description: "Work with large datasets to extract insights that drive product and business decisions. Help us build the future of sustainable energy and transportation.",
    requirements: ["Python", "Machine Learning", "SQL", "Data Visualization", "Statistics"],
    posted: "1 week ago",
    type: "Full-time",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/1200px-Tesla_Motors.svg.png"
  },
  {
    id: "8",
    title: "Cloud Solutions Architect",
    company: "Amazon Web Services",
    location: "Remote",
    salary: "$145k - $180k",
    description: "Design and implement cloud solutions for enterprise customers. Help customers leverage AWS services to solve business problems.",
    requirements: ["AWS", "Solution Architecture", "Cloud Migration", "Security", "Networking"],
    posted: "2 days ago",
    type: "Full-time",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1200px-Amazon_Web_Services_Logo.svg.png"
  },
  {
    id: "9",
    title: "UI/UX Designer",
    company: "Adobe",
    location: "San Jose, CA",
    salary: "$100k - $130k",
    description: "Create beautiful, intuitive interfaces for our creative suite of products. Work closely with product managers and engineers to deliver amazing user experiences.",
    requirements: ["UI Design", "UX Research", "Adobe Creative Suite", "Prototyping", "Visual Design"],
    posted: "4 days ago",
    type: "Full-time",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Adobe_Systems_logo_and_wordmark.svg/1200px-Adobe_Systems_logo_and_wordmark.svg.png",
    isNew: true
  },
  {
    id: "10",
    title: "Mobile Developer (iOS)",
    company: "Uber",
    location: "Chicago, IL",
    salary: "$115k - $140k",
    description: "Build and maintain iOS applications for our platform. Work with a team of talented engineers to deliver high-quality, performant mobile experiences.",
    requirements: ["Swift", "iOS", "Mobile Development", "RESTful APIs", "Git"],
    posted: "1 week ago",
    type: "Full-time",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/1200px-Uber_logo_2018.svg.png"
  }
];

// Simulate network delays for more realistic API behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get initial batch of jobs
export const getJobs = async (count: number = 5): Promise<Job[]> => {
  // Simulate API delay
  await delay(1500);
  return mockJobs.slice(0, count);
};

// Get more jobs (pagination simulation)
export const getMoreJobs = async (lastJobId: string, count: number = 3): Promise<Job[]> => {
  // Simulate API delay
  await delay(2000);
  
  const lastIndex = mockJobs.findIndex(job => job.id === lastJobId);
  if (lastIndex === -1 || lastIndex + 1 >= mockJobs.length) {
    return [];
  }
  
  return mockJobs.slice(lastIndex + 1, lastIndex + 1 + count);
};

// Get jobs based on filters
export const getFilteredJobs = async (filters: any): Promise<Job[]> => {
  // Simulate API delay
  await delay(1500);
  
  // In a real implementation, this would apply the filters on the server side
  // This is just a simplified version for demonstration
  let filteredJobs = [...mockJobs];
  
  if (filters.jobType && filters.jobType.length > 0) {
    filteredJobs = filteredJobs.filter(job => 
      filters.jobType.some((type: string) => 
        job.type.toLowerCase().includes(type.toLowerCase())
      )
    );
  }
  
  if (filters.location) {
    filteredJobs = filteredJobs.filter(job => 
      job.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }
  
  if (filters.isRemote) {
    filteredJobs = filteredJobs.filter(job => 
      job.location.toLowerCase().includes("remote")
    );
  }
  
  return filteredJobs.slice(0, 5); // Return the first 5 matching jobs
};

export default {
  getJobs,
  getMoreJobs,
  getFilteredJobs
};
