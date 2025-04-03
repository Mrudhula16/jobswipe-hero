
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Award, CheckCircle, TrendingUp, Calendar } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface MotivationalInsight {
  id: number;
  title: string;
  message: string;
  icon: React.ReactNode;
}

const MotivationalInsights = () => {
  const { user } = useAuth();
  const [activeInsight, setActiveInsight] = useState<number>(0);
  const [weeklyGoal, setWeeklyGoal] = useState<number>(10);
  const [weeklyProgress, setWeeklyProgress] = useState<number>(0);

  // This would normally come from actual data, but for demo purposes:
  const applicationCount = user?.appliedJobs?.length || 0;
  const savedJobsCount = user?.savedJobs?.length || 0;
  
  // Calculate a simulated weekly progress for demo
  useEffect(() => {
    const simulatedWeeklyApps = Math.min(applicationCount, weeklyGoal);
    setWeeklyProgress((simulatedWeeklyApps / weeklyGoal) * 100);
  }, [applicationCount, weeklyGoal]);

  // Rotate through motivational messages
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveInsight((prev) => (prev + 1) % motivationalInsights.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const motivationalInsights: MotivationalInsight[] = [
    {
      id: 1,
      title: "Consistency Pays Off!",
      message: "You've submitted applications consistently. Great job staying committed to your job search!",
      icon: <TrendingUp className="h-6 w-6 text-primary" />
    },
    {
      id: 2,
      title: "You're Making Progress",
      message: `${applicationCount > 0 ? `With ${applicationCount} job applications, you're increasing your chances of finding the perfect role.` : "Each application you submit increases your chances of finding the perfect role."}`,
      icon: <CheckCircle className="h-6 w-6 text-green-500" />
    },
    {
      id: 3,
      title: "Building Momentum",
      message: `${savedJobsCount > 0 ? `You've saved ${savedJobsCount} interesting positions. Having options is a great strategy!` : "Save jobs that interest you to build a collection of great opportunities."}`,
      icon: <Award className="h-6 w-6 text-amber-500" />
    },
    {
      id: 4,
      title: "Weekly Progress",
      message: `You're ${weeklyProgress >= 100 ? "exceeding" : "working toward"} your weekly application goal. Consistency is key to job search success!`,
      icon: <Calendar className="h-6 w-6 text-blue-500" />
    },
    {
      id: 5,
      title: "Keep Going!",
      message: "The average job search takes 3-6 months. Your persistence will pay off!",
      icon: <Sparkles className="h-6 w-6 text-purple-500" />
    }
  ];

  const currentInsight = motivationalInsights[activeInsight];

  return (
    <Card className="neo-card relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Job Search Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentInsight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                {currentInsight.icon}
              </div>
              <div>
                <h3 className="font-medium text-lg">{currentInsight.title}</h3>
                <p className="text-muted-foreground">{currentInsight.message}</p>
              </div>
            </div>

            {currentInsight.id === 4 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Weekly Application Goal</span>
                  <span>{Math.min(applicationCount, weeklyGoal)} of {weeklyGoal}</span>
                </div>
                <Progress value={weeklyProgress} className="h-2" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default MotivationalInsights;
