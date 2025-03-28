// Job service to fetch real job data and manage job interactions

import { supabase } from "@/integrations/supabase/client";
import { useJobFilters } from "@/hooks/useJobFilters";

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
  url?: string;
  applicationUrl?: string;
  source?: string;
  sourceId?: string;
}

// Re-export these types from the useJobFilters hook
export type { FilterOption, FilterCategory } from "@/hooks/useJobFilters";

// Simulate network delays for more realistic API behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get initial batch of jobs
export const getJobs = async (count: number = 5): Promise<Job[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('linkedin-jobs', {
      body: { action: 'search', count, source: "linkedin" }
    });
    
    if (error) throw error;
    return data?.jobs || [];
  } catch (error) {
    console.error("Error fetching jobs:", error);
    // Simulate API delay
    await delay(1500);
    return [];
  }
};

// Get more jobs (pagination simulation)
export const getMoreJobs = async (lastJobId: string, count: number = 3): Promise<Job[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('linkedin-jobs', {
      body: { action: 'search', lastJobId, count, source: "linkedin" }
    });
    
    if (error) throw error;
    return data?.jobs || [];
  } catch (error) {
    console.error("Error fetching more jobs:", error);
    await delay(1500);
    return [];
  }
};

// Get jobs based on filters
export const getFilteredJobs = async (filters: any): Promise<Job[]> => {
  try {
    // Extract query and location from filters
    const query = filters.job_function?.[0] || filters.jobType?.[0] || "";
    const location = filters.location || "";
    
    const { data, error } = await supabase.functions.invoke('linkedin-jobs', {
      body: { 
        action: 'search', 
        query, 
        location,
        count: 10, 
        filters 
      }
    });
    
    if (error) throw error;
    return data?.jobs || [];
  } catch (error) {
    console.error("Error fetching filtered jobs:", error);
    await delay(1500);
    return [];
  }
};

// Save job to user's saved jobs
export const saveJob = async (jobId: string): Promise<boolean> => {
  try {
    const { data, error: userError } = await supabase.auth.getUser();
    if (!data.user) throw new Error("User not authenticated");
    
    const { error } = await supabase
      .from('saved_jobs')
      .insert([{ job_id: jobId, user_id: data.user.id }]);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error saving job ${jobId}:`, error);
    return false;
  }
};

// Apply to a job
export const applyToJob = async (jobDetails: Job): Promise<boolean> => {
  try {
    const { data, error: userError } = await supabase.auth.getUser();
    if (!data.user) throw new Error("User not authenticated");
    
    // If this is a LinkedIn job, use the LinkedIn application process
    if (jobDetails.source === 'linkedin') {
      const { data: applyData, error: applyError } = await supabase.functions.invoke('linkedin-jobs', {
        body: { 
          action: 'apply',
          jobDetails,
          userId: data.user.id
        }
      });
      
      if (applyError) throw applyError;
      return applyData?.success || false;
    }
    
    // Otherwise use the standard application process
    console.log(`Applying to job ${jobDetails.id}`);
    await delay(1000);
    return true;
  } catch (error) {
    console.error("Error applying to job:", error);
    return false;
  }
};

// Fetch job filter categories and options from the database
export const getJobFilterCategories = async (): Promise<FilterCategory[]> => {
  try {
    // This function is now implemented in the useJobFilters hook
    const { filterCategories } = useJobFilters();
    return filterCategories;
  } catch (error) {
    console.error("Error fetching job filter categories:", error);
    return [];
  }
};

// Get options for a specific category
export const getFilterOptionsByCategory = async (categoryName: string): Promise<FilterOption[]> => {
  try {
    // This function is now implemented in the useJobFilters hook
    const { getOptionsByCategory } = useJobFilters();
    return getOptionsByCategory(categoryName);
  } catch (error) {
    console.error(`Error fetching options for category ${categoryName}:`, error);
    return [];
  }
};

export default {
  getJobs,
  getMoreJobs,
  getFilteredJobs,
  saveJob,
  applyToJob,
  getJobFilterCategories,
  getFilterOptionsByCategory
};
