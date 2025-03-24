
import { useState } from "react";
import Navbar from "@/components/Navbar";
import ResumeAnalyzer from "@/components/ResumeAnalyzer";
import AccountConnector from "@/components/AccountConnector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Input
} from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, Settings, FileText, MapPin, Building, Briefcase, 
  School, Phone, Mail, Globe, Award, Languages, PenTool,
  AlertCircle, Save
} from "lucide-react";
import { motion } from "framer-motion";

const Profile = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 pt-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
        
        {/* Profile Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <Card className="neo-card md:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="h-32 w-32 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-4 border-background shadow-lg">
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-16 w-16 text-muted-foreground" />
                    )}
                  </div>
                  <label 
                    htmlFor="profile-image" 
                    className="absolute bottom-0 right-0 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer shadow-md"
                  >
                    <PenTool className="h-4 w-4" />
                  </label>
                  <input 
                    id="profile-image" 
                    type="file" 
                    accept="image/*" 
                    className="sr-only" 
                    onChange={handleImageChange}
                  />
                </div>
                
                <h2 className="text-2xl font-bold mb-1">John Doe</h2>
                <p className="text-muted-foreground mb-4">Product Designer</p>
                
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  <Button variant="outline" size="sm" className="rounded-full gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full gap-1">
                    <Globe className="h-3.5 w-3.5" />
                    Website
                  </Button>
                </div>
                
                <div className="w-full space-y-3">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm">San Francisco, CA</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm">john.doe@example.com</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm">johndoe.com</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="neo-card md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Job Preferences
              </CardTitle>
              <CardDescription>
                What type of jobs are you looking for?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between mb-1">
                  <Label>Job Title</Label>
                  <span className="text-xs text-muted-foreground">Suggested based on your profile</span>
                </div>
                <Input placeholder="Product Designer" value="Product Designer" />
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button variant="secondary" size="sm" className="rounded-full">UI/UX Designer</Button>
                  <Button variant="secondary" size="sm" className="rounded-full">Interface Designer</Button>
                  <Button variant="secondary" size="sm" className="rounded-full">Interaction Designer</Button>
                  <Button variant="outline" size="sm" className="rounded-full">+ Add</Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Employment Type</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm" className="rounded-full">Full-time</Button>
                    <Button variant="outline" size="sm" className="rounded-full">Part-time</Button>
                    <Button variant="outline" size="sm" className="rounded-full">Contract</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Location Preference</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm" className="rounded-full">Remote</Button>
                    <Button variant="outline" size="sm" className="rounded-full">On-site</Button>
                    <Button variant="outline" size="sm" className="rounded-full">Hybrid</Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Desired Salary Range</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Minimum (USD)" value="90,000" />
                  <Input placeholder="Maximum (USD)" value="150,000" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Industries</Label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" className="rounded-full">Technology</Button>
                  <Button variant="secondary" size="sm" className="rounded-full">Design</Button>
                  <Button variant="outline" size="sm" className="rounded-full">E-commerce</Button>
                  <Button variant="outline" size="sm" className="rounded-full">Finance</Button>
                  <Button variant="outline" size="sm" className="rounded-full">Healthcare</Button>
                  <Button variant="outline" size="sm" className="rounded-full">+ Add</Button>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-800 font-medium">Improve your job matches</p>
                  <p className="text-xs text-amber-700">
                    Complete your profile for better job recommendations from our AI agent.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="resume" className="mb-8">
          <TabsList className="bg-card border border-border shadow-sm">
            <TabsTrigger value="resume" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Resume
            </TabsTrigger>
            <TabsTrigger value="experience" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Experience
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Education
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Skills
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="resume" className="mt-4 space-y-6">
            <Card className="neo-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Resume
                </CardTitle>
                <CardDescription>
                  Upload and manage your resumes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Product_Designer_Resume.pdf</h3>
                        <p className="text-xs text-muted-foreground">Uploaded 2 weeks ago • Default</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Delete</Button>
                    </div>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">UX_Designer_Resume_Creative.pdf</h3>
                        <p className="text-xs text-muted-foreground">Uploaded 1 month ago</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Delete</Button>
                    </div>
                  </div>
                </div>
                
                <ResumeAnalyzer />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="experience" className="mt-4 space-y-6">
            <Card className="neo-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Work Experience
                  </CardTitle>
                  <CardDescription>
                    Add your work history
                  </CardDescription>
                </div>
                <Button size="sm" className="gap-2">
                  <Briefcase className="h-4 w-4" />
                  Add Experience
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    role: "Senior Product Designer",
                    company: "DesignCo",
                    location: "San Francisco, CA",
                    type: "Full-time",
                    start: "Jan 2021",
                    end: "Present",
                    description: "Led the redesign of the company's flagship product, resulting in a 40% increase in user engagement. Managed a team of 4 designers and collaborated with engineering and product teams."
                  },
                  {
                    role: "UI/UX Designer",
                    company: "TechStart",
                    location: "Remote",
                    type: "Full-time",
                    start: "Mar 2018",
                    end: "Dec 2020",
                    description: "Designed user interfaces for web and mobile applications. Conducted user research and usability testing. Created wireframes, prototypes, and high-fidelity designs."
                  }
                ].map((experience, i) => (
                  <motion.div 
                    key={i}
                    className="border border-border rounded-lg p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                  >
                    <div className="flex justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-medium">{experience.role}</h3>
                        <div className="text-muted-foreground">
                          {experience.company} • {experience.location}
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div>{experience.start} - {experience.end}</div>
                        <div>{experience.type}</div>
                      </div>
                    </div>
                    <p className="text-sm mt-2">
                      {experience.description}
                    </p>
                    <div className="flex justify-end mt-4 gap-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Delete</Button>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="education" className="mt-4 space-y-6">
            <Card className="neo-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <School className="h-5 w-5 text-primary" />
                    Education
                  </CardTitle>
                  <CardDescription>
                    Add your educational background
                  </CardDescription>
                </div>
                <Button size="sm" className="gap-2">
                  <School className="h-4 w-4" />
                  Add Education
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div 
                  className="border border-border rounded-lg p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-medium">Bachelor of Fine Arts, Graphic Design</h3>
                      <div className="text-muted-foreground">
                        California Institute of the Arts • Valencia, CA
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>2014 - 2018</div>
                      <div>GPA: 3.8/4.0</div>
                    </div>
                  </div>
                  <p className="text-sm mt-2">
                    Coursework included user interface design, typography, color theory, and interactive design.
                    Member of the Design Club. Dean's List all semesters.
                  </p>
                  <div className="flex justify-end mt-4 gap-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Delete</Button>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="skills" className="mt-4 space-y-6">
            <Card className="neo-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Skills
                </CardTitle>
                <CardDescription>
                  Add your skills and proficiency levels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Technical Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "HTML/CSS", "Prototyping", "User Research", "Wireframing"].map((skill, i) => (
                        <div 
                          key={i} 
                          className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {skill}
                          <button className="h-4 w-4 rounded-full flex items-center justify-center hover:bg-muted-foreground/20 ml-1">
                            <span className="sr-only">Remove</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="rounded-full">+ Add Skill</Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Soft Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["Communication", "Teamwork", "Problem Solving", "Time Management", "Leadership"].map((skill, i) => (
                        <div 
                          key={i} 
                          className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {skill}
                          <button className="h-4 w-4 rounded-full flex items-center justify-center hover:bg-primary/20 ml-1">
                            <span className="sr-only">Remove</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="rounded-full">+ Add Skill</Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Languages</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[
                        { language: "English", level: "Native" },
                        { language: "Spanish", level: "Intermediate" },
                        { language: "French", level: "Basic" }
                      ].map((item, i) => (
                        <div 
                          key={i} 
                          className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {item.language} ({item.level})
                          <button className="h-4 w-4 rounded-full flex items-center justify-center hover:bg-accent/20 ml-1">
                            <span className="sr-only">Remove</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="rounded-full">+ Add Language</Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Certifications</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["Google UX Design Professional Certificate", "Adobe Certified Expert"].map((cert, i) => (
                        <div 
                          key={i} 
                          className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {cert}
                          <button className="h-4 w-4 rounded-full flex items-center justify-center hover:bg-muted-foreground/20 ml-1">
                            <span className="sr-only">Remove</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="rounded-full">+ Add Certification</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="neo-card md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="h-5 w-5 text-primary" />
                Professional Summary
              </CardTitle>
              <CardDescription>
                Describe your professional background and goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea 
                className="min-h-[150px]"
                placeholder="Write a professional summary..."
                defaultValue="Passionate Product Designer with 5+ years of experience creating user-centered digital experiences. Proven track record of improving user engagement and satisfaction through thoughtful design solutions. Expert in interaction design, prototyping, and design systems. Looking for opportunities to lead design initiatives in innovative tech companies."
              />
              
              <div className="flex justify-end">
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <AccountConnector />
        </div>
      </main>
    </div>
  );
};

export default Profile;
