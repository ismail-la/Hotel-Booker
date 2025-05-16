import { format } from "date-fns";
import { ShieldCheck, Info } from "lucide-react";
import { useBookingContext } from "@/context/BookingContext";

export default function BookingSummary() {
  const { bookingData } = useBookingContext();
  
  // Format dates
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "MMM d, yyyy");
  };
  
  // Calculate price breakdown
  const subtotal = bookingData.pricePerNight * (bookingData.nights || 1);
  const taxRate = 0.12; // 12% tax
  const taxes = subtotal * taxRate;
  
  // Calculate discount if any
  const discount = bookingData.discount || 0;
  const discountAmount = subtotal * (discount / 100);
  
  // Calculate total
  const total = subtotal + taxes - discountAmount;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
      <h2 className="font-heading font-semibold text-xl mb-4">Price Summary</h2>
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-neutral-600">Room rate ({bookingData.nights} night{bookingData.nights !== 1 ? 's' : ''})</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-600">Taxes and fees</span>
          <span className="font-medium">${taxes.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-success">
            <span>Special discount ({discount}%)</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="pt-3 border-t border-neutral-200 flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span className="text-primary">${total.toFixed(2)}</span>
        </div>
      </div>
      
      {bookingData.checkInDate && (
        <div className="bg-neutral-50 p-4 rounded-lg mb-4">
          <div className="flex items-start">
            <Info className="text-primary mt-0.5 mr-2 h-5 w-5" />
            <div>
              <h4 className="font-medium mb-1">Free cancellation until {format(new Date(bookingData.checkInDate), "MMM d")}</h4>
              <p className="text-sm text-neutral-600">You can cancel for free until 24 hours before check-in.</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-neutral-50 p-4 rounded-lg">
        <div className="flex items-start">
          <ShieldCheck className="text-primary mt-0.5 mr-2 h-5 w-5" />
          <div>
            <h4 className="font-medium mb-1">No payment needed today</h4>
            <p className="text-sm text-neutral-600">You'll pay when you stay at the property.</p>
          </div>
        </div>
      </div>
      
      {/* Show booking details when available */}
      {bookingData.checkInDate && bookingData.checkOutDate && (
        <div className="mt-6 pt-6 border-t border-neutral-200">
          <h3 className="font-medium text-lg mb-3">Booking Details</h3>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2">
              <span className="text-neutral-600">Check-in:</span>
              <span className="font-medium">{formatDate(bookingData.checkInDate)}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-neutral-600">Check-out:</span>
              <span className="font-medium">{formatDate(bookingData.checkOutDate)}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-neutral-600">Guests:</span>
              <span className="font-medium">
                {bookingData.adultCount} Adult{bookingData.adultCount !== 1 ? 's' : ''}
                {bookingData.childCount ? `, ${bookingData.childCount} Child${bookingData.childCount !== 1 ? 'ren' : ''}` : ''}
              </span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-neutral-600">Room:</span>
              <span className="font-medium">{bookingData.roomName}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
