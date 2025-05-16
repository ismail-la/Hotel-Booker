import { useState } from "react";
import { useNavigate } from "wouter";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, User, Smile } from "lucide-react";
import { useBookingContext } from "@/context/BookingContext";
import { useToast } from "@/hooks/use-toast";

interface BookingFormProps {
  onContinue: () => void;
}

export default function BookingForm({ onContinue }: BookingFormProps) {
  const { bookingData, setBookingData } = useBookingContext();
  const [, navigate] = useNavigate();
  const { toast } = useToast();
  
  // Initialize state for form fields
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 3))
  });
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [specialRequests, setSpecialRequests] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Format dates for display
  const formatDateRange = () => {
    if (!date.from) return "";
    if (!date.to) return format(date.from, "MMM d, yyyy");
    return `${format(date.from, "MMM d, yyyy")} - ${format(date.to, "MMM d, yyyy")}`;
  };

  // Handle back button
  const handleBack = () => {
    navigate(`/hotels/${bookingData.hotelId}`);
  };

  // Handle continue button
  const handleContinue = () => {
    if (!date.from || !date.to) {
      toast({
        title: "Missing dates",
        description: "Please select check-in and check-out dates",
        variant: "destructive"
      });
      return;
    }

    // Calculate number of nights
    const nights = Math.max(1, Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Update booking context with form data
    setBookingData({
      ...bookingData,
      checkInDate: date.from,
      checkOutDate: date.to,
      guestCount: parseInt(adults) + parseInt(children),
      adultCount: parseInt(adults),
      childCount: parseInt(children),
      specialRequests,
      nights,
      totalPrice: bookingData.pricePerNight * nights
    });
    
    onContinue();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="font-heading font-semibold text-xl mb-4">Room Selection</h2>
      
      {/* Selected Room Overview */}
      <div className="flex items-center p-4 border border-neutral-200 rounded-lg mb-6">
        <img 
          src={bookingData.image} 
          alt={bookingData.roomName} 
          className="w-20 h-20 object-cover rounded mr-4"
        />
        <div className="flex-grow">
          <h3 className="font-medium text-lg">{bookingData.roomName}</h3>
          <div className="text-sm text-neutral-600">{bookingData.hotelName}</div>
          <div className="flex items-center mt-1 text-sm">
            <User className="mr-1 h-4 w-4 text-neutral-500" />
            <span>Max {bookingData.maxGuests} Guests</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-primary">${bookingData.pricePerNight}</div>
          <div className="text-sm text-neutral-500">per night</div>
        </div>
      </div>
      
      {/* Check-in/Check-out Dates */}
      <div className="mb-6">
        <Label className="block font-medium mb-2">Stay Dates</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="block text-sm text-neutral-600 mb-1">Check-in / Check-out</Label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 h-4 w-4" />
                  <Input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-6 cursor-pointer" 
                    value={formatDateRange()}
                    readOnly 
                    onClick={() => setDatePickerOpen(true)}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date.from}
                  selected={date}
                  onSelect={(range) => {
                    setDate(range);
                    if (range.to) {
                      setDatePickerOpen(false);
                    }
                  }}
                  numberOfMonths={2}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      
      {/* Guest Count */}
      <div className="mb-6">
        <Label className="block font-medium mb-2">Number of Guests</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="block text-sm text-neutral-600 mb-1">Adults</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 h-4 w-4" />
              <Select value={adults} onValueChange={setAdults}>
                <SelectTrigger className="w-full pl-10">
                  <SelectValue placeholder="Select adults" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Adult</SelectItem>
                  <SelectItem value="2">2 Adults</SelectItem>
                  <SelectItem value="3">3 Adults</SelectItem>
                  <SelectItem value="4">4 Adults</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="block text-sm text-neutral-600 mb-1">Children</Label>
            <div className="relative">
              <Smile className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 h-4 w-4" />
              <Select value={children} onValueChange={setChildren}>
                <SelectTrigger className="w-full pl-10">
                  <SelectValue placeholder="Select children" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 Children</SelectItem>
                  <SelectItem value="1">1 Child</SelectItem>
                  <SelectItem value="2">2 Children</SelectItem>
                  <SelectItem value="3">3 Children</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Special Requests */}
      <div className="mb-6">
        <Label className="block font-medium mb-2">Special Requests (Optional)</Label>
        <Textarea 
          rows={3} 
          placeholder="Any special requests or preferences?" 
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
        />
        <p className="text-xs text-neutral-500 mt-1">
          Special requests cannot be guaranteed but we will do our best to accommodate your needs.
        </p>
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button onClick={handleContinue}>
          Continue to Guest Details
        </Button>
      </div>
    </div>
  );
}
