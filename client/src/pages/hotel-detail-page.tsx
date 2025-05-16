import { useParams, useNavigate } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Hotel, Room } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MapPin, Star, Wifi, Utensils, Car, Hotel, FileHeart, WavesLadder, Wine, Accessibility } from "lucide-react";
import HotelGallery from "@/components/hotel/HotelGallery";
import RoomCard from "@/components/hotel/RoomCard";

interface HotelDetailResponse extends Hotel {
  amenities: {
    id: number;
    hotelId: number;
    name: string;
    icon: string;
  }[];
  rooms: (Room & {
    amenities: {
      id: number;
      roomId: number;
      name: string;
      icon: string;
    }[];
  })[];
}

export default function HotelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useNavigate();
  const hotelId = parseInt(id);

  // Fetch hotel details with rooms and amenities
  const { data: hotel, isLoading, error } = useQuery<HotelDetailResponse>({
    queryKey: [`/api/hotels/${hotelId}`],
  });

  // Calculate discounted price
  const getDiscountedPrice = (originalPrice: number, discountPercentage: number) => {
    return originalPrice * (1 - discountPercentage / 100);
  };

  // Render icon based on name
  const renderAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case "ri-wifi-line":
        return <Wifi className="text-lg text-primary mr-2 h-5 w-5" />;
      case "ri-restaurant-line":
        return <Utensils className="text-lg text-primary mr-2 h-5 w-5" />;
      case "ri-parking-box-line":
        return <Car className="text-lg text-primary mr-2 h-5 w-5" />;
      case "ri-hotel-bed-line":
        return <Hotel className="text-lg text-primary mr-2 h-5 w-5" />;
      case "ri-user-heart-line":
        return <FileHeart className="text-lg text-primary mr-2 h-5 w-5" />;
      case "ri-swimming-pool-line":
        return <WavesLadder className="text-lg text-primary mr-2 h-5 w-5" />;
      case "ri-goblet-line":
        return <Wine className="text-lg text-primary mr-2 h-5 w-5" />;
      case "ri-wheelchair-line":
        return <Accessibility className="text-lg text-primary mr-2 h-5 w-5" />;
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="py-12 container mx-auto px-4 text-center">
        <h1 className="font-heading font-bold text-2xl mb-4">Error Loading Hotel</h1>
        <p className="text-neutral-600 mb-6">Sorry, we couldn't load the hotel details. Please try again later.</p>
        <Button onClick={() => navigate("/hotels")}>
          Return to Hotel Listings
        </Button>
      </div>
    );
  }

  return (
    <section className="py-12 container mx-auto px-4">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="inline-flex items-center text-primary font-medium mb-4"
          onClick={() => navigate("/hotels")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search Results
        </Button>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        ) : (
          <div className="flex flex-wrap justify-between items-start">
            <div>
              <h1 className="font-heading font-bold text-3xl mb-2">{hotel?.name}</h1>
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < (hotel?.rating || 0) ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <span className="text-sm text-neutral-600">{hotel?.rating}-star hotel</span>
              </div>
              <div className="flex items-center text-sm text-neutral-600 mb-2">
                <MapPin className="mr-1 h-4 w-4" />
                <span>{hotel?.location}</span>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="bg-neutral-100 p-4 rounded-lg">
                {hotel?.discountPercentage ? (
                  <div className="text-sm text-neutral-600 line-through">${hotel.pricePerNight}</div>
                ) : null}
                <div className="text-2xl font-bold text-primary">
                  ${hotel?.discountPercentage 
                    ? getDiscountedPrice(hotel.pricePerNight, hotel.discountPercentage).toFixed(2) 
                    : hotel?.pricePerNight.toFixed(2)}
                </div>
                <div className="text-sm text-neutral-500">per night</div>
                <Button variant="secondary" className="mt-3 w-full">
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      ) : hotel ? (
        <>
          {/* Hotel Image Gallery */}
          <HotelGallery hotel={hotel} />

          {/* Hotel Details Tabs */}
          <div className="mb-10">
            <Tabs defaultValue="overview">
              <TabsList className="w-full justify-start border-b border-neutral-200 rounded-none bg-transparent">
                <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">Overview</TabsTrigger>
                <TabsTrigger value="rooms" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">Rooms</TabsTrigger>
                <TabsTrigger value="amenities" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">Amenities</TabsTrigger>
                <TabsTrigger value="location" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">Location</TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="py-6">
                <h2 className="font-heading font-semibold text-xl mb-4">About {hotel.name}</h2>
                <p className="text-neutral-600 mb-6">
                  {hotel.description}
                </p>

                <h3 className="font-heading font-semibold text-lg mt-8 mb-4">Popular Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {hotel.amenities?.map((amenity) => (
                    <div key={amenity.id} className="flex items-center">
                      {renderAmenityIcon(amenity.icon)}
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="rooms" className="py-6">
                <h2 className="font-heading font-semibold text-xl mb-4">Available Rooms</h2>
                <p className="text-neutral-600 mb-6">
                  Select from our range of comfortable and well-appointed rooms.
                </p>
                {/* Room content would be displayed here */}
              </TabsContent>

              <TabsContent value="amenities" className="py-6">
                <h2 className="font-heading font-semibold text-xl mb-4">Hotel Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-3">General</h3>
                    <ul className="space-y-2">
                      {hotel.amenities?.filter(a => !a.name.includes("WavesLadder") && !a.name.includes("Spa") && !a.name.includes("Fitness")).map((amenity) => (
                        <li key={amenity.id} className="flex items-center">
                          {renderAmenityIcon(amenity.icon)}
                          <span>{amenity.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-3">Wellness</h3>
                    <ul className="space-y-2">
                      {hotel.amenities?.filter(a => a.name.includes("WavesLadder") || a.name.includes("Spa") || a.name.includes("Fitness")).map((amenity) => (
                        <li key={amenity.id} className="flex items-center">
                          {renderAmenityIcon(amenity.icon)}
                          <span>{amenity.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="location" className="py-6">
                <h2 className="font-heading font-semibold text-xl mb-4">Location</h2>
                <p className="text-neutral-600 mb-6">
                  {hotel.name} is located at {hotel.location}. The area is known for its excellent access to local attractions.
                </p>
                <div className="bg-neutral-100 h-80 rounded-lg flex items-center justify-center">
                  <p className="text-neutral-500">Map view would be displayed here</p>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="py-6">
                <h2 className="font-heading font-semibold text-xl mb-4">Guest Reviews</h2>
                <div className="bg-neutral-100 p-6 rounded-lg mb-6">
                  <div className="flex items-center mb-4">
                    <div className="text-4xl font-bold text-primary mr-4">{hotel.rating}</div>
                    <div>
                      <div className="flex text-yellow-400 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-5 w-5 ${i < hotel.rating ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                      <p className="text-sm">{hotel.reviewCount} reviews</p>
                    </div>
                  </div>
                  <p className="text-neutral-600">
                    Guests love this hotel for its excellent location, friendly staff, and clean rooms.
                  </p>
                </div>
                {/* Reviews would be displayed here */}
                <div className="text-center">
                  <Button variant="outline">
                    Load More Reviews
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Available Rooms */}
          <div>
            <h2 className="font-heading font-semibold text-2xl mb-6">Available Rooms</h2>
            <div className="space-y-6">
              {hotel.rooms?.map((room) => (
                <RoomCard 
                  key={room.id} 
                  room={room} 
                  hotelId={hotel.id}
                  hotelName={hotel.name}
                />
              ))}
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
