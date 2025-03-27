
import { useState } from "react";
import { Filter, Check, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterGroup {
  name: string;
  options: FilterOption[];
}

// Common filter groups used by job platforms like LinkedIn/Glassdoor
const filterGroups: FilterGroup[] = [
  {
    name: "Job Type",
    options: [
      { value: "full-time", label: "Full-time" },
      { value: "part-time", label: "Part-time" },
      { value: "contract", label: "Contract" },
      { value: "temporary", label: "Temporary" },
      { value: "internship", label: "Internship" },
      { value: "remote", label: "Remote" },
    ],
  },
  {
    name: "Experience Level",
    options: [
      { value: "entry", label: "Entry level" },
      { value: "mid", label: "Mid-Senior level" },
      { value: "senior", label: "Senior level" },
      { value: "director", label: "Director" },
      { value: "executive", label: "Executive" },
    ],
  },
  {
    name: "Industry",
    options: [
      { value: "tech", label: "Information Technology" },
      { value: "healthcare", label: "Healthcare" },
      { value: "finance", label: "Finance" },
      { value: "education", label: "Education" },
      { value: "retail", label: "Retail" },
      { value: "manufacturing", label: "Manufacturing" },
      { value: "media", label: "Media & Communication" },
      { value: "consulting", label: "Consulting" },
      { value: "government", label: "Government" },
    ],
  },
  {
    name: "Salary Range",
    options: [
      { value: "0-50k", label: "$0 - $50,000" },
      { value: "50k-70k", label: "$50,000 - $70,000" },
      { value: "70k-100k", label: "$70,000 - $100,000" },
      { value: "100k-150k", label: "$100,000 - $150,000" },
      { value: "150k+", label: "$150,000+" },
    ],
  },
  {
    name: "Skills",
    options: [
      { value: "javascript", label: "JavaScript" },
      { value: "python", label: "Python" },
      { value: "react", label: "React" },
      { value: "sql", label: "SQL" },
      { value: "java", label: "Java" },
      { value: "product-management", label: "Product Management" },
      { value: "marketing", label: "Marketing" },
      { value: "sales", label: "Sales" },
      { value: "design", label: "Design" },
      { value: "data-analysis", label: "Data Analysis" },
    ],
  },
  {
    name: "Date Posted",
    options: [
      { value: "24h", label: "Past 24 hours" },
      { value: "week", label: "Past week" },
      { value: "month", label: "Past month" },
      { value: "any", label: "Any time" },
    ],
  },
];

interface JobFiltersProps {
  onFilterChange?: (filters: Record<string, string[]>) => void;
  onApplyFilters?: (filters: Record<string, any>) => void;
  isFiltering?: boolean;
}

const JobFilters = ({ onFilterChange, onApplyFilters, isFiltering = false }: JobFiltersProps) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(
    Object.fromEntries(filterGroups.map(group => [group.name, []]))
  );
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleFilterChange = (groupName: string, value: string) => {
    setSelectedFilters(prev => {
      // Check if value is already selected
      const isSelected = prev[groupName].includes(value);
      
      // Create a new array with or without the value
      const newValues = isSelected
        ? prev[groupName].filter(item => item !== value)
        : [...prev[groupName], value];
      
      const newFilters = {
        ...prev,
        [groupName]: newValues,
      };
      
      // Call the callback if provided
      if (onFilterChange) {
        onFilterChange(newFilters);
      }
      
      return newFilters;
    });
  };

  const resetFilters = () => {
    const emptyFilters = Object.fromEntries(filterGroups.map(group => [group.name, []]));
    setSelectedFilters(emptyFilters);
    if (onFilterChange) {
      onFilterChange(emptyFilters);
    }
  };

  const applyFilters = () => {
    if (onApplyFilters) {
      // Convert selected filters to format expected by the API
      const formattedFilters = {
        jobType: selectedFilters['Job Type'],
        experienceLevel: selectedFilters['Experience Level'].length > 0 ? selectedFilters['Experience Level'][0] : '',
        industry: selectedFilters['Industry'].length > 0 ? selectedFilters['Industry'][0] : '',
        skills: selectedFilters['Skills'],
        jobFunction: selectedFilters['Job Type']
      };
      
      onApplyFilters(formattedFilters);
    }
  };

  const totalSelectedFilters = Object.values(selectedFilters).flat().length;

  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </h3>
        {totalSelectedFilters > 0 && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-xs">
            Clear all
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {filterGroups.map((group) => (
          <Popover 
            key={group.name} 
            open={activeFilter === group.name}
            onOpenChange={(open) => setActiveFilter(open ? group.name : null)}
          >
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className={`h-8 text-xs ${selectedFilters[group.name].length > 0 ? 'border-primary/50 bg-primary/5' : ''}`}
              >
                {group.name}
                {selectedFilters[group.name].length > 0 && (
                  <Badge className="ml-2 h-5 bg-primary/20 text-primary hover:bg-primary/30" variant="secondary">
                    {selectedFilters[group.name].length}
                  </Badge>
                )}
                <ChevronDown className="ml-1 h-3 w-3 opacity-70" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start">
              <Command>
                <CommandInput placeholder={`Search ${group.name.toLowerCase()}...`} />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {group.options.map((option) => {
                      const isSelected = selectedFilters[group.name].includes(option.value);
                      return (
                        <CommandItem
                          key={option.value}
                          onSelect={() => handleFilterChange(group.name, option.value)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <div className={`flex h-4 w-4 items-center justify-center rounded border ${
                            isSelected ? 'bg-primary border-primary' : 'border-input'
                          }`}>
                            {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                          </div>
                          <span>{option.label}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        ))}
      </div>

      {totalSelectedFilters > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          {filterGroups.map(group => (
            selectedFilters[group.name].length > 0 && (
              <div key={group.name} className="flex flex-wrap gap-1">
                {selectedFilters[group.name].map((value) => {
                  const option = group.options.find(opt => opt.value === value);
                  return option ? (
                    <Badge 
                      key={value} 
                      variant="secondary" 
                      className="flex items-center gap-1 bg-secondary/80"
                    >
                      <span className="text-xs font-normal">{option.label}</span>
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleFilterChange(group.name, value)}
                      />
                    </Badge>
                  ) : null;
                })}
              </div>
            )
          ))}
        </div>
      )}
      
      <div className="pt-4 flex justify-end">
        <Button 
          onClick={applyFilters} 
          disabled={isFiltering}
          size="sm"
        >
          {isFiltering ? (
            <>
              <span className="mr-2">Applying...</span>
              <span className="animate-spin">⟳</span>
            </>
          ) : (
            'Apply Filters'
          )}
        </Button>
      </div>
    </div>
  );
};

export default JobFilters;
