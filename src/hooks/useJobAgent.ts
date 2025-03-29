
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';
import { Job } from '@/services/jobService';

interface UseJobAgentReturn {
  isActive: boolean;
  isLoading: boolean;
  config: any;
  toggleJobAgent: () => Promise<void>;
  applyToJob: (job: Job) => Promise<boolean>;
  getSkillsMatchPercentage: (job: Job) => Promise<number>;
  shouldAutoApply: (job: Job) => Promise<boolean>;
  updateConfig: (newConfig: any) => Promise<void>;
}

export const useJobAgent = (): UseJobAgentReturn => {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAgentConfig();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchAgentConfig = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('job_agent_configs')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching job agent config:', error);
        throw error;
      }

      if (data) {
        setConfig(data);
        setIsActive(data.is_active);
      } else {
        setConfig(null);
        setIsActive(false);
      }
    } catch (error) {
      console.error('Error in fetchAgentConfig:', error);
      toast({
        title: 'Error',
        description: 'Failed to load job agent configuration',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleJobAgent = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to use the job agent',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('toggle_job_agent');

      if (error) throw error;

      // Handle the JSON data properly by casting it to the expected type
      const result = data as {
        is_active: boolean;
        message: string;
      };

      setIsActive(result.is_active);
      setConfig(prev => ({ ...prev, is_active: result.is_active }));

      toast({
        title: result.is_active ? 'Job Agent Activated' : 'Job Agent Deactivated',
        description: result.message
      });
    } catch (error) {
      console.error('Error toggling job agent:', error);
      toast({
        title: 'Error',
        description: 'Failed to toggle job agent',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyToJob = async (job: Job): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to apply to jobs',
        variant: 'destructive'
      });
      return false;
    }

    try {
      // First, record the application in our database
      const { data: applicationData, error: applicationError } = await supabase
        .from('job_applications')
        .insert({
          user_id: user.id,
          job_id: job.id,
          job_title: job.title,
          company: job.company,
          job_url: job.url || job.applicationUrl,
          status: 'applied',
          auto_applied: isActive
        })
        .select()
        .single();

      if (applicationError) throw applicationError;

      // If agent is active, try auto-apply via the edge function
      if (isActive) {
        const { data: autoApplyData, error: autoApplyError } = await supabase.functions
          .invoke('job-auto-apply', {
            body: {
              action: 'apply',
              jobDetails: job,
              userId: user.id
            }
          });

        if (autoApplyError) {
          console.warn('Auto-apply failed, but application was recorded:', autoApplyError);
          toast({
            title: 'Application Recorded',
            description: `Your application to ${job.title} at ${job.company} was saved, but automatic submission failed.`
          });
          return true;
        }

        toast({
          title: 'Application Submitted',
          description: `Successfully applied to ${job.title} at ${job.company}`
        });
        return autoApplyData.success;
      } else {
        // If agent not active, just record the application
        toast({
          title: 'Application Saved',
          description: `Your interest in ${job.title} at ${job.company} was recorded`
        });
        return true;
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      toast({
        title: 'Application Failed',
        description: 'There was an error submitting your application',
        variant: 'destructive'
      });
      return false;
    }
  };

  const getSkillsMatchPercentage = async (job: Job): Promise<number> => {
    if (!user) return 0;

    try {
      // Get user's latest resume
      const { data: userResumes } = await supabase
        .from('resumes')
        .select('skills')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      const userResume = userResumes && userResumes.length > 0 ? userResumes[0] : null;
      if (!userResume || !userResume.skills) return 0;

      // Ensure skills is treated as an array by casting it
      const skills = Array.isArray(userResume.skills) ? userResume.skills : [];
      
      // Extract skills from job requirements
      const jobSkills = job.requirements.map(req => req.toLowerCase());
      const userSkills = skills.map((skill: any) => skill.name.toLowerCase());

      // Calculate match percentage
      const matchingSkills = userSkills.filter(skill => 
        jobSkills.some(jobSkill => jobSkill.includes(skill))
      );

      return Math.round((matchingSkills.length / Math.max(jobSkills.length, 1)) * 100);
    } catch (error) {
      console.error('Error calculating skills match:', error);
      return 0;
    }
  };

  const shouldAutoApply = async (job: Job): Promise<boolean> => {
    if (!isActive || !user) return false;

    try {
      // Get agent configuration
      const { data: agentConfig } = await supabase
        .from('job_agent_configs')
        .select('auto_apply_preferences')
        .eq('user_id', user.id)
        .single();

      if (!agentConfig || !agentConfig.auto_apply_preferences) return false;

      // Cast the preferences to the expected type to avoid type errors
      const preferences = agentConfig.auto_apply_preferences as {
        skills_match_threshold?: number;
        location_preference?: string;
        apply_on_swipe_right?: boolean;
        max_daily_applications?: number;
      };
      
      // Check skills match threshold
      const skillsMatch = await getSkillsMatchPercentage(job);
      const skillsMatchThreshold = preferences.skills_match_threshold || 60;
      
      // Check job location preference
      const locationPreference = preferences.location_preference || 'any';
      const locationMatch = locationPreference === 'any' || 
                           (locationPreference === 'remote' && job.location.toLowerCase().includes('remote')) ||
                           job.location.toLowerCase().includes(locationPreference.toLowerCase());
      
      // Check if should auto-apply on swipe right
      const applyOnSwipeRight = preferences.apply_on_swipe_right !== false;
      
      // Check if daily limit is reached
      const { count } = await supabase
        .from('job_applications')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('auto_applied', true)
        .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());
      
      const dailyLimit = preferences.max_daily_applications || 10;
      const withinDailyLimit = count < dailyLimit;
      
      return skillsMatch >= skillsMatchThreshold && 
             locationMatch && 
             applyOnSwipeRight && 
             withinDailyLimit;
    } catch (error) {
      console.error('Error determining auto-apply:', error);
      return false;
    }
  };

  const updateConfig = async (newConfig: any): Promise<void> => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to update job agent configuration',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('job_agent_configs')
        .upsert({
          user_id: user.id,
          ...newConfig
        });

      if (error) throw error;

      setConfig(prev => ({ ...prev, ...newConfig }));
      setIsActive(newConfig.is_active);

      toast({
        title: 'Configuration Updated',
        description: 'Job agent configuration updated successfully'
      });
    } catch (error) {
      console.error('Error updating job agent config:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update job agent configuration',
        variant: 'destructive'
      });
    }
  };

  return {
    isActive,
    isLoading,
    config,
    toggleJobAgent,
    applyToJob,
    getSkillsMatchPercentage,
    shouldAutoApply,
    updateConfig
  };
};
