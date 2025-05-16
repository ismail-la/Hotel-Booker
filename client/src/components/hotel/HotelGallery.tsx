import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Hotel } from "@shared/schema";

interface HotelGalleryProps {
  hotel: Hotel;
}

// Sample images for gallery
const sampleGalleryImages = [
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
];

export default function HotelGallery({ hotel }: HotelGalleryProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // For a real implementation, we would get hotel images from the API
  // Here we're using the hotel's main image plus sample images
  const galleryImages = [hotel.image, ...sampleGalleryImages];
  
  const openGallery = (index: number = 0) => {
    setCurrentImageIndex(index);
    setGalleryOpen(true);
  };
  
  return (
    <>
      <div className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Main large image */}
          <div className="md:col-span-2 md:row-span-2">
            <img 
              src={galleryImages[0]} 
              alt={`${hotel.name} Main`} 
              className="rounded-lg w-full h-full object-cover cursor-pointer"
              onClick={() => openGallery(0)}
            />
          </div>
          
          {/* Smaller gallery images */}
          {galleryImages.slice(1, 5).map((image, index) => (
            <div key={index}>
              <img 
                src={image} 
                alt={`${hotel.name} ${index + 1}`} 
                className="rounded-lg w-full h-full object-cover cursor-pointer"
                onClick={() => openGallery(index + 1)}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 text-center">
          <Button 
            variant="link" 
            className="text-primary font-medium hover:underline"
            onClick={() => openGallery()}
          >
            View all {galleryImages.length} photos
          </Button>
        </div>
      </div>
      
      {/* Full Gallery Dialog */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black overflow-hidden">
          <div className="relative">
            <img 
              src={galleryImages[currentImageIndex]} 
              alt={`${hotel.name} Gallery ${currentImageIndex + 1}`}
              className="w-full object-contain max-h-[80vh]"
            />
            
            {/* Navigation buttons */}
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-black/50 text-white hover:bg-black/70"
                onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-black/50 text-white hover:bg-black/70"
                onClick={() => setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </Button>
            </div>
            
            {/* Close button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={() => setGalleryOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
              </svg>
            </Button>
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
