
import { useState, useEffect } from 'react';
import { FilterCategory, FilterOption, getJobFilterCategories, getFilterOptionsByCategory } from '@/services/jobService';
import { useToast } from '@/hooks/use-toast';

interface UseJobFiltersReturn {
  filterCategories: FilterCategory[];
  filterOptions: Record<string, FilterOption[]>;
  isLoading: boolean;
  getOptionsByCategory: (categoryName: string) => FilterOption[];
  getLabelByValue: (categoryName: string, value: string) => string;
}

export const useJobFilters = (): UseJobFiltersReturn => {
  const [filterCategories, setFilterCategories] = useState<FilterCategory[]>([]);
  const [filterOptions, setFilterOptions] = useState<Record<string, FilterOption[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load filter categories and options on mount
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        setIsLoading(true);
        const categories = await getJobFilterCategories();
        
        // Organize options by category name for easier lookup
        const optionsByCategory: Record<string, FilterOption[]> = {};
        categories.forEach(category => {
          optionsByCategory[category.name] = category.options;
        });
        
        setFilterCategories(categories);
        setFilterOptions(optionsByCategory);
      } catch (error) {
        console.error("Error loading job filters:", error);
        toast({
          title: "Error",
          description: "Failed to load job filter options. Please refresh the page.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadFilterData();
  }, [toast]);

  // Get options for a specific category
  const getOptionsByCategory = (categoryName: string): FilterOption[] => {
    return filterOptions[categoryName] || [];
  };

  // Get label for a given value in a category
  const getLabelByValue = (categoryName: string, value: string): string => {
    const options = filterOptions[categoryName] || [];
    const option = options.find(opt => opt.value === value);
    return option?.label || value;
  };

  return {
    filterCategories,
    filterOptions,
    isLoading,
    getOptionsByCategory,
    getLabelByValue
  };
};

export default useJobFilters;
