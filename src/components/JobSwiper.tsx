
// We'll update the JobSwiper component to use all our hooks and services properly

import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';
import JobCardSkeleton from './JobCardSkeleton';
import JobCardActions from './JobCardActions';
import JobFilters from './JobFilters';
import { getJobs, Job } from '@/services/jobService';
import { toast } from '@/hooks/use-toast';
import useJobSwiper from '@/hooks/useJobSwiper';
import { useJobAgent } from '@/hooks/useJobAgent';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const JobSwiper = () => {
  const [isFiltering, setIsFiltering] = useState(false);
  const [matchScore, setMatchScore] = useState<number | undefined>(undefined);
  const [shouldAuto, setShouldAuto] = useState(false);
  
  const {
    jobs,
    currentIndex,
    isLoading,
    isLoadingMore,
    noMoreJobs,
    handleSwipe,
    handleUndo,
    resetJobs,
    applyFilters,
    history,
    canUndo
  } = useJobSwiper({
    initialFetchCount: 5,
    prefetchThreshold: 2
  });
  
  const { getSkillsMatchPercentage, shouldAutoApply } = useJobAgent();

  useEffect(() => {
    if (jobs.length > 0 && currentIndex < jobs.length) {
      calculateJobMatch(jobs[currentIndex]);
    }
  }, [currentIndex, jobs]);

  const calculateJobMatch = async (job: Job) => {
    try {
      const score = await getSkillsMatchPercentage(job);
      setMatchScore(score);
      
      const autoApply = await shouldAutoApply(job);
      setShouldAuto(autoApply);
    } catch (error) {
      console.error('Error calculating job match:', error);
      setMatchScore(undefined);
      setShouldAuto(false);
    }
  };
  
  const handleFilterChange = (filters: Record<string, string[]>) => {
    setIsFiltering(true);
    
    const formattedFilters = {
      jobType: filters.job_type || [],
      experienceLevel: filters.experience_level?.length > 0 ? filters.experience_level[0] : '',
      industry: filters.industry?.length > 0 ? filters.industry[0] : '',
      skills: filters.skills || [],
      location: filters.location?.length > 0 ? filters.location[0] : '',
      datePosted: filters.date_posted?.length > 0 ? filters.date_posted[0] : ''
    };
    
    applyFilters(formattedFilters).finally(() => {
      setIsFiltering(false);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 md:p-6">
      {/* Job Filters */}
      <div className="w-full max-w-3xl mb-8">
        <JobFilters 
          onFilterChange={handleFilterChange}
          onApplyFilters={() => {}} // Already handled in handleFilterChange
          isFiltering={isFiltering}
        />
      </div>
      
      {/* Main Card Area */}
      <div className="w-full max-w-lg mx-auto mb-6 flex-grow flex flex-col items-center">
        <AnimatePresence>
          {isLoading ? (
            <JobCardSkeleton />
          ) : jobs.length > 0 && currentIndex < jobs.length ? (
            <motion.div
              key={jobs[currentIndex].id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <JobCard 
                job={jobs[currentIndex]}
                onSwipe={handleSwipe}
                active={true}
                matchScore={matchScore}
              />
            </motion.div>
          ) : noMoreJobs ? (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-2">No more jobs</h3>
              <p className="text-gray-600 mb-4">We've run out of jobs matching your criteria.</p>
              <button 
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                onClick={resetJobs}
              >
                Reset Filters & Find More Jobs
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-red-800 mb-2">Failed to load jobs</h3>
              <p className="text-red-700 mb-4">We couldn't find any jobs matching your criteria.</p>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                onClick={resetJobs}
              >
                Try Again
              </button>
            </div>
          )}
        </AnimatePresence>
        
        {isLoadingMore && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading more jobs...</span>
          </div>
        )}
      </div>
      
      {/* Job Actions */}
      {!isLoading && jobs.length > 0 && currentIndex < jobs.length && (
        <div className="w-full max-w-lg">
          <JobCardActions 
            job={jobs[currentIndex]}
            onSwipe={handleSwipe}
            onUndo={handleUndo}
            canUndo={canUndo}
            matchScore={matchScore}
            shouldAutoApply={shouldAuto}
          />
        </div>
      )}
    </div>
  );
};

export default JobSwiper;
