
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ThumbsUp, ThumbsDown, Undo2, RotateCcw, 
  Share2, ExternalLink, CheckCircle, Robot
} from "lucide-react";
import { useJobAgent } from "@/hooks/useJobAgent";
import { useToast } from "@/hooks/use-toast";
import { Job } from "@/services/jobService";
import { motion } from "framer-motion";

interface JobCardActionsProps {
  job: Job;
  onSwipe: (direction: "left" | "right") => void;
  onUndo: () => void;
  canUndo: boolean;
  matchScore?: number;
  shouldAutoApply?: boolean;
}

const JobCardActions = ({ 
  job, 
  onSwipe, 
  onUndo, 
  canUndo, 
  matchScore, 
  shouldAutoApply 
}: JobCardActionsProps) => {
  const { toast } = useToast();
  const { isActive } = useJobAgent();
  
  const handleShare = () => {
    if (navigator.share && job.url) {
      navigator.share({
        title: `${job.title} at ${job.company}`,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: job.url
      }).catch(error => {
        console.error('Error sharing:', error);
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };
  
  const copyToClipboard = () => {
    if (job.url) {
      navigator.clipboard.writeText(job.url);
      toast({
        title: "Link Copied",
        description: "Job link copied to clipboard",
      });
    }
  };
  
  const openJobLink = () => {
    if (job.url) {
      window.open(job.url, '_blank');
    }
  };

  return (
    <Card className="bg-background border-none shadow-none">
      <CardContent className="p-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center">
            {matchScore !== undefined && (
              <div className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${
                matchScore >= 80 ? "bg-green-500/10 text-green-600" :
                matchScore >= 60 ? "bg-amber-500/10 text-amber-600" :
                "bg-gray-200 text-gray-700"
              }`}>
                {matchScore}% match
              </div>
            )}
            
            {shouldAutoApply && isActive && (
              <div className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-medium flex items-center">
                <Robot className="w-3 h-3 mr-1" />
                Auto-apply
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full" 
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full" 
              onClick={openJobLink}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between mt-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              className="rounded-full px-6 border-2 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600" 
              onClick={() => onSwipe("left")}
            >
              <ThumbsDown className="h-5 w-5 mr-1" />
              Pass
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              className="rounded-full px-6 border-2 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600" 
              onClick={() => onSwipe("right")}
            >
              {shouldAutoApply && isActive ? (
                <>
                  <Robot className="h-5 w-5 mr-1" />
                  Auto-Apply
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-1" />
                  Apply
                </>
              )}
            </Button>
          </motion.div>
        </div>
        
        <div className="flex justify-center mt-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground" 
            onClick={onUndo}
            disabled={!canUndo}
          >
            <Undo2 className="h-4 w-4 mr-1" />
            Undo
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground"
            onClick={() => {
              window.location.reload();
            }}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCardActions;
