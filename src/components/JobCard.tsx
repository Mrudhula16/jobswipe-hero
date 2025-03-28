
import { useState, useEffect, useRef } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Building, MapPin, Briefcase, CalendarDays, Clock, Ban, Check, 
  ChevronDown, ChevronUp, ArrowUpRight, AlertCircle, Star 
} from "lucide-react";
import { motion } from "framer-motion";
import { Job } from "@/services/jobService";
import { useJobAgent } from "@/hooks/useJobAgent";

interface JobCardProps {
  job: Job;
  onSwipe: (direction: "left" | "right") => void;
  active: boolean;
}

const JobCard = ({ job, onSwipe, active }: JobCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [currentPoint, setCurrentPoint] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [direction, setDirection] = useState<"" | "left" | "right">("");
  const [skillsMatch, setSkillsMatch] = useState<number | null>(null);
  const [isLoadingMatch, setIsLoadingMatch] = useState(false);
  const { getSkillsMatchPercentage, shouldAutoApply } = useJobAgent();
  const [willAutoApply, setWillAutoApply] = useState(false);
  const [checkingAutoApply, setCheckingAutoApply] = useState(false);

  // Calculate skills match when card becomes active
  useEffect(() => {
    if (active) {
      checkSkillsMatch();
      checkIfWillAutoApply();
    }
  }, [active, job.id]);

  const checkSkillsMatch = async () => {
    setIsLoadingMatch(true);
    try {
      const match = await getSkillsMatchPercentage(job);
      setSkillsMatch(match);
    } catch (error) {
      console.error("Error getting skills match:", error);
    } finally {
      setIsLoadingMatch(false);
    }
  };

  const checkIfWillAutoApply = async () => {
    setCheckingAutoApply(true);
    try {
      const shouldApply = await shouldAutoApply(job);
      setWillAutoApply(shouldApply);
    } catch (error) {
      console.error("Error checking if will auto-apply:", error);
      setWillAutoApply(false);
    } finally {
      setCheckingAutoApply(false);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!active) return;
    setStartPoint({ x: e.clientX, y: e.clientY });
    setCurrentPoint({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setCurrentPoint({ x: e.clientX, y: e.clientY });
    
    const deltaX = currentPoint.x - startPoint.x;
    
    if (deltaX > 50) {
      setDirection("right");
    } else if (deltaX < -50) {
      setDirection("left");
    } else {
      setDirection("");
    }
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (direction === "left" || direction === "right") {
      onSwipe(direction);
    }
    
    // Reset position
    setCurrentPoint({ x: 0, y: 0 });
    setStartPoint({ x: 0, y: 0 });
    setDirection("");
  };

  // Convert ISO date to relative time
  const getRelativeTime = (isoDate: string) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const deltaX = isDragging ? currentPoint.x - startPoint.x : 0;
  const rotate = deltaX * 0.05;
  
  const renderSkillsMatchBadge = () => {
    if (isLoadingMatch) {
      return (
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></span>
          <span className="text-xs text-gray-500">Checking match...</span>
        </div>
      );
    }
    
    if (skillsMatch === null) return null;
    
    let color = "bg-red-500/10 text-red-600 border-red-200";
    if (skillsMatch >= 80) {
      color = "bg-green-500/10 text-green-600 border-green-200";
    } else if (skillsMatch >= 60) {
      color = "bg-amber-500/10 text-amber-600 border-amber-200";
    }
    
    return (
      <Badge variant="outline" className={`${color}`}>
        {skillsMatch}% Match
      </Badge>
    );
  };

  const renderAutoApplyBadge = () => {
    if (checkingAutoApply) {
      return null;
    }
    
    if (willAutoApply) {
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200 flex items-center gap-1">
          <Star className="h-3 w-3" />
          Auto-Apply
        </Badge>
      );
    }
    
    return null;
  };

  return (
    <motion.div
      ref={cardRef}
      className={`absolute inset-0 ${!active && "pointer-events-none"}`}
      style={{
        zIndex: active ? 10 : 0,
      }}
      animate={{
        rotate: isDragging ? rotate : 0,
        x: isDragging ? deltaX : 0,
        scale: active ? 1 : 0.9,
        opacity: active ? 1 : 0.5,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <Card className={`w-full h-full overflow-hidden neo-card relative ${
        direction === "right"
          ? "border-green-500 shadow-lg shadow-green-100"
          : direction === "left"
          ? "border-red-500 shadow-lg shadow-red-100"
          : ""
      }`}>
        {job.isNew && (
          <div className="absolute top-0 right-0 bg-primary text-white text-xs px-2 py-1 rounded-bl-md z-10">
            New
          </div>
        )}
        
        {/* Direction Overlays */}
        {direction === "right" && (
          <div className="absolute top-1/2 left-6 transform -translate-y-1/2 bg-green-500 text-white p-2 rounded-full z-20">
            <Check className="h-8 w-8" />
          </div>
        )}
        {direction === "left" && (
          <div className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-red-500 text-white p-2 rounded-full z-20">
            <Ban className="h-8 w-8" />
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-secondary rounded-md flex items-center justify-center overflow-hidden">
                {job.logo ? (
                  <img 
                    src={job.logo} 
                    alt={job.company} 
                    className="h-8 w-8 object-contain"
                    onError={(e) => { 
                      e.currentTarget.src = "https://via.placeholder.com/32?text=" + job.company.charAt(0);
                    }}
                  />
                ) : (
                  <Building className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <CardTitle className="text-xl line-clamp-1">{job.title}</CardTitle>
                <CardDescription className="line-clamp-1">{job.company}</CardDescription>
              </div>
            </div>
            <div className="flex gap-1 flex-col items-end">
              {renderSkillsMatchBadge()}
              {renderAutoApplyBadge()}
            </div>
          </div>
        </CardHeader>

        <CardContent className={`space-y-4 overflow-auto ${showDetails ? "max-h-[350px] pb-4" : "max-h-[230px]"}`}>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="line-clamp-1">{job.location}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4 mr-2" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4 mr-2" />
              <span>Posted {getRelativeTime(job.posted)}</span>
            </div>
            {job.salary && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>{job.salary}</span>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Job Description</h3>
            <div className={`text-sm text-muted-foreground ${showDetails ? "" : "line-clamp-4"}`}>
              {job.description}
            </div>
          </div>

          {showDetails && (
            <>
              <div>
                <h3 className="text-sm font-medium mb-2">Requirements</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {job.requirements?.map((req, i) => (
                    <li key={i} className="line-clamp-2">{req}</li>
                  ))}
                </ul>
              </div>
              
              {skillsMatch !== null && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Skills Match</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Match with your resume</span>
                      <span className={`font-medium ${
                        skillsMatch >= 80 ? "text-green-600" : 
                        skillsMatch >= 60 ? "text-amber-600" : 
                        "text-red-600"
                      }`}>{skillsMatch}%</span>
                    </div>
                    <Progress 
                      value={skillsMatch} 
                      className="h-2"
                      color={
                        skillsMatch >= 80 ? "bg-green-600" : 
                        skillsMatch >= 60 ? "bg-amber-600" : 
                        "bg-red-600"
                      }
                    />
                    
                    {willAutoApply && (
                      <div className="flex items-center gap-2 text-sm bg-blue-50 p-2 rounded border border-blue-200 mt-2">
                        <Star className="h-4 w-4 text-blue-600" />
                        <span className="text-blue-700">AI Agent will auto-apply when you swipe right</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => window.open(job.url || job.applicationUrl, '_blank')}
                >
                  View on {job.source === 'linkedin' ? 'LinkedIn' : 'Job Board'}
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="pt-0 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full" 
            onClick={() => setShowDetails(prev => !prev)}
          >
            {showDetails ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Show More
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default JobCard;
