
import { useState, useRef, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Job, getJobs, getMoreJobs, getFilteredJobs } from '@/services/jobService';
import { useJobAgent } from '@/hooks/useJobAgent';
import { useAuth } from '@/hooks/useAuth';

interface UseJobSwiperProps {
  initialFetchCount?: number;
  prefetchThreshold?: number;
  onJobsChange?: (jobs: Job[]) => void;
  filters?: Record<string, any>;
}

interface UseJobSwiperReturn {
  jobs: Job[];
  currentIndex: number;
  swipedJobs: { id: string; direction: "left" | "right" }[];
  isLoading: boolean;
  isLoadingMore: boolean;
  noMoreJobs: boolean;
  animatingCardId: string | null;
  handleSwipe: (direction: "left" | "right") => void;
  handleUndo: () => void;
  resetJobs: () => void;
  applyFilters: (filters: Record<string, any>) => Promise<void>;
}

const useJobSwiper = ({
  initialFetchCount = 5,
  prefetchThreshold = 3,
  onJobsChange,
  filters: initialFilters = {}
}: UseJobSwiperProps = {}): UseJobSwiperReturn => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedJobs, setSwipedJobs] = useState<{ id: string; direction: "left" | "right" }[]>([]);
  const swipeHistoryRef = useRef<{ id: string; direction: "left" | "right" }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [noMoreJobs, setNoMoreJobs] = useState(false);
  const [animatingCardId, setAnimatingCardId] = useState<string | null>(null);
  const hasMoreJobsRef = useRef(true);
  const [currentFilters, setCurrentFilters] = useState<Record<string, any>>(initialFilters);
  
  // Add job agent integration
  const { isActive: isAgentActive, applyToJob } = useJobAgent();
  const { user } = useAuth();

  // Initial fetch
  useEffect(() => {
    const fetchInitialJobs = async () => {
      try {
        setIsLoading(true);
        let initialJobs: Job[] = [];
        
        // Use filters if available
        if (Object.keys(currentFilters).length > 0) {
          initialJobs = await getFilteredJobs(currentFilters);
        } else {
          initialJobs = await getJobs(initialFetchCount);
        }
        
        setJobs(initialJobs);
        if (initialJobs.length < initialFetchCount) {
          setNoMoreJobs(true);
          hasMoreJobsRef.current = false;
        }
        if (onJobsChange) onJobsChange(initialJobs);
      } catch (error) {
        console.error('Error fetching initial jobs:', error);
        toast({
          title: "Error",
          description: "Failed to load jobs. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialJobs();
  }, [initialFetchCount, onJobsChange, JSON.stringify(currentFilters)]);

  // Prefetch more jobs when approaching end of list
  useEffect(() => {
    const fetchMoreJobs = async () => {
      if (
        !isLoadingMore && 
        hasMoreJobsRef.current && 
        jobs.length > 0 && 
        jobs.length - currentIndex <= prefetchThreshold
      ) {
        try {
          setIsLoadingMore(true);
          const lastJobId = jobs[jobs.length - 1].id;
          
          // Use the same filters for pagination
          const newJobs = await getMoreJobs(lastJobId, 3);
          
          if (newJobs.length === 0) {
            hasMoreJobsRef.current = false;
            if (jobs.length - currentIndex === 0) {
              setNoMoreJobs(true);
            }
          } else {
            setJobs(prevJobs => [...prevJobs, ...newJobs]);
            if (onJobsChange) onJobsChange([...jobs, ...newJobs]);
          }
        } catch (error) {
          console.error('Error fetching more jobs:', error);
        } finally {
          setIsLoadingMore(false);
        }
      }
    };

    fetchMoreJobs();
  }, [currentIndex, isLoadingMore, jobs, prefetchThreshold, onJobsChange]);

  // Handle job swiping
  const handleSwipe = async (direction: "left" | "right") => {
    if (animatingCardId || jobs.length === 0) return;
    
    const jobId = jobs[currentIndex]?.id;
    if (!jobId) return;
    
    // Set the currently animating card
    setAnimatingCardId(jobId);
    
    // Update swiped jobs list
    setSwipedJobs(prev => [...prev, { id: jobId, direction }]);
    swipeHistoryRef.current = [...swipeHistoryRef.current, { id: jobId, direction }];
    
    // If right swipe (application) and job agent is active, attempt to auto-apply
    if (direction === "right") {
      const currentJob = jobs[currentIndex];
      
      // If user is logged in and the agent is active, attempt auto-application
      if (user && isAgentActive) {
        toast({
          title: "AI Agent Active",
          description: `AI Agent is attempting to apply to ${currentJob.title}...`,
        });
        
        // This will be handled by the job agent
        applyToJob(currentJob).catch(err => {
          console.error("Auto-application error:", err);
        });
      } else {
        // Show regular toast for standard application
        toast({
          title: "Application Saved",
          description: `${currentJob.title} has been added to your Applications`,
        });
      }
    }
    
    // Wait for animation to complete before changing index
    setTimeout(() => {
      setCurrentIndex(prevIndex => {
        const newIndex = prevIndex + 1;
        // Check if we've reached the end of our jobs
        if (newIndex >= jobs.length && !hasMoreJobsRef.current) {
          setNoMoreJobs(true);
        }
        return newIndex;
      });
      // Reset the animating card ID
      setAnimatingCardId(null);
    }, 500);
  };

  // Undo last swipe action
  const handleUndo = () => {
    if (swipeHistoryRef.current.length === 0 || currentIndex === 0) return;
    
    // Pop the last action from history
    swipeHistoryRef.current.pop();
    setSwipedJobs(swipeHistoryRef.current);
    
    // Decrement current index to go back to previous card
    setCurrentIndex(prevIndex => prevIndex - 1);
    
    // Since we're going back, ensure noMoreJobs is set to false
    setNoMoreJobs(false);
  };

  // Apply new filters
  const applyFilters = async (filters: Record<string, any>) => {
    setIsLoading(true);
    setCurrentIndex(0);
    setSwipedJobs([]);
    swipeHistoryRef.current = [];
    setNoMoreJobs(false);
    hasMoreJobsRef.current = true;
    setCurrentFilters(filters);
    
    try {
      const filteredJobs = await getFilteredJobs(filters);
      setJobs(filteredJobs);
      
      if (filteredJobs.length === 0) {
        toast({
          title: "No Jobs Found",
          description: "No jobs match your filter criteria. Try broadening your search.",
        });
        setNoMoreJobs(true);
        hasMoreJobsRef.current = false;
      } else {
        toast({
          title: "Filters Applied",
          description: `Found ${filteredJobs.length} jobs matching your criteria.`,
        });
      }
      
      if (onJobsChange) onJobsChange(filteredJobs);
    } catch (error) {
      console.error('Error applying filters:', error);
      toast({
        title: "Error",
        description: "Failed to apply filters. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset all jobs and state
  const resetJobs = async () => {
    setIsLoading(true);
    setCurrentIndex(0);
    setSwipedJobs([]);
    swipeHistoryRef.current = [];
    setNoMoreJobs(false);
    hasMoreJobsRef.current = true;
    setCurrentFilters({});
    
    try {
      const initialJobs = await getJobs(initialFetchCount);
      setJobs(initialJobs);
      if (initialJobs.length < initialFetchCount) {
        setNoMoreJobs(true);
        hasMoreJobsRef.current = false;
      }
      if (onJobsChange) onJobsChange(initialJobs);
    } catch (error) {
      console.error('Error resetting jobs:', error);
      toast({
        title: "Error",
        description: "Failed to reset jobs. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    jobs,
    currentIndex,
    swipedJobs,
    isLoading,
    isLoadingMore,
    noMoreJobs,
    animatingCardId,
    handleSwipe,
    handleUndo,
    resetJobs,
    applyFilters
  };
};

export default useJobSwiper;
