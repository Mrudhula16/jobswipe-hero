
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

// Mock user data for development
const mockUsers = [
  {
    id: "1",
    email: "test@example.com",
    password: "password123", // In a real app, this would be hashed
    name: "Test User",
    avatar: "",
    role: "user",
    savedJobs: ["1", "3"],
    appliedJobs: ["2"]
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get user from local storage
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem("jobhub_user");
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch (error) {
      console.error("Error parsing user from local storage:", error);
      return null;
    }
  }
  return null;
};

// Sign in user
export const signIn = async (email: string, password: string): Promise<User> => {
  // Simulate API call
  await delay(1000);
  
  // In a real app, this would be an API call to verify credentials
  const user = mockUsers.find(u => u.email === email);
  
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password");
  }
  
  const { password: _, ...userWithoutPassword } = user;
  
  // Save user to local storage
  localStorage.setItem("jobhub_user", JSON.stringify(userWithoutPassword));
  
  return userWithoutPassword as User;
};

// Register user
export const register = async (name: string, email: string, password: string): Promise<User> => {
  // Simulate API call
  await delay(1500);
  
  // Check if user already exists
  if (mockUsers.some(u => u.email === email)) {
    throw new Error("User with this email already exists");
  }
  
  // In a real app, this would be an API call to create user in database
  const newUser = {
    id: Date.now().toString(),
    email,
    name,
    role: "user" as const,
    savedJobs: [],
    appliedJobs: []
  };
  
  // Save user to local storage
  localStorage.setItem("jobhub_user", JSON.stringify(newUser));
  
  return newUser;
};

// Sign out user
export const signOut = async (): Promise<void> => {
  // Simulate API call
  await delay(500);
  
  // Clear user from local storage
  localStorage.removeItem("jobhub_user");
};

// Save job to user's saved jobs
export const saveJob = async (jobId: string): Promise<void> => {
  const user = getCurrentUser();
  if (!user) {
    toast({
      title: "Authentication required",
      description: "Please sign in to save jobs",
      variant: "destructive"
    });
    throw new Error("User not authenticated");
  }
  
  // Simulate API call
  await delay(700);
  
  // Add job to user's saved jobs if not already saved
  if (!user.savedJobs.includes(jobId)) {
    user.savedJobs.push(jobId);
    localStorage.setItem("jobhub_user", JSON.stringify(user));
  }
};

// Apply to job
export const applyToJob = async (jobId: string): Promise<void> => {
  const user = getCurrentUser();
  if (!user) {
    toast({
      title: "Authentication required",
      description: "Please sign in to apply for jobs",
      variant: "destructive"
    });
    throw new Error("User not authenticated");
  }
  
  // Simulate API call
  await delay(1200);
  
  // Add job to user's applied jobs if not already applied
  if (!user.appliedJobs.includes(jobId)) {
    user.appliedJobs.push(jobId);
    localStorage.setItem("jobhub_user", JSON.stringify(user));
  }
};

export default {
  getCurrentUser,
  signIn,
  register,
  signOut,
  saveJob,
  applyToJob
};
