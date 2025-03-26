
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, BriefcaseIcon, Zap, Settings, Target, Shield, BarChart2, Search, PenTool } from "lucide-react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import JobPreferencesForm from "@/components/JobPreferencesForm";

const Index = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll event
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  <span className="text-gradient">Job hunting</span> made simple
                </h1>
              </motion.div>
              
              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Swipe right on your dream job. Let AI find and apply to jobs for you across LinkedIn, Indeed, and more.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-white gap-2 px-6 h-12 rounded-full"
                  onClick={() => navigate('/job-swipe')}
                >
                  Start Swiping
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="gap-2 px-6 h-12 rounded-full"
                  onClick={() => navigate('/dashboard')}
                >
                  <BarChart2 className="h-5 w-5" />
                  View Dashboard
                </Button>
              </motion.div>
            </div>
            
            <motion.div 
              className="flex-1 relative max-w-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="relative aspect-square md:aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-border">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <div className="w-72 h-[450px] bg-card rounded-3xl shadow-xl border border-border overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                      <BriefcaseIcon className="h-16 w-16 text-primary/60" />
                    </div>
                    <div className="p-5 space-y-3">
                      <h3 className="text-xl font-semibold">Senior Product Designer</h3>
                      <p className="text-sm text-muted-foreground">Apple Inc.</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 text-xs rounded-full bg-secondary">$120k - $150k</span>
                        <span className="px-2 py-1 text-xs rounded-full bg-secondary">Remote</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        Join our team to help design the next generation of innovative products...
                      </p>
                    </div>
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                      <Button size="sm" variant="destructive" className="rounded-full w-12 h-12 flex items-center justify-center p-0">
                        ✕
                      </Button>
                      <Button size="sm" variant="default" className="rounded-full w-12 h-12 flex items-center justify-center p-0 bg-green-500">
                        ♥
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden md:block absolute -top-6 -right-6 bg-accent/10 backdrop-blur-lg border border-accent/20 rounded-xl p-4 shadow-lg animate-float">
                <div className="text-sm font-medium">
                  <span className="text-accent">AI Agent</span> found 12 matching jobs!
                </div>
              </div>
              <div className="hidden md:block absolute -bottom-6 -left-6 bg-primary/10 backdrop-blur-lg border border-primary/20 rounded-xl p-4 shadow-lg animate-pulse-subtle">
                <div className="text-sm font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <span>Resume Score: 92%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Job Preferences Section */}
      <section className="py-12 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Set Your Job Preferences</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Tell us what you're looking for to receive personalized job recommendations
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <JobPreferencesForm />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How JobSwipe Works</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Our AI-powered platform simplifies every step of your job search
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate(feature.path)}
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
                <div className="mt-4 flex justify-end">
                  <ChevronRight className="h-5 w-5 text-primary opacity-70" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12 shadow-sm border border-border">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to revolutionize your job search?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of professionals who've simplified their job hunt with JobSwipe.
              </p>
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-white gap-2 px-8 h-12 rounded-full"
                onClick={() => navigate('/job-swipe')}
              >
                Get Started
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <BriefcaseIcon className="h-6 w-6 text-primary mr-2" />
              <span className="text-lg font-semibold">Employed</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Employed. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
