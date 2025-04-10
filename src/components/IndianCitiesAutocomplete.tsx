
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { MapPin } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const popularIndianCities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", 
  "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", 
  "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", 
  "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", 
  "Kalyan-Dombivli", "Vasai-Virar", "Varanasi", "Srinagar", "Aurangabad", 
  "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", 
  "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada", "Jodhpur", "Madurai", 
  "Raipur", "Kota", "Chandigarh", "Guwahati", "Solapur", "Hubli–Dharwad", 
  "Mysore", "Tiruchirappalli", "Bareilly", "Aligarh", "Tiruppur", "Gurgaon", 
  "Noida", "Moradabad", "Jalandhar", "Bhubaneswar", "Salem", "Warangal", 
  "Mira-Bhayandar", "Jalgaon", "Kochi", "Gorakhpur", "Bhiwandi", "Saharanpur"
];

interface IndianCitiesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const IndianCitiesAutocomplete = ({ value, onChange, placeholder = "Enter city name..." }: IndianCitiesAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);

  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredCities(popularIndianCities.slice(0, 10));
    } else {
      const filtered = popularIndianCities.filter(city => 
        city.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredCities(filtered.slice(0, 15));
    }
  }, [inputValue]);

  const handleSelect = (city: string) => {
    onChange(city);
    setInputValue(city);
    setOpen(false);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <MapPin className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div>
            <Input
              placeholder={placeholder}
              className="pl-10"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setOpen(true)}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search cities..." value={inputValue} onValueChange={setInputValue} />
            <CommandList>
              <CommandEmpty>No cities found.</CommandEmpty>
              <CommandGroup heading="Popular Cities in India">
                {filteredCities.map((city) => (
                  <CommandItem key={city} onSelect={() => handleSelect(city)}>
                    <MapPin className="h-4 w-4 mr-2" />
                    {city}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default IndianCitiesAutocomplete;
