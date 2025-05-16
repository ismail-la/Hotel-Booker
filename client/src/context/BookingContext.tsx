import { createContext, useState, useContext, ReactNode } from "react";

interface BookingData {
  hotelId: number;
  hotelName: string;
  roomId: number;
  roomName: string;
  pricePerNight: number;
  maxGuests: number;
  image: string;
  checkInDate?: Date;
  checkOutDate?: Date;
  guestCount?: number;
  adultCount?: number;
  childCount?: number;
  specialRequests?: string;
  nights?: number;
  totalPrice?: number;
  discount?: number;
}

interface BookingContextType {
  bookingData: BookingData;
  setBookingData: (data: BookingData) => void;
  resetBookingData: () => void;
  updateBookingData: (data: Partial<BookingData>) => void;
}

// Default empty booking data
const defaultBookingData: BookingData = {
  hotelId: 0,
  hotelName: "",
  roomId: 0,
  roomName: "",
  pricePerNight: 0,
  maxGuests: 0,
  image: "",
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingData, setBookingData] = useState<BookingData>(defaultBookingData);

  const resetBookingData = () => {
    setBookingData(defaultBookingData);
  };

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        setBookingData,
        resetBookingData,
        updateBookingData
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookingContext() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBookingContext must be used within a BookingProvider");
  }
  return context;
}
