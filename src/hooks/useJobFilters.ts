
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FilterOption {
  id: string;
  value: string;
  label: string;
  description?: string;
}

export interface FilterCategory {
  id: string;
  name: string;
  description?: string;
  options: FilterOption[];
}

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

  useEffect(() => {
    const loadFilterData = async () => {
      try {
        setIsLoading(true);
        
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('job_filter_categories')
          .select('*')
          .order('name');
        
        if (categoriesError) throw categoriesError;
        
        const { data: optionsData, error: optionsError } = await supabase
          .from('job_filter_options')
          .select('*')
          .order('label');
        
        if (optionsError) throw optionsError;
        
        const categories: FilterCategory[] = [];
        const optionsByCategory: Record<string, FilterOption[]> = {};
        
        categoriesData?.forEach(category => {
          const categoryOptions = optionsData?.filter(option => 
            option.category_id === category.id
          ) || [];
          
          const transformedCategory: FilterCategory = {
            id: category.id,
            name: category.name,
            description: category.description,
            options: categoryOptions.map(option => ({
              id: option.id,
              value: option.value,
              label: option.label,
              description: option.description
            }))
          };
          
          categories.push(transformedCategory);
          optionsByCategory[category.name] = transformedCategory.options;
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

  const getOptionsByCategory = (categoryName: string): FilterOption[] => {
    return filterOptions[categoryName] || [];
  };

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
