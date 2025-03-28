
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

export interface AutoApplyPreferences {
  apply_on_swipe_right: boolean;
  skills_match_threshold: number;
  location_preference: string;
  max_daily_applications: number;
}

export interface JobAgentConfig {
  id?: string;
  is_active: boolean;
  ml_parameters?: Record<string, any>;
  resume_id?: string;
  auto_apply_preferences?: AutoApplyPreferences;
  created_at?: string;
  updated_at?: string;
}

interface UseJobAgentReturn {
  isActive: boolean;
  isLoading: boolean;
  error: Error | null;
  applications: JobApplication[];
  agentConfig: JobAgentConfig | null;
  toggleJobAgent: () => Promise<void>;
  setMLParameters: (params: Record<string, any>) => Promise<void>;
  applyToJob: (jobDetails: any) => Promise<boolean>;
  getSkillsMatchPercentage: (jobDetails: any) => Promise<number>;
  shouldAutoApply: (jobDetails: any) => Promise<boolean>;
}

export const useJobAgent = (): UseJobAgentReturn => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [agentConfig, setAgentConfig] = useState<JobAgentConfig | null>(null);
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
      
      const { data: configData, error: configError } = await supabase
        .from('job_agent_configs')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (configError && configError.code !== 'PGRST116') throw configError;
      
      if (configData) {
        // Convert raw JSON data to proper typed objects
        let autoApplyPreferences: AutoApplyPreferences;
        
        if (typeof configData.auto_apply_preferences === 'object') {
          const prefs = configData.auto_apply_preferences as Record<string, any>;
          autoApplyPreferences = {
            apply_on_swipe_right: Boolean(prefs.apply_on_swipe_right ?? true),
            skills_match_threshold: Number(prefs.skills_match_threshold ?? 60),
            location_preference: String(prefs.location_preference ?? "remote"),
            max_daily_applications: Number(prefs.max_daily_applications ?? 10)
          };
        } else {
          autoApplyPreferences = {
            apply_on_swipe_right: true,
            skills_match_threshold: 60,
            location_preference: "remote",
            max_daily_applications: 10
          };
        }
        
        const mlParameters = typeof configData.ml_parameters === 'object' ? 
          configData.ml_parameters as Record<string, any> : {};
        
        const typedConfig: JobAgentConfig = {
          id: configData.id,
          is_active: configData.is_active,
          ml_parameters: mlParameters,
          resume_id: configData.resume_id,
          auto_apply_preferences: autoApplyPreferences,
          created_at: configData.created_at,
          updated_at: configData.updated_at
        };
        
        setAgentConfig(typedConfig);
      }
      
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
      
      fetchStatus();
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
      
      setAgentConfig(prev => prev ? {...prev, ml_parameters: params} : null);
      
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

  const getSkillsMatchPercentage = async (jobDetails: any): Promise<number> => {
    if (!user || !agentConfig?.resume_id) return 0;
    
    try {
      const { data: resumeData, error: resumeError } = await supabase
        .from('resumes')
        .select('skills')
        .eq('id', agentConfig.resume_id)
        .single();
        
      if (resumeError) throw resumeError;
      
      if (!resumeData?.skills || !Array.isArray(resumeData.skills) || resumeData.skills.length === 0) {
        return 0;
      }
      
      const resumeSkills = resumeData.skills.map(skill => {
        if (typeof skill === 'string') return skill.toLowerCase();
        if (typeof skill === 'object' && skill !== null && 'name' in skill) {
          return (skill as {name: string}).name.toLowerCase();
        }
        return '';
      }).filter(Boolean);
      
      const jobSkills: string[] = [];
      
      if (jobDetails.requirements && Array.isArray(jobDetails.requirements)) {
        jobDetails.requirements.forEach((req: string) => {
          jobSkills.push(req.toLowerCase());
        });
      }
      
      if (jobDetails.description) {
        const techSkills = [
          'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node',
          'typescript', 'html', 'css', 'sql', 'nosql', 'aws', 'azure', 'gcp',
          'docker', 'kubernetes', 'devops', 'ci/cd', 'agile', 'scrum'
        ];
        
        const description = jobDetails.description.toLowerCase();
        techSkills.forEach(skill => {
          if (description.includes(skill) && !jobSkills.includes(skill)) {
            jobSkills.push(skill);
          }
        });
      }
      
      let matchCount = 0;
      resumeSkills.forEach(skill => {
        if (jobSkills.some(jobSkill => jobSkill.includes(skill) || skill.includes(jobSkill))) {
          matchCount++;
        }
      });
      
      const matchPercentage = Math.round((matchCount / Math.max(resumeSkills.length, 1)) * 100);
      return Math.min(matchPercentage, 100);
    } catch (error) {
      console.error('Error calculating skills match:', error);
      return 0;
    }
  };

  const shouldAutoApply = async (jobDetails: any): Promise<boolean> => {
    if (!isActive || !agentConfig || !agentConfig.auto_apply_preferences) return false;
    
    try {
      const preferences = agentConfig.auto_apply_preferences;
      
      if (!preferences.apply_on_swipe_right) return false;
      
      if (preferences.location_preference !== 'any') {
        const jobLocation = jobDetails.location?.toLowerCase() || '';
        
        if (preferences.location_preference === 'remote' && 
           !jobLocation.includes('remote') && !jobDetails.title?.toLowerCase().includes('remote')) {
          return false;
        }
        
        if (preferences.location_preference === 'hybrid' && 
           !jobLocation.includes('hybrid') && !jobLocation.includes('remote')) {
          return false;
        }
      }
      
      const matchPercentage = await getSkillsMatchPercentage(jobDetails);
      if (matchPercentage < preferences.skills_match_threshold) {
        return false;
      }
      
      const today = new Date().toISOString().split('T')[0];
      const { count, error } = await supabase
        .from('job_applications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .eq('auto_applied', true)
        .gte('created_at', `${today}T00:00:00Z`);
        
      if (error) throw error;
      
      if (count >= preferences.max_daily_applications) {
        console.log(`Daily application limit reached: ${count}/${preferences.max_daily_applications}`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking if job should be auto-applied to:', error);
      return false;
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
    
    const canAutoApply = await shouldAutoApply(jobDetails);
    const isAgentApplying = isActive && canAutoApply;
    
    try {
      const { data: appData, error: appError } = await supabase
        .from('job_applications')
        .insert({
          user_id: user.id,
          job_title: jobDetails.title,
          company: jobDetails.company,
          job_url: jobDetails.applicationUrl || jobDetails.url,
          status: isAgentApplying ? 'pending' : 'applied',
          auto_applied: isAgentApplying,
          notes: isAgentApplying ? 'Submitted by AI Job Agent' : 'Manually saved'
        })
        .select();
          
      if (appError) throw appError;
      
      if (!isAgentApplying) {
        toast({
          title: "Job Saved",
          description: `${jobDetails.title} at ${jobDetails.company} has been saved to your applications.`,
        });
        
        fetchStatus();
        return true;
      }
      
      setIsLoading(true);
      toast({
        title: "Auto-Applying",
        description: `Attempting to apply for ${jobDetails.title} at ${jobDetails.company}...`,
      });
      
      const { data, error } = await supabase.functions.invoke('job-auto-apply', {
        body: { 
          jobDetails,
          userId: user.id,
          applicationId: appData[0].id,
          resumeId: agentConfig?.resume_id
        }
      });
      
      if (error) throw error;
      
      await supabase
        .from('job_applications')
        .update({
          status: data.success ? 'applied' : 'failed',
          notes: data.message
        })
        .eq('id', appData[0].id);
      
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
      console.error('Error during application:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Application Error",
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
    agentConfig,
    toggleJobAgent,
    setMLParameters,
    applyToJob,
    getSkillsMatchPercentage,
    shouldAutoApply
  };
};
