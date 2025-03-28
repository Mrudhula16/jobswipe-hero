
import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';
import JobCardSkeleton from './JobCardSkeleton';
import JobCardActions from './JobCardActions';
import JobFilters from './JobFilters';
import { getJobs, Job } from '@/services/jobService';
import { useToast } from '@/hooks/use-toast';
import useJobSwiper from '@/hooks/useJobSwiper';
import { useJobFilters } from '@/hooks/useJobFilters';
import { AlertTriangle } from 'lucide-react';
import { useJobAgent } from '@/hooks/useJobAgent';
import { motion, AnimatePresence } from 'framer-motion';

const JobSwiper = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { history, addToHistory, undoLastSwipe, canUndo } = useJobSwiper();
  const { getOptionsByCategory, getLabelByValue, filterCategories, filterOptions } = useJobFilters();
  const { getSkillsMatchPercentage, shouldAutoApply, applyToJob } = useJobAgent();
  const [matchScore, setMatchScore] = useState<number | undefined>(undefined);
  const [shouldAuto, setShouldAuto] = useState(false);
  const [filtersState, setFiltersState] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fetchJobs();
  }, [filtersState]);

  useEffect(() => {
    if (jobs.length > 0 && currentIndex < jobs.length) {
      calculateJobMatch(jobs[currentIndex]);
    }
  }, [currentIndex, jobs]);

  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Modified to correctly call getJobs with either filters or a number
      const jobsData = Object.keys(filtersState).length > 0 
        ? await getJobs(filtersState) 
        : await getJobs(5); // Default to 5 jobs if no filters
      
      // Filter out jobs that are already in the history
      const newJobs = jobsData.filter(job => 
        !history.some(item => item.job.id === job.id)
      );
      
      setJobs(newJobs);
      setCurrentIndex(0);
      
      if (newJobs.length === 0) {
        toast({
          title: "No more jobs",
          description: "We couldn't find any more jobs matching your filters. Try changing your filters or check back later.",
        });
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch jobs'));
      toast({
        title: "Error",
        description: "Failed to load jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (currentIndex >= jobs.length) return;
    
    const currentJob = jobs[currentIndex];
    
    // Apply to job if swiped right and auto-apply is enabled
    if (direction === 'right') {
      try {
        await applyToJob(currentJob);
      } catch (error) {
        console.error('Error applying to job:', error);
      }
    }
    
    // Add to history
    addToHistory({
      job: currentJob,
      direction,
      timestamp: new Date(),
    });
    
    // Move to next job
    setCurrentIndex(prevIndex => prevIndex + 1);
    
    // Reset match score for next job
    setMatchScore(undefined);
    setShouldAuto(false);
    
    // If we've reached the end of the jobs, fetch more
    if (currentIndex >= jobs.length - 1) {
      toast({
        title: "Loading more jobs",
        description: "Please wait while we find more jobs for you.",
      });
      fetchJobs();
    }
  };

  const handleUndo = () => {
    if (canUndo) {
      undoLastSwipe();
      // Go back to the previous job
      setCurrentIndex(prevIndex => Math.max(0, prevIndex - 1));
    }
  };

  const updateFilter = (filters: Record<string, string[]>) => {
    setFiltersState(filters);
  };

  const resetFilters = () => {
    setFiltersState({});
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 md:p-6">
      {/* Job Filters */}
      <div className="w-full max-w-3xl mb-8">
        <JobFilters 
          onFilterChange={updateFilter}
          onApplyFilters={() => fetchJobs()}
          isFiltering={isLoading}
        />
      </div>
      
      {/* Main Card Area */}
      <div className="w-full max-w-lg mx-auto mb-6 flex-grow flex flex-col items-center">
        <AnimatePresence>
          {isLoading ? (
            <JobCardSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-red-800 mb-2">Failed to load jobs</h3>
              <p className="text-red-700 mb-4">{error.message}</p>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                onClick={fetchJobs}
              >
                Try Again
              </button>
            </div>
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
              />
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-2">No more jobs</h3>
              <p className="text-gray-600 mb-4">We've run out of jobs matching your criteria.</p>
              <button 
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                onClick={() => {
                  resetFilters();
                  fetchJobs();
                }}
              >
                Reset Filters & Find More Jobs
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Job Actions */}
      {!isLoading && !error && jobs.length > 0 && currentIndex < jobs.length && (
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
