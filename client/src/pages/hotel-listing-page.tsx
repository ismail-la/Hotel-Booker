import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Hotel } from "@shared/schema";
import HotelCard from "@/components/hotel/HotelCard";
import HotelFilters from "@/components/hotel/HotelFilters";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";

export default function HotelListingPage() {
  const [location, search] = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("recommended");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [activeFilters, setActiveFilters] = useState<{
    priceRange: [number, number];
    starRatings: number[];
    amenities: string[];
    location?: string;
  }>({
    priceRange: [0, 500],
    starRatings: [],
    amenities: [],
  });

  // Parse search params
  const searchParams = new URLSearchParams(search);
  const locationParam = searchParams.get("location");
  const checkInParam = searchParams.get("checkIn");
  const checkOutParam = searchParams.get("checkOut");
  const guestsParam = searchParams.get("guests");

  // Fetch all hotels
  const { data: hotels, isLoading } = useQuery<Hotel[]>({
    queryKey: ["/api/hotels"],
  });

  // Initialize active filters from URL params
  useEffect(() => {
    if (locationParam) {
      setActiveFilters(prev => ({
        ...prev,
        location: locationParam
      }));
    }
  }, [locationParam]);

  // Apply filters to hotels
  useEffect(() => {
    if (!hotels) return;

    let results = [...hotels];

    // Apply location filter from search params
    if (activeFilters.location) {
      results = results.filter(hotel =>
        hotel.location.toLowerCase().includes(activeFilters.location!.toLowerCase())
      );
    }

    // Apply price range filter
    results = results.filter(hotel => {
      const actualPrice = hotel.discountPercentage 
        ? hotel.pricePerNight * (1 - hotel.discountPercentage / 100) 
        : hotel.pricePerNight;
      return actualPrice >= activeFilters.priceRange[0] && actualPrice <= activeFilters.priceRange[1];
    });

    // Apply star rating filter
    if (activeFilters.starRatings.length > 0) {
      results = results.filter(hotel => 
        activeFilters.starRatings.includes(Math.floor(hotel.rating))
      );
    }

    // Apply sort option
    switch (sortOption) {
      case "price_low":
        results.sort((a, b) => {
          const priceA = a.discountPercentage ? a.pricePerNight * (1 - a.discountPercentage / 100) : a.pricePerNight;
          const priceB = b.discountPercentage ? b.pricePerNight * (1 - b.discountPercentage / 100) : b.pricePerNight;
          return priceA - priceB;
        });
        break;
      case "price_high":
        results.sort((a, b) => {
          const priceA = a.discountPercentage ? a.pricePerNight * (1 - a.discountPercentage / 100) : a.pricePerNight;
          const priceB = b.discountPercentage ? b.pricePerNight * (1 - b.discountPercentage / 100) : b.pricePerNight;
          return priceB - priceA;
        });
        break;
      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      // Default is "recommended"
      default:
        // For recommended, prioritize higher rating and discount
        results.sort((a, b) => {
          // Start with rating comparison
          const ratingDiff = b.rating - a.rating;
          if (ratingDiff !== 0) return ratingDiff;
          
          // If ratings are equal, prioritize discount
          return (b.discountPercentage || 0) - (a.discountPercentage || 0);
        });
    }

    setFilteredHotels(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [hotels, activeFilters, sortOption]);

  // Handle filter changes
  const handleFilterChange = (filters: any) => {
    setActiveFilters(prev => ({
      ...prev,
      ...filters
    }));
  };

  // Calculate pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil((filteredHotels?.length || 0) / itemsPerPage);
  const currentHotels = filteredHotels?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="py-12 container mx-auto px-4" id="hotel-listing">
      {/* Search summary */}
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2">Available Hotels</h1>
        <div className="text-neutral-600">
          {locationParam && (
            <p>
              Showing hotels in <span className="font-medium">{locationParam}</span>
              {checkInParam && checkOutParam && (
                <> from <span className="font-medium">{checkInParam}</span> to <span className="font-medium">{checkOutParam}</span></>
              )}
              {guestsParam && (
                <> for <span className="font-medium">{guestsParam}</span> guests</>
              )}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mobile filters toggle */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <Button 
            variant="outline" 
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
          <Select 
            value={sortOption} 
            onValueChange={setSortOption}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile filters sidebar */}
        <div className={`lg:hidden fixed inset-0 z-50 bg-white transform transition-transform duration-300 ${mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
            <h3 className="font-heading font-semibold text-lg">Filters</h3>
            <Button variant="ghost" size="sm" onClick={() => setMobileFiltersOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
            <HotelFilters onFilterChange={handleFilterChange} />
          </div>
        </div>

        {/* Desktop filters sidebar */}
        <div className="hidden lg:block lg:w-1/4">
          <HotelFilters onFilterChange={handleFilterChange} />
        </div>

        {/* Hotel list */}
        <div className="lg:w-3/4">
          <div className="hidden lg:flex justify-between items-center mb-6">
            <h2 className="font-heading font-semibold text-2xl">Available Hotels</h2>
            <div className="flex items-center">
              <label className="text-sm mr-2 text-neutral-600">Sort by:</label>
              <Select 
                value={sortOption} 
                onValueChange={setSortOption}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Hotel Cards */}
          <div className="space-y-6">
            {isLoading ? (
              // Loading skeletons
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-60 bg-neutral-200 rounded-md"></div>
                    <div className="md:w-2/3 p-5">
                      <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-neutral-200 rounded w-1/2 mb-4"></div>
                      <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-neutral-200 rounded w-full mb-4"></div>
                      <div className="flex gap-2 mb-4">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="h-6 bg-neutral-200 rounded w-16"></div>
                        ))}
                      </div>
                      <div className="flex justify-between">
                        <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
                        <div className="h-10 bg-neutral-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : currentHotels?.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="font-heading font-semibold text-xl mb-2">No hotels found</h3>
                <p className="text-neutral-600 mb-4">
                  We couldn't find any hotels matching your search criteria. Try adjusting your filters.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveFilters({
                    priceRange: [0, 500],
                    starRatings: [],
                    amenities: [],
                  })}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              currentHotels?.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))
            )}

            {/* Pagination */}
            {!isLoading && filteredHotels.length > itemsPerPage && (
              <div className="mt-8 flex justify-center">
                <nav className="inline-flex rounded shadow-sm" aria-label="Pagination">
                  <Button 
                    variant="outline"
                    size="icon"
                    className="rounded-l-md"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous</span>
                  </Button>
                  
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <Button
                      key={index}
                      variant={currentPage === index + 1 ? "default" : "outline"}
                      className="rounded-none"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                  
                  <Button 
                    variant="outline"
                    size="icon"
                    className="rounded-r-md"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next</span>
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
