import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";

interface HotelFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  priceRange: [number, number];
  starRatings: number[];
  amenities: string[];
}

const amenitiesList = [
  { value: "wifi", label: "Free WiFi" },
  { value: "breakfast", label: "Breakfast Included" },
  { value: "pool", label: "Swimming Pool" },
  { value: "parking", label: "Free Parking" },
  { value: "gym", label: "Fitness Center" }
];

export default function HotelFilters({ onFilterChange }: HotelFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [minPrice, setMinPrice] = useState<string>("0");
  const [maxPrice, setMaxPrice] = useState<string>("500");
  const [starRatings, setStarRatings] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Handle price range slider change
  const handlePriceSliderChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[0] === 500 ? 1000 : value[0]];
    setPriceRange(newRange);
    setMinPrice(newRange[0].toString());
    setMaxPrice(newRange[1].toString());
  };

  // Handle min price input change
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPrice(value);
    if (value === "" || isNaN(Number(value))) return;
    
    const newMin = Math.max(0, parseInt(value));
    setPriceRange([newMin, priceRange[1]]);
  };

  // Handle max price input change
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPrice(value);
    if (value === "" || isNaN(Number(value))) return;
    
    const newMax = Math.min(1000, parseInt(value));
    setPriceRange([priceRange[0], newMax]);
  };

  // Handle star rating checkbox change
  const handleStarRatingChange = (rating: number) => {
    const updatedRatings = starRatings.includes(rating)
      ? starRatings.filter(r => r !== rating)
      : [...starRatings, rating];
    
    setStarRatings(updatedRatings);
  };

  // Handle amenity checkbox change
  const handleAmenityChange = (amenity: string) => {
    const updatedAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
    
    setSelectedAmenities(updatedAmenities);
  };

  // Apply filters
  const applyFilters = () => {
    onFilterChange({
      priceRange,
      starRatings,
      amenities: selectedAmenities
    });
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm">
      <h3 className="font-heading font-semibold text-lg mb-4">Filters</h3>
      
      {/* Price Range Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-sm uppercase text-neutral-600 mb-3">Price Range</h4>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-sm text-neutral-600">$0</span>
            <span className="text-sm text-neutral-600">$500+</span>
          </div>
          <Slider 
            defaultValue={[priceRange[0]]} 
            max={500} 
            step={10}
            onValueChange={handlePriceSliderChange}
          />
        </div>
        <div className="flex justify-between">
          <div className="w-[48%]">
            <Label className="block text-sm text-neutral-600 mb-1">Min ($)</Label>
            <Input 
              type="number" 
              placeholder="0" 
              value={minPrice}
              onChange={handleMinPriceChange}
              className="w-full px-3 py-2"
            />
          </div>
          <div className="w-[48%]">
            <Label className="block text-sm text-neutral-600 mb-1">Max ($)</Label>
            <Input 
              type="number" 
              placeholder="500+" 
              value={maxPrice}
              onChange={handleMaxPriceChange}
              className="w-full px-3 py-2"
            />
          </div>
        </div>
      </div>
      
      {/* Star Rating Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-sm uppercase text-neutral-600 mb-3">Star Rating</h4>
        <div className="space-y-2">
          {[5, 4, 3].map(rating => (
            <div key={rating} className="flex items-center">
              <Checkbox 
                id={`rating-${rating}`}
                checked={starRatings.includes(rating)}
                onCheckedChange={() => handleStarRatingChange(rating)}
                className="mr-2"
              />
              <Label htmlFor={`rating-${rating}`} className="flex text-yellow-400 cursor-pointer">
                {Array(rating).fill(0).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
                {Array(5 - rating).fill(0).map((_, i) => (
                  <Star key={i + rating} className="h-4 w-4 text-neutral-300" />
                ))}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Amenities Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-sm uppercase text-neutral-600 mb-3">Amenities</h4>
        <div className="space-y-2">
          {amenitiesList.map(amenity => (
            <div key={amenity.value} className="flex items-center">
              <Checkbox 
                id={`amenity-${amenity.value}`}
                checked={selectedAmenities.includes(amenity.value)}
                onCheckedChange={() => handleAmenityChange(amenity.value)}
                className="mr-2"
              />
              <Label 
                htmlFor={`amenity-${amenity.value}`}
                className="text-sm cursor-pointer"
              >
                {amenity.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Apply Filters Button */}
      <Button className="w-full" onClick={applyFilters}>
        Apply Filters
      </Button>
    </div>
  );
}
