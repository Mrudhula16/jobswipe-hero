
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { JobAgentConfigDialog } from '@/components/JobAgentConfig';
import { useJobAgent } from '@/hooks/useJobAgent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Briefcase, 
  BookmarkCheck, 
  FileText, 
  ChevronRight, 
  AlertCircle,
  Upload,
  Trash2,
  Plus
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface JobApplication {
  id: string;
  company: string;
  job_title: string;
  status: string;
  created_at: string;
  auto_applied: boolean;
  job_url?: string;
}

interface SavedJob {
  id: string;
  job_id: string;
  created_at: string;
  job?: {
    company: string;
    title: string;
    location: string;
  };
}

interface Resume {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  version: number;
}

const JobAgentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { isActive, agentConfig } = useJobAgent();
  
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplications: 0,
    interviews: 0,
    offers: 0,
    rejections: 0,
    autoApplied: 0
  });

  useEffect(() => {
    if (user) {
      fetchApplications();
      fetchSavedJobs();
      fetchResumes();
      calculateStats();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching job applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your job applications.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select(`
          *,
          job:jobs(company, title, location)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedJobs(data || []);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your saved jobs.',
        variant: 'destructive',
      });
    }
  };

  const fetchResumes = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your resumes.',
        variant: 'destructive',
      });
    }
  };

  const calculateStats = async () => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('status, auto_applied');

      if (error) throw error;

      const applications = data || [];
      const stats = {
        totalApplications: applications.length,
        interviews: applications.filter(app => app.status === 'interview').length,
        offers: applications.filter(app => app.status === 'offer').length,
        rejections: applications.filter(app => app.status === 'rejected').length,
        autoApplied: applications.filter(app => app.auto_applied).length
      };

      setStats(stats);
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setApplications(applications.filter(app => app.id !== id));
      toast({
        title: 'Application deleted',
        description: 'The job application has been removed from your list.',
      });
      calculateStats();
    } catch (error) {
      console.error('Error deleting application:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the application.',
        variant: 'destructive',
      });
    }
  };

  const deleteSavedJob = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSavedJobs(savedJobs.filter(job => job.id !== id));
      toast({
        title: 'Job removed',
        description: 'The job has been removed from your saved list.',
      });
    } catch (error) {
      console.error('Error removing saved job:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove the saved job.',
        variant: 'destructive',
      });
    }
  };

  const deleteResume = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setResumes(resumes.filter(resume => resume.id !== id));
      toast({
        title: 'Resume deleted',
        description: 'The resume has been removed.',
      });
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the resume.',
        variant: 'destructive',
      });
    }
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setApplications(applications.map(app => 
        app.id === id ? { ...app, status } : app
      ));
      
      toast({
        title: 'Status updated',
        description: `Application status changed to ${status}.`,
      });
      
      calculateStats();
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update the application status.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'applied':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Applied</Badge>;
      case 'interview':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">Interview</Badge>;
      case 'offer':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Offer</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">My Jobs Dashboard</h1>
            <div className="flex items-center gap-2">
              <JobAgentConfigDialog />
              <Button onClick={() => navigate('/ai-assistant')}>
                Resume Builder
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Agent Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Job Agent Status</CardTitle>
              <CardDescription>
                Your AI-powered job agent helps you find and apply to matching jobs automatically
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`h-3 w-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="font-medium">{isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {isActive 
                    ? `Using resume: ${agentConfig?.resume_id ? (resumes.find(r => r.id === agentConfig.resume_id)?.title || 'Unknown') : 'None selected'}` 
                    : 'Configure your job agent to start receiving personalized job matches'}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalApplications}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.interviews}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.offers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Auto-Applied</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.autoApplied}</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Content Tabs */}
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="applications" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>Applications</span>
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center gap-2">
                <BookmarkCheck className="h-4 w-4" />
                <span>Saved Jobs</span>
              </TabsTrigger>
              <TabsTrigger value="resumes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Resumes</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Applications Tab */}
            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>Job Applications</CardTitle>
                  <CardDescription>Manage your job applications and track their status</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : applications.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Title</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Applied On</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {applications.map((application) => (
                          <TableRow key={application.id}>
                            <TableCell className="font-medium">
                              {application.job_url ? (
                                <a 
                                  href={application.job_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {application.job_title}
                                </a>
                              ) : (
                                application.job_title
                              )}
                              {application.auto_applied && (
                                <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-300">Auto</Badge>
                              )}
                            </TableCell>
                            <TableCell>{application.company}</TableCell>
                            <TableCell>{formatDate(application.created_at)}</TableCell>
                            <TableCell>{getStatusBadge(application.status)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <select 
                                  className="text-xs border rounded p-1"
                                  value={application.status}
                                  onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                                >
                                  <option value="applied">Applied</option>
                                  <option value="interview">Interview</option>
                                  <option value="offer">Offer</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => deleteApplication(application.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Alert className="max-w-md">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No applications yet</AlertTitle>
                        <AlertDescription>
                          You haven't applied to any jobs yet. Start browsing jobs and applying!
                        </AlertDescription>
                      </Alert>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => navigate('/')}
                      >
                        Browse Jobs
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Saved Jobs Tab */}
            <TabsContent value="saved">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Jobs</CardTitle>
                  <CardDescription>Jobs you've saved for later</CardDescription>
                </CardHeader>
                <CardContent>
                  {savedJobs.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Title</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Saved On</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {savedJobs.map((savedJob) => (
                          <TableRow key={savedJob.id}>
                            <TableCell className="font-medium">
                              {savedJob.job?.title || 'Unknown Job'}
                            </TableCell>
                            <TableCell>{savedJob.job?.company || 'Unknown Company'}</TableCell>
                            <TableCell>{savedJob.job?.location || 'Remote'}</TableCell>
                            <TableCell>{formatDate(savedJob.created_at)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => navigate(`/job/${savedJob.job_id}`)}
                                >
                                  View
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => deleteSavedJob(savedJob.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Alert className="max-w-md">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No saved jobs</AlertTitle>
                        <AlertDescription>
                          You haven't saved any jobs yet. Save jobs by swiping right or clicking the bookmark icon.
                        </AlertDescription>
                      </Alert>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => navigate('/')}
                      >
                        Browse Jobs
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Resumes Tab */}
            <TabsContent value="resumes">
              <Card>
                <CardHeader>
                  <CardTitle>My Resumes</CardTitle>
                  <CardDescription>Manage your resumes and upload new ones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Button 
                      className="flex items-center gap-2"
                      onClick={() => navigate('/ai-assistant')}
                    >
                      <Plus className="h-4 w-4" />
                      Create New Resume
                    </Button>
                  </div>
                  
                  {resumes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {resumes.map((resume) => (
                        <Card key={resume.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{resume.title}</CardTitle>
                            <CardDescription>Version {resume.version} • {formatDate(resume.updated_at)}</CardDescription>
                          </CardHeader>
                          <CardFooter className="flex justify-between">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/ai-assistant?resumeId=${resume.id}`)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteResume(resume.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Alert className="max-w-md">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No resumes</AlertTitle>
                        <AlertDescription>
                          You haven't created any resumes yet. Create a resume to start applying for jobs.
                        </AlertDescription>
                      </Alert>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => navigate('/ai-assistant')}
                      >
                        Create Resume
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default JobAgentDashboard;
