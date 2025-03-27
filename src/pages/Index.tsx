
import React from "react";
import Navbar from "@/components/Navbar";
import JobFilterExample from "@/components/JobFilterExample";
import FeedbackChat from "@/components/FeedbackChat";
import MotivationalInsights from "@/components/MotivationalInsights";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { 
  BriefcaseIcon, 
  Search, 
  TrendingUp, 
  ArrowRight, 
  Sparkles 
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-10 px-4 sm:px-6">
        {/* Hero Section */}
        <section className="py-10 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Find Your Dream Job <span className="text-primary">Today</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Discover opportunities tailored to your skills and preferences. Your career journey starts here.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/job-swipe">
                  <Button size="lg" className="gap-2">
                    <Search className="h-5 w-5" />
                    Start Job Swiping
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  Create Profile
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="absolute -z-10 bg-primary/10 rounded-full w-[350px] h-[350px] blur-3xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Job Search" 
                  className="rounded-lg shadow-lg object-cover max-w-md"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-10 border-y">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <p className="text-3xl font-bold">5,000+</p>
              <p className="text-muted-foreground">Active Jobs</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold">200+</p>
              <p className="text-muted-foreground">Companies</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold">50,000+</p>
              <p className="text-muted-foreground">Professionals</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold">85%</p>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </section>

        {/* Motivational Section - Only visible when logged in */}
        {user && (
          <section className="py-10">
            <MotivationalInsights />
          </section>
        )}

        {/* Job Filter Section */}
        <section className="py-10">
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Find Your Perfect Match</h2>
            <p className="text-muted-foreground">
              Use our advanced filtering system to discover jobs that match your skills, location, and career goals.
            </p>
          </div>
          <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
            <JobFilterExample />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-10">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg border hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover Opportunities</h3>
              <p className="text-muted-foreground">
                Browse thousands of job listings or use our AI-powered job matching.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BriefcaseIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Apply With Ease</h3>
              <p className="text-muted-foreground">
                One-click applications with personalized resume and cover letter suggestions.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
              <p className="text-muted-foreground">
                Monitor your applications and get insights to improve your job search.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10 mb-10">
          <div className="bg-primary/10 rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Create your profile now and let our AI-powered platform find your perfect job match.
            </p>
            <Link to="/job-swipe">
              <Button size="lg" className="gap-2">
                Explore Jobs Now
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <FeedbackChat />
    </div>
  );
};

export default Index;
