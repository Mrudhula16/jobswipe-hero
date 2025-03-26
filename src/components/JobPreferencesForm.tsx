
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, AlertCircle, Save, Loader2 } from "lucide-react";
import { getUserJobPreferences, saveJobPreferences, JobPreferences } from "@/services/jobPreferencesService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

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
  
  // Load job preferences from database
  useEffect(() => {
    const fetchJobPreferences = async () => {
      if (user) {
        setLoading(true);
        try {
          const preferences = await getUserJobPreferences();
          if (preferences) {
            setJobPreferences(preferences);
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
    } finally {
      setSaving(false);
    }
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
              <Label>Desired Salary Range</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  placeholder="Minimum (USD)" 
                  value={jobPreferences.min_salary || ""} 
                  onChange={(e) => handlePreferenceChange('min_salary', e.target.value ? Number(e.target.value) : undefined)}
                  type="number"
                />
                <Input 
                  placeholder="Maximum (USD)" 
                  value={jobPreferences.max_salary || ""} 
                  onChange={(e) => handlePreferenceChange('max_salary', e.target.value ? Number(e.target.value) : undefined)}
                  type="number"
                />
              </div>
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
                  Technology
                </Button>
                <Button 
                  variant={jobPreferences.industries?.includes('design') ? "secondary" : "outline"} 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => toggleArrayPreference('industries', 'design')}
                >
                  Design
                </Button>
                <Button 
                  variant={jobPreferences.industries?.includes('finance') ? "secondary" : "outline"} 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => toggleArrayPreference('industries', 'finance')}
                >
                  Finance
                </Button>
                <Button 
                  variant={jobPreferences.industries?.includes('healthcare') ? "secondary" : "outline"} 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => toggleArrayPreference('industries', 'healthcare')}
                >
                  Healthcare
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">+ Add</Button>
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
