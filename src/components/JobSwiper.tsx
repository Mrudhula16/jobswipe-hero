
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import JobCard from "@/components/JobCard";
import JobCardSkeleton from "@/components/JobCardSkeleton";
import JobCardActions from "@/components/JobCardActions";
import { PanInfo, motion, useAnimationControls } from "framer-motion";
import useJobSwiper from "@/hooks/useJobSwiper";
import { BadgeInfo, Filter } from "lucide-react";
import JobFilters from "@/components/JobFilters";
import { useJobAgent } from "@/hooks/useJobAgent";
import { JobAgentConfigDialog } from '@/components/JobAgentConfig';

const JobSwiper = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { isActive, getSkillsMatchPercentage, shouldAutoApply } = useJobAgent();
  const { 
    jobs, 
    currentIndex, 
    isLoading, 
    noMoreJobs, 
    animatingCardId,
    handleSwipe, 
    handleUndo,
    resetJobs,
    applyFilters
  } = useJobSwiper({
    initialFetchCount: 5,
    prefetchThreshold: 3
  });
  
  // Store skills match and auto-apply status for each job
  const [jobMatches, setJobMatches] = useState<{[key: string]: number}>({});
  const [autoApplyJobs, setAutoApplyJobs] = useState<{[key: string]: boolean}>({});
  
  // Animation controls for the main card
  const controls = useAnimationControls();
  
  // Handle manual swipe with animation
  const handleDragEnd = (_: MouseEvent, info: PanInfo) => {
    if (isLoading || jobs.length === 0 || currentIndex >= jobs.length) return;
    
    const threshold = 100;
    const velocity = 0.5;
    
    // Determine swipe direction based on drag distance and velocity
    if (info.offset.x > threshold && info.velocity.x > velocity) {
      // Swipe right
      controls.start({ 
        x: "120%", 
        opacity: 0,
        transition: { duration: 0.2 } 
      }).then(() => {
        handleSwipe("right");
        controls.set({ x: 0, opacity: 1 });
      });
    } else if (info.offset.x < -threshold && info.velocity.x < -velocity) {
      // Swipe left
      controls.start({ 
        x: "-120%", 
        opacity: 0,
        transition: { duration: 0.2 } 
      }).then(() => {
        handleSwipe("left");
        controls.set({ x: 0, opacity: 1 });
      });
    } else {
      // Reset position if swipe was not decisive
      controls.start({ 
        x: 0,
        opacity: 1,
        transition: { duration: 0.2 } 
      });
    }
  };
  
  // Calculate skills match and auto-apply status for visible jobs
  useEffect(() => {
    const calculateMatches = async () => {
      if (jobs.length === 0 || !isActive) return;
      
      const visibleJobs = jobs.slice(currentIndex, currentIndex + 3);
      
      for (const job of visibleJobs) {
        // Skip if we already calculated the match for this job
        if (jobMatches[job.id] !== undefined) continue;
        
        try {
          // Calculate skills match percentage
          const matchScore = await getSkillsMatchPercentage(job);
          setJobMatches(prev => ({...prev, [job.id]: matchScore}));
          
          // Determine if the job should be auto-applied
          const autoApply = await shouldAutoApply(job);
          setAutoApplyJobs(prev => ({...prev, [job.id]: autoApply}));
        } catch (error) {
          console.error(`Error calculating match for job ${job.id}:`, error);
        }
      }
    };
    
    calculateMatches();
  }, [jobs, currentIndex, isActive]);
  
  // Handle filter application
  const handleApplyFilters = async (filters: Record<string, string[]>) => {
    setShowFilters(false);
    
    // Reset matches and auto-apply data when filters change
    setJobMatches({});
    setAutoApplyJobs({});
    
    // Apply the new filters
    await applyFilters(filters);
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto h-full">
      <div className="flex justify-between mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
        
        <JobAgentConfigDialog />
      </div>
      
      {showFilters && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <JobFilters onApplyFilters={handleApplyFilters} />
          </CardContent>
        </Card>
      )}
      
      <div className="relative flex-1 w-full">
        {isLoading ? (
          <JobCardSkeleton />
        ) : jobs.length === 0 || currentIndex >= jobs.length ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Card className="w-full max-w-md p-8 text-center">
              <CardContent className="flex flex-col items-center pt-6">
                <BadgeInfo className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-bold mb-2">No More Jobs</h2>
                <p className="text-muted-foreground mb-6">
                  You've reviewed all available jobs matching your criteria.
                </p>
                <Button onClick={resetJobs}>Find More Jobs</Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="relative h-full">
            {/* Current job card (animated) */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={handleDragEnd}
              animate={controls}
              className="absolute inset-0"
            >
              <JobCard 
                job={jobs[currentIndex]} 
                isLoading={false}
              />
            </motion.div>
            
            {/* Show card actions below the card */}
            <div className="absolute bottom-0 left-0 right-0">
              <JobCardActions 
                job={jobs[currentIndex]}
                onSwipe={handleSwipe}
                onUndo={handleUndo}
                canUndo={currentIndex > 0 || jobs.length > 1}
                matchScore={jobMatches[jobs[currentIndex]?.id]}
                shouldAutoApply={autoApplyJobs[jobs[currentIndex]?.id]}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSwiper;
