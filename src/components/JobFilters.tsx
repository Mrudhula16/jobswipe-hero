
import { useEffect, useState } from "react";
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
import { useJobFilters } from "@/hooks/useJobFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterOption } from "@/services/jobService";

interface JobFiltersProps {
  onFilterChange?: (filters: Record<string, string[]>) => void;
  onApplyFilters?: (filters: Record<string, any>) => void;
  isFiltering?: boolean;
}

const JobFilters = ({ onFilterChange, onApplyFilters, isFiltering = false }: JobFiltersProps) => {
  const { filterCategories, filterOptions, isLoading } = useJobFilters();
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Initialize selected filters with empty arrays for each category
  useEffect(() => {
    if (filterCategories.length > 0) {
      const initialFilters: Record<string, string[]> = {};
      filterCategories.forEach(category => {
        initialFilters[category.name] = [];
      });
      setSelectedFilters(initialFilters);
    }
  }, [filterCategories]);

  const handleFilterChange = (groupName: string, value: string) => {
    setSelectedFilters(prev => {
      // Check if value is already selected
      const isSelected = prev[groupName]?.includes(value);
      
      // Create a new array with or without the value
      const newValues = isSelected
        ? prev[groupName].filter(item => item !== value)
        : [...(prev[groupName] || []), value];
      
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
    const emptyFilters: Record<string, string[]> = {};
    filterCategories.forEach(category => {
      emptyFilters[category.name] = [];
    });
    
    setSelectedFilters(emptyFilters);
    if (onFilterChange) {
      onFilterChange(emptyFilters);
    }
  };

  const applyFilters = () => {
    if (onApplyFilters) {
      // Convert selected filters to format expected by the API
      const formattedFilters = {
        jobType: selectedFilters['job_type'] || [],
        experienceLevel: selectedFilters['experience_level']?.length > 0 ? selectedFilters['experience_level'][0] : '',
        industry: selectedFilters['industry']?.length > 0 ? selectedFilters['industry'][0] : '',
        skills: selectedFilters['skills'] || [],
        jobFunction: selectedFilters['job_function'] || []
      };
      
      onApplyFilters(formattedFilters);
    }
  };

  const getTotalSelectedFilters = () => {
    return Object.values(selectedFilters).reduce((total, filters) => total + filters.length, 0);
  };

  const totalSelectedFilters = getTotalSelectedFilters();

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-8 w-24" />
          ))}
        </div>
      </div>
    );
  }

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
        {filterCategories.map((category) => (
          <Popover 
            key={category.name} 
            open={activeFilter === category.name}
            onOpenChange={(open) => setActiveFilter(open ? category.name : null)}
          >
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className={`h-8 text-xs ${selectedFilters[category.name]?.length > 0 ? 'border-primary/50 bg-primary/5' : ''}`}
              >
                {category.name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                {selectedFilters[category.name]?.length > 0 && (
                  <Badge className="ml-2 h-5 bg-primary/20 text-primary hover:bg-primary/30" variant="secondary">
                    {selectedFilters[category.name].length}
                  </Badge>
                )}
                <ChevronDown className="ml-1 h-3 w-3 opacity-70" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start">
              <Command>
                <CommandInput placeholder={`Search ${category.name.split('_').join(' ')}...`} />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {filterOptions[category.name]?.map((option: FilterOption) => {
                      const isSelected = selectedFilters[category.name]?.includes(option.value);
                      return (
                        <CommandItem
                          key={option.id}
                          onSelect={() => handleFilterChange(category.name, option.value)}
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
          {filterCategories.map(category => (
            selectedFilters[category.name]?.length > 0 && (
              <div key={category.name} className="flex flex-wrap gap-1">
                {selectedFilters[category.name].map((value) => {
                  const option = filterOptions[category.name]?.find(opt => opt.value === value);
                  return option ? (
                    <Badge 
                      key={value} 
                      variant="secondary" 
                      className="flex items-center gap-1 bg-secondary/80"
                    >
                      <span className="text-xs font-normal">{option.label}</span>
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleFilterChange(category.name, value)}
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
