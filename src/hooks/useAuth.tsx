
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, getCurrentUser, signIn, register, signOut } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
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
    // Check if user is already logged in
    const checkLoggedIn = async () => {
      try {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const loggedInUser = await signIn(email, password);
      setUser(loggedInUser);
      toast({
        title: "Sign in successful",
        description: `Welcome back, ${loggedInUser.name}!`
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Authentication failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const newUser = await register(name, email, password);
      setUser(newUser);
      toast({
        title: "Account created successfully",
        description: `Welcome to JobHub, ${newUser.name}!`
      });
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Registration failed",
        description: "Could not create your account. Please try again.",
        variant: "destructive"
      });
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
      toast({
        title: "Signed out successfully",
      });
      navigate("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error signing out",
        variant: "destructive"
      });
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
      // In a real app, this would call an API
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
      
      toast({
        title: "Job saved successfully",
        description: "You can view it in your saved jobs list."
      });
    } catch (error) {
      console.error("Error saving job:", error);
      toast({
        title: "Error saving job",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const applyToJob = async (jobId: string) => {
    if (!user) {
      navigate("/sign-in");
      return;
    }
    
    try {
      // In a real app, this would call an API
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
      
      toast({
        title: "Application submitted",
        description: "Your application has been sent to the employer."
      });
    } catch (error) {
      console.error("Error applying to job:", error);
      toast({
        title: "Error applying to job",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
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
