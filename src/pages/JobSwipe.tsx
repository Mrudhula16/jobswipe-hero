
import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BriefcaseIcon, Filter, ArrowLeft, ArrowRight, Bookmark, Clock, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const JobSwipe = () => {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedJobs, setSwipedJobs] = useState<{ id: string; direction: "left" | "right" }[]>([]);
  const swipeHistoryRef = useRef<{ id: string; direction: "left" | "right" }[]>([]);
  const [activeTab, setActiveTab] = useState("recommended");

  // Sample job data
  const jobs = [
    {
      id: "1",
      title: "Senior UX Designer",
      company: "Apple",
      location: "Cupertino, CA",
      salary: "$120k - $150k",
      description: "Join our team to help design the next generation of innovative products. Looking for a experienced designer who can create beautiful, intuitive interfaces.",
      requirements: ["5+ years experience", "Figma", "User Research", "Prototyping", "UI Design"],
      posted: "2 days ago",
      type: "Full-time",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
    },
    {
      id: "2",
      title: "Frontend Developer",
      company: "Google",
      location: "Remote",
      salary: "$100k - $130k",
      description: "Work on cutting-edge web applications using the latest technologies. We're seeking a talented frontend developer to join our growing team.",
      requirements: ["React", "TypeScript", "CSS", "Next.js", "Testing"],
      posted: "1 week ago",
      type: "Full-time",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
    },
    {
      id: "3",
      title: "Product Manager",
      company: "Spotify",
      location: "New York, NY",
      salary: "$110k - $140k",
      description: "Lead product development initiatives and work closely with design, engineering, and marketing teams to deliver exceptional user experiences.",
      requirements: ["3+ years experience", "Agile", "Data Analysis", "User Stories", "Roadmapping"],
      posted: "3 days ago",
      type: "Full-time",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png"
    },
    {
      id: "4",
      title: "Machine Learning Engineer",
      company: "Netflix",
      location: "Remote",
      salary: "$140k - $180k",
      description: "Build and optimize machine learning models to enhance our recommendation system and improve user experience across the platform.",
      requirements: ["Python", "TensorFlow", "PyTorch", "Data Science", "NLP"],
      posted: "5 days ago",
      type: "Full-time",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1200px-Netflix_2015_logo.svg.png"
    },
    {
      id: "5",
      title: "DevOps Engineer",
      company: "Microsoft",
      location: "Seattle, WA",
      salary: "$115k - $145k",
      description: "Implement and maintain CI/CD pipelines, infrastructure as code, and cloud services to support our development teams.",
      requirements: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD"],
      posted: "1 day ago",
      type: "Full-time",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png"
    }
  ];

  const handleSwipe = (direction: "left" | "right") => {
    const jobId = jobs[currentIndex].id;
    setSwipedJobs([...swipedJobs, { id: jobId, direction }]);
    swipeHistoryRef.current = [...swipeHistoryRef.current, { id: jobId, direction }];
    
    if (direction === "right") {
      toast({
        title: "Application Saved",
        description: `${jobs[currentIndex].title} has been added to your Applications`,
      });
    }
    
    setTimeout(() => {
      setCurrentIndex(prevIndex => 
        prevIndex < jobs.length - 1 ? prevIndex + 1 : prevIndex
      );
    }, 300);
  };

  const handleUndo = () => {
    if (swipeHistoryRef.current.length === 0 || currentIndex === 0) return;
    
    swipeHistoryRef.current.pop();
    setSwipedJobs(swipeHistoryRef.current);
    setCurrentIndex(prevIndex => prevIndex - 1);
  };

  const noMoreCards = currentIndex >= jobs.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 pt-8 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-72 space-y-6">
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border bg-secondary/50">
                <h2 className="font-medium">Job Filters</h2>
              </div>
              <div className="p-4 space-y-4">
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filter Jobs</span>
                  </div>
                  <span className="text-xs bg-secondary rounded-full px-2 py-0.5">4</span>
                </Button>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">Remote</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Experience</span>
                    <span className="font-medium">Mid-Senior</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Job Type</span>
                    <span className="font-medium">Full-time</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Salary Range</span>
                    <span className="font-medium">$100k+</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border bg-secondary/50">
                <h2 className="font-medium">Job Summary</h2>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Matches Today</span>
                  </div>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Bookmark className="h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground">Applied</span>
                  </div>
                  <span className="font-medium">{swipedJobs.filter(j => j.direction === "right").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span className="text-muted-foreground">Viewed</span>
                  </div>
                  <span className="font-medium">{currentIndex}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-4 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <BriefcaseIcon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium">Job Agent</h3>
                  <p className="text-xs text-muted-foreground">AI-powered assistant</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Let our AI agent automatically apply to jobs that match your profile and preferences.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Activate Job Agent
              </Button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue="recommended" value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="bg-card border border-border shadow-sm">
                <TabsTrigger value="recommended" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Recommended
                </TabsTrigger>
                <TabsTrigger value="saved" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Saved
                </TabsTrigger>
                <TabsTrigger value="applied" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Applied
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="recommended" className="mt-4">
                <div className="relative h-[600px] max-w-md mx-auto">
                  {noMoreCards ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 neo-card rounded-2xl border border-border animate-fade-in">
                      <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-4">
                        <BriefcaseIcon className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">No more jobs to show</h3>
                      <p className="text-muted-foreground mb-6">
                        You've viewed all available jobs matching your criteria.
                      </p>
                      <Button 
                        variant="default" 
                        onClick={() => {
                          setCurrentIndex(0);
                          setSwipedJobs([]);
                          swipeHistoryRef.current = [];
                        }}
                        className="gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Reset Jobs
                      </Button>
                    </div>
                  ) : (
                    <>
                      <AnimatePresence>
                        {jobs
                          .slice(currentIndex, currentIndex + 3)
                          .reverse()
                          .map((job, index) => {
                            const isActive = index === 0;
                            return (
                              <JobCard
                                key={job.id}
                                job={job}
                                onSwipe={handleSwipe}
                                active={isActive}
                              />
                            );
                          })}
                      </AnimatePresence>
                      
                      {/* Control buttons */}
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-8">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-14 w-14 rounded-full border-2 border-border"
                          onClick={handleUndo}
                          disabled={currentIndex === 0 || swipeHistoryRef.current.length === 0}
                        >
                          <ArrowLeft className="h-6 w-6" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-14 w-14 rounded-full"
                          onClick={() => handleSwipe("left")}
                        >
                          <ArrowLeft className="h-6 w-6" />
                        </Button>
                        <Button
                          variant="default"
                          size="icon"
                          className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600"
                          onClick={() => handleSwipe("right")}
                        >
                          <ArrowRight className="h-6 w-6" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-muted-foreground">
                    Swipe right to apply, swipe left to pass
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="saved" className="mt-4">
                <div className="neo-card p-8 text-center rounded-xl border border-border">
                  <BriefcaseIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">Saved Jobs</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't saved any jobs yet. Swipe right on jobs you're interested in.
                  </p>
                  <Button 
                    variant="default" 
                    onClick={() => setActiveTab("recommended")}
                  >
                    Browse Jobs
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="applied" className="mt-4">
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {swipedJobs.filter(j => j.direction === "right").length > 0 ? (
                    jobs
                      .filter(job => swipedJobs.some(j => j.id === job.id && j.direction === "right"))
                      .map(job => (
                        <motion.div
                          key={job.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="neo-card p-4 rounded-xl border border-border flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-secondary rounded-md flex items-center justify-center overflow-hidden">
                              {job.logo ? (
                                <img src={job.logo} alt={job.company} className="h-8 w-8 object-contain" />
                              ) : (
                                <BriefcaseIcon className="h-6 w-6 text-primary" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium">{job.title}</h3>
                              <p className="text-sm text-muted-foreground">{job.company} • Applied today</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                            Applied
                          </Badge>
                        </motion.div>
                      ))
                  ) : (
                    <div className="neo-card p-8 text-center rounded-xl border border-border">
                      <BriefcaseIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-2">Applied Jobs</h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't applied to any jobs yet. Swipe right on jobs you'd like to apply for.
                      </p>
                      <Button 
                        variant="default" 
                        onClick={() => setActiveTab("recommended")}
                      >
                        Browse Jobs
                      </Button>
                    </div>
                  )}
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobSwipe;
