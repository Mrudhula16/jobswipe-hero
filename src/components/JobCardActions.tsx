
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, ArrowLeft, Bot, Zap } from 'lucide-react';
import { Job } from '@/services/jobService';

interface JobCardActionsProps {
  job: Job;
  onSwipe: (direction: 'left' | 'right') => void;
  onUndo?: () => void;
  canUndo?: boolean;
  matchScore?: number;
  shouldAutoApply?: boolean;
}

const JobCardActions: React.FC<JobCardActionsProps> = ({
  job,
  onSwipe,
  onUndo,
  canUndo = false,
  matchScore,
  shouldAutoApply = false
}) => {
  return (
    <div className="p-4 bg-card rounded-xl border border-border shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {matchScore !== undefined && matchScore > 0 && (
            <div className={`px-2 py-1 rounded-md text-xs ${
              matchScore >= 80 ? 'bg-green-100 text-green-800' : 
              matchScore >= 60 ? 'bg-amber-100 text-amber-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              <span className="font-medium">{matchScore}%</span> Match
            </div>
          )}
          
          {shouldAutoApply && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-purple-100 text-purple-800 text-xs">
              <Bot className="h-3 w-3" />
              <span>Auto-Apply Ready</span>
            </div>
          )}
          
          {!shouldAutoApply && matchScore !== undefined && matchScore < 60 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-orange-100 text-orange-800 text-xs">
              <Zap className="h-3 w-3" />
              <span>Low Match</span>
            </div>
          )}
        </div>
        
        {canUndo && onUndo && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs" 
            onClick={onUndo}
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Undo
          </Button>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={() => onSwipe('left')}
        >
          <ThumbsDown className="h-4 w-4 mr-2" />
          Pass
        </Button>
        
        <Button 
          className="flex-1 bg-green-600 text-white hover:bg-green-700"
          onClick={() => onSwipe('right')}
        >
          <ThumbsUp className="h-4 w-4 mr-2" />
          {shouldAutoApply ? 'Apply' : 'Interested'}
        </Button>
      </div>
    </div>
  );
};

export default JobCardActions;
