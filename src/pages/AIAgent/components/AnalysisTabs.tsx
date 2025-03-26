
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, RefreshCw } from "lucide-react";

interface AnalysisTabsProps {
  activeDocType: string;
  setActiveDocType: (docType: string) => void;
  matchScore: number;
  optimizing: boolean;
  onOptimize: () => void;
  llmModel: string;
}

const getAIModelName = (model: string) => {
  switch (model) {
    case "gpt4": return "GPT-4o";
    case "gpt3": return "GPT-3.5 Turbo";
    case "claude": return "Claude 3";
    case "llama3": return "Llama 3";
    case "grok": return "Grok";
    case "gemini": return "Gemini";
    default: return "AI";
  }
};

const AnalysisTabs = ({ activeDocType, setActiveDocType, matchScore, optimizing, onOptimize, llmModel }: AnalysisTabsProps) => {
  const getDocumentTitle = (docType: string) => {
    switch(docType) {
      case "resume": return "Resume";
      case "coverLetter": return "Cover Letter";
      case "sop": return "Statement of Purpose";
      case "linkedInProfile": return "LinkedIn Profile";
      case "portfolioDescription": return "Portfolio Description";
      default: return "Document";
    }
  };

  return (
    <Tabs 
      defaultValue="resume" 
      value={activeDocType} 
      onValueChange={setActiveDocType}
      className="w-full"
    >
      <TabsList className="inline-flex h-9 w-full items-center justify-start rounded-md bg-muted p-1 text-muted-foreground overflow-x-auto">
        <TabsTrigger value="resume" className="h-8 whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-medium">
          Resume Analysis
        </TabsTrigger>
        <TabsTrigger value="coverLetter" className="h-8 whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-medium">
          Cover Letter Analysis
        </TabsTrigger>
        <TabsTrigger value="sop" className="h-8 whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-medium">
          SOP Analysis
        </TabsTrigger>
        <TabsTrigger value="linkedInProfile" className="h-8 whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-medium">
          LinkedIn Analysis
        </TabsTrigger>
        <TabsTrigger value="portfolioDescription" className="h-8 whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-medium">
          Portfolio Analysis
        </TabsTrigger>
      </TabsList>
      
      {/* Analysis Content Tabs */}
      {["resume", "coverLetter", "sop", "linkedInProfile", "portfolioDescription"].map((docType) => (
        <TabsContent key={docType} value={docType} className="mt-4">
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">{getDocumentTitle(docType)} Analysis</h3>
                <div className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1 flex items-center gap-1">
                  Using {getAIModelName(llmModel)}
                </div>
              </div>
              <Button 
                onClick={onOptimize} 
                variant="outline" 
                size="sm"
                disabled={optimizing}
              >
                {optimizing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Match Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <div className="relative h-32 w-32">
                      <svg viewBox="0 0 100 100" className="h-full w-full">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="10"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={matchScore > 80 ? "#10b981" : matchScore > 60 ? "#f59e0b" : "#ef4444"}
                          strokeWidth="10"
                          strokeDasharray="283"
                          strokeDashoffset={283 - (283 * matchScore) / 100}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">{matchScore}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Key Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Strengths</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li className="text-sm">Strong technical skills section</li>
                      <li className="text-sm">Clear work experience formatting</li>
                      <li className="text-sm">Good keyword optimization</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Areas for Improvement</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li className="text-sm">Add more quantifiable achievements</li>
                      <li className="text-sm">Improve job title alignment with target positions</li>
                      <li className="text-sm">Consider adding a summary section</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Detailed Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Keyword Match</h4>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Your {getDocumentTitle(docType).toLowerCase()} includes 75% of key terms from the job description.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Readability</h4>
                  <Progress value={82} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Your document has good readability for both human reviewers and ATS systems.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Formatting</h4>
                  <Progress value={90} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Clean, well-structured format that will display correctly in most ATS systems.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Generate Optimization with {getAIModelName(llmModel)}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default AnalysisTabs;
