
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useJobAgent } from '@/hooks/useJobAgent';
import { Bot, Settings, Zap, MapPin, BriefcaseIcon, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface JobAgentConfigProps {
  onClose?: () => void;
}

const JobAgentConfig = ({ onClose }: JobAgentConfigProps) => {
  const { isActive, isLoading, config, toggleJobAgent, updateConfig } = useJobAgent();
  
  const [skillsMatchThreshold, setSkillsMatchThreshold] = useState(60);
  const [locationPreference, setLocationPreference] = useState('remote');
  const [applyOnSwipeRight, setApplyOnSwipeRight] = useState(true);
  const [maxDailyApplications, setMaxDailyApplications] = useState(10);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (config && config.auto_apply_preferences) {
      const prefs = config.auto_apply_preferences;
      setSkillsMatchThreshold(prefs.skills_match_threshold || 60);
      setLocationPreference(prefs.location_preference || 'remote');
      setApplyOnSwipeRight(prefs.apply_on_swipe_right !== false);
      setMaxDailyApplications(prefs.max_daily_applications || 10);
    }
  }, [config]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateConfig({
        is_active: isActive,
        auto_apply_preferences: {
          skills_match_threshold: skillsMatchThreshold,
          location_preference: locationPreference,
          apply_on_swipe_right: applyOnSwipeRight,
          max_daily_applications: maxDailyApplications
        }
      });
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: 'Save Failed',
        description: 'There was an error saving your configuration',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch 
            id="agent-active"
            checked={isActive}
            onCheckedChange={toggleJobAgent}
            disabled={isLoading}
          />
          <Label htmlFor="agent-active" className="text-base font-medium">
            {isActive ? 'Agent Active' : 'Agent Inactive'}
          </Label>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {isActive ? 'Enabled' : 'Disabled'}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Skills Match Threshold
          </Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[skillsMatchThreshold]}
              onValueChange={(values) => setSkillsMatchThreshold(values[0])}
              min={0}
              max={100}
              step={5}
              className="flex-1"
            />
            <span className="text-sm font-medium bg-secondary px-2 py-1 rounded w-12 text-center">
              {skillsMatchThreshold}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Minimum skills match percentage required for auto-applying
          </p>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location Preference
          </Label>
          <Select
            value={locationPreference}
            onValueChange={setLocationPreference}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remote">Remote Only</SelectItem>
              <SelectItem value="hybrid">Hybrid Preferred</SelectItem>
              <SelectItem value="onsite">Onsite Acceptable</SelectItem>
              <SelectItem value="any">Any Location</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <BriefcaseIcon className="h-4 w-4" />
            Apply on Swipe Right
          </Label>
          <div className="flex items-center space-x-2">
            <Switch 
              id="auto-apply"
              checked={applyOnSwipeRight}
              onCheckedChange={setApplyOnSwipeRight}
            />
            <Label htmlFor="auto-apply">
              {applyOnSwipeRight ? 'Automatically apply when you swipe right' : 'Just save jobs when you swipe right'}
            </Label>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Maximum Daily Applications
          </Label>
          <Input
            type="number"
            value={maxDailyApplications}
            onChange={(e) => setMaxDailyApplications(parseInt(e.target.value) || 10)}
            min={1}
            max={50}
          />
          <p className="text-xs text-muted-foreground">
            Limit how many jobs the agent can apply to per day
          </p>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        {onClose && (
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSave} disabled={isSaving || isLoading}>
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </Button>
      </div>
    </div>
  );
};

export default JobAgentConfig;
