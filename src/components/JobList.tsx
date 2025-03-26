
import React, { useState, useEffect } from "react";
import { Job, getFilteredJobs } from "@/services/jobService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { BriefcaseIcon, Building, MapPin, Banknote, CalendarDays, Heart, ExternalLink } from "lucide-react";

interface JobListProps {
  filters: any;
}

const JobList: React.FC<JobListProps> = ({ filters }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch jobs whenever filters change
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const filteredJobs = await getFilteredJobs(filters);
        setJobs(filteredJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast({
          title: "Error",
          description: "Failed to load jobs. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [filters, toast]);

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs((prev) => {
      if (prev.includes(jobId)) {
        toast({
          title: "Job Removed",
          description: "Job has been removed from saved jobs",
        });
        return prev.filter((id) => id !== jobId);
      } else {
        toast({
          title: "Job Saved",
          description: "Job has been added to saved jobs",
        });
        return [...prev, jobId];
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Found {jobs.length} Job{jobs.length !== 1 && "s"}
        </h2>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6 bg-card animate-pulse">
              <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-20 bg-muted rounded w-full mb-4"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-muted rounded w-24"></div>
                <div className="h-8 bg-muted rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-secondary/20 rounded-lg border">
          <BriefcaseIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No jobs found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters to see more results
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex gap-4 items-start">
                  <div className="h-12 w-12 bg-secondary rounded-md flex items-center justify-center overflow-hidden">
                    {job.logo ? (
                      <img src={job.logo} alt={job.company} className="h-10 w-10 object-contain" />
                    ) : (
                      <Building className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-muted-foreground">{job.company}</p>
                  </div>
                </div>
                {job.isNew && (
                  <Badge variant="outline" className="bg-green-500/10 border-green-200 text-green-600">
                    New
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-1">
                    <Banknote className="h-4 w-4" />
                    <span>{job.salary}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>Posted {job.posted}</span>
                </div>
              </div>

              <div className="mt-4 text-sm line-clamp-3">{job.description}</div>

              {job.requirements && job.requirements.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Requirements</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.slice(0, 5).map((req, index) => (
                      <Badge key={index} variant="secondary" className="font-normal">
                        {req}
                      </Badge>
                    ))}
                    {job.requirements.length > 5 && (
                      <Badge variant="outline">+{job.requirements.length - 5} more</Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <Button variant="default" size="sm" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Apply Now
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSaveJob(job.id)}
                  className={`gap-2 ${
                    savedJobs.includes(job.id) ? "text-red-500 border-red-200 hover:bg-red-50" : ""
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${savedJobs.includes(job.id) ? "fill-red-500" : ""}`}
                  />
                  {savedJobs.includes(job.id) ? "Saved" : "Save"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
