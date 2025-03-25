
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const JobCardSkeleton = () => {
  return (
    <Card className="w-full h-full max-w-md mx-auto overflow-hidden neo-card absolute inset-0 animate-pulse">
      {/* Header Skeleton */}
      <div className="relative h-32 bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-center">
        <Skeleton className="h-16 w-16 rounded-md" />
      </div>
      
      <div className="p-5 space-y-4">
        {/* Title & Company Skeleton */}
        <div>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        
        {/* Job Details Skeleton */}
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        
        {/* Badge Skeleton */}
        <Skeleton className="h-6 w-20" />
        
        {/* Description Skeleton */}
        <div>
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        {/* Requirements Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 mb-2" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </div>
      
      {/* Action Buttons Skeleton */}
      <div className="p-5 pt-0 flex justify-between">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-32 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </Card>
  );
};

export default JobCardSkeleton;
