
import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BriefcaseIcon, MapPin, Building, Clock, DollarSign, Heart, X, ExternalLink, ChevronDown, ChevronRight, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

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
    applicationUrl?: string;
    applyUrl?: string;
    isRemote?: boolean;
  };
  onSwipe: (direction: "left" | "right") => void;
  active: boolean;
}

const JobCard = ({ job, onSwipe, active }: JobCardProps) => {
  const [exitX, setExitX] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
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

  const handleDetailsClick = () => {
    setIsOpen(!isOpen);
  };

  // Format logo URL to ensure it's valid
  const logoUrl = job.logo && (
    job.logo.startsWith('http') ? job.logo : `https://logo.clearbit.com/${job.company.toLowerCase().replace(/\s+/g, '')}.com`
  );

  const applicationUrl = job.applicationUrl || job.applyUrl || `https://linkedin.com/jobs/view/${job.id}`;

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
          setExitX(null); // Reset exitX to null to allow for proper cleanup
        }
      }}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full h-full">
        <Card className="w-full h-full max-w-md mx-auto overflow-hidden neo-card">
          {/* Job Image/Logo Header */}
          <div className="relative h-32 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={job.company} 
                className="h-16 w-16 object-contain bg-white p-1 rounded-md"
                onError={(e) => {
                  // If image fails to load, replace with default icon
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const icon = document.createElement('div');
                    icon.className = "h-16 w-16 bg-white rounded-md flex items-center justify-center";
                    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>';
                    parent.appendChild(icon);
                  }
                }}
              />
            ) : (
              <div className="h-16 w-16 bg-white rounded-md flex items-center justify-center">
                <Building className="h-8 w-8 text-primary" />
              </div>
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
                {job.isRemote && (
                  <Badge variant="secondary" className="ml-2 bg-green-500/10 text-green-600 border-green-200">
                    <Globe className="h-3 w-3 mr-1" /> Remote
                  </Badge>
                )}
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
                {job.requirements && job.requirements.slice(0, 3).map((req, i) => (
                  <Badge key={i} variant="outline" className="badge-pill">
                    {req}
                  </Badge>
                ))}
                {job.requirements && job.requirements.length > 3 && (
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
            
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full"
                onClick={handleDetailsClick}
              >
                {isOpen ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="ml-1">Track Application</span>
              </Button>
            </CollapsibleTrigger>
            
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
          
          <CollapsibleContent className="px-5 pb-5">
            <div className="rounded-md bg-secondary/50 p-4 space-y-3">
              <h3 className="font-medium">Application Tracking</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Application Status:</span>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">
                    Applied
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Date Applied:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="pt-2">
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => {
                    // Open the application URL if available
                    if (applicationUrl) {
                      window.open(applicationUrl, '_blank');
                    } else {
                      window.open('https://linkedin.com', '_blank');
                    }
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Full Application
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </motion.div>
  );
};

export default JobCard;
