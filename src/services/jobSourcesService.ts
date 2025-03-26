// This service integrates with LinkedIn and Glassdoor APIs
// It currently uses mock data but can be switched to use real API calls

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

// API configuration - replace these with your actual API keys
const API_KEYS = {
  linkedin: "",   // Add your LinkedIn API key here
  glassdoor: "",  // Add your Glassdoor API key here
  indeed: ""      // Add your Indeed API key here
};

// Mock job sources (used as fallback when API keys are not configured)
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

// Sample industry data (used as fallback)
const mockIndustries = [
  "Technology", "Healthcare", "Finance", "Education", "Manufacturing",
  "Retail", "Media", "Transportation", "Energy", "Consulting", 
  "Non-profit", "Government", "Legal", "Real Estate", "Hospitality",
  "Construction", "Telecommunications", "Pharmaceuticals", "Agriculture"
];

// Sample job roles (used as fallback)
const mockJobRoles = [
  "Software Engineer", "Product Manager", "Data Scientist", "UX Designer",
  "Project Manager", "Marketing Manager", "Sales Representative", "Customer Success Manager",
  "Business Analyst", "Financial Analyst", "HR Manager", "Operations Manager",
  "Content Writer", "Graphic Designer", "Account Executive", "DevOps Engineer"
];

// Sample company sizes (used as fallback)
const mockCompanySizes = [
  "1-10 employees", "11-50 employees", "51-200 employees",
  "201-500 employees", "501-1,000 employees", "1,001-5,000 employees",
  "5,001-10,000 employees", "10,001+ employees"
];

// Sample platforms filters (used as fallback)
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

/**
 * Checks if the API key for a specific platform is configured
 * @param platformId The ID of the platform to check (linkedin, glassdoor, indeed)
 * @returns boolean indicating if the API key is configured
 */
const isApiKeyConfigured = (platformId: string): boolean => {
  return API_KEYS[platformId as keyof typeof API_KEYS]?.length > 0;
};

/**
 * Fetch job sources from LinkedIn and Glassdoor APIs
 * Falls back to mock data if API keys are not configured
 */
export const getAvailableJobSources = async (): Promise<JobSource[]> => {
  // Check if any API keys are configured
  const hasAnyApiKey = Object.values(API_KEYS).some(key => key.length > 0);
  
  if (!hasAnyApiKey) {
    console.log("No API keys configured, using mock job sources");
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockJobSources;
  }
  
  // In a real implementation, we would fetch from each API if the key is available
  const sources = [...mockJobSources];
  
  // Update connection status based on API key availability
  sources.forEach(source => {
    source.isConnected = isApiKeyConfigured(source.id);
  });
  
  return sources;
};

/**
 * Fetch filter options from job platforms APIs
 * Falls back to mock data if API keys are not configured
 */
export const getJobPlatformFilters = async (): Promise<JobPlatformFilters> => {
  // Check if any API keys are configured
  const hasAnyApiKey = Object.values(API_KEYS).some(key => key.length > 0);
  
  if (!hasAnyApiKey) {
    console.log("No API keys configured, using mock platform filters");
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockPlatformFilters;
  }
  
  // In a real implementation, this would call LinkedIn/Glassdoor APIs
  try {
    // Example of how to fetch from LinkedIn API (pseudocode)
    if (isApiKeyConfigured('linkedin')) {
      // This would be replaced with actual API call
      console.log("Would fetch roles and industries from LinkedIn API");
      // const linkedinData = await fetchFromLinkedIn();
    }
    
    // Example of how to fetch from Glassdoor API (pseudocode)
    if (isApiKeyConfigured('glassdoor')) {
      // This would be replaced with actual API call
      console.log("Would fetch company sizes and ratings from Glassdoor API");
      // const glassdoorData = await fetchFromGlassdoor();
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For now, return mock data but in a real implementation,
    // we would combine data from different sources
    return mockPlatformFilters;
  } catch (error) {
    console.error("Error fetching platform filters:", error);
    return mockPlatformFilters;
  }
};

/**
 * Connect to a job platform using OAuth
 * @param platformId ID of the platform to connect to
 */
export const connectToJobPlatform = async (platformId: string): Promise<boolean> => {
  console.log(`Connecting to platform: ${platformId}`);
  
  // Check if API key is already configured
  if (isApiKeyConfigured(platformId)) {
    console.log(`API key for ${platformId} is already configured`);
    return true;
  }
  
  // In a real implementation, this would:
  // 1. Redirect to OAuth authorization page
  // 2. Handle the callback and token exchange
  // 3. Store the access token securely
  
  // For demonstration, we'll simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // This would be where we'd store the API key/token
  // For now, we'll just log that it would happen
  console.log(`Would store token for ${platformId} after OAuth flow`);
  
  return true;
};

/**
 * Import preferences from a connected platform
 * @param platformId ID of the platform to import from
 */
export const importPreferencesFromPlatform = async (platformId: string): Promise<any> => {
  console.log(`Importing preferences from: ${platformId}`);
  
  // Check if platform is connected (has API key)
  if (!isApiKeyConfigured(platformId)) {
    throw new Error(`Cannot import from ${platformId}: Not connected`);
  }
  
  // In a real implementation, this would call the platform's API
  try {
    // Example API call (pseudocode)
    // const preferences = await fetchPreferencesFromApi(platformId, API_KEYS[platformId]);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock data based on platform
    return {
      jobTitle: platformId === "linkedin" ? "Product Designer" : "UX Designer",
      skills: ["Design Systems", "Figma", "User Research", "Prototyping"],
      industries: ["Technology", "Design"]
    };
  } catch (error) {
    console.error(`Error importing preferences from ${platformId}:`, error);
    throw error;
  }
};

/**
 * Set API key for a specific platform
 * @param platformId ID of the platform to set the key for
 * @param apiKey The API key to set
 */
export const setApiKey = (platformId: string, apiKey: string): boolean => {
  if (!platformId || !apiKey) {
    console.error("Platform ID and API key are required");
    return false;
  }
  
  // In a real app, we would store this securely
  // For demo purposes, we'll just update our in-memory object
  if (platformId in API_KEYS) {
    // @ts-ignore - this is a valid operation but TypeScript doesn't recognize it
    API_KEYS[platformId] = apiKey;
    console.log(`API key set for ${platformId}`);
    return true;
  }
  
  console.error(`Unknown platform: ${platformId}`);
  return false;
};

export default {
  getAvailableJobSources,
  getJobPlatformFilters,
  connectToJobPlatform,
  importPreferencesFromPlatform,
  setApiKey,
  isApiKeyConfigured
};
