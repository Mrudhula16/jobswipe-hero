
// Job service to fetch real job data and manage job interactions

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
}

import { supabase } from "@/integrations/supabase/client";

// Simulate network delays for more realistic API behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get initial batch of jobs
export const getJobs = async (count: number = 5): Promise<Job[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('job-search', {
      body: { filters: {}, count }
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
    const { data, error } = await supabase.functions.invoke('job-search', {
      body: { lastJobId, count }
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
    const { data, error } = await supabase.functions.invoke('job-search', {
      body: { filters }
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
    const { user } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    const { error } = await supabase
      .from('saved_jobs')
      .insert([{ job_id: jobId, user_id: user.id }]);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error saving job ${jobId}:`, error);
    return false;
  }
};

// Apply to a job
export const applyToJob = async (jobId: string): Promise<boolean> => {
  try {
    const { user } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    // In a real implementation, this would make an API call to the backend
    console.log(`Applying to job ${jobId}`);
    
    // Simulate API call
    await delay(1000);
    return true;
  } catch (error) {
    console.error("Error applying to job:", error);
    return false;
  }
};

export default {
  getJobs,
  getMoreJobs,
  getFilteredJobs,
  saveJob,
  applyToJob
};
