
import React, { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Job } from '@/services/jobService';
import { BriefcaseIcon, MapPin, Building, Clock, Calendar, DollarSign, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: Job;
  onSwipe: (direction: 'left' | 'right') => void;
  active?: boolean;
  matchScore?: number;
}

const JobCard: React.FC<JobCardProps> = ({ job, onSwipe, active = false, matchScore }) => {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (!active) return;

    const swipeThreshold = 100;
    const direction = info.offset.x > swipeThreshold 
      ? 'right' 
      : info.offset.x < -swipeThreshold 
        ? 'left' 
        : null;

    if (direction) {
      setSwipeDirection(direction);
      setTimeout(() => {
        onSwipe(direction);
        setSwipeDirection(null);
      }, 200);
    }
  };

  const handleDragStart = () => {
    if (!active) return;
    setIsSwiping(true);
  };

  const getPostedTimeAgo = () => {
    try {
      return formatDistanceToNow(new Date(job.posted), { addSuffix: true });
    } catch (error) {
      return 'Recently';
    }
  };

  const swipeLeftButton = () => {
    if (!active) return;
    setSwipeDirection('left');
    setTimeout(() => {
      onSwipe('left');
      setSwipeDirection(null);
    }, 200);
  };

  const swipeRightButton = () => {
    if (!active) return;
    setSwipeDirection('right');
    setTimeout(() => {
      onSwipe('right');
      setSwipeDirection(null);
    }, 200);
  };

  return (
    <motion.div
      className={`absolute w-full ${active ? 'z-10' : 'z-0'}`}
      drag={active ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      animate={{
        scale: active ? 1 : 0.9,
        opacity: active ? 1 : 0.6,
        x: swipeDirection === 'left' ? -1000 : swipeDirection === 'right' ? 1000 : 0,
        rotateZ: swipeDirection === 'left' ? -20 : swipeDirection === 'right' ? 20 : isSwiping ? Math.min(Math.max(-20, 0), 20) : 0
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card className="w-full shadow-xl overflow-hidden neo-card">
        <div className="relative">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            {job.isNew && (
              <Badge variant="default" className="bg-green-500">New</Badge>
            )}
            {matchScore !== undefined && (
              <Badge variant="outline" className={`
                ${matchScore >= 80 ? 'bg-green-100 text-green-800 border-green-200' : 
                  matchScore >= 60 ? 'bg-amber-100 text-amber-800 border-amber-200' :
                  'bg-gray-100 text-gray-800 border-gray-200'}
              `}>
                {matchScore}% Match
              </Badge>
            )}
          </div>
          
          <CardHeader className="pb-2">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-md bg-secondary flex items-center justify-center overflow-hidden">
                {job.logo ? (
                  <img 
                    src={job.logo} 
                    alt={`${job.company} logo`} 
                    className="h-10 w-10 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=' + job.company[0];
                    }}
                  />
                ) : (
                  <BriefcaseIcon className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold line-clamp-2">{job.title}</h3>
                <div className="flex items-center text-muted-foreground">
                  <Building className="h-3.5 w-3.5 mr-1" />
                  <span className="text-sm">{job.company}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0 pb-4 space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{job.location}</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{getPostedTimeAgo()}</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <BriefcaseIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{job.type}</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <DollarSign className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{job.salary || 'Not specified'}</span>
              </div>
            </div>
            
            <div className={`${showDetails ? '' : 'max-h-20 overflow-hidden relative'}`}>
              <p className="text-sm text-muted-foreground mb-2">{job.description}</p>
              
              {!showDetails && (
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent"></div>
              )}
            </div>
            
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-primary hover:underline focus:outline-none"
            >
              {showDetails ? 'Show less' : 'Show more'}
            </button>
            
            {showDetails && (
              <>
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">Requirements</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {job.requirements.map((req, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {job.url && (
                  <a 
                    href={job.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    View original posting
                  </a>
                )}
              </>
            )}
          </CardContent>
        </div>
        
        {active && (
          <CardFooter className="pt-0 pb-4 px-4 flex justify-between">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={swipeLeftButton}
            >
              <ThumbsDown className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-full border-green-200 text-green-500 hover:bg-green-50 hover:text-green-600" 
              onClick={swipeRightButton}
            >
              <ThumbsUp className="h-5 w-5" />
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default JobCard;
