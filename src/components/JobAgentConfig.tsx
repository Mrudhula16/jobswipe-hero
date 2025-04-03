
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useJobAgent } from "@/hooks/useJobAgent";
import { Settings, Server, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

interface JobAgentConfigProps {
  onClose?: () => void;
}

const JobAgentConfig = ({ onClose }: JobAgentConfigProps) => {
  const { isActive, isLoading, toggleJobAgent, setMLParameters } = useJobAgent();
  const { toast } = useToast();
  const [endpointUrl, setEndpointUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [enableRealTime, setEnableRealTime] = useState(true);
  const [enableActions, setEnableActions] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await setMLParameters({
        model_type: "custom",
        endpoint_url: endpointUrl,
        api_key: apiKey, // Note: In a real app, securely handle API keys
        preferences: {
          enable_real_time: enableRealTime,
          enable_auto_actions: enableActions
        }
      });
      
      if (onClose) onClose();
    } catch (error) {
      console.error("Error saving ML configuration:", error);
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
          <Database className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">ML Model Configuration</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Configure your custom ML model integration for the Job Agent.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
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
