
import { useState, useRef, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Job, getJobs, getMoreJobs } from '@/services/jobService';

interface UseJobSwiperProps {
  initialFetchCount?: number;
  prefetchThreshold?: number;
  onJobsChange?: (jobs: Job[]) => void;
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
}

const useJobSwiper = ({
  initialFetchCount = 5,
  prefetchThreshold = 3,
  onJobsChange
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

  // Initial fetch
  useEffect(() => {
    const fetchInitialJobs = async () => {
      try {
        setIsLoading(true);
        const initialJobs = await getJobs(initialFetchCount);
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
  }, [initialFetchCount, onJobsChange]);

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
  const handleSwipe = (direction: "left" | "right") => {
    if (animatingCardId || jobs.length === 0) return;
    
    const jobId = jobs[currentIndex]?.id;
    if (!jobId) return;
    
    // Set the currently animating card
    setAnimatingCardId(jobId);
    
    // Update swiped jobs list
    setSwipedJobs(prev => [...prev, { id: jobId, direction }]);
    swipeHistoryRef.current = [...swipeHistoryRef.current, { id: jobId, direction }];
    
    // Show toast for right swipes (applications)
    if (direction === "right") {
      toast({
        title: "Application Saved",
        description: `${jobs[currentIndex].title} has been added to your Applications`,
      });
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

  // Reset all jobs and state
  const resetJobs = async () => {
    setIsLoading(true);
    setCurrentIndex(0);
    setSwipedJobs([]);
    swipeHistoryRef.current = [];
    setNoMoreJobs(false);
    hasMoreJobsRef.current = true;
    
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
    resetJobs
  };
};

export default useJobSwiper;
