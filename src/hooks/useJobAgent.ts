import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

interface JobApplication {
  id?: string;
  job_title: string;
  company: string;
  job_url?: string;
  status: 'pending' | 'applied' | 'failed';
  auto_applied?: boolean;
  notes?: string;
  created_at?: string;
}

interface JobAgentConfig {
  id?: string;
  is_active: boolean;
  ml_parameters?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

interface UseJobAgentReturn {
  isActive: boolean;
  isLoading: boolean;
  error: Error | null;
  applications: JobApplication[];
  toggleJobAgent: () => Promise<void>;
  setMLParameters: (params: Record<string, any>) => Promise<void>;
  applyToJob: (jobDetails: any) => Promise<boolean>;
}

export const useJobAgent = (): UseJobAgentReturn => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchStatus = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('job-agent', {
        body: { action: 'status' }
      });

      if (error) throw error;
      setIsActive(data?.is_active || false);
      
      const { data: appData, error: appError } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (appError) throw appError;
      
      const transformedApplications: JobApplication[] = appData?.map(app => ({
        id: app.id,
        job_title: app.job_title,
        company: app.company,
        job_url: app.job_url,
        status: app.status as 'pending' | 'applied' | 'failed',
        auto_applied: app.auto_applied,
        notes: app.notes,
        created_at: app.created_at
      })) || [];
      
      setApplications(transformedApplications);
      
    } catch (err) {
      console.error('Error fetching job agent status:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Error",
        description: "Failed to fetch job agent status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleJobAgent = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use the Job Agent feature.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('job-agent', {
        body: { 
          action: 'toggle',
          parameters: {
            is_active: !isActive
          }
        }
      });

      if (error) throw error;
      
      setIsActive(data?.is_active || false);
      toast({
        title: data?.is_active ? "Job Agent Activated" : "Job Agent Deactivated",
        description: data?.message || "Status updated successfully.",
      });
    } catch (err) {
      console.error('Error toggling job agent:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Error",
        description: "Failed to update job agent status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setMLParameters = async (params: Record<string, any>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to configure ML parameters.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('job-agent', {
        body: { 
          action: 'ml_integration',
          parameters: {
            model_type: params.model_type || 'default',
            endpoint_url: params.endpoint_url,
            params: params
          }
        }
      });

      if (error) throw error;
      
      toast({
        title: "ML Configuration Saved",
        description: "Your ML model configuration has been updated successfully.",
      });
      
      return data;
    } catch (err) {
      console.error('Error updating ML parameters:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Error",
        description: "Failed to update ML configuration. Please try again.",
        variant: "destructive"
      });
    }
  };

  const applyToJob = async (jobDetails: any): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to apply for jobs.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!isActive) {
      try {
        const { error } = await supabase
          .from('job_applications')
          .insert({
            user_id: user.id,
            job_title: jobDetails.title,
            company: jobDetails.company,
            job_url: jobDetails.applicationUrl || jobDetails.url,
            status: 'pending',
            auto_applied: false
          });
          
        if (error) throw error;
        
        toast({
          title: "Job Saved",
          description: `${jobDetails.title} at ${jobDetails.company} has been saved to your applications.`,
        });
        
        fetchStatus();
        return true;
      } catch (err) {
        console.error('Error saving job application:', err);
        toast({
          title: "Error",
          description: "Failed to save job application.",
          variant: "destructive"
        });
        return false;
      }
    }
    
    try {
      setIsLoading(true);
      toast({
        title: "Auto-Applying",
        description: `Attempting to apply for ${jobDetails.title} at ${jobDetails.company}...`,
      });
      
      const { data, error } = await supabase.functions.invoke('job-auto-apply', {
        body: { 
          jobDetails,
          userId: user.id
        }
      });
      
      if (error) throw error;
      
      if (data.success) {
        toast({
          title: "Application Successful",
          description: data.message,
        });
      } else {
        toast({
          title: "Application Failed",
          description: data.message,
          variant: "destructive"
        });
      }
      
      fetchStatus();
      return data.success;
    } catch (err) {
      console.error('Error during auto-application:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Auto-Application Error",
        description: "Failed to apply to job. Please try manually.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [user]);

  return {
    isActive,
    isLoading,
    error,
    applications,
    toggleJobAgent,
    setMLParameters,
    applyToJob
  };
};
