
import React from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Option {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  options: Option[] | string[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  multiSelect?: boolean;
  className?: string;
}

const FilterDropdown = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select option",
  multiSelect = false,
  className = "",
}: FilterDropdownProps) => {
  // Convert string[] to Option[] if necessary
  const normalizedOptions: Option[] = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : (option as Option)
  );

  // For multi-select dropdowns
  if (multiSelect) {
    const selectedValues = Array.isArray(value) ? value : [];
    
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="text-sm font-medium">{label}</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full justify-between">
              <span>
                {selectedValues.length 
                  ? `${selectedValues.length} selected` 
                  : placeholder
                }
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-popover" align="start">
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {normalizedOptions.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={isSelected}
                  onCheckedChange={() => {
                    const newValue = isSelected
                      ? selectedValues.filter((item) => item !== option.value)
                      : [...selectedValues, option.value];
                    onChange(newValue);
                  }}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        {selectedValues.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedValues.map((selectedValue) => {
              const option = normalizedOptions.find(opt => opt.value === selectedValue);
              return option ? (
                <Badge 
                  key={selectedValue} 
                  variant="secondary"
                  className="flex items-center gap-1"
                  onClick={() => {
                    const newValue = selectedValues.filter(v => v !== selectedValue);
                    onChange(newValue);
                  }}
                >
                  {option.label}
                  <span className="cursor-pointer">×</span>
                </Badge>
              ) : null;
            })}
          </div>
        )}
      </div>
    );
  }

  // For single-select dropdowns
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium">{label}</label>
      <Select 
        value={value as string} 
        onValueChange={(val) => onChange(val)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {normalizedOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterDropdown;
