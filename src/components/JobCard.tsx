
import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BriefcaseIcon, MapPin, Building, Clock, DollarSign, Heart, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    description: string;
    requirements: string[];
    posted: string;
    type: string;
    logo?: string;
  };
  onSwipe: (direction: "left" | "right") => void;
  active: boolean;
}

const JobCard = ({ job, onSwipe, active }: JobCardProps) => {
  const [exitX, setExitX] = useState<number | null>(null);
  
  // Card motion values
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
  
  // Indicator opacity based on drag direction
  const likeOpacity = useTransform(x, [0, 125], [0, 1]);
  const nopeOpacity = useTransform(x, [-125, 0], [1, 0]);
  
  const handleDragEnd = () => {
    if (x.get() > 100) {
      setExitX(500);
      onSwipe("right");
    } else if (x.get() < -100) {
      setExitX(-500);
      onSwipe("left");
    }
  };

  if (!active && exitX === null) {
    return null;
  }

  return (
    <motion.div
      className="absolute inset-0 touch-none"
      style={{ x, rotate, opacity }}
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={exitX !== null ? { x: exitX } : undefined}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.5,
        ease: "easeOut"
      }}
      onAnimationComplete={() => {
        if (exitX !== null) {
          x.set(0);
        }
      }}
    >
      <Card className="w-full h-full max-w-md mx-auto overflow-hidden neo-card">
        {/* Job Image/Logo Header */}
        <div className="relative h-32 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
          {job.logo ? (
            <img src={job.logo} alt={job.company} className="h-16 w-16 object-contain" />
          ) : (
            <Building className="h-16 w-16 text-primary/60" />
          )}
          
          {/* Like/Dislike Indicators */}
          <motion.div 
            className="absolute top-4 left-4 bg-destructive text-white py-1 px-3 rounded-full text-lg font-bold border-2 border-white rotate-[-20deg]"
            style={{ opacity: nopeOpacity }}
          >
            PASS
          </motion.div>
          
          <motion.div 
            className="absolute top-4 right-4 bg-green-500 text-white py-1 px-3 rounded-full text-lg font-bold border-2 border-white rotate-[20deg]"
            style={{ opacity: likeOpacity }}
          >
            APPLY
          </motion.div>
        </div>
        
        <div className="p-5 space-y-4">
          {/* Job Title & Company */}
          <div>
            <h2 className="text-xl font-semibold text-balance line-clamp-2">{job.title}</h2>
            <div className="flex items-center mt-1 text-muted-foreground">
              <Building className="h-4 w-4 mr-1" />
              <span>{job.company}</span>
            </div>
          </div>
          
          {/* Job Details */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4 mr-1" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>{job.posted}</span>
            </div>
          </div>
          
          {/* Job Type Badge */}
          <Badge variant="secondary" className="badge-pill">
            {job.type}
          </Badge>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3">
            {job.description}
          </p>
          
          {/* Requirements */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Key Requirements</h3>
            <div className="flex flex-wrap gap-2">
              {job.requirements.slice(0, 3).map((req, i) => (
                <Badge key={i} variant="outline" className="badge-pill">
                  {req}
                </Badge>
              ))}
              {job.requirements.length > 3 && (
                <Badge variant="outline" className="badge-pill">
                  +{job.requirements.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="p-5 pt-0 flex justify-between">
          <Button 
            variant="destructive" 
            size="lg" 
            className="rounded-full" 
            onClick={() => {
              setExitX(-500);
              onSwipe("left");
            }}
          >
            <X className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline"
            size="lg"
            className="rounded-full"
          >
            <ExternalLink className="h-5 w-5 text-muted-foreground" />
            <span className="ml-1">Apply Manually</span>
          </Button>
          
          <Button 
            variant="default"
            size="lg" 
            className="rounded-full bg-green-500 hover:bg-green-600" 
            onClick={() => {
              setExitX(500);
              onSwipe("right");
            }}
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default JobCard;
