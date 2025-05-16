import { Hotel } from "@shared/schema";
import { Link } from "wouter";
import { Star, StarHalf, MapPin, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HotelCardProps {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  // Calculate discounted price
  const discountedPrice = hotel.discountPercentage > 0
    ? hotel.pricePerNight * (1 - hotel.discountPercentage / 100)
    : hotel.pricePerNight;

  // Format price as $X
  const formatPrice = (price: number) => {
    return `$${Math.round(price)}`;
  };

  // Sample amenities (would come from API in a real implementation)
  const sampleAmenities = ["Free WiFi", "Spa", "Pool", "Restaurant"];

  // Render rating stars
  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="fill-current h-4 w-4" />
        ))}
        {hasHalfStar && <StarHalf className="fill-current h-4 w-4" />}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={i + fullStars + (hasHalfStar ? 1 : 0)} className="h-4 w-4 text-neutral-300" />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 h-60 md:h-auto relative">
          <Link href={`/hotels/${hotel.id}`}>
            <img 
              src={hotel.image} 
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
            {hotel.discountPercentage > 0 && (
              <div className="absolute top-3 left-3 bg-secondary text-white text-xs font-bold px-2 py-1 rounded">
                {hotel.discountPercentage}% OFF
              </div>
            )}
          </Link>
        </div>
        <div className="md:w-2/3 p-5 flex flex-col">
          <div className="flex justify-between">
            <div>
              <Link href={`/hotels/${hotel.id}`} className="inline-block font-heading font-semibold text-xl hover:text-primary transition-colors">
                {hotel.name}
              </Link>
              <div className="flex items-center mt-1">
                <div className="flex text-yellow-400 mr-1">
                  {renderRatingStars(hotel.rating)}
                </div>
                <span className="text-sm text-neutral-600">{hotel.reviewCount} reviews</span>
              </div>
            </div>
            <div className="text-right">
              {hotel.discountPercentage > 0 && (
                <div className="text-sm text-neutral-600 line-through">
                  {formatPrice(hotel.pricePerNight)}
                </div>
              )}
              <div className="text-xl font-semibold text-primary">
                {formatPrice(discountedPrice)}
              </div>
              <div className="text-sm text-neutral-500">per night</div>
            </div>
          </div>
          <div className="mt-2 mb-3">
            <div className="flex items-center text-sm text-neutral-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{hotel.location}</span>
            </div>
          </div>
          <div className="mt-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {sampleAmenities.map((amenity, index) => (
                <Badge key={index} variant="secondary" className="bg-neutral-100 text-neutral-600 hover:bg-neutral-200">
                  {amenity}
                </Badge>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-success font-medium">
                <Check className="inline h-4 w-4 mr-1" />
                Free cancellation
              </div>
              <Link href={`/hotels/${hotel.id}`}>
                <Button>View Details</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
