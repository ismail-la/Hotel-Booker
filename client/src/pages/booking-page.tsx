import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useBookingContext } from "@/context/BookingContext";
import { useNavigate } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import BookingSteps from "@/components/booking/BookingSteps";
import BookingForm from "@/components/booking/BookingForm";
import BookingSummary from "@/components/booking/BookingSummary";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, CreditCard, Landmark, AlertTriangle } from "lucide-react";

// Form schema
const paymentFormSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be at least 16 digits"),
  cardholderName: z.string().min(2, "Cardholder name is required"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format"),
  cvv: z.string().min(3, "CVV must be at least 3 digits"),
  saveCard: z.boolean().optional(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export default function BookingPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const { bookingData } = useBookingContext();
  const { user } = useAuth();
  const [, navigate] = useNavigate();
  const { toast } = useToast();

  // Set up form with default values
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardNumber: "",
      cardholderName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "",
      expiryDate: "",
      cvv: "",
      saveCard: false,
    },
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return await response.json();
    },
    onSuccess: () => {
      setActiveStep(4);
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Check if all required data is available
  if (!bookingData.hotelId || !bookingData.roomId) {
    return (
      <div className="py-12 container mx-auto px-4 text-center">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Booking Error</CardTitle>
            <CardDescription>No booking information found</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">Please select a room from a hotel before proceeding to booking.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate("/hotels")}>
              Browse Hotels
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Handle continue to payment
  const handleContinueToPayment = () => {
    setActiveStep(3);
  };

  // Handle form submission
  const onSubmit = (data: PaymentFormValues) => {
    // In a real app, you would process payment here
    console.log("Payment data:", data);
    
    // Then create booking
    const booking = {
      hotelId: bookingData.hotelId,
      roomId: bookingData.roomId,
      checkInDate: format(bookingData.checkInDate!, "yyyy-MM-dd"),
      checkOutDate: format(bookingData.checkOutDate!, "yyyy-MM-dd"),
      guestCount: bookingData.guestCount,
      totalPrice: bookingData.totalPrice,
      specialRequests: bookingData.specialRequests,
    };
    
    createBookingMutation.mutate(booking);
  };

  // Handle payment method change
  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
  };

  return (
    <div className="py-12 container mx-auto px-4">
      <h1 className="font-heading font-bold text-2xl md:text-3xl mb-8 text-center">Complete Your Booking</h1>
      
      {/* Progress Steps */}
      <BookingSteps activeStep={activeStep} />
      
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Booking Form Steps */}
          <div className="lg:w-2/3">
            {/* Step 1: Room Selection */}
            {activeStep === 1 && (
              <BookingForm onContinue={() => setActiveStep(2)} />
            )}
            
            {/* Step 2: Guest Details */}
            {activeStep === 2 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="font-heading font-semibold text-xl mb-4">Guest Details</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium mb-1">First Name</label>
                      <Input 
                        type="text" 
                        placeholder="Enter first name" 
                        value={user?.firstName || ""}
                        readOnly={!!user?.firstName}
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Last Name</label>
                      <Input 
                        type="text" 
                        placeholder="Enter last name" 
                        value={user?.lastName || ""}
                        readOnly={!!user?.lastName}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-1">Email</label>
                    <Input 
                      type="email" 
                      placeholder="Enter email address" 
                      value={user?.email || ""}
                      readOnly={!!user?.email}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveStep(1)}
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleContinueToPayment}
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 3: Payment */}
            {activeStep === 3 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="font-heading font-semibold text-xl mb-4">Payment Details</h2>
                
                <Tabs 
                  defaultValue="card" 
                  value={paymentMethod} 
                  onValueChange={handlePaymentMethodChange}
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="card" className="flex gap-2">
                      <CreditCard className="h-4 w-4" /> Credit Card
                    </TabsTrigger>
                    <TabsTrigger value="bank" className="flex gap-2">
                      <Landmark className="h-4 w-4" /> Bank Transfer
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="card">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Number</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="1234 5678 9012 3456" 
                                  {...field} 
                                  maxLength={16}
                                  onChange={(e) => {
                                    // Only allow digits
                                    const value = e.target.value.replace(/\D/g, '');
                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="cardholderName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cardholder Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Smith" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="expiryDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiry Date (MM/YY)</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="MM/YY" 
                                    {...field} 
                                    maxLength={5}
                                    onChange={(e) => {
                                      let value = e.target.value.replace(/[^\d]/g, '');
                                      if (value.length > 2) {
                                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                      }
                                      field.onChange(value);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="123" 
                                    {...field} 
                                    maxLength={4}
                                    type="password"
                                    onChange={(e) => {
                                      // Only allow digits
                                      const value = e.target.value.replace(/\D/g, '');
                                      field.onChange(value);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="saveCard"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Save card for future bookings</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <div className="pt-4 flex justify-between">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setActiveStep(2)}
                          >
                            Back
                          </Button>
                          <Button 
                            type="submit"
                            disabled={createBookingMutation.isPending}
                          >
                            {createBookingMutation.isPending ? "Processing..." : "Complete Booking"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </TabsContent>
                  
                  <TabsContent value="bank">
                    <div className="p-4 border border-neutral-200 rounded-lg mb-6">
                      <h3 className="font-medium text-lg mb-2">Bank Transfer Details</h3>
                      <p className="text-sm text-neutral-600 mb-4">
                        Please make a bank transfer to the following account with your booking reference as the payment reference.
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-3 gap-1">
                          <span className="font-medium">Bank Name:</span>
                          <span className="col-span-2">Global Banking Corporation</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="font-medium">Account Name:</span>
                          <span className="col-span-2">StayEase Bookings Ltd</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="font-medium">Account Number:</span>
                          <span className="col-span-2">1234567890</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="font-medium">Sort Code:</span>
                          <span className="col-span-2">12-34-56</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="font-medium">Reference:</span>
                          <span className="col-span-2">BK-{user?.id}-{bookingData.roomId}</span>
                        </div>
                      </div>
                      <div className="mt-4 p-2 bg-yellow-50 text-yellow-800 rounded-md flex">
                        <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                        <p className="text-sm">
                          Please note that your booking will not be confirmed until payment is received and verified.
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveStep(2)}
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={() => {
                          // Simulated bank transfer - in real app this would just register the booking as 'pending payment'
                          const booking = {
                            hotelId: bookingData.hotelId,
                            roomId: bookingData.roomId,
                            checkInDate: format(bookingData.checkInDate!, "yyyy-MM-dd"),
                            checkOutDate: format(bookingData.checkOutDate!, "yyyy-MM-dd"),
                            guestCount: bookingData.guestCount,
                            totalPrice: bookingData.totalPrice,
                            specialRequests: bookingData.specialRequests,
                            status: "pending_payment"
                          };
                          
                          createBookingMutation.mutate(booking);
                        }}
                        disabled={createBookingMutation.isPending}
                      >
                        {createBookingMutation.isPending ? "Processing..." : "Complete Booking"}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            
            {/* Step 4: Confirmation */}
            {activeStep === 4 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="font-heading font-bold text-2xl mb-2">Booking Confirmed!</h2>
                  <p className="text-neutral-600">
                    Your booking at {bookingData.hotelName} has been successfully confirmed.
                  </p>
                </div>
                
                <div className="bg-neutral-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-lg mb-3">Booking Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-3 gap-1">
                      <span className="font-medium">Booking Number:</span>
                      <span className="col-span-2">BK-{Math.floor(Math.random() * 1000000)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="font-medium">Hotel:</span>
                      <span className="col-span-2">{bookingData.hotelName}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="font-medium">Room:</span>
                      <span className="col-span-2">{bookingData.roomName}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="font-medium">Check-in:</span>
                      <span className="col-span-2">{bookingData.checkInDate && format(bookingData.checkInDate, "MMM d, yyyy")}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="font-medium">Check-out:</span>
                      <span className="col-span-2">{bookingData.checkOutDate && format(bookingData.checkOutDate, "MMM d, yyyy")}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="font-medium">Guests:</span>
                      <span className="col-span-2">{bookingData.guestCount}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="font-medium">Total Amount:</span>
                      <span className="col-span-2 font-semibold text-primary">${bookingData.totalPrice?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/dashboard")}
                  >
                    View My Bookings
                  </Button>
                  <Button onClick={() => navigate("/")}>
                    Return to Home
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Price Summary */}
          <div className="lg:w-1/3">
            <BookingSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
