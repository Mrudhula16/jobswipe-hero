
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Sparkles, Calendar, TrendingUp } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface InsightsData {
  appliedJobs: number;
  savedJobs: number;
  completedTasks: number;
  streak: number;
}

const MotivationalInsights = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<InsightsData>({
    appliedJobs: 0,
    savedJobs: 0,
    completedTasks: 0,
    streak: 0
  });

  useEffect(() => {
    if (user) {
      fetchInsights();
    }
  }, [user]);

  const fetchInsights = async () => {
    try {
      // Get applied jobs count
      const { count: appliedCount, error: appliedError } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);
        
      // Get saved jobs count
      const { count: savedCount, error: savedError } = await supabase
        .from('saved_jobs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);
        
      // For demo purposes, we'll generate random numbers for tasks and streak
      const completedTasks = Math.floor(Math.random() * 10);
      const streak = Math.floor(Math.random() * 7);
      
      setInsights({
        appliedJobs: appliedCount || 0,
        savedJobs: savedCount || 0,
        completedTasks,
        streak
      });
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
  };

  const getMotivationalMessage = () => {
    if (insights.appliedJobs === 0) {
      return "Apply to your first job to begin your journey!";
    } else if (insights.appliedJobs < 5) {
      return "Great start! Keep applying to find your perfect role.";
    } else if (insights.appliedJobs < 10) {
      return "You're making excellent progress. Keep the momentum going!";
    } else {
      return "Impressive effort! Your persistence will pay off soon.";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" /> 
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {getMotivationalMessage()}
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-3 bg-primary/10 rounded-lg">
            <TrendingUp className="h-8 w-8 text-primary mb-1" />
            <span className="text-2xl font-bold">{insights.appliedJobs}</span>
            <span className="text-xs text-muted-foreground">Applications</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-amber-100 rounded-lg">
            <Trophy className="h-8 w-8 text-amber-500 mb-1" />
            <span className="text-2xl font-bold">{insights.savedJobs}</span>
            <span className="text-xs text-muted-foreground">Saved Jobs</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-green-100 rounded-lg">
            <Calendar className="h-8 w-8 text-green-600 mb-1" />
            <span className="text-2xl font-bold">{insights.streak}</span>
            <span className="text-xs text-muted-foreground">Day Streak</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-blue-100 rounded-lg">
            <Sparkles className="h-8 w-8 text-blue-600 mb-1" />
            <span className="text-2xl font-bold">{insights.completedTasks}</span>
            <span className="text-xs text-muted-foreground">Tasks Done</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MotivationalInsights;
