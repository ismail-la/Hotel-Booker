import { useState } from "react";
import { useNavigate } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { MapPin, Calendar as CalendarIcon, User, Search } from "lucide-react";

interface SearchFormProps {
  className?: string;
}

export default function HotelSearchForm({ className }: SearchFormProps) {
  const [, navigate] = useNavigate();
  const [destination, setDestination] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [guestCount, setGuestCount] = useState("2");
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Convert dates to string format
  const getFormattedDateRange = () => {
    if (!dateRange.from) return "Add dates";
    if (!dateRange.to) return format(dateRange.from, "MMM d, yyyy");
    return `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`;
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query parameters
    const params = new URLSearchParams();
    if (destination) params.append("location", destination);
    if (dateRange.from) params.append("checkIn", format(dateRange.from, "yyyy-MM-dd"));
    if (dateRange.to) params.append("checkOut", format(dateRange.to, "yyyy-MM-dd"));
    params.append("guests", guestCount);
    
    // Navigate to hotels page with filters
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <form 
      onSubmit={handleSearch}
      className={`${className} text-neutral-800`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1 text-left">Destination</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 h-4 w-4" />
            <Input 
              type="text" 
              placeholder="Where are you going?" 
              className="w-full pl-10 pr-4 py-6" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1 text-left">Check-in / Check-out</label>
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 h-4 w-4" />
                <Input 
                  type="text" 
                  placeholder="Add dates" 
                  className="w-full pl-10 pr-4 py-6 cursor-pointer" 
                  value={getFormattedDateRange()}
                  readOnly 
                  onClick={() => setDatePickerOpen(true)}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range);
                  if (range.to) {
                    setDatePickerOpen(false);
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-1 text-left">Guests</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 h-4 w-4" />
            <Select 
              value={guestCount} 
              onValueChange={setGuestCount}
            >
              <SelectTrigger className="w-full pl-10 py-6">
                <SelectValue placeholder="Select guests" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Guest</SelectItem>
                <SelectItem value="2">2 Guests</SelectItem>
                <SelectItem value="3">3 Guests</SelectItem>
                <SelectItem value="4">4 Guests</SelectItem>
                <SelectItem value="5">5+ Guests</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Button type="submit" variant="secondary" className="w-full py-6 text-base">
          <Search className="mr-2 h-4 w-4" /> Search Hotels
        </Button>
      </div>
    </form>
  );
}
