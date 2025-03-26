
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, AlertCircle, Save, Loader2, Building, MapPin, Briefcase } from "lucide-react";
import { getUserJobPreferences, saveJobPreferences, JobPreferences } from "@/services/jobPreferencesService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const JobPreferencesForm = () => {
  const { user } = useAuth();
  const [jobPreferences, setJobPreferences] = useState<JobPreferences>({
    job_title: "",
    employment_types: [],
    location_preferences: [],
    min_salary: undefined,
    max_salary: undefined,
    industries: []
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([50000, 150000]);
  const [companySize, setCompanySize] = useState<string | undefined>(undefined);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  // Load job preferences from database
  useEffect(() => {
    const fetchJobPreferences = async () => {
      if (user) {
        setLoading(true);
        try {
          const preferences = await getUserJobPreferences();
          if (preferences) {
            setJobPreferences(preferences);
            
            // Set the salary slider if values exist
            if (preferences.min_salary && preferences.max_salary) {
              setSalaryRange([
                Number(preferences.min_salary), 
                Number(preferences.max_salary)
              ]);
            }
          }
        } catch (error) {
          console.error("Error fetching job preferences:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchJobPreferences();
  }, [user]);
  
  const handlePreferenceChange = (field: keyof JobPreferences, value: any) => {
    setJobPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleArrayPreference = (field: 'employment_types' | 'location_preferences' | 'industries', value: string) => {
    const currentArray = jobPreferences[field] || [];
    const exists = currentArray.includes(value);
    
    if (exists) {
      // Remove the value
      handlePreferenceChange(field, currentArray.filter(item => item !== value));
    } else {
      // Add the value
      handlePreferenceChange(field, [...currentArray, value]);
    }
  };

  const handleSalaryChange = (values: number[]) => {
    setSalaryRange([values[0], values[1]]);
    handlePreferenceChange('min_salary', values[0]);
    handlePreferenceChange('max_salary', values[1]);
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSavePreferences = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save job preferences",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      await saveJobPreferences(jobPreferences);
      toast({
        title: "Preferences saved",
        description: "Your job preferences have been updated",
      });
    } catch (error) {
      toast({
        title: "Error saving preferences",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // Company size options for the dropdown
  const companySizes = [
    { value: "startup", label: "Startup (1-50)" },
    { value: "small", label: "Small (51-200)" },
    { value: "medium", label: "Medium (201-1000)" },
    { value: "large", label: "Large (1001-5000)" },
    { value: "enterprise", label: "Enterprise (5000+)" },
  ];

  // Common skills for tech/design roles
  const commonSkills = [
    "JavaScript", "React", "TypeScript", "Node.js", "UI/UX Design", 
    "Python", "SQL", "AWS", "Product Management", "Data Analysis",
    "Figma", "Adobe XD", "Project Management", "Marketing", "Sales"
  ];

  // Format salary as currency
  const formatSalary = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className="neo-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Job Preferences
        </CardTitle>
        <CardDescription>
          What type of jobs are you looking for?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex justify-between mb-1">
                <Label>Job Title</Label>
                <span className="text-xs text-muted-foreground">Suggested based on your profile</span>
              </div>
              <Input 
                placeholder="Product Designer" 
                value={jobPreferences.job_title || ""} 
                onChange={(e) => handlePreferenceChange('job_title', e.target.value)}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => handlePreferenceChange('job_title', 'UI/UX Designer')}
                >
                  UI/UX Designer
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => handlePreferenceChange('job_title', 'Frontend Developer')}
                >
                  Frontend Developer
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => handlePreferenceChange('job_title', 'Software Engineer')}
                >
                  Software Engineer
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => handlePreferenceChange('job_title', 'Product Manager')}
                >
                  Product Manager
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => handlePreferenceChange('job_title', 'Data Scientist')}
                >
                  Data Scientist
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">+ Add</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Employment Type</Label>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={jobPreferences.employment_types?.includes('full-time') ? "secondary" : "outline"} 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => toggleArrayPreference('employment_types', 'full-time')}
                  >
                    Full-time
                  </Button>
                  <Button 
                    variant={jobPreferences.employment_types?.includes('part-time') ? "secondary" : "outline"} 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => toggleArrayPreference('employment_types', 'part-time')}
                  >
                    Part-time
                  </Button>
                  <Button 
                    variant={jobPreferences.employment_types?.includes('contract') ? "secondary" : "outline"} 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => toggleArrayPreference('employment_types', 'contract')}
                  >
                    Contract
                  </Button>
                  <Button 
                    variant={jobPreferences.employment_types?.includes('internship') ? "secondary" : "outline"} 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => toggleArrayPreference('employment_types', 'internship')}
                  >
                    Internship
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Location Preference</Label>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={jobPreferences.location_preferences?.includes('remote') ? "secondary" : "outline"} 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => toggleArrayPreference('location_preferences', 'remote')}
                  >
                    Remote
                  </Button>
                  <Button 
                    variant={jobPreferences.location_preferences?.includes('on-site') ? "secondary" : "outline"} 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => toggleArrayPreference('location_preferences', 'on-site')}
                  >
                    On-site
                  </Button>
                  <Button 
                    variant={jobPreferences.location_preferences?.includes('hybrid') ? "secondary" : "outline"} 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => toggleArrayPreference('location_preferences', 'hybrid')}
                  >
                    Hybrid
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Desired Salary Range</Label>
                <span className="text-sm text-muted-foreground">
                  {formatSalary(salaryRange[0])} - {formatSalary(salaryRange[1])}
                </span>
              </div>
              <Slider
                defaultValue={[50000, 150000]}
                value={salaryRange}
                max={300000}
                min={0}
                step={5000}
                onValueChange={handleSalaryChange}
                className="mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label>Company Size</Label>
              <Select 
                value={companySize} 
                onValueChange={setCompanySize}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map(size => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Industries</Label>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={jobPreferences.industries?.includes('technology') ? "secondary" : "outline"} 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => toggleArrayPreference('industries', 'technology')}
                >
                  <Building className="h-3.5 w-3.5 mr-1.5" />
                  Technology
                </Button>
                <Button 
                  variant={jobPreferences.industries?.includes('design') ? "secondary" : "outline"} 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => toggleArrayPreference('industries', 'design')}
                >
                  <Building className="h-3.5 w-3.5 mr-1.5" />
                  Design
                </Button>
                <Button 
                  variant={jobPreferences.industries?.includes('finance') ? "secondary" : "outline"} 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => toggleArrayPreference('industries', 'finance')}
                >
                  <Building className="h-3.5 w-3.5 mr-1.5" />
                  Finance
                </Button>
                <Button 
                  variant={jobPreferences.industries?.includes('healthcare') ? "secondary" : "outline"} 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => toggleArrayPreference('industries', 'healthcare')}
                >
                  <Building className="h-3.5 w-3.5 mr-1.5" />
                  Healthcare
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-full">+ More</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>More Industries</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => toggleArrayPreference('industries', 'education')}>
                        Education
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleArrayPreference('industries', 'retail')}>
                        Retail
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleArrayPreference('industries', 'marketing')}>
                        Marketing
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleArrayPreference('industries', 'consulting')}>
                        Consulting
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleArrayPreference('industries', 'hospitality')}>
                        Hospitality
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleArrayPreference('industries', 'nonprofit')}>
                        Nonprofit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleArrayPreference('industries', 'government')}>
                        Government
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Required Skills</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {commonSkills.slice(0, 10).map(skill => (
                  <Badge 
                    key={skill}
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Badge variant="outline" className="cursor-pointer">+ More</Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>More Skills</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {commonSkills.slice(10).map(skill => (
                        <DropdownMenuItem key={skill} onClick={() => toggleSkill(skill)}>
                          {skill}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="City, state, or country" 
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 font-medium">Improve your job matches</p>
                <p className="text-xs text-amber-700">
                  Complete your profile for better job recommendations from our AI agent.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleSavePreferences} 
                disabled={saving}
                className="gap-2"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Preferences
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default JobPreferencesForm;
