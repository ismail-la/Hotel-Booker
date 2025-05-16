import { Link } from "wouter";
import HotelSearchForm from "@/components/hotel/HotelSearchForm";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Hotel } from "@shared/schema";
import HotelCard from "@/components/hotel/HotelCard";
import { ChevronRight, CheckCircle } from "lucide-react";

export default function HomePage() {
  // Fetch featured hotels (limit to 3)
  const { data: hotels, isLoading } = useQuery<Hotel[]>({
    queryKey: ["/api/hotels"],
  });

  // Get first 3 hotels for featured section
  const featuredHotels = hotels?.slice(0, 3);

  return (
    <>
      {/* Hero Section with Search */}
      <section className="relative bg-neutral-800 text-white">
        <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
        <div className="relative z-20 container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl mb-4">Find Your Perfect Stay</h1>
            <p className="text-neutral-200 text-lg mb-8">Best prices, free cancellation options, and exclusive deals on top hotels</p>
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
              <HotelSearchForm />
            </div>
          </div>
        </div>
        <div 
          className="h-full w-full absolute inset-0 z-0" 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        ></div>
      </section>

      {/* Featured Hotels Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-heading font-bold text-2xl md:text-3xl">Featured Hotels</h2>
          <Link href="/hotels">
            <Button variant="link" className="text-primary flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 h-[400px] animate-pulse">
                <div className="w-full h-48 bg-neutral-200 rounded-md mb-4"></div>
                <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
                  <div className="h-10 bg-neutral-200 rounded w-1/4"></div>
                </div>
              </div>
            ))
          ) : featuredHotels?.length ? (
            featuredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-neutral-500">
              No hotels available at the moment. Please check back later.
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">Why Choose StayEase</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Experience the perfect stay with our handpicked selection of hotels and exclusive benefits designed for your comfort and convenience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center bg-primary-light bg-opacity-10 w-16 h-16 rounded-full mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary h-8 w-8">
                  <path d="M22 9.00002L12 5.00002L2 9.00002L12 13L22 9.00002ZM22 9.00002V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 10.9999V15.9999C6 15.9999 8.5 17.9999 12 17.9999C15.5 17.9999 18 15.9999 18 15.9999V10.9999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-3">Best Prices Guaranteed</h3>
              <p className="text-neutral-600">
                We match or beat any competitor's price so you can book with confidence, knowing you're getting the best deal.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center bg-primary-light bg-opacity-10 w-16 h-16 rounded-full mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary h-8 w-8">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-3">Free Cancellation</h3>
              <p className="text-neutral-600">
                Plans change, and we understand. Enjoy free cancellation on most hotels up to 24 hours before check-in.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center bg-primary-light bg-opacity-10 w-16 h-16 rounded-full mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary h-8 w-8">
                  <path d="M16 8C16 10.2091 14.2091 12 12 12C9.79086 12 8 10.2091 8 8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 20V19C21 16.7909 19.2091 15 17 15H7C4.79086 15 3 16.7909 3 19V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-3">24/7 Customer Support</h3>
              <p className="text-neutral-600">
                Our dedicated support team is available around the clock to assist with any questions or concerns during your stay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">What Our Guests Say</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Read reviews from real travelers who have experienced the StayEase difference.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex text-yellow-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="16" height="16" fill="currentColor" className="mr-1" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
              ))}
            </div>
            <p className="text-neutral-600 mb-4 italic">
              "StayEase made our family vacation so easy! The booking process was simple, we found a great hotel, and saved money with their exclusive deals."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-neutral-200 rounded-full mr-3 flex items-center justify-center font-medium text-neutral-600">
                JD
              </div>
              <div>
                <h4 className="font-medium">John Davis</h4>
                <p className="text-sm text-neutral-500">New York, USA</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex text-yellow-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="16" height="16" fill="currentColor" className="mr-1" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
              ))}
            </div>
            <p className="text-neutral-600 mb-4 italic">
              "I travel for business frequently and StayEase is now my go-to platform. Their customer service is exceptional and the hotels are always top-notch."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-neutral-200 rounded-full mr-3 flex items-center justify-center font-medium text-neutral-600">
                SM
              </div>
              <div>
                <h4 className="font-medium">Sarah Miller</h4>
                <p className="text-sm text-neutral-500">Chicago, USA</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex text-yellow-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="16" height="16" fill="currentColor" className="mr-1" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
              ))}
            </div>
            <p className="text-neutral-600 mb-4 italic">
              "The free cancellation policy saved our trip when plans changed last minute. We rebooked with ease and had a wonderful experience at our hotel."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-neutral-200 rounded-full mr-3 flex items-center justify-center font-medium text-neutral-600">
                RJ
              </div>
              <div>
                <h4 className="font-medium">Robert Johnson</h4>
                <p className="text-sm text-neutral-500">Miami, USA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">Ready to Find Your Perfect Stay?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-primary-foreground">
            Discover amazing hotel deals and start planning your next trip with StayEase today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/hotels">
              <Button variant="secondary" size="lg">
                Browse Hotels
              </Button>
            </Link>
            <Link href="/auth?mode=register">
              <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">Experience the StayEase Difference</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            We're committed to making your travel experience exceptional from start to finish.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 text-primary">
              <CheckCircle className="h-12 w-12" />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">Verified Reviews</h3>
            <p className="text-neutral-600">
              All reviews are from verified guests who booked through StayEase.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 text-primary">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 19C19 20.1046 18.1046 21 17 21C15.8954 21 15 20.1046 15 19C15 17.8954 15.8954 17 17 17C18.1046 17 19 17.8954 19 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 19H3V13C3 12.4477 3.44772 12 4 12H20L17 7H4M9 19H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">Free Extras</h3>
            <p className="text-neutral-600">
              Enjoy free parking, WiFi, and breakfast at select hotels.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 text-primary">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M7 11H17M7 11C7 15.4183 10.5817 19 15 19C19.4183 19 22 16.4183 22 12C22 7.58172 19.4183 5 15 5C10.5817 5 7 8.58172 7 13V11ZM7 11H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">No Hidden Fees</h3>
            <p className="text-neutral-600">
              The price you see is the price you pay, with no surprises at checkout.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 text-primary">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M12 15C8.13401 15 5 11.866 5 8V7C5 4.23858 7.23858 2 10 2H14C16.7614 2 19 4.23858 19 7V8C19 11.866 15.866 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 22H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">Smart Recommendations</h3>
            <p className="text-neutral-600">
              Our system learns your preferences to suggest perfect hotels.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
