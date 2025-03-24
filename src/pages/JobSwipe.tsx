import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { BriefcaseIcon, Filter, ArrowLeft, ArrowRight, Bookmark, Clock, Zap, Building, MapPin, GraduationCap, Banknote, Timer, Globe, CalendarDays, Search, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const JobSwipe = () => {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedJobs, setSwipedJobs] = useState<{ id: string; direction: "left" | "right" }[]>([]);
  const swipeHistoryRef = useRef<{ id: string; direction: "left" | "right" }[]>([]);
  const [activeTab, setActiveTab] = useState("recommended");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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
          <div className="w-full md:w-80 space-y-6">
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border bg-secondary/50 flex items-center justify-between">
                <h2 className="font-medium">Job Filters</h2>
                <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
                  <Filter className="h-4 w-4" />
                  <span className="text-xs">Filters</span>
                </Button>
              </div>
              <div className="p-4 space-y-5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search by title, skill, or company" 
                    className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="City, state, or zip code" 
                        className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Toggle size="sm" aria-label="Toggle remote">
                        <Globe className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs">Remote only</span>
                      </Toggle>
                      <Toggle size="sm" aria-label="Toggle hybrid">
                        <Building className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs">Hybrid</span>
                      </Toggle>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <ToggleGroup type="multiple">
                        <ToggleGroupItem value="full-time" size="sm" className="h-8 text-xs justify-center">
                          Full-time
                        </ToggleGroupItem>
                        <ToggleGroupItem value="part-time" size="sm" className="h-8 text-xs justify-center">
                          Part-time
                        </ToggleGroupItem>
                        <ToggleGroupItem value="contract" size="sm" className="h-8 text-xs justify-center">
                          Contract
                        </ToggleGroupItem>
                        <ToggleGroupItem value="internship" size="sm" className="h-8 text-xs justify-center">
                          Internship
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Experience Level</label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="associate">Associate</SelectItem>
                        <SelectItem value="mid">Mid-Level</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                        <SelectItem value="executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Salary Range</label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-50k">$0 - $50,000</SelectItem>
                        <SelectItem value="50k-75k">$50,000 - $75,000</SelectItem>
                        <SelectItem value="75k-100k">$75,000 - $100,000</SelectItem>
                        <SelectItem value="100k-150k">$100,000 - $150,000</SelectItem>
                        <SelectItem value="150k+">$150,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Posted</label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Any time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Past 24 hours</SelectItem>
                        <SelectItem value="week">Past week</SelectItem>
                        <SelectItem value="month">Past month</SelectItem>
                        <SelectItem value="any">Any time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Industry</label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        <span>Education & Skills</span>
                      </div>
                      <span className="text-xs bg-secondary rounded-full px-2 py-0.5">+</span>
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between gap-4 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Reset
                  </Button>
                  <Button size="sm" className="flex-1">
                    Apply Filters
                  </Button>
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
