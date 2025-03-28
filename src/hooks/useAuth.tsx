
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

// Simple toast implementation to avoid circular dependencies
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  console.log(`Toast (${type}):`, message);
  // We'll use this simple implementation temporarily
  // and let the Toaster component handle the actual UI
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  loginWithEmail: (email: string) => Promise<void>;
  verifyOTP: (email: string, token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
        
        if (event === 'SIGNED_IN') {
          navigate('/');
        } else if (event === 'SIGNED_OUT') {
          navigate('/auth');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      showToast("Signed out successfully");
    } catch (error) {
      console.error("Sign out error:", error);
      showToast("Error signing out", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        throw error;
      }

      showToast("Verification email sent");

    } catch (error: any) {
      console.error("Login error:", error);
      showToast(error.message || "An error occurred during login.", "error");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (email: string, token: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (error) {
        throw error;
      }

      showToast("Verification successful");
      
      navigate('/');

    } catch (error: any) {
      console.error("OTP verification error:", error);
      showToast(error.message || "An error occurred during verification.", "error");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    signOut,
    loginWithEmail,
    verifyOTP
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
