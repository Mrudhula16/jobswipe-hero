
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useJobAgent } from "@/hooks/useJobAgent";
import { Settings, Server, Database, File, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface JobAgentConfigProps {
  onClose?: () => void;
}

interface Resume {
  id: string;
  title: string;
}

const JobAgentConfig = ({ onClose }: JobAgentConfigProps) => {
  const { isActive, isLoading, toggleJobAgent, setMLParameters } = useJobAgent();
  const { toast } = useToast();
  const { user } = useAuth();
  const [endpointUrl, setEndpointUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [enableRealTime, setEnableRealTime] = useState(true);
  const [enableActions, setEnableActions] = useState(true);
  const [applyOnSwipeRight, setApplyOnSwipeRight] = useState(true);
  const [skillsMatchThreshold, setSkillsMatchThreshold] = useState(60);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [locationPreference, setLocationPreference] = useState("remote");
  const [maxDailyApplications, setMaxDailyApplications] = useState(10);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (user) {
      fetchResumes();
      fetchCurrentConfig();
    }
  }, [user]);

  const fetchResumes = async () => {
    try {
      setLoadingResumes(true);
      const { data, error } = await supabase
        .from('resumes')
        .select('id, title')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      toast({
        title: "Error",
        description: "Failed to load your resumes.",
        variant: "destructive"
      });
    } finally {
      setLoadingResumes(false);
    }
  };

  const fetchCurrentConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('job_agent_configs')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"

      if (data) {
        // Set form values from saved configuration
        setSelectedResumeId(data.resume_id || "");
        
        if (data.auto_apply_preferences) {
          const prefs = data.auto_apply_preferences;
          setApplyOnSwipeRight(prefs.apply_on_swipe_right || true);
          setSkillsMatchThreshold(prefs.skills_match_threshold || 60);
          setLocationPreference(prefs.location_preference || "remote");
          setMaxDailyApplications(prefs.max_daily_applications || 10);
        }
        
        if (data.ml_parameters) {
          setEndpointUrl(data.ml_parameters.endpoint_url || "");
          setApiKey(data.ml_parameters.api_key || "");
          setEnableRealTime(data.ml_parameters.preferences?.enable_real_time !== false);
          setEnableActions(data.ml_parameters.preferences?.enable_auto_actions !== false);
        }
      }
    } catch (error) {
      console.error("Error fetching agent config:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // First update the ML parameters
      await setMLParameters({
        model_type: "custom",
        endpoint_url: endpointUrl,
        api_key: apiKey,
        preferences: {
          enable_real_time: enableRealTime,
          enable_auto_actions: enableActions
        }
      });
      
      // Then update the agent config with resume and preferences
      const { error } = await supabase
        .from('job_agent_configs')
        .upsert({
          user_id: user?.id,
          resume_id: selectedResumeId,
          auto_apply_preferences: {
            apply_on_swipe_right: applyOnSwipeRight,
            skills_match_threshold: skillsMatchThreshold,
            location_preference: locationPreference,
            max_daily_applications: maxDailyApplications
          }
        });
      
      if (error) throw error;
      
      toast({
        title: "Configuration Saved",
        description: "Your job agent settings have been updated successfully.",
      });
      
      if (onClose) onClose();
    } catch (error) {
      console.error("Error saving ML configuration:", error);
      toast({
        title: "Error",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Job Agent Status</h3>
          </div>
          <Button
            onClick={toggleJobAgent}
            variant={isActive ? "destructive" : "default"}
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : isActive ? "Deactivate" : "Activate"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {isActive 
            ? "Your Job Agent is active and will automatically apply to matching jobs."
            : "Activate the Job Agent to automatically apply to jobs that match your profile."}
        </p>
      </div>

      <div className="space-y-2 pt-4">
        <div className="flex items-center gap-2">
          <File className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Resume Selection</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Select which resume the AI agent should use when applying to jobs.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="space-y-2">
          <Label htmlFor="resume-select">Select Resume</Label>
          <Select
            value={selectedResumeId}
            onValueChange={setSelectedResumeId}
            disabled={loadingResumes || resumes.length === 0}
          >
            <SelectTrigger id="resume-select">
              <SelectValue placeholder="Select a resume" />
            </SelectTrigger>
            <SelectContent>
              {resumes.map((resume) => (
                <SelectItem key={resume.id} value={resume.id}>
                  {resume.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {resumes.length === 0 && (
            <p className="text-xs text-amber-500">
              You need to create at least one resume before activating the job agent.
            </p>
          )}
        </div>

        <div className="space-y-2 pt-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Application Preferences</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure how the AI agent should apply to jobs on your behalf.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="swipe-right">Apply on Swipe Right</Label>
              <p className="text-xs text-muted-foreground">
                Automatically apply when you swipe right on a job
              </p>
            </div>
            <Switch
              id="swipe-right"
              checked={applyOnSwipeRight}
              onCheckedChange={setApplyOnSwipeRight}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="skills-threshold">Skills Match Threshold</Label>
              <span className="text-sm">{skillsMatchThreshold}%</span>
            </div>
            <Slider
              id="skills-threshold"
              min={30}
              max={100}
              step={5}
              value={[skillsMatchThreshold]}
              onValueChange={(value) => setSkillsMatchThreshold(value[0])}
            />
            <p className="text-xs text-muted-foreground">
              Minimum skills match percentage required for automatic application
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location-pref">Location Preference</Label>
            <Select value={locationPreference} onValueChange={setLocationPreference}>
              <SelectTrigger id="location-pref">
                <SelectValue placeholder="Select location preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote Only</SelectItem>
                <SelectItem value="hybrid">Hybrid Preferred</SelectItem>
                <SelectItem value="onsite">On-site Acceptable</SelectItem>
                <SelectItem value="any">Any Location</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="max-applications">Max Daily Applications</Label>
              <span className="text-sm">{maxDailyApplications}</span>
            </div>
            <Slider
              id="max-applications"
              min={1}
              max={50}
              step={1}
              value={[maxDailyApplications]}
              onValueChange={(value) => setMaxDailyApplications(value[0])}
            />
            <p className="text-xs text-muted-foreground">
              Maximum number of applications the agent will submit per day
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">ML Model Configuration</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure your custom ML model integration for the Job Agent.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endpoint-url">ML Model Endpoint URL</Label>
          <Input
            id="endpoint-url"
            placeholder="https://your-ml-model-endpoint.com/api"
            value={endpointUrl}
            onChange={(e) => setEndpointUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            The endpoint where your ML model is hosted.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="api-key">API Key (Optional)</Label>
          <Input
            id="api-key"
            type="password"
            placeholder="Your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            If your ML model requires authentication, provide the API key.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-medium">Preferences</h4>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="real-time">Real-time Processing</Label>
              <p className="text-xs text-muted-foreground">
                Process jobs as soon as they are posted
              </p>
            </div>
            <Switch
              id="real-time"
              checked={enableRealTime}
              onCheckedChange={setEnableRealTime}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-actions">Automatic Actions</Label>
              <p className="text-xs text-muted-foreground">
                Allow the agent to apply to jobs automatically
              </p>
            </div>
            <Switch
              id="auto-actions"
              checked={enableActions}
              onCheckedChange={setEnableActions}
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button type="submit">Save Configuration</Button>
        </DialogFooter>
      </form>
    </div>
  );
};

export const JobAgentConfigDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Settings className="h-4 w-4 mr-2" />
          Configure Job Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Job Agent Configuration</DialogTitle>
          <DialogDescription>
            Configure your AI-powered job agent to automatically find and apply to matching jobs.
          </DialogDescription>
        </DialogHeader>
        <JobAgentConfig />
      </DialogContent>
    </Dialog>
  );
};

export default JobAgentConfig;
