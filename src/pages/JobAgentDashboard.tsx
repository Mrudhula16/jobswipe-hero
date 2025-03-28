
import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobAgentConfigDialog } from "@/components/JobAgentConfig";
import { useJobAgent } from "@/hooks/useJobAgent";
import { useAuth } from "@/hooks/useAuth";
import { Robot, RefreshCw, CheckCircle, XCircle, Clock, ChevronRight, Activity, Settings, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import ResumeUpload from "@/components/ResumeUpload";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const JobAgentDashboard = () => {
  const { isActive, isLoading, applications, agentConfig, toggleJobAgent } = useJobAgent();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    appliedCount: 0,
    pendingCount: 0,
    failedCount: 0,
    totalCount: 0,
    successRate: 0,
  });

  useEffect(() => {
    // Calculate statistics from applications
    if (applications.length > 0) {
      const appliedCount = applications.filter(app => app.status === 'applied').length;
      const pendingCount = applications.filter(app => app.status === 'pending').length;
      const failedCount = applications.filter(app => app.status === 'failed').length;
      const totalCount = applications.length;
      const successRate = Math.round((appliedCount / totalCount) * 100);
      
      setStats({
        appliedCount,
        pendingCount,
        failedCount,
        totalCount,
        successRate,
      });
    }
  }, [applications]);

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">AI Job Agent</h1>
            <p className="text-muted-foreground">Your personal assistant for job applications</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm">Agent Status:</span>
            <div className="flex items-center gap-2">
              <Switch
                checked={isActive}
                onCheckedChange={toggleJobAgent}
                disabled={isLoading}
              />
              <Label className="font-medium">
                {isActive ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-muted-foreground">Inactive</span>
                )}
              </Label>
            </div>
            
            <JobAgentConfigDialog />
          </div>
        </div>
        
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="resumes">Resumes</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalCount}</div>
                  <p className="text-muted-foreground text-sm">Total applications</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.successRate}%</div>
                  <Progress value={stats.successRate} className="h-2 mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Agent Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    {isActive ? (
                      <>
                        <Robot className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-green-600 font-medium">Active</span>
                      </>
                    ) : (
                      <>
                        <Robot className="w-5 h-5 text-muted-foreground mr-2" />
                        <span className="text-muted-foreground font-medium">Inactive</span>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-2 text-sm text-muted-foreground">
                    {isActive 
                      ? "Your AI agent is actively searching for matching jobs" 
                      : "Activate your AI agent to start automatic job applications"}
                  </div>
                  
                  {!agentConfig?.resume_id && (
                    <div className="mt-2 text-sm text-amber-600">
                      Please select a resume in settings before activating
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Your most recent job applications</CardDescription>
                </CardHeader>
                <CardContent>
                  {applications.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No applications yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.slice(0, 5).map((app) => (
                        <div key={app.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                          <div className="flex-1">
                            <div className="font-medium">{app.job_title}</div>
                            <div className="text-sm text-muted-foreground">{app.company}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {formatDate(app.created_at)}
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Badge 
                              variant="outline" 
                              className={`mr-2 ${
                                app.status === 'applied' ? 'bg-green-100 text-green-800 border-green-200' : 
                                app.status === 'pending' ? 'bg-blue-100 text-blue-800 border-blue-200' : 
                                'bg-red-100 text-red-800 border-red-200'
                              }`}
                            >
                              {app.status === 'applied' ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : app.status === 'pending' ? (
                                <Clock className="w-3 h-3 mr-1" />
                              ) : (
                                <XCircle className="w-3 h-3 mr-1" />
                              )}
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </Badge>
                            
                            {app.auto_applied && (
                              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                <Robot className="w-3 h-3 mr-1" />
                                Auto
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="ml-auto" onClick={() => setActiveTab("applications")}>
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>All Applications</CardTitle>
                <CardDescription>History of all your job applications</CardDescription>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground mb-4">No applications have been made yet</p>
                    <Button>Start Applying</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div className="flex-1">
                          <div className="font-medium">{app.job_title}</div>
                          <div className="text-sm text-muted-foreground">{app.company}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatDate(app.created_at)}
                          </div>
                          {app.notes && (
                            <div className="text-xs mt-1 max-w-md text-muted-foreground">
                              {app.notes}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={`${
                              app.status === 'applied' ? 'bg-green-100 text-green-800 border-green-200' : 
                              app.status === 'pending' ? 'bg-blue-100 text-blue-800 border-blue-200' : 
                              'bg-red-100 text-red-800 border-red-200'
                            }`}
                          >
                            {app.status === 'applied' ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : app.status === 'pending' ? (
                              <Clock className="w-3 h-3 mr-1" />
                            ) : (
                              <XCircle className="w-3 h-3 mr-1" />
                            )}
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </Badge>
                          
                          {app.auto_applied && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                              <Robot className="w-3 h-3 mr-1" />
                              Auto
                            </Badge>
                          )}
                          
                          {app.job_url && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8" 
                              onClick={() => window.open(app.job_url, '_blank')}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resumes">
            <ResumeUpload />
          </TabsContent>
          
          <TabsContent value="settings">
            <JobAgentConfig />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default JobAgentDashboard;
