
import React, { useState } from "react";
import FilterDropdown from "./FilterDropdown";
import { JobPlatformFilters } from "@/services/jobSourcesService";
import { getJobPlatformFilters } from "@/services/jobSourcesService";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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

  // Handle filter changes
  const handleFilterChange = (filterName: keyof typeof selectedFilters, value: string | string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Job Filter Options</h2>
        <Button onClick={loadFilters} disabled={isLoading}>
          {isLoading ? "Loading..." : filters ? "Reload Filters" : "Load Filter Options"}
        </Button>
      </div>

      {filters ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            multiSelect={false}
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
        </div>
      ) : (
        <div className="text-center p-12 bg-muted rounded-md">
          <p className="text-muted-foreground">
            Click the button above to load filter options from mock data.
          </p>
        </div>
      )}

      {filters && Object.values(selectedFilters).some(val => 
        Array.isArray(val) ? val.length > 0 : val !== ""
      ) && (
        <div className="mt-8 p-4 border rounded-md bg-secondary/20">
          <h3 className="font-medium mb-2">Selected Filters:</h3>
          <pre className="bg-background p-4 rounded-md overflow-auto max-h-60">
            {JSON.stringify(selectedFilters, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default JobFilterExample;
