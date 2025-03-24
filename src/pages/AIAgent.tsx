
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Edit, Briefcase, CheckCircle2, Star, ArrowRight, RefreshCw, Download } from "lucide-react";
import { motion } from "framer-motion";

const AIAgent = () => {
  const [activeTab, setActiveTab] = useState("resume");
  const [optimizing, setOptimizing] = useState(false);
  const [matchScore, setMatchScore] = useState(62);
  const [improvements, setImprovements] = useState<{id: number, date: string, score: number, description: string}[]>([
    {
      id: 1,
      date: "2 days ago",
      score: 62,
      description: "Added relevant keywords for UX Designer role"
    },
    {
      id: 2, 
      date: "1 week ago",
      score: 48,
      description: "Restructured work experience to highlight design achievements"
    }
  ]);

  const form = useForm({
    defaultValues: {
      jobTitle: "",
      jobDescription: "",
      company: ""
    }
  });
  
  // Sample content for the resume and cover letter
  const resumeContent = `JOHN DOE
UX/UI Designer
john.doe@email.com | (123) 456-7890 | Portfolio: johndoe.design

EXPERIENCE
Senior UX Designer | ABC Design Studio | 2019 - Present
• Led the redesign of a financial app resulting in 35% increase in user engagement
• Conducted user interviews and usability tests with over 200 participants
• Collaborated with cross-functional teams to implement design systems

UX/UI Designer | XYZ Interactive | 2017 - 2019
• Designed responsive interfaces for web and mobile platforms
• Created wireframes, mockups, and interactive prototypes
• Optimized user flows resulting in 28% reduction in task completion time

EDUCATION
Master of Design, User Experience | Design University | 2017
Bachelor of Arts, Graphic Design | Creative Institute | 2015

SKILLS
• User Research
• Wireframing & Prototyping
• Usability Testing
• Figma, Adobe XD, Sketch
• Design Systems
`;

  const coverLetterContent = `Dear Hiring Manager,

I am writing to express my interest in the Senior UX Designer position at Apple, as advertised on LinkedIn. With over 5 years of experience in UX/UI design and a proven track record of creating user-centered digital experiences, I am confident in my ability to make a significant contribution to your team.

In my current role as Senior UX Designer at ABC Design Studio, I led the redesign of a financial application that resulted in a 35% increase in user engagement and a 28% reduction in task completion time. I have extensive experience conducting user research, creating wireframes and prototypes, and collaborating with cross-functional teams to implement design solutions.

I am particularly drawn to Apple's commitment to intuitive and elegant design that puts the user first. My approach to design aligns perfectly with Apple's philosophy of creating products that are both beautiful and functional. I am excited about the opportunity to bring my skills and passion for user experience to a company that has consistently set the standard for design excellence.

I have attached my resume for your review, and you can find examples of my work at johndoe.design. I would welcome the opportunity to discuss how my experience and skills would benefit your team.

Thank you for your consideration.

Sincerely,
John Doe`;
  
  const handleOptimize = () => {
    setOptimizing(true);
    
    // Simulate optimization process
    setTimeout(() => {
      setOptimizing(false);
      setMatchScore(prevScore => {
        const newScore = Math.min(100, prevScore + Math.floor(Math.random() * 15) + 5);
        
        // Add new improvement to history
        const newImprovement = {
          id: improvements.length + 1,
          date: "Just now",
          score: newScore,
          description: newScore > 80 
            ? "Tailored achievements to match job requirements" 
            : "Enhanced skills section with job-specific keywords"
        };
        
        setImprovements([newImprovement, ...improvements]);
        
        return newScore;
      });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 pt-8 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Career Assistant</h1>
          <p className="text-muted-foreground">Optimize your resume and cover letters with AI to match your dream jobs</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Details and Controls */}
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
                  onClick={handleOptimize} 
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
          
          {/* Right Column - Content Editor */}
          <div className="lg:col-span-2">
            <Card className="neo-card">
              <CardHeader className="pb-2">
                <Tabs defaultValue="resume" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="resume">Resume</TabsTrigger>
                    <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="pt-4">
                <TabsContent value="resume" className="mt-0">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">My Resume</h3>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Upload Resume</DialogTitle>
                            <DialogDescription>
                              Upload your resume in PDF or DOCX format.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-sm mb-2">Drag and drop your resume here</p>
                            <p className="text-xs text-muted-foreground mb-4">Supports PDF, DOCX (max 5MB)</p>
                            <Button size="sm">Select File</Button>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button>Upload</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative border border-border rounded-lg overflow-hidden">
                    <div className="absolute right-2 top-2">
                      <Button size="icon" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <pre className="p-4 whitespace-pre-wrap text-sm font-mono">
                      {resumeContent}
                    </pre>
                  </div>
                </TabsContent>
                
                <TabsContent value="cover-letter" className="mt-0">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">My Cover Letter</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Generate New
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative border border-border rounded-lg overflow-hidden">
                    <div className="absolute right-2 top-2">
                      <Button size="icon" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <pre className="p-4 whitespace-pre-wrap text-sm">
                      {coverLetterContent}
                    </pre>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIAgent;
