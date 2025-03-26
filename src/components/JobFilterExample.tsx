
import React, { useState, useEffect } from "react";
import FilterDropdown from "./FilterDropdown";
import { JobPlatformFilters } from "@/services/jobSourcesService";
import { getJobPlatformFilters } from "@/services/jobSourcesService";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import JobList from "./JobList";
import { RefreshCw } from "lucide-react";

const JobFilterExample = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<JobPlatformFilters | null>(null);
  const [selectedFilters, setSelectedFilters] = useState({
    roles: [] as string[],
    industries: [] as string[],
    companySizes: [] as string[],
    locations: [] as string[],
    skills: [] as string[],
    salaryRange: "",
    jobType: [] as string[],
    experienceLevel: "",
    isRemote: false,
  });

  const loadFilters = async () => {
    setIsLoading(true);
    try {
      // This uses the mock data from jobSourcesService
      const filterOptions = await getJobPlatformFilters();
      setFilters(filterOptions);
      toast({
        title: "Filters Loaded",
        description: "Filter options loaded successfully from mock data.",
      });
    } catch (error) {
      console.error("Error loading filters:", error);
      toast({
        title: "Error",
        description: "Failed to load filter options.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load filters on component mount
  useEffect(() => {
    loadFilters();
  }, []);

  // Handle filter changes
  const handleFilterChange = (filterName: keyof typeof selectedFilters, value: string | string[] | boolean) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Convert selected filters to the format expected by jobService
  const getFormattedFilters = () => {
    return {
      roles: selectedFilters.roles,
      industries: selectedFilters.industries,
      location: selectedFilters.locations.length > 0 ? selectedFilters.locations[0] : "",
      jobType: selectedFilters.jobType,
      isRemote: selectedFilters.isRemote,
      skills: selectedFilters.skills,
      experienceLevel: selectedFilters.experienceLevel,
      salary: selectedFilters.salaryRange,
    };
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Job Filter Options</h2>
        <Button onClick={loadFilters} disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              {filters ? "Reload Filters" : "Load Filter Options"}
            </>
          )}
        </Button>
      </div>

      {filters ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FilterDropdown
              label="Job Roles"
              options={filters.roles.map(role => ({ value: role.toLowerCase().replace(/\s+/g, '-'), label: role }))}
              value={selectedFilters.roles}
              onChange={(value) => handleFilterChange("roles", value as string[])}
              placeholder="Select job roles"
              multiSelect={true}
            />

            <FilterDropdown
              label="Industries"
              options={filters.industries.map(industry => ({ value: industry.toLowerCase().replace(/\s+/g, '-'), label: industry }))}
              value={selectedFilters.industries}
              onChange={(value) => handleFilterChange("industries", value as string[])}
              placeholder="Select industries"
              multiSelect={true}
            />

            <FilterDropdown
              label="Company Sizes"
              options={filters.companySizes.map(size => ({ value: size.toLowerCase().replace(/\s+/g, '-'), label: size }))}
              value={selectedFilters.companySizes}
              onChange={(value) => handleFilterChange("companySizes", value as string[])}
              placeholder="Select company sizes"
              multiSelect={true}
            />

            <FilterDropdown
              label="Locations"
              options={filters.locations.map(location => ({ value: location.toLowerCase().replace(/\s+/g, '-'), label: location }))}
              value={selectedFilters.locations}
              onChange={(value) => handleFilterChange("locations", value as string[])}
              placeholder="Select locations"
              multiSelect={true}
            />

            <FilterDropdown
              label="Skills"
              options={filters.skills.map(skill => ({ value: skill.toLowerCase().replace(/\s+/g, '-'), label: skill }))}
              value={selectedFilters.skills}
              onChange={(value) => handleFilterChange("skills", value as string[])}
              placeholder="Select skills"
              multiSelect={true}
            />

            <FilterDropdown
              label="Salary Range"
              options={filters.salaryRanges.map(range => ({ value: `${range.min}-${range.max}`, label: range.label }))}
              value={selectedFilters.salaryRange}
              onChange={(value) => handleFilterChange("salaryRange", value as string)}
              placeholder="Select salary range"
              multiSelect={false}
            />

            <FilterDropdown
              label="Job Type"
              options={[
                { value: "full-time", label: "Full-time" },
                { value: "part-time", label: "Part-time" },
                { value: "contract", label: "Contract" },
                { value: "internship", label: "Internship" },
                { value: "temporary", label: "Temporary" }
              ]}
              value={selectedFilters.jobType}
              onChange={(value) => handleFilterChange("jobType", value as string[])}
              placeholder="Select job type"
              multiSelect={true}
            />

            <FilterDropdown
              label="Experience Level"
              options={[
                { value: "entry", label: "Entry Level" },
                { value: "mid", label: "Mid Level" },
                { value: "senior", label: "Senior Level" },
                { value: "executive", label: "Executive" }
              ]}
              value={selectedFilters.experienceLevel}
              onChange={(value) => handleFilterChange("experienceLevel", value as string)}
              placeholder="Select experience level"
              multiSelect={false}
            />

            <div className="flex items-center h-full">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedFilters.isRemote}
                  onChange={(e) => handleFilterChange("isRemote", e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                <span className="ms-3 text-sm font-medium">Remote Only</span>
              </label>
            </div>
          </div>

          {/* Display applied filters summary if any filters are selected */}
          {Object.entries(selectedFilters).some(([key, value]) => 
            Array.isArray(value) ? value.length > 0 : value !== "" && value !== false
          ) && (
            <div className="mt-4 p-4 border rounded-md bg-secondary/20">
              <h3 className="font-medium mb-2">Applied Filters:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedFilters.roles.length > 0 && (
                  <Badge variant="secondary" className="px-3 py-1">
                    Roles: {selectedFilters.roles.length}
                  </Badge>
                )}
                {selectedFilters.industries.length > 0 && (
                  <Badge variant="secondary" className="px-3 py-1">
                    Industries: {selectedFilters.industries.length}
                  </Badge>
                )}
                {selectedFilters.companySizes.length > 0 && (
                  <Badge variant="secondary" className="px-3 py-1">
                    Company Sizes: {selectedFilters.companySizes.length}
                  </Badge>
                )}
                {selectedFilters.locations.length > 0 && (
                  <Badge variant="secondary" className="px-3 py-1">
                    Locations: {selectedFilters.locations.length}
                  </Badge>
                )}
                {selectedFilters.skills.length > 0 && (
                  <Badge variant="secondary" className="px-3 py-1">
                    Skills: {selectedFilters.skills.length}
                  </Badge>
                )}
                {selectedFilters.salaryRange && (
                  <Badge variant="secondary" className="px-3 py-1">
                    Salary: {selectedFilters.salaryRange}
                  </Badge>
                )}
                {selectedFilters.jobType.length > 0 && (
                  <Badge variant="secondary" className="px-3 py-1">
                    Job Type: {selectedFilters.jobType.length}
                  </Badge>
                )}
                {selectedFilters.experienceLevel && (
                  <Badge variant="secondary" className="px-3 py-1">
                    Experience: {selectedFilters.experienceLevel}
                  </Badge>
                )}
                {selectedFilters.isRemote && (
                  <Badge variant="secondary" className="px-3 py-1">
                    Remote Only
                  </Badge>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-auto"
                  onClick={() => setSelectedFilters({
                    roles: [],
                    industries: [],
                    companySizes: [],
                    locations: [],
                    skills: [],
                    salaryRange: "",
                    jobType: [],
                    experienceLevel: "",
                    isRemote: false,
                  })}
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}
          
          {/* Real-time job results */}
          <div className="mt-8 border-t pt-8">
            <JobList filters={getFormattedFilters()} />
          </div>
        </div>
      ) : (
        <div className="text-center p-12 bg-muted rounded-md">
          <p className="text-muted-foreground">
            Click the button above to load filter options from mock data.
          </p>
        </div>
      )}
    </div>
  );
};

export default JobFilterExample;
