
import React, { createContext, useContext, useState } from "react";

// Simplified user type
interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: {
    id: "demo-user",
    email: "demo@jobswipe.com"
  },
  isAuthenticated: true,
  signOut: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user] = useState<User>({
    id: "demo-user",
    email: "demo@jobswipe.com"
  });

  const signOut = () => {
    // Implement sign out logic if needed in the future
  };

  const value = {
    user,
    isAuthenticated: true,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
