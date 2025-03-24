
import { useForm } from "react-hook-form";
import { CheckCircle2, RefreshCw, Briefcase, Star, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { ImprovementItem } from "..";

interface JobDetailsPanelProps {
  matchScore: number;
  optimizing: boolean;
  improvements: ImprovementItem[];
  onOptimize: () => void;
}

const JobDetailsPanel = ({ 
  matchScore, 
  optimizing, 
  improvements, 
  onOptimize 
}: JobDetailsPanelProps) => {
  const form = useForm({
    defaultValues: {
      jobTitle: "",
      jobDescription: "",
      company: ""
    }
  });
  
  return (
    <div className="space-y-6">
      <Card className="neo-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Job Details
          </CardTitle>
          <CardDescription>
            Enter the job details to optimize your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. UX Designer" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Apple" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Paste the job description here..." 
                        className="min-h-[150px]" 
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="neo-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Match Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current Match</span>
              <Badge 
                variant="outline" 
                className={`${
                  matchScore >= 80 ? "bg-green-500/10 text-green-600 border-green-200" :
                  matchScore >= 60 ? "bg-amber-500/10 text-amber-600 border-amber-200" :
                  "bg-red-500/10 text-red-600 border-red-200"
                }`}
              >
                {matchScore}%
              </Badge>
            </div>
            <Progress value={matchScore} className="h-2" />
          </div>
          
          <Button 
            onClick={onOptimize} 
            className="w-full" 
            disabled={optimizing}
          >
            {optimizing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Optimize for This Job
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      <Card className="neo-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Improvement History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {improvements.map(improvement => (
              <div key={improvement.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{improvement.description}</span>
                    <Badge variant="outline">{improvement.score}%</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{improvement.date}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDetailsPanel;
