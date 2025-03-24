
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
import { Upload, FileText, Edit, Briefcase, CheckCircle2, Star, ArrowRight, RefreshCw, Download, FileSpreadsheet, FileCode, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const AIAgent = () => {
  const [activeTab, setActiveTab] = useState("resume");
  const [activeDocType, setActiveDocType] = useState("resume");
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
  
  // Sample content for the different document types
  const documentContent = {
    resume: `JOHN DOE
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
`,

    coverLetter: `Dear Hiring Manager,

I am writing to express my interest in the Senior UX Designer position at Apple, as advertised on LinkedIn. With over 5 years of experience in UX/UI design and a proven track record of creating user-centered digital experiences, I am confident in my ability to make a significant contribution to your team.

In my current role as Senior UX Designer at ABC Design Studio, I led the redesign of a financial application that resulted in a 35% increase in user engagement and a 28% reduction in task completion time. I have extensive experience conducting user research, creating wireframes and prototypes, and collaborating with cross-functional teams to implement design solutions.

I am particularly drawn to Apple's commitment to intuitive and elegant design that puts the user first. My approach to design aligns perfectly with Apple's philosophy of creating products that are both beautiful and functional. I am excited about the opportunity to bring my skills and passion for user experience to a company that has consistently set the standard for design excellence.

I have attached my resume for your review, and you can find examples of my work at johndoe.design. I would welcome the opportunity to discuss how my experience and skills would benefit your team.

Thank you for your consideration.

Sincerely,
John Doe`,

    sop: `Statement of Purpose - John Doe

As I apply to the Master of Human-Computer Interaction program at Carnegie Mellon University, I am driven by a passion for creating digital experiences that truly serve human needs and enhance our relationship with technology.

My journey in user experience design began during my undergraduate studies in Graphic Design, where I discovered the power of purposeful design to solve real-world problems. Through coursework and internships, I developed a strong foundation in visual communication and user-centered design principles. However, I soon realized that effective digital experiences require more than visual appeal—they demand a deep understanding of human psychology, behavior, and needs.

For the past five years, I have been working as a UX/UI designer, most recently as a Senior Designer at ABC Design Studio. In this role, I have led redesign projects for financial applications, healthcare portals, and e-commerce platforms. My proudest achievement has been the complete overhaul of a complex financial management application, which resulted in a 35% increase in user engagement and significant improvements in task completion metrics.

While my professional experience has been rewarding, I have identified areas where I need to deepen my knowledge to advance my career and make more meaningful contributions to the field. I am particularly interested in developing expertise in:
1. Research methodologies and quantitative analysis
2. Cognitive psychology as it relates to human-computer interaction
3. Emerging technologies such as AR/VR and voice interfaces

Carnegie Mellon's MHCI program stands out for its interdisciplinary approach and rigorous research focus. I am excited about the opportunity to work with faculty who are leaders in the field and to collaborate with peers from diverse backgrounds. The program's emphasis on both theoretical foundations and practical application aligns perfectly with my learning goals.

After completing the MHCI program, my goal is to work at the intersection of design and research, either at a technology company focused on creating innovative user experiences or at a design consultancy where I can apply my skills across various domains. Long-term, I aspire to contribute to the evolution of how humans interact with technology, particularly as we move toward more ambient and seamless experiences.

Thank you for considering my application. I look forward to the opportunity to join the Carnegie Mellon community and to grow both personally and professionally through this transformative educational experience.
`,

    linkedInProfile: `# John Doe
UX/UI Designer | Creating User-Centered Digital Experiences | Portfolio: johndoe.design

## About
Passionate UX/UI Designer with 5+ years of experience creating intuitive digital experiences for financial, healthcare, and e-commerce industries. Specialized in user research, interaction design, and usability testing. Committed to creating products that are both beautiful and functional.

## Experience
### Senior UX Designer
ABC Design Studio | 2019 - Present
- Led the redesign of a financial app resulting in 35% increase in user engagement
- Conducted user interviews and usability tests with over 200 participants
- Collaborated with cross-functional teams to implement design systems
- Mentored junior designers and facilitated design thinking workshops

### UX/UI Designer
XYZ Interactive | 2017 - 2019
- Designed responsive interfaces for web and mobile platforms
- Created wireframes, mockups, and interactive prototypes
- Optimized user flows resulting in 28% reduction in task completion time
- Participated in agile development processes

## Education
### Master of Design, User Experience
Design University | 2017

### Bachelor of Arts, Graphic Design
Creative Institute | 2015

## Skills
- User Research
- Wireframing & Prototyping
- Usability Testing
- Interaction Design
- Visual Design
- Design Systems
- Figma, Adobe XD, Sketch
- HTML/CSS basics

## Certifications
- Google UX Design Professional Certificate
- Nielsen Norman Group UX Certified
`,

    portfolioDescription: `# John Doe - UX/UI Designer Portfolio

## About Me
I'm a UX/UI Designer with 5+ years of experience creating intuitive and engaging digital experiences. I believe in design that solves real problems and creates meaningful connections between people and technology.

## My Design Process
I follow a user-centered design process that emphasizes thorough research, collaborative ideation, iterative design, and data-driven decision making. For each project, I:

1. **Understand**: Research users and context to define clear problems
2. **Explore**: Ideate multiple solutions and create concepts
3. **Create**: Develop wireframes, prototypes, and visual designs
4. **Validate**: Test with users and refine based on feedback
5. **Implement**: Work with developers to bring designs to life

## Featured Projects

### Financial App Redesign - ABC Bank
The challenge was to simplify a complex financial management application with poor user engagement metrics. I led a complete redesign that resulted in:
- 35% increase in user engagement
- 28% reduction in task completion time
- 40% decrease in support tickets

The process included competitive analysis, user interviews, card sorting, journey mapping, wireframing, prototyping, and multiple rounds of usability testing.

### Healthcare Portal - MedConnect
Designed an accessible patient portal for a healthcare provider serving 500,000+ patients. Key achievements:
- Created an inclusive design for users with diverse abilities
- Simplified appointment scheduling, reducing steps by 60%
- Developed a medication management system with clear visual indicators
- Implemented responsive design for seamless cross-device experience

### E-commerce Mobile App - ShopEasy
Redesigned the mobile shopping experience for a major retail client. Highlights:
- Streamlined checkout process reducing abandonment by 25%
- Designed an innovative product filtering system
- Created a cohesive visual design system for long-term consistency
- Implemented gesture-based interactions for intuitive navigation

## Skills & Tools
**Design Skills**: User Research, Information Architecture, Wireframing, Prototyping, Visual Design, Interaction Design, Usability Testing

**Tools**: Figma, Adobe XD, Sketch, InVision, Principle, Illustrator, Photoshop

**Additional**: HTML/CSS basics, Design Systems, Accessibility Guidelines (WCAG), Agile/Scrum methodology

## Contact
I'm always interested in new challenges and opportunities. Let's connect!
- Email: john.doe@email.com
- Phone: (123) 456-7890
- Portfolio: johndoe.design
- LinkedIn: linkedin.com/in/johndoe
`
  };

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
            ? `Tailored ${activeDocType} achievements to match job requirements` 
            : `Enhanced ${activeDocType} with job-specific keywords`
        };
        
        setImprovements([newImprovement, ...improvements]);
        
        return newScore;
      });
    }, 2500);
  };

  const getDocumentIcon = (docType: string) => {
    switch(docType) {
      case "resume": return <FileText className="h-5 w-5 text-primary" />;
      case "coverLetter": return <FileSpreadsheet className="h-5 w-5 text-primary" />;
      case "sop": return <BookOpen className="h-5 w-5 text-primary" />;
      case "linkedInProfile": return <FileCode className="h-5 w-5 text-primary" />;
      case "portfolioDescription": return <FileText className="h-5 w-5 text-primary" />;
      default: return <FileText className="h-5 w-5 text-primary" />;
    }
  };

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
                <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="pt-4">
                {/* Documents Tab Content */}
                <TabsContent value="documents" className="mt-0">
                  <Tabs 
                    defaultValue="resume" 
                    value={activeDocType} 
                    onValueChange={setActiveDocType}
                    className="w-full"
                  >
                    <TabsList className="inline-flex h-9 w-full items-center justify-start rounded-md bg-muted p-1 text-muted-foreground overflow-x-auto">
                      <TabsTrigger value="resume" className="h-8 whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-medium">
                        Resume
                      </TabsTrigger>
                      <TabsTrigger value="coverLetter" className="h-8 whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-medium">
                        Cover Letter
                      </TabsTrigger>
                      <TabsTrigger value="sop" className="h-8 whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-medium">
                        Statement of Purpose
                      </TabsTrigger>
                      <TabsTrigger value="linkedInProfile" className="h-8 whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-medium">
                        LinkedIn Profile
                      </TabsTrigger>
                      <TabsTrigger value="portfolioDescription" className="h-8 whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-medium">
                        Portfolio
                      </TabsTrigger>
                    </TabsList>
                    
                    {/* Document Content Tabs */}
                    {Object.keys(documentContent).map((docType) => (
                      <TabsContent key={docType} value={docType} className="mt-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium">My {getDocumentTitle(docType)}</h3>
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
                                  <DialogTitle>Upload {getDocumentTitle(docType)}</DialogTitle>
                                  <DialogDescription>
                                    Upload your {getDocumentTitle(docType).toLowerCase()} in PDF or DOCX format.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                  <p className="text-sm mb-2">Drag and drop your file here</p>
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
                          <pre className="p-4 whitespace-pre-wrap text-sm font-mono overflow-y-auto max-h-[60vh]">
                            {documentContent[docType as keyof typeof documentContent]}
                          </pre>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </TabsContent>
                
                {/* Analysis Tab Content */}
                <TabsContent value="analysis" className="mt-0">
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
                    {Object.keys(documentContent).map((docType) => (
                      <TabsContent key={docType} value={docType} className="mt-4">
                        <div className="space-y-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">{getDocumentTitle(docType)} Analysis</h3>
                            <Button 
                              onClick={handleOptimize} 
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
                                Generate Optimization Suggestions
                              </Button>
                            </CardFooter>
                          </Card>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
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
