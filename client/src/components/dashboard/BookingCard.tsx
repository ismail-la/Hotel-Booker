import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CalendarCheck, 
  FileText, 
  AlertTriangle 
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BookingCardProps {
  booking: any; // Using any here since the booking will include hotel and room info
}

export default function BookingCard({ booking }: BookingCardProps) {
  const { toast } = useToast();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  
  // Format dates
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };
  
  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-success bg-opacity-10 text-success">Upcoming</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-neutral-100 text-neutral-600">Past</Badge>;
      case "cancelled":
        return <Badge className="bg-error bg-opacity-10 text-error">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Calculate nights
  const nights = () => {
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    return Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };
  
  // Handle cancel booking
  const handleCancelBooking = async () => {
    setIsCancelling(true);
    try {
      await apiRequest("PATCH", `/api/bookings/${booking.id}/cancel`);
      
      // Invalidate bookings cache to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      
      toast({
        title: "Booking cancelled",
        description: "Your booking has been successfully cancelled.",
      });
      
      setCancelDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              {getStatusBadge(booking.status)}
              <h3 className="font-heading font-semibold text-xl mt-2">{booking.hotel?.name}</h3>
              <div className="text-sm text-neutral-600">{booking.hotel?.location}</div>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="font-semibold text-lg text-primary">${booking.totalPrice.toFixed(2)}</div>
              <div className="text-sm text-neutral-600">{nights()} nights, {booking.guestCount} guests</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 mb-4">
            <div>
              <div className="text-sm text-neutral-500 mb-1">Check-in</div>
              <div className="flex items-center font-medium">
                <CalendarCheck className="text-primary mr-2 h-4 w-4" />
                <span>{formatDate(booking.checkInDate)}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-neutral-500 mb-1">Check-out</div>
              <div className="flex items-center font-medium">
                <CalendarCheck className="text-primary mr-2 h-4 w-4" />
                <span>{formatDate(booking.checkOutDate)}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-neutral-500 mb-1">Booking ID</div>
              <div className="flex items-center font-medium">
                <FileText className="text-primary mr-2 h-4 w-4" />
                <span>BK-{booking.id.toString().padStart(7, '0')}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="default" size="sm">
              View Details
            </Button>
            {booking.status === "confirmed" && (
              <>
                <Button variant="outline" size="sm">
                  Modify Booking
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-error border-error hover:bg-error hover:bg-opacity-10"
                  onClick={() => setCancelDialogOpen(true)}
                >
                  Cancel Booking
                </Button>
              </>
            )}
            {booking.status === "completed" && (
              <>
                <Button variant="outline" size="sm">
                  Book Again
                </Button>
                <Button variant="outline" size="sm">
                  Write Review
                </Button>
              </>
            )}
            {booking.status === "cancelled" && (
              <Button variant="outline" size="sm">
                Book Again
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      
      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your booking at {booking.hotel?.name}?
              {new Date(booking.checkInDate) > new Date(Date.now() + 24 * 60 * 60 * 1000) ? (
                <p className="mt-2 text-success flex items-center">
                  <Check className="mr-1 h-4 w-4" /> You are eligible for a full refund.
                </p>
              ) : (
                <p className="mt-2 text-yellow-600 flex items-center">
                  <AlertTriangle className="mr-1 h-4 w-4" /> Cancellation charges may apply as you're within 24 hours of check-in.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setCancelDialogOpen(false)}
              disabled={isCancelling}
            >
              Keep Booking
            </Button>
            <Button 
              variant="destructive"

              onClick={handleCancelBooking}
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelling..." : "Cancel Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
