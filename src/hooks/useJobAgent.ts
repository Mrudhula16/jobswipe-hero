
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

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
  toggleJobAgent: () => Promise<void>;
  setMLParameters: (params: Record<string, any>) => Promise<void>;
}

export const useJobAgent = (): UseJobAgentReturn => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
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

  useEffect(() => {
    fetchStatus();
  }, [user]);

  return {
    isActive,
    isLoading,
    error,
    toggleJobAgent,
    setMLParameters
  };
};
