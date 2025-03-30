
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import JobSwiper from '@/components/JobSwiper';
import JobFilters from '@/components/JobFilters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Settings, Undo, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import useJobSwiper from '@/hooks/useJobSwiper';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from '@/hooks/useAuth';
import { useJobAgent } from '@/hooks/useJobAgent';
import { Skeleton } from '@/components/ui/skeleton';
import JobCardSkeleton from '@/components/JobCardSkeleton';
import MotivationalInsights from '@/components/MotivationalInsights';
import JobAgentConfigDialog from '@/components/JobAgentConfigDialog';

const JobSwipe = () => {
  const [activeTab, setActiveTab] = useState<string>("swiper");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { isActive: isAgentActive, isLoading: isAgentLoading, toggleJobAgent } = useJobAgent();
  
  const {
    jobs,
    currentIndex,
    swipedJobs,
    isLoading,
    noMoreJobs,
    handleSwipe,
    handleUndo,
    resetJobs,
    applyFilters,
    canUndo
  } = useJobSwiper();

  const [showTutorial, setShowTutorial] = useState(true);
  
  // Check if it's the user's first time using the app
  useEffect(() => {
    const tutorialSeen = localStorage.getItem('jobSwipeTutorialSeen');
    if (tutorialSeen) {
      setShowTutorial(false);
    }
  }, []);

  const handleDismissTutorial = () => {
    localStorage.setItem('jobSwipeTutorialSeen', 'true');
    setShowTutorial(false);
  };

  const handleToggleAgent = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to use the Job Agent feature",
        variant: "destructive",
      });
      return;
    }
    
    await toggleJobAgent();
  };

  const handleResetJobs = () => {
    resetJobs();
    toast({
      title: "Jobs Reset",
      description: "Your job queue has been refreshed",
    });
  };

  // Tutorial dialog
  const renderTutorial = () => (
    <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to JobSwipe</DialogTitle>
          <DialogDescription>
            Find your dream job with just a swipe!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">How it works:</h4>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Swipe right on jobs you like to apply</li>
              <li>Swipe left to skip jobs</li>
              <li>Use filters to find specific roles</li>
              <li>Enable Job Agent to automatically apply to matching jobs</li>
            </ul>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleDismissTutorial}>Got it</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Main content renderer based on conditions
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6 p-4">
          <Skeleton className="h-12 w-full" />
          <JobCardSkeleton />
          <div className="flex justify-center space-x-4 mt-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>
      );
    }

    if (noMoreJobs) {
      return (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">No More Jobs</CardTitle>
            <CardDescription>
              You've reached the end of available jobs matching your criteria.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <MotivationalInsights />
            <Button onClick={handleResetJobs} className="w-full" variant="outline">
              <Trash2 className="mr-2 h-4 w-4" />
              Reset & Get New Jobs
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="max-w-md w-full mx-auto">
        {jobs.length > 0 && currentIndex < jobs.length && (
          <JobSwiper
            currentJob={jobs[currentIndex]}
            onSwipeLeft={() => handleSwipe("left")}
            onSwipeRight={() => handleSwipe("right")}
          />
        )}
        
        <div className="flex justify-center mt-4 space-x-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12"
            onClick={() => handleSwipe("left")}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="outline"
            size="icon" 
            className="rounded-full h-12 w-12"
            onClick={handleUndo}
            disabled={!canUndo}
          >
            <Undo className="h-6 w-6" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      {renderTutorial()}
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">JobSwipe</h1>
        
        <div className="flex space-x-2">
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Job Filters</SheetTitle>
                <SheetDescription>
                  Customize your job search criteria
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <JobFilters 
                  onApplyFilters={(filters) => {
                    applyFilters(filters);
                    setFiltersOpen(false);
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
          
          <JobAgentConfigDialog />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="swiper">Job Cards</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="swiper" className="mt-6 focus-visible:outline-none focus-visible:ring-0">
          {renderContent()}
        </TabsContent>
        
        <TabsContent value="insights" className="focus-visible:outline-none focus-visible:ring-0">
          <Card>
            <CardHeader>
              <CardTitle>Job Hunting Insights</CardTitle>
              <CardDescription>
                Stats and tips to improve your job search
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MotivationalInsights />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobSwipe;
