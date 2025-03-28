
import { useState, useEffect } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { X, Upload, FileText, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Skill {
  id: string;
  name: string;
}

interface Resume {
  id: string;
  title: string;
  content: string;
  skills: Skill[];
}

const ResumeUpload = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [activeResume, setActiveResume] = useState<Resume | null>(null);
  const [newResumeTitle, setNewResumeTitle] = useState("");
  const [newResumeContent, setNewResumeContent] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchResumes();
    }
  }, [user]);

  const fetchResumes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Transform the data to match our Resume interface
        const resumesWithSkills = data.map(resume => ({
          id: resume.id,
          title: resume.title,
          content: resume.content,
          skills: Array.isArray(resume.skills) 
            ? resume.skills.map((skill: any, index: number) => ({
                id: `skill-${index}`,
                name: typeof skill === 'string' ? skill : skill.name
              }))
            : []
        }));
        
        setResumes(resumesWithSkills);
        if (resumesWithSkills.length > 0) {
          setActiveResume(resumesWithSkills[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
      toast({
        title: "Error",
        description: "Failed to load resumes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createResume = async () => {
    if (!newResumeTitle || !newResumeContent) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and content for your resume.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Format skills array for storage
      const skillsArray = skills.map(skill => skill.name);
      
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          title: newResumeTitle,
          content: newResumeContent,
          skills: skillsArray,
          user_id: user?.id
        })
        .select();

      if (error) throw error;

      toast({
        title: "Resume Created",
        description: "Your resume has been saved successfully.",
      });

      // Reset form fields
      setNewResumeTitle("");
      setNewResumeContent("");
      setSkills([]);
      setOpenDialog(false);
      
      // Refresh resumes list
      fetchResumes();
    } catch (error) {
      console.error("Error creating resume:", error);
      toast({
        title: "Error",
        description: "Failed to save resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const updateResume = async () => {
    if (!activeResume) return;

    try {
      setIsUploading(true);
      
      // Format skills array for storage
      const skillsArray = activeResume.skills.map(skill => skill.name);
      
      const { error } = await supabase
        .from('resumes')
        .update({
          title: activeResume.title,
          content: activeResume.content,
          skills: skillsArray
        })
        .eq('id', activeResume.id);

      if (error) throw error;

      toast({
        title: "Resume Updated",
        description: "Your resume has been updated successfully.",
      });
      
      // Refresh resumes list
      fetchResumes();
    } catch (error) {
      console.error("Error updating resume:", error);
      toast({
        title: "Error",
        description: "Failed to update resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const deleteResume = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Resume Deleted",
        description: "Your resume has been deleted successfully.",
      });
      
      // Refresh resumes list
      fetchResumes();
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast({
        title: "Error",
        description: "Failed to delete resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    
    if (openDialog) {
      // Adding skill to new resume form
      setSkills([...skills, { id: `new-skill-${Date.now()}`, name: newSkill.trim() }]);
    } else if (activeResume) {
      // Adding skill to existing resume
      setActiveResume({
        ...activeResume,
        skills: [...activeResume.skills, { id: `resume-skill-${Date.now()}`, name: newSkill.trim() }]
      });
    }
    
    setNewSkill("");
  };

  const removeSkill = (skillId: string) => {
    if (openDialog) {
      // Remove from new resume form
      setSkills(skills.filter(skill => skill.id !== skillId));
    } else if (activeResume) {
      // Remove from existing resume
      setActiveResume({
        ...activeResume,
        skills: activeResume.skills.filter(skill => skill.id !== skillId)
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // For demo purposes, we're just reading the file content
      // In a real app, you'd parse the resume properly
      const text = await file.text();
      
      if (openDialog) {
        // Set in new resume form
        setNewResumeTitle(file.name.replace(/\.[^/.]+$/, ""));
        setNewResumeContent(text);
      } else if (activeResume) {
        // Update existing resume
        setActiveResume({
          ...activeResume,
          content: text
        });
      }
      
      toast({
        title: "File Uploaded",
        description: "Resume content has been extracted.",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Error",
        description: "Failed to process the resume file.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Resumes</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Resume
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Resume</DialogTitle>
              <DialogDescription>
                Add a new resume to your profile. This will be used when applying to jobs.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid w-full items-center gap-2">
                <label htmlFor="resumeTitle" className="text-sm font-medium">
                  Resume Title
                </label>
                <Input
                  id="resumeTitle"
                  placeholder="e.g. Software Engineer Resume"
                  value={newResumeTitle}
                  onChange={(e) => setNewResumeTitle(e.target.value)}
                />
              </div>
              
              <div className="grid w-full items-center gap-2">
                <label className="text-sm font-medium flex justify-between">
                  <span>Resume Content</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('resumeFile')?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                  <input
                    id="resumeFile"
                    type="file"
                    className="hidden"
                    accept=".txt,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                </label>
                <Textarea
                  placeholder="Paste your resume content here..."
                  className="min-h-[200px]"
                  value={newResumeContent}
                  onChange={(e) => setNewResumeContent(e.target.value)}
                />
              </div>
              
              <div className="grid w-full items-center gap-2">
                <label className="text-sm font-medium">Skills</label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button type="button" onClick={addSkill} variant="secondary">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary" className="flex items-center gap-1">
                      {skill.name}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeSkill(skill.id)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={createResume}
                disabled={isUploading || !newResumeTitle || !newResumeContent}
              >
                {isUploading ? "Saving..." : "Save Resume"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-[200px] bg-muted rounded-md animate-pulse" />
          <div className="h-[50px] bg-muted rounded-md animate-pulse w-3/4" />
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Resumes Found</h3>
          <p className="text-muted-foreground mb-4">
            You haven't created any resumes yet. Add your first resume to start applying to jobs.
          </p>
          <Button onClick={() => setOpenDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Resume
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {resumes.map((resume) => (
              <Card 
                key={resume.id} 
                className={`min-w-[200px] cursor-pointer ${activeResume?.id === resume.id ? 'border-primary' : ''}`}
                onClick={() => setActiveResume(resume)}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-base truncate">{resume.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {resume.skills.length} skills
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          
          {activeResume && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{activeResume.title}</CardTitle>
                  <Button variant="destructive" size="sm" onClick={() => deleteResume(activeResume.id)}>
                    Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Resume Content</h3>
                  <Textarea 
                    value={activeResume.content} 
                    onChange={(e) => setActiveResume({...activeResume, content: e.target.value})}
                    className="min-h-[300px] font-mono text-sm"
                  />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Skills</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Input
                      placeholder="Add a skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <Button type="button" onClick={addSkill} variant="secondary">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeResume.skills.map((skill) => (
                      <Badge key={skill.id} variant="secondary" className="flex items-center gap-1">
                        {skill.name}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeSkill(skill.id)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={updateResume} disabled={isUploading}>
                  {isUploading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
