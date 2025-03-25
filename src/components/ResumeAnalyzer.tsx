
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, Upload, CheckCircle, AlertCircle, Sparkles, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ResumeAnalyzerProps {
  className?: string;
}

const ResumeAnalyzer = ({ className }: ResumeAnalyzerProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [activeTab, setActiveTab] = useState("resume");
  const [aiModel, setAiModel] = useState("gpt4");
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [optimizedContent, setOptimizedContent] = useState("");
  const [result, setResult] = useState<{
    score: number;
    strengths: string[];
    improvements: string[];
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setOptimizedContent("");
    }
  };

  const handleAnalyze = () => {
    if (!file) return;
    
    setAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      setResult({
        score: 78,
        strengths: [
          "Strong technical skills section",
          "Clear work experience formatting",
          "Good keyword optimization"
        ],
        improvements: [
          "Add more quantifiable achievements",
          "Improve job title alignment with target positions",
          "Consider adding a summary section"
        ]
      });
      setAnalyzing(false);
    }, 2000);
  };

  const handleOptimize = () => {
    if (!file) return;
    
    if (!jobDescription.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a job description for better optimization.",
        variant: "destructive"
      });
      return;
    }
    
    setOptimizing(true);
    
    // Simulated AI optimization process
    setTimeout(() => {
      // In a real implementation, this would call an API endpoint that interfaces with the selected AI model
      
      let optimizedText = "";
      if (activeTab === "resume") {
        optimizedText = `JOHN DOE
UX/UI Designer
john.doe@email.com | (123) 456-7890 | Portfolio: johndoe.design

PROFESSIONAL SUMMARY
Results-driven UX/UI Designer with 5+ years of experience creating intuitive digital experiences that boost user engagement and satisfaction. Proven track record of redesigning applications that meet business goals while enhancing user experience metrics.

EXPERIENCE
Senior UX Designer | ABC Design Studio | 2019 - Present
• Led the redesign of a financial app resulting in 35% increase in user engagement and 28% reduction in task completion time
• Conducted user interviews and usability tests with over 200 participants, translating insights into actionable design improvements
• Collaborated with cross-functional teams to implement scalable design systems that reduced development time by 20%
• Mentored junior designers and conducted weekly design thinking workshops, increasing team efficiency by 15%

UX/UI Designer | XYZ Interactive | 2017 - 2019
• Designed responsive interfaces for web and mobile platforms across 10+ client projects
• Created wireframes, mockups, and interactive prototypes resulting in 90% client approval rate
• Optimized user flows reducing task completion time by 28% and increasing conversion rates by 15%
• Implemented data-driven design decisions based on A/B testing results and analytics

EDUCATION
Master of Design, User Experience | Design University | 2017
Bachelor of Arts, Graphic Design | Creative Institute | 2015

SKILLS
• User Research & Testing
• Wireframing & Prototyping
• Accessibility Compliance (WCAG)
• Design Systems
• Figma, Adobe XD, Sketch
• Agile & Design Thinking
• HTML/CSS, Basic JavaScript
`;
      } else if (activeTab === "coverLetter") {
        optimizedText = `Dear Hiring Manager,

I am writing to express my interest in the UX/UI Designer position at ${companyName || "your company"}, as advertised on your careers page. With over 5 years of experience creating user-centered digital experiences and a proven track record of improving engagement metrics, I am confident in my ability to contribute to your team's success.

In my current role as Senior UX Designer at ABC Design Studio, I led the complete redesign of a financial application that resulted in a 35% increase in user engagement and a 28% reduction in task completion time. This project required close collaboration with product managers, developers, and stakeholders to ensure the solution met both user needs and business objectives.

What particularly excites me about the opportunity at ${companyName || "your company"} is your focus on ${jobDescription.includes("innovation") ? "innovation and pushing the boundaries of digital experiences" : "creating user-centered products that solve real problems"}. I admire your recent ${jobDescription.includes("mobile") ? "mobile application launches" : "product developments"} and would be thrilled to contribute my expertise in ${jobDescription.includes("research") ? "user research and testing" : "interaction design and prototyping"} to help ${companyName || "your company"} continue to deliver exceptional user experiences.

My approach to design combines analytical thinking with creative problem-solving. I believe in making data-informed decisions while maintaining empathy for users throughout the design process. This philosophy has allowed me to consistently deliver solutions that not only look great but also perform exceptionally well against key metrics.

I have attached my resume for your review, and you can find examples of my work at johndoe.design. I would welcome the opportunity to discuss how my experience and skills align with your team's needs.

Thank you for your consideration. I look forward to the possibility of contributing to ${companyName || "your company"}'s continued success.

Sincerely,
John Doe`;
      }
      
      setOptimizedContent(optimizedText);
      setOptimizing(false);
      
      toast({
        title: "Optimization Complete",
        description: `Your ${activeTab} has been optimized based on the job requirements using ${getAIModelName(aiModel)}.`,
      });
      
    }, 3000);
  };

  const getAIModelName = (model: string) => {
    switch (model) {
      case "gpt4": return "GPT-4.0";
      case "llama3": return "Llama 3";
      case "grok": return "Grok";
      default: return "AI";
    }
  };

  return (
    <Card className={cn("neo-card", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          AI-Powered Document Optimizer
        </CardTitle>
        <CardDescription>
          Analyze and optimize your resume or cover letter using AI
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!file && !result && (
          <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="font-medium text-foreground">Upload your document</h3>
              <p className="text-sm text-muted-foreground">
                PDF, DOCX or TXT up to 5MB
              </p>
              <label className="mt-4">
                <Button className="gap-2">
                  <Upload className="h-4 w-4" />
                  Select File
                </Button>
                <input
                  type="file"
                  className="sr-only"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        )}

        {file && !analyzing && !result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFile(null)}
                className="text-muted-foreground"
              >
                Remove
              </Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="resume">Resume</TabsTrigger>
                <TabsTrigger value="coverLetter">Cover Letter</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Google, Microsoft"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Description</label>
                <Textarea
                  placeholder="Paste the job description here for better optimization..."
                  className="resize-none min-h-[100px]"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">AI Model</label>
                <Select value={aiModel} onValueChange={setAiModel}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt4">GPT-4.0</SelectItem>
                    <SelectItem value="llama3">Llama 3</SelectItem>
                    <SelectItem value="grok">Grok</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Different models may excel at different types of optimizations
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button className="flex-1" onClick={handleAnalyze}>
                Analyze Document
              </Button>
              <Button className="flex-1" variant="secondary" onClick={handleOptimize}>
                <Sparkles className="h-4 w-4 mr-2" />
                Optimize with AI
              </Button>
            </div>
          </div>
        )}

        {analyzing && (
          <div className="space-y-4 py-4">
            <p className="text-center font-medium">Analyzing your document...</p>
            <Progress value={45} className="w-full" />
            <p className="text-sm text-center text-muted-foreground">
              Checking for ATS compatibility and optimization opportunities
            </p>
          </div>
        )}
        
        {optimizing && (
          <div className="space-y-4 py-4">
            <p className="text-center font-medium">Optimizing with {getAIModelName(aiModel)}...</p>
            <Progress value={65} className="w-full" />
            <p className="text-sm text-center text-muted-foreground">
              Enhancing your {activeTab} based on job requirements and industry standards
            </p>
          </div>
        )}

        {result && !optimizedContent && (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
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
                    stroke={result.score > 80 ? "#10b981" : result.score > 60 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="10"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * result.score) / 100}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{result.score}</span>
                </div>
              </div>
              <p className="mt-2 font-medium text-lg">ATS Score</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                Strengths
              </h4>
              <ul className="space-y-1">
                {result.strengths.map((strength, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-1 text-amber-600">
                <AlertCircle className="h-4 w-4" />
                Improvement Areas
              </h4>
              <ul className="space-y-1">
                {result.improvements.map((improvement, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleOptimize}
              disabled={optimizing}
            >
              {optimizing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Optimize with {getAIModelName(aiModel)}
                </>
              )}
            </Button>
          </div>
        )}
        
        {optimizedContent && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Optimized {activeTab === "resume" ? "Resume" : "Cover Letter"}</h3>
              <div className="flex items-center gap-2">
                <div className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {getAIModelName(aiModel)}
                </div>
              </div>
            </div>
            
            <div className="border border-border rounded-lg p-4 bg-muted/30">
              <pre className="whitespace-pre-wrap text-sm font-mono overflow-y-auto max-h-[400px]">
                {optimizedContent}
              </pre>
            </div>
            
            <p className="text-sm text-muted-foreground">
              This AI-optimized content is tailored to match the job requirements while highlighting your strengths.
            </p>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setOptimizedContent("");
                  setFile(null);
                  setResult(null);
                }}
              >
                Start Over
              </Button>
              <Button 
                className="flex-1"
                onClick={() => {
                  // Simulate download or copy to clipboard
                  navigator.clipboard.writeText(optimizedContent);
                  toast({
                    title: "Copied to clipboard",
                    description: `Your optimized ${activeTab} has been copied to clipboard.`
                  });
                }}
              >
                Copy to Clipboard
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      {result && !optimizedContent && (
        <CardFooter className="flex justify-between border-t p-4">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => {
              setFile(null);
              setResult(null);
            }}
          >
            <Upload className="h-4 w-4" />
            New Document
          </Button>
          <Button className="gap-2" onClick={handleOptimize}>
            <Sparkles className="h-4 w-4" />
            Optimize with AI
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ResumeAnalyzer;
