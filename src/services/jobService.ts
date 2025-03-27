
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
  source?: string;
  sourceId?: string;
}

// Filter option types
export interface FilterOption {
  id: string;
  value: string;
  label: string;
  description?: string;
}

export interface FilterCategory {
  id: string;
  name: string;
  description?: string;
  options: FilterOption[];
}

import { supabase } from "@/integrations/supabase/client";

// Simulate network delays for more realistic API behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get initial batch of jobs
export const getJobs = async (count: number = 5): Promise<Job[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('job-search', {
      body: { filters: {}, count, source: "linkedin" }
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
      body: { lastJobId, count, source: "linkedin" }
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
      body: { filters, source: "linkedin" }
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
export const applyToJob = async (jobId: string): Promise<boolean> => {
  try {
    const { data, error: userError } = await supabase.auth.getUser();
    if (!data.user) throw new Error("User not authenticated");
    
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

// Fetch job filter categories and options from the database
export const getJobFilterCategories = async (): Promise<FilterCategory[]> => {
  try {
    // First, fetch all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('job_filter_categories')
      .select('*')
      .order('name');
    
    if (categoriesError) throw categoriesError;
    
    // Next, fetch all options
    const { data: options, error: optionsError } = await supabase
      .from('job_filter_options')
      .select('*')
      .order('label');
    
    if (optionsError) throw optionsError;
    
    // Organize options by category
    const categoryMap: Record<string, FilterCategory> = {};
    
    if (categories) {
      categories.forEach(category => {
        categoryMap[category.id] = {
          ...category,
          options: []
        };
      });
    }
    
    if (options) {
      options.forEach(option => {
        if (categoryMap[option.category_id]) {
          categoryMap[option.category_id].options.push({
            id: option.id,
            value: option.value,
            label: option.label,
            description: option.description
          });
        }
      });
    }
    
    return Object.values(categoryMap);
  } catch (error) {
    console.error("Error fetching job filter categories:", error);
    return [];
  }
};

// Get options for a specific category
export const getFilterOptionsByCategory = async (categoryName: string): Promise<FilterOption[]> => {
  try {
    const { data: category, error: categoryError } = await supabase
      .from('job_filter_categories')
      .select('id')
      .eq('name', categoryName)
      .single();
    
    if (categoryError) throw categoryError;
    
    const { data: options, error: optionsError } = await supabase
      .from('job_filter_options')
      .select('*')
      .eq('category_id', category.id)
      .order('label');
    
    if (optionsError) throw optionsError;
    
    return options.map(option => ({
      id: option.id,
      value: option.value,
      label: option.label,
      description: option.description
    }));
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
