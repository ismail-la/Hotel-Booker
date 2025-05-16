import { Room } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Users, Hotel, Ruler, Mountain } from "lucide-react";
import { useBookingContext } from "@/context/BookingContext";
import { useLocation } from "wouter";

interface RoomCardProps {
  room: Room;
  hotelId: number;
  hotelName: string;
}

export default function RoomCard({ room, hotelId, hotelName }: RoomCardProps) {
  const { setBookingData } = useBookingContext();
  const [, setLocation] = useLocation();
  
  // Calculate discounted price
  const discountedPrice = room.discountPercentage > 0
    ? room.pricePerNight * (1 - room.discountPercentage / 100)
    : room.pricePerNight;

  // Format price as $X
  const formatPrice = (price: number) => {
    return `$${Math.round(price)}`;
  };

  // Handle booking button click
  const handleBookNow = () => {
    setBookingData({
      hotelId,
      hotelName,
      roomId: room.id,
      roomName: room.name,
      pricePerNight: discountedPrice,
      maxGuests: room.maxGuests,
      image: room.image || ""
    });
    
    setLocation("/booking");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-neutral-200">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 h-60 md:h-auto">
          <img 
            src={room.image || "https://images.unsplash.com/photo-1560185007-5f0bb1866cab"} 
            alt={room.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:w-3/4 p-5">
          <div className="flex flex-wrap justify-between">
            <div>
              <h3 className="font-heading font-semibold text-xl">{room.name}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary" className="flex items-center gap-1 bg-neutral-100">
                  <Hotel className="h-3 w-3" /> {room.bedType}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1 bg-neutral-100">
                  <Users className="h-3 w-3" /> {room.maxGuests} Guests
                </Badge>
                {room.size && (
                  <Badge variant="secondary" className="flex items-center gap-1 bg-neutral-100">
                    <Ruler className="h-3 w-3" /> {room.size}
                  </Badge>
                )}
                {room.view && (
                  <Badge variant="secondary" className="flex items-center gap-1 bg-neutral-100">
                    <Mountain className="h-3 w-3" /> {room.view}
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right mt-4 md:mt-0">
              {room.discountPercentage > 0 && (
                <div className="text-sm text-neutral-600 line-through">
                  {formatPrice(room.pricePerNight)}
                </div>
              )}
              <div className="text-xl font-semibold text-primary">
                {formatPrice(discountedPrice)}
              </div>
              <div className="text-sm text-neutral-500">per night</div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-neutral-600 mb-4">
              {room.description}
            </p>
            <div className="flex flex-wrap justify-between items-center">
              <div className="text-sm text-success font-medium">
                <Check className="inline h-4 w-4 mr-1" />
                Free cancellation until 24 hours before check-in
              </div>
              <Button 
                variant="secondary" 
                onClick={handleBookNow}
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
