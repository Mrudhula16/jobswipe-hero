import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, BriefcaseIcon, Zap, Settings, Target, Shield, BarChart2, Search, PenTool } from "lucide-react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import JobPreferencesForm from "@/components/JobPreferencesForm";
import JobSourceConnector from "@/components/JobSourceConnector";

const Index = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Search,
      title: "Smart Job Matching",
      description: "AI-powered job matching based on your skills and preferences",
      path: "/job-swipe"
    },
    {
      icon: Zap,
      title: "One-Click Apply",
      description: "Apply to multiple jobs with a single swipe right",
      path: "/job-swipe"
    },
    {
      icon: PenTool,
      title: "Resume Optimizer",
      description: "AI analysis and optimization for your resume and cover letters",
      path: "/profile"
    },
    {
      icon: BarChart2,
      title: "Application Tracking",
      description: "Track all your applications and interviews in one place",
      path: "/dashboard"
    },
    {
      icon: Target,
      title: "AI Agent",
      description: "Let the AI agent apply to jobs for you automatically",
      path: "/dashboard"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data is encrypted and never shared without permission",
      path: "/profile"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-7xl py-10">
        <div className="flex flex-col gap-4 mb-8">
          <h1 className="text-4xl font-bold">Find Your Next Career Opportunity</h1>
          <p className="text-xl text-muted-foreground">
            Customize your job search preferences and connect to job platforms
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <JobPreferencesForm />
          </div>
          
          <div className="space-y-8">
            <JobSourceConnector />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
