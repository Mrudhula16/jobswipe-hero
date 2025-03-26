
// This service prepares for integration with LinkedIn and Glassdoor APIs
// It currently uses mock data but is structured to easily swap in real API calls

export interface JobSource {
  id: string;
  name: string;
  logo: string;
  description: string;
  isConnected: boolean;
}

export interface CompanyInfo {
  id: string;
  name: string;
  size: string;
  industry: string;
  location: string;
  logo?: string;
  diversityScore?: number;
  rating?: number;
}

export interface JobPlatformFilters {
  roles: string[];
  companySizes: string[];
  industries: string[];
  locations: string[];
  skills: string[];
  salaryRanges: { min: number; max: number; label: string }[];
}

// Mock job sources (to be replaced with real API connections)
const mockJobSources: JobSource[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/800px-LinkedIn_logo_initials.png",
    description: "Connect your LinkedIn account to import job preferences and find matching opportunities",
    isConnected: false
  },
  {
    id: "glassdoor",
    name: "Glassdoor",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Glassdoor_logo.svg",
    description: "Link your Glassdoor profile to access company reviews and salary information",
    isConnected: false
  },
  {
    id: "indeed",
    name: "Indeed",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Indeed_logo.svg",
    description: "Import your Indeed profile to find more opportunities and simplify applications",
    isConnected: false
  }
];

// Sample industry data that would be pulled from APIs
const mockIndustries = [
  "Technology", "Healthcare", "Finance", "Education", "Manufacturing",
  "Retail", "Media", "Transportation", "Energy", "Consulting", 
  "Non-profit", "Government", "Legal", "Real Estate", "Hospitality",
  "Construction", "Telecommunications", "Pharmaceuticals", "Agriculture"
];

// Sample job roles that would be pulled from APIs
const mockJobRoles = [
  "Software Engineer", "Product Manager", "Data Scientist", "UX Designer",
  "Project Manager", "Marketing Manager", "Sales Representative", "Customer Success Manager",
  "Business Analyst", "Financial Analyst", "HR Manager", "Operations Manager",
  "Content Writer", "Graphic Designer", "Account Executive", "DevOps Engineer"
];

// Sample company sizes
const mockCompanySizes = [
  "1-10 employees", "11-50 employees", "51-200 employees",
  "201-500 employees", "501-1,000 employees", "1,001-5,000 employees",
  "5,001-10,000 employees", "10,001+ employees"
];

// Sample platforms filters
const mockPlatformFilters: JobPlatformFilters = {
  roles: mockJobRoles,
  companySizes: mockCompanySizes,
  industries: mockIndustries,
  locations: ["Remote", "New York, NY", "San Francisco, CA", "Austin, TX", "Seattle, WA", "Boston, MA"],
  skills: [
    "JavaScript", "Python", "React", "SQL", "AWS", "Product Management",
    "Marketing", "Sales", "Data Analysis", "Project Management", "UX Design",
    "User Research", "Customer Service", "Leadership", "Communication"
  ],
  salaryRanges: [
    { min: 0, max: 50000, label: "Under $50K" },
    { min: 50000, max: 80000, label: "$50K - $80K" },
    { min: 80000, max: 100000, label: "$80K - $100K" },
    { min: 100000, max: 130000, label: "$100K - $130K" },
    { min: 130000, max: 150000, label: "$130K - $150K" },
    { min: 150000, max: 200000, label: "$150K - $200K" },
    { min: 200000, max: 500000, label: "$200K+" }
  ]
};

// Get available job platforms for integration
export const getAvailableJobSources = async (): Promise<JobSource[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockJobSources;
};

// Get filter options from job platforms
export const getJobPlatformFilters = async (): Promise<JobPlatformFilters> => {
  // In a real implementation, this would call LinkedIn/Glassdoor APIs
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockPlatformFilters;
};

// Connect to a job platform (would require OAuth in real implementation)
export const connectToJobPlatform = async (platformId: string): Promise<boolean> => {
  console.log(`Connecting to platform: ${platformId}`);
  // This would trigger OAuth flow in real implementation
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  return true;
};

// Import preferences from a connected platform
export const importPreferencesFromPlatform = async (platformId: string): Promise<any> => {
  console.log(`Importing preferences from: ${platformId}`);
  // This would call the platform's API to get user preferences
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    jobTitle: platformId === "linkedin" ? "Product Designer" : "UX Designer",
    skills: ["Design Systems", "Figma", "User Research", "Prototyping"],
    industries: ["Technology", "Design"]
  };
};

export default {
  getAvailableJobSources,
  getJobPlatformFilters,
  connectToJobPlatform,
  importPreferencesFromPlatform
};
