
import React, { useState, useEffect } from 'react';
import { useJobAgent } from '@/hooks/useJobAgent';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Robot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const JobAgentConfigDialog = () => {
  const { config, isActive, isLoading, updateConfig, toggleJobAgent } = useJobAgent();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [localConfig, setLocalConfig] = useState<any>({
    is_active: false,
    auto_apply_preferences: {
      skills_match_threshold: 60,
      location_preference: 'remote',
      apply_on_swipe_right: true,
      max_daily_applications: 10
    }
  });

  // Update local config when the actual config changes
  useEffect(() => {
    if (config) {
      setLocalConfig({
        is_active: isActive,
        auto_apply_preferences: config.auto_apply_preferences || {
          skills_match_threshold: 60,
          location_preference: 'remote',
          apply_on_swipe_right: true,
          max_daily_applications: 10
        }
      });
    }
  }, [config, isActive]);

  const handleUpdateConfig = async () => {
    await updateConfig(localConfig);
    setOpen(false);
    toast({
      title: "Configuration Updated",
      description: "Your job agent preferences have been saved"
    });
  };

  const handleToggleAgent = async () => {
    await toggleJobAgent();
  };

  // Update local config when form values change
  const handleConfigChange = (path: string, value: any) => {
    if (path.includes('.')) {
      // Handle nested properties (e.g., auto_apply_preferences.skills_match_threshold)
      const [parent, child] = path.split('.');
      setLocalConfig({
        ...localConfig,
        [parent]: {
          ...localConfig[parent],
          [child]: value
        }
      });
    } else {
      // Handle top-level properties
      setLocalConfig({
        ...localConfig,
        [path]: value
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Robot className="h-4 w-4" />
          Job Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Job Agent Configuration</DialogTitle>
          <DialogDescription>
            Configure your AI-powered job agent to help you find and apply to the perfect jobs
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="agent-status" className="text-base">
              Job Agent Status
            </Label>
            <Switch
              id="agent-status"
              checked={isActive}
              onCheckedChange={handleToggleAgent}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="font-medium">Application Preferences</h4>
            
            <div className="space-y-2">
              <Label>Skills Match Threshold ({localConfig.auto_apply_preferences.skills_match_threshold}%)</Label>
              <Slider
                value={[localConfig.auto_apply_preferences.skills_match_threshold]}
                onValueChange={(values) => handleConfigChange('auto_apply_preferences.skills_match_threshold', values[0])}
                min={0}
                max={100}
                step={5}
              />
              <p className="text-xs text-muted-foreground">
                Only auto-apply to jobs matching this percentage of your skills
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-preference">Location Preference</Label>
              <Input
                id="location-preference"
                value={localConfig.auto_apply_preferences.location_preference}
                onChange={(e) => handleConfigChange('auto_apply_preferences.location_preference', e.target.value)}
                placeholder="Remote, City name, or 'any'"
              />
              <p className="text-xs text-muted-foreground">
                Only auto-apply to jobs in this location. Use "any" for all locations.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-applications">Max Daily Applications</Label>
              <Input
                id="max-applications"
                type="number"
                value={localConfig.auto_apply_preferences.max_daily_applications}
                onChange={(e) => handleConfigChange('auto_apply_preferences.max_daily_applications', parseInt(e.target.value))}
                min={1}
                max={50}
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of automatic applications per day
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="apply-on-swipe"
                checked={localConfig.auto_apply_preferences.apply_on_swipe_right}
                onCheckedChange={(checked) => handleConfigChange('auto_apply_preferences.apply_on_swipe_right', checked)}
              />
              <Label htmlFor="apply-on-swipe">Auto-apply on swipe right</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleUpdateConfig}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobAgentConfigDialog;
