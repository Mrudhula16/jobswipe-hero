import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { 
  BriefcaseIcon, Filter, ArrowLeft, ArrowRight, Bookmark, Clock, Zap, Building, MapPin, 
  GraduationCap, Banknote, Timer, Globe, CalendarDays, Search, X, Heart, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const JobSwipe = () => {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedJobs, setSwipedJobs] = useState<{ id: string; direction: "left" | "right" }[]>([]);
  const swipeHistoryRef = useRef<{ id: string; direction: "left" | "right" }[]>([]);
  const [activeTab, setActiveTab] = useState("recommended");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [animatingCardId, setAnimatingCardId] = useState<string | null>(null);
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
    if (animatingCardId) return; // Prevent multiple swipes while animating
    
    const jobId = jobs[currentIndex].id;
    
    // Set the currently animating card
    setAnimatingCardId(jobId);
    
    setSwipedJobs([...swipedJobs, { id: jobId, direction }]);
    swipeHistoryRef.current = [...swipeHistoryRef.current, { id: jobId, direction }];
    
    if (direction === "right") {
      toast({
        title: "Application Saved",
        description: `${jobs[currentIndex].title} has been added to your Applications`,
      });
    }
    
    // Wait for animation to complete before changing index
    setTimeout(() => {
      setCurrentIndex(prevIndex => 
        prevIndex < jobs.length - 1 ? prevIndex + 1 : prevIndex
      );
      // Reset the animating card ID
      setAnimatingCardId(null);
    }, 500); // Match this with the animation duration in JobCard
  };

  const handleUndo = () => {
    if (swipeHistoryRef.current.length === 0 || currentIndex === 0) return;
    
    swipeHistoryRef.current.pop();
    setSwipedJobs(swipeHistoryRef.current);
    setCurrentIndex(prevIndex => prevIndex - 1);
  };

  const handleFilterChange = (category: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const noMoreCards = currentIndex >= jobs.length;

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
                      <Popover>
                        <PopoverTrigger asChild>
                          <input 
                            type="text" 
                            placeholder="City, state, or zip code" 
                            className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                            readOnly
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
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Type</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full justify-between">
                          <span>{filters.jobType.length ? `${filters.jobType.length} selected` : "Select job types"}</span>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 bg-background border border-border shadow-md" align="start">
                        <DropdownMenuLabel>Job Types</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          {jobTypeOptions.map((option) => (
                            <DropdownMenuItem 
                              key={option.value}
                              className="cursor-pointer"
                              onSelect={(e) => {
                                e.preventDefault();
                                const newJobTypes = filters.jobType.includes(option.value)
                                  ? filters.jobType.filter(t => t !== option.value)
                                  : [...filters.jobType, option.value];
                                handleFilterChange("jobType", newJobTypes);
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 border rounded flex items-center justify-center ${filters.jobType.includes(option.value) ? 'bg-primary border-primary' : 'border-input'}`}>
                                  {filters.jobType.includes(option.value) && <Check className="h-3 w-3 text-white" />}
                                </div>
                                <span>{option.label}</span>
                              </div>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Experience Level</label>
                    <Select 
                      value={filters.experienceLevel} 
                      onValueChange={(value) => handleFilterChange("experienceLevel", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border shadow-md">
                        <SelectGroup>
                          <SelectLabel>Experience Level</SelectLabel>
                          {experienceLevelOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Salary Range</label>
                    <Select
                      value={filters.salary}
                      onValueChange={(value) => handleFilterChange("salary", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border shadow-md">
                        <SelectGroup>
                          <SelectLabel>Salary Range</SelectLabel>
                          {salaryRangeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Posted</label>
                    <Select
                      value={filters.datePosted}
                      onValueChange={(value) => handleFilterChange("datePosted", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Any time" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border shadow-md">
                        <SelectGroup>
                          <SelectLabel>Date Posted</SelectLabel>
                          {datePostedOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Industry</label>
                    <Select
                      value={filters.industry}
                      onValueChange={(value) => handleFilterChange("industry", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border shadow-md max-h-80">
                        <SelectGroup>
                          <SelectLabel>Industry</SelectLabel>
                          {industryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Function</label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select job function" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border shadow-md max-h-80">
                        <SelectGroup>
                          <SelectLabel>Job Function</SelectLabel>
                          {jobFunctionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Education</label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select education" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border shadow-md">
                        <SelectGroup>
                          <SelectLabel>Education</SelectLabel>
                          {educationOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full justify-between">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            <span>Skills</span>
                          </div>
                          <span className="text-xs bg-secondary rounded-full px-2 py-0.5">+</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search skills..." />
                          <CommandList className="max-h-80">
                            <CommandEmpty>No skills found.</CommandEmpty>
                            <CommandGroup heading="Popular Skills">
                              {skillsOptions.map((skill) => (
                                <CommandItem key={skill.value}>
                                  {skill.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="flex items-center justify-between gap-4 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
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
                    }}
                  >
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
