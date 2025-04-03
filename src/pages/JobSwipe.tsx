import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import JobSwiper from '@/components/JobSwiper';
import JobFilters from '@/components/JobFilters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Settings, Undo, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import useJobSwiper from '@/hooks/useJobSwiper';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import JobCardSkeleton from '@/components/JobCardSkeleton';
import MotivationalInsights from '@/components/MotivationalInsights';
import JobAgentConfigDialog from '@/components/JobAgentConfigDialog';

const JobSwipe = () => {
  const [activeTab, setActiveTab] = useState<string>("swiper");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { toast } = useToast();
  
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

  const [showTutorial, setShowTutorial] = useState(false); // Set to false to skip tutorial
  
  const handleResetJobs = () => {
    resetJobs();
    toast({
      title: "Jobs Reset",
      description: "Your job queue has been refreshed",
    });
  };

  // Main content renderer based on conditions
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6 p-4">
          <JobCardSkeleton />
          <div className="flex justify-center space-x-4 mt-4">
            <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
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
          <JobSwiper />
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
