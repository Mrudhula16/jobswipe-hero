import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import JobCard from "@/components/JobCard";
import JobCardSkeleton from "@/components/JobCardSkeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { 
  BriefcaseIcon, Filter, ArrowLeft, ArrowRight, Bookmark, Clock, Zap, Building, MapPin, 
  GraduationCap, Banknote, Timer, Globe, CalendarDays, Search, X, Heart, ChevronDown, Check, 
  RefreshCw, Bot, Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useJobSwiper from "@/hooks/useJobSwiper";
import { getFilteredJobs } from "@/services/jobService";
import { useJobAgent } from "@/hooks/useJobAgent";
import { JobAgentConfigDialog } from "@/components/JobAgentConfig";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import JobAgentConfig from "@/components/JobAgentConfig";
import JobFilters from "@/components/JobFilters";

const JobSwipe = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("recommended");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filters, setFilters] = useState({
    jobType: [] as string[],
    experienceLevel: "",
    datePosted: "",
    salary: "",
    location: "",
    industry: "",
    isRemote: false,
    isHybrid: false,
  });

  const {
    jobs,
    currentIndex,
    swipedJobs,
    isLoading,
    isLoadingMore,
    noMoreJobs,
    animatingCardId,
    handleSwipe,
    handleUndo,
    resetJobs,
    applyFilters
  } = useJobSwiper({
    initialFetchCount: 5,
    prefetchThreshold: 2
  });

  const { isActive, isLoading: agentLoading, toggleJobAgent } = useJobAgent();
  const [showAgentConfig, setShowAgentConfig] = useState(false);

  const handleFilterChange = (category: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleJobFiltersChange = (newFilters: Record<string, string[]>) => {
    // Map the database filter format to our application format
    setFilters(prev => ({
      ...prev,
      jobType: newFilters['job_type'] || [],
      experienceLevel: newFilters['experience_level']?.length > 0 ? newFilters['experience_level'][0] : '',
      industry: newFilters['industry']?.length > 0 ? newFilters['industry'][0] : '',
      salary: newFilters['salary_range']?.length > 0 ? newFilters['salary_range'][0] : '',
      datePosted: newFilters['date_posted']?.length > 0 ? newFilters['date_posted'][0] : '',
    }));
  };

  const applyJobFilters = async (formattedFilters?: Record<string, any>) => {
    setIsFiltering(true);
    try {
      // If formatted filters are provided directly, use them
      // Otherwise use our current filters state
      const filtersToApply = formattedFilters || {
        jobType: filters.jobType,
        experienceLevel: filters.experienceLevel,
        industry: filters.industry,
        isRemote: filters.isRemote,
        location: filters.location,
        salary: filters.salary,
        datePosted: filters.datePosted
      };
      
      await applyFilters(filtersToApply);
    } catch (error) {
      console.error('Error in applyJobFilters:', error);
      toast({
        title: "Error",
        description: "Failed to apply filters. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsFiltering(false);
    }
  };

  const resetJobFilters = () => {
    setFilters({
      jobType: [],
      experienceLevel: "",
      datePosted: "",
      salary: "",
      location: "",
      industry: "",
      isRemote: false,
      isHybrid: false,
    });
    resetJobs();
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared.",
    });
  };

  const datePostedOptions = [
    { value: "past24h", label: "Past 24 hours" },
    { value: "past3d", label: "Past 3 days" },
    { value: "pastWeek", label: "Past week" },
    { value: "pastMonth", label: "Past month" },
    { value: "any", label: "Any time" }
  ];

  const experienceLevelOptions = [
    { value: "internship", label: "Internship" },
    { value: "entry", label: "Entry level" },
    { value: "associate", label: "Associate" },
    { value: "mid", label: "Mid-Senior level" },
    { value: "director", label: "Director" },
    { value: "executive", label: "Executive" }
  ];

  const salaryRangeOptions = [
    { value: "0-50k", label: "$0 - $50,000" },
    { value: "50k-75k", label: "$50,000 - $75,000" },
    { value: "75k-100k", label: "$75,000 - $100,000" },
    { value: "100k-150k", label: "$100,000 - $150,000" },
    { value: "150k-200k", label: "$150,000 - $200,000" },
    { value: "200k+", label: "$200,000+" }
  ];

  const industryOptions = [
    { value: "tech", label: "Information Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance" },
    { value: "education", label: "Education" },
    { value: "marketing", label: "Marketing & Advertising" },
    { value: "retail", label: "Retail & Consumer Goods" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "media", label: "Media & Communications" },
    { value: "nonprofit", label: "Nonprofit" },
    { value: "realestate", label: "Real Estate" },
    { value: "hospitality", label: "Hospitality & Tourism" },
    { value: "construction", label: "Construction" },
    { value: "legal", label: "Legal Services" },
    { value: "consulting", label: "Consulting" },
    { value: "transportation", label: "Transportation & Logistics" },
    { value: "energy", label: "Energy & Utilities" },
    { value: "agriculture", label: "Agriculture" },
    { value: "arts", label: "Arts & Entertainment" },
    { value: "government", label: "Government" }
  ];

  const jobTypeOptions = [
    { value: "fulltime", label: "Full-time" },
    { value: "parttime", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "temporary", label: "Temporary" },
    { value: "internship", label: "Internship" },
    { value: "volunteer", label: "Volunteer" },
    { value: "apprenticeship", label: "Apprenticeship" }
  ];

  const jobFunctionOptions = [
    { value: "engineering", label: "Engineering" },
    { value: "sales", label: "Sales" },
    { value: "marketing", label: "Marketing" },
    { value: "product", label: "Product Management" },
    { value: "design", label: "Design" },
    { value: "customerservice", label: "Customer Service" },
    { value: "hr", label: "Human Resources" },
    { value: "finance", label: "Finance" },
    { value: "operations", label: "Operations" },
    { value: "it", label: "Information Technology" },
    { value: "legal", label: "Legal" },
    { value: "research", label: "Research" },
    { value: "education", label: "Education" },
    { value: "healthcare", label: "Healthcare Services" },
    { value: "administrative", label: "Administrative" },
    { value: "consulting", label: "Consulting" },
    { value: "executive", label: "Executive" }
  ];

  const skillsOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "react", label: "React" },
    { value: "node", label: "Node.js" },
    { value: "sql", label: "SQL" },
    { value: "figma", label: "Figma" },
    { value: "excel", label: "Microsoft Excel" },
    { value: "communication", label: "Communication" },
    { value: "projectmanagement", label: "Project Management" },
    { value: "leadership", label: "Leadership" },
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" },
    { value: "analytics", label: "Analytics" },
    { value: "cloud", label: "Cloud Computing" },
    { value: "devops", label: "DevOps" },
    { value: "android", label: "Android Development" },
    { value: "ios", label: "iOS Development" },
    { value: "ux", label: "User Experience (UX)" },
    { value: "ui", label: "User Interface (UI)" }
  ];

  const educationOptions = [
    { value: "highschool", label: "High School" },
    { value: "associate", label: "Associate's Degree" },
    { value: "bachelor", label: "Bachelor's Degree" },
    { value: "master", label: "Master's Degree" },
    { value: "doctorate", label: "Doctorate" },
    { value: "professional", label: "Professional Degree" },
    { value: "certification", label: "Professional Certification" }
  ];

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
                {/* Replace with our new JobFilters component */}
                <JobFilters 
                  onFilterChange={handleJobFiltersChange} 
                  onApplyFilters={applyJobFilters}
                  isFiltering={isFiltering}
                />
                
                {/* Keep the location search input separate */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <input 
                          type="text" 
                          placeholder="City, state, or zip code" 
                          className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                          readOnly
                          value={filters.location}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search location..." />
                          <CommandList>
                            <CommandEmpty>No locations found.</CommandEmpty>
                            <CommandGroup heading="Popular Cities">
                              <CommandItem onSelect={() => handleFilterChange("location", "Remote")}>
                                Remote
                              </CommandItem>
                              <CommandItem onSelect={() => handleFilterChange("location", "New York, NY")}>
                                New York, NY
                              </CommandItem>
                              <CommandItem onSelect={() => handleFilterChange("location", "San Francisco, CA")}>
                                San Francisco, CA
                              </CommandItem>
                              <CommandItem onSelect={() => handleFilterChange("location", "Seattle, WA")}>
                                Seattle, WA
                              </CommandItem>
                              <CommandItem onSelect={() => handleFilterChange("location", "Austin, TX")}>
                                Austin, TX
                              </CommandItem>
                              <CommandItem onSelect={() => handleFilterChange("location", "Chicago, IL")}>
                                Chicago, IL
                              </CommandItem>
                              <CommandItem onSelect={() => handleFilterChange("location", "Boston, MA")}>
                                Boston, MA
                              </CommandItem>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Toggle 
                      size="sm" 
                      aria-label="Toggle remote"
                      pressed={filters.isRemote}
                      onPressedChange={(pressed) => handleFilterChange("isRemote", pressed)}
                    >
                      <Globe className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">Remote only</span>
                    </Toggle>
                    <Toggle 
                      size="sm" 
                      aria-label="Toggle hybrid"
                      pressed={filters.isHybrid}
                      onPressedChange={(pressed) => handleFilterChange("isHybrid", pressed)}
                    >
                      <Building className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">Hybrid</span>
                    </Toggle>
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
                    <span className="text-muted-foreground">Available Jobs</span>
                  </div>
                  <span className="font-medium">{jobs.length}</span>
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
                  <Bot className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium">Job Agent</h3>
                  <p className="text-xs text-muted-foreground">AI-powered assistant</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Let our AI agent automatically apply to jobs that match your profile and preferences.
              </p>
              <div className="space-y-2">
                <Button 
                  variant={isActive ? "outline" : "default"} 
                  size="sm" 
                  className="w-full"
                  onClick={toggleJobAgent}
                  disabled={agentLoading}
                >
                  {agentLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : isActive ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Agent Active
                    </>
                  ) : (
                    "Activate Job Agent"
                  )}
                </Button>
                
                <Dialog open={showAgentConfig} onOpenChange={setShowAgentConfig}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Job Agent Configuration</DialogTitle>
                      <DialogDescription>
                        Configure your AI-powered job agent to automatically find and apply to matching jobs.
                      </DialogDescription>
                    </DialogHeader>
                    <JobAgentConfig onClose={() => setShowAgentConfig(false)} />
                  </DialogContent>
                </Dialog>
              </div>
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
                  {isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <JobCardSkeleton />
                      <p className="text-center mt-4 text-muted-foreground animate-pulse">
                        Loading jobs...
                      </p>
                    </div>
                  ) : noMoreJobs ? (
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
                        onClick={resetJobs}
                        className="gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Find More Jobs
                      </Button>
                    </div>
                  ) : (
                    <>
                      <AnimatePresence>
                        {jobs
                          .slice(currentIndex, currentIndex + 3)
                          .reverse()
                          .map((job, index) => {
                            const isActive = index === 0 && !animatingCardId;
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
                      
                      {isLoadingMore && currentIndex > 0 && !noMoreJobs && (
                        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4">
                          <div className="flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1 text-sm">
                            <RefreshCw className="h-3 w-3 animate-spin text-primary" />
                            <span>Loading more jobs...</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                <div className="mt-8 flex items-center justify-center gap-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full" 
                    onClick={handleUndo}
                    disabled={currentIndex === 0 || isLoading}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Undo
                  </Button>
                  
                  <div className="text-sm text-muted-foreground">
                    Swipe right to apply, swipe left to pass
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full" 
                    onClick={resetJobs}
                    disabled={isLoading}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
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
