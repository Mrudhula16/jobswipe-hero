
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useJobAgent } from '@/hooks/useJobAgent';
import { useToast } from '@/hooks/use-toast';
import { Bot, Calendar, Clock, FileBadge } from 'lucide-react';
import JobAgentConfigDialog from '@/components/JobAgentConfigDialog';
import { supabase } from '@/integrations/supabase/client';

const JobAgentDashboard = () => {
  const { isActive, isLoading, toggleJobAgent, config } = useJobAgent();
  const [stats, setStats] = useState({
    applicationsToday: 0,
    applicationsTotal: 0,
    averageApplicationsPerDay: 0,
    mostRecentApplication: null as string | null
  });
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Get applications created today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: todayCount, error: todayError } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());
      
      if (todayError) throw todayError;
      
      // Get total application count
      const { count: totalCount, error: totalError } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true });
      
      if (totalError) throw totalError;
      
      // Get most recent application
      const { data: recentApplication, error: recentError } = await supabase
        .from('job_applications')
        .select('job_title, company, created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (recentError && recentError.code !== 'PGRST116') {
        // PGRST116 is the error code for no rows returned, which is fine
        throw recentError;
      }
      
      // Calculate average applications per day
      const { data: firstApplication, error: firstError } = await supabase
        .from('job_applications')
        .select('created_at')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();
      
      let averagePerDay = 0;
      
      if (!firstError && firstApplication && totalCount > 0) {
        const firstDate = new Date(firstApplication.created_at);
        const daysSinceFirst = Math.max(1, Math.ceil((today.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)));
        averagePerDay = Math.round((totalCount / daysSinceFirst) * 10) / 10;
      }
      
      setStats({
        applicationsToday: todayCount || 0,
        applicationsTotal: totalCount || 0,
        averageApplicationsPerDay: averagePerDay,
        mostRecentApplication: recentApplication 
          ? `${recentApplication.job_title} at ${recentApplication.company}`
          : null
      });
    } catch (error) {
      console.error('Error fetching agent stats:', error);
      toast({
        title: 'Error fetching stats',
        description: 'Failed to load the latest job application statistics',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAgent = async () => {
    await toggleJobAgent();
    toast({
      title: isActive ? 'Job Agent Deactivated' : 'Job Agent Activated',
      description: isActive 
        ? 'Your job agent will no longer automatically apply to jobs.' 
        : 'Your job agent will now automatically apply to matching jobs!',
    });
  };

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Job Agent Dashboard</h1>
        <JobAgentConfigDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Agent Status Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              Job Agent Status
            </CardTitle>
            <CardDescription>
              Your AI assistant for job applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              {config && config.auto_apply_preferences && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Skills Match Threshold:</span>
                    <span className="text-sm">{config.auto_apply_preferences.skills_match_threshold || 60}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Location Preference:</span>
                    <span className="text-sm capitalize">{config.auto_apply_preferences.location_preference || 'Any'}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant={isActive ? "outline" : "default"} 
              className="w-full" 
              onClick={handleToggleAgent}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : isActive ? 'Deactivate Agent' : 'Activate Agent'}
            </Button>
          </CardFooter>
        </Card>

        {/* Application Stats Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <FileBadge className="h-5 w-5 mr-2" />
              Application Statistics
            </CardTitle>
            <CardDescription>
              Your job application activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  Applications Today:
                </span>
                <span className="text-sm font-bold">{stats.applicationsToday}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Applications:</span>
                <span className="text-sm font-bold">{stats.applicationsTotal}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-1.5" />
                  Daily Average:
                </span>
                <span className="text-sm">{stats.averageApplicationsPerDay}</span>
              </div>
              
              {stats.mostRecentApplication && (
                <div className="pt-2">
                  <span className="text-sm font-medium">Latest Application:</span>
                  <p className="text-sm mt-1">{stats.mostRecentApplication}</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={fetchStats} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh Stats'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default JobAgentDashboard;
