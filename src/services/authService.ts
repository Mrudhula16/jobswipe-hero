
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "user" | "admin";
  savedJobs: string[];
  appliedJobs: string[];
}

// Auth state interface
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Get user from Supabase session
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return null;
  }
  
  // Get additional user data from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  
  if (profile) {
    // Get saved jobs
    const { data: savedJobs } = await supabase
      .from('saved_jobs')
      .select('job_id')
      .eq('user_id', session.user.id);
    
    // Get applied jobs
    const { data: appliedJobs } = await supabase
      .from('job_applications')
      .select('job_id')
      .eq('user_id', session.user.id);
    
    return {
      id: session.user.id,
      email: session.user.email || '',
      name: profile.name || session.user.email?.split('@')[0] || '',
      avatar: profile.avatar_url,
      role: "user", // Default role, can be updated based on user_roles table
      savedJobs: savedJobs?.map(job => job.job_id) || [],
      appliedJobs: appliedJobs?.map(job => job.job_id) || []
    };
  }
  
  return null;
};

// Sign in with email OTP
export const signInWithEmailOTP = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin + '/job-swipe'
    }
  });
  
  if (error) {
    toast({
      title: "Authentication failed",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
  
  toast({
    title: "Verification email sent",
    description: "Please check your email for the login link"
  });
};

// Verify OTP
export const verifyOTP = async (email: string, token: string): Promise<User> => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email'
  });
  
  if (error) {
    toast({
      title: "Verification failed",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
  
  if (!data.user) {
    throw new Error("User data not found");
  }
  
  toast({
    title: "Verification successful",
    description: "You are now signed in"
  });
  
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User data not found");
  }
  
  return user;
};

// Sign out user
export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    toast({
      title: "Error signing out",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
  
  toast({
    title: "Signed out successfully",
  });
};

// Save job to user's saved jobs
export const saveJob = async (jobId: string): Promise<void> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    toast({
      title: "Authentication required",
      description: "Please sign in to save jobs",
      variant: "destructive"
    });
    throw new Error("User not authenticated");
  }
  
  const { error } = await supabase
    .from('saved_jobs')
    .insert({
      user_id: session.user.id,
      job_id: jobId
    });
  
  if (error) {
    // If it's a unique violation, the job is already saved
    if (error.code === '23505') {
      toast({
        title: "Job already saved",
        description: "This job is already in your saved jobs"
      });
      return;
    }
    
    toast({
      title: "Error saving job",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
  
  toast({
    title: "Job saved successfully",
    description: "You can view it in your saved jobs list"
  });
};

// Apply to job
export const applyToJob = async (jobId: string): Promise<void> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    toast({
      title: "Authentication required",
      description: "Please sign in to apply for jobs",
      variant: "destructive"
    });
    throw new Error("User not authenticated");
  }
  
  const { error } = await supabase
    .from('job_applications')
    .insert({
      user_id: session.user.id,
      job_id: jobId,
      status: 'applied'
    });
  
  if (error) {
    // If it's a unique violation, the job application already exists
    if (error.code === '23505') {
      toast({
        title: "Already applied",
        description: "You have already applied to this job"
      });
      return;
    }
    
    toast({
      title: "Error applying to job",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
  
  toast({
    title: "Application submitted",
    description: "Your application has been sent to the employer"
  });
};

export default {
  getCurrentUser,
  signInWithEmailOTP,
  verifyOTP,
  signOut,
  saveJob,
  applyToJob
};
