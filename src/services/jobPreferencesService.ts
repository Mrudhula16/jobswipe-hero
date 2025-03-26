
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface JobPreferences {
  id?: string;
  user_id?: string;
  job_title?: string;
  employment_types?: string[];
  location_preferences?: string[];
  min_salary?: number;
  max_salary?: number;
  industries?: string[];
  created_at?: string;
  updated_at?: string;
}

export const getUserJobPreferences = async (): Promise<JobPreferences | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return null;
    }

    const { data, error } = await supabase
      .from('job_preferences')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // No rows returned is not a real error
        console.error("Error fetching job preferences:", error);
        toast({
          title: "Error fetching preferences",
          description: "There was an issue retrieving your job preferences",
          variant: "destructive"
        });
      }
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getUserJobPreferences:", error);
    return null;
  }
};

export const saveJobPreferences = async (preferences: JobPreferences): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save job preferences",
        variant: "destructive"
      });
      return false;
    }

    // Get existing preferences first
    const existingPrefs = await getUserJobPreferences();

    if (existingPrefs) {
      // Update existing preferences
      const { error } = await supabase
        .from('job_preferences')
        .update({
          job_title: preferences.job_title,
          employment_types: preferences.employment_types || [],
          location_preferences: preferences.location_preferences || [],
          min_salary: preferences.min_salary,
          max_salary: preferences.max_salary,
          industries: preferences.industries || []
        })
        .eq('user_id', session.user.id);

      if (error) {
        console.error("Error updating job preferences:", error);
        toast({
          title: "Error saving preferences",
          description: "There was an issue updating your job preferences",
          variant: "destructive"
        });
        return false;
      }
    } else {
      // Insert new preferences
      const { error } = await supabase
        .from('job_preferences')
        .insert({
          user_id: session.user.id,
          job_title: preferences.job_title,
          employment_types: preferences.employment_types || [],
          location_preferences: preferences.location_preferences || [],
          min_salary: preferences.min_salary,
          max_salary: preferences.max_salary,
          industries: preferences.industries || []
        });

      if (error) {
        console.error("Error inserting job preferences:", error);
        toast({
          title: "Error saving preferences",
          description: "There was an issue saving your job preferences",
          variant: "destructive"
        });
        return false;
      }
    }

    toast({
      title: "Preferences saved",
      description: "Your job preferences have been updated successfully"
    });
    return true;
  } catch (error) {
    console.error("Error in saveJobPreferences:", error);
    toast({
      title: "Error saving preferences",
      description: "An unexpected error occurred"
    });
    return false;
  }
};
