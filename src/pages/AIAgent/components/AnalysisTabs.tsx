
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, RefreshCw, Settings, LinkedinIcon, Target, 
  CheckCircle2, AlertTriangle, XCircle
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnalysisTabsProps } from "./AnalysisTabsProps";

export default function AnalysisTabs({
  activeDocType,
  setActiveDocType,
  matchScore,
  optimizing,
  onOptimize,
  llmModel,
  useLinkedIn = false
}: AnalysisTabsProps) {
  return (
    <Card className="p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <Tabs defaultValue={activeDocType} value={activeDocType} onValueChange={setActiveDocType}>
          <TabsList>
            <TabsTrigger value="resume" className="data-[state=active]:bg-secondary">
              <FileText className="mr-2 h-4 w-4" />
              Resume
            </TabsTrigger>
            <TabsTrigger value="job_description" className="data-[state=active]:bg-secondary">
              <FileText className="mr-2 h-4 w-4" />
              Job Description
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center space-x-2">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-semibold">{matchScore}%</span>
            </div>
            <svg className="h-10 w-10" viewBox="0 0 36 36">
              <path
                className="stroke-current text-primary opacity-25"
                fill="none"
                strokeWidth="3"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="stroke-current text-primary"
                fill="none"
                strokeWidth="3"
                strokeDasharray={`${matchScore}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>
          <span className="text-sm text-muted-foreground">Match Score</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onOptimize}
          disabled={optimizing}
        >
          {optimizing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <Target className="mr-2 h-4 w-4" />
              Optimize
            </>
          )}
        </Button>

        <div className="flex items-center space-x-2">
          <Settings className="mr-2 h-4 w-4" />
          <Select defaultValue={llmModel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-3.5-turbo">GPT 3.5 Turbo</SelectItem>
              <SelectItem value="gpt-4">GPT 4</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {useLinkedIn ? (
            <CheckCircle2 className="text-green-500 h-5 w-5" />
          ) : (
            <AlertTriangle className="text-yellow-500 h-5 w-5" />
          )}
          <p className="text-sm">
            {useLinkedIn
              ? "Using LinkedIn data to enhance matching."
              : "LinkedIn data not being used."}
          </p>
        </div>
        <div className="space-x-2 flex items-center">
          <Label htmlFor="linkedin">Use LinkedIn</Label>
          <Switch id="linkedin" disabled={!useLinkedIn} />
        </div>
      </div>
    </Card>
  );
}
