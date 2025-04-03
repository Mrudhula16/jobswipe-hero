
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, getCurrentUser, signInWithEmailOTP, verifyOTP, signOut } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithEmail: (email: string) => Promise<void>;
  verifyOTP: (email: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
  saveJob: (jobId: string) => Promise<void>;
  applyToJob: (jobId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        if (session && session.user) {
          try {
            const userData = await getCurrentUser();
            setUser(userData);
          } catch (error) {
            console.error("Error getting user data:", error);
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loginWithEmail = async (email: string) => {
    try {
      setIsLoading(true);
      await signInWithEmailOTP(email);
    } catch (error) {
      console.error("Login error:", error);
      // Error is handled by the auth service
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyUserOTP = async (email: string, token: string) => {
    try {
      setIsLoading(true);
      const userData = await verifyOTP(email, token);
      setUser(userData);
      navigate("/job-swipe");
    } catch (error) {
      console.error("OTP verification error:", error);
      // Error is handled by the auth service
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      setUser(null);
      navigate("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
      // Error is handled by the auth service
    } finally {
      setIsLoading(false);
    }
  };

  const saveJob = async (jobId: string) => {
    if (!user) {
      navigate("/sign-in");
      return;
    }
    
    try {
      await import("@/services/authService").then(module => module.saveJob(jobId));
      
      // Update local user state
      setUser(prev => {
        if (!prev) return prev;
        if (prev.savedJobs.includes(jobId)) return prev;
        
        return {
          ...prev,
          savedJobs: [...prev.savedJobs, jobId]
        };
      });
    } catch (error) {
      console.error("Error saving job:", error);
      // Error is handled by the auth service
    }
  };

  const applyToJob = async (jobId: string) => {
    if (!user) {
      navigate("/sign-in");
      return;
    }
    
    try {
      await import("@/services/authService").then(module => module.applyToJob(jobId));
      
      // Update local user state
      setUser(prev => {
        if (!prev) return prev;
        if (prev.appliedJobs.includes(jobId)) return prev;
        
        return {
          ...prev,
          appliedJobs: [...prev.appliedJobs, jobId]
        };
      });
    } catch (error) {
      console.error("Error applying to job:", error);
      // Error is handled by the auth service
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loginWithEmail,
        verifyOTP: verifyUserOTP,
        logout,
        saveJob,
        applyToJob
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
