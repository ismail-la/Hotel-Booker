import {
  User, IUser,
  Hotel, IHotel,
  Room, IRoom,
  Booking, IBooking,
  HotelAmenity, IHotelAmenity,
  RoomAmenity, IRoomAmenity,
  InsertUser,
  InsertHotel,
  InsertRoom,
  InsertBooking,
  InsertHotelAmenity,
  InsertRoomAmenity
} from "@shared/models";
import session from "express-session";
import createMemoryStore from "memorystore";

// Interface for storage methods
export interface IStorage {
  // User methods
  getUser(id: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  createUser(user: InsertUser): Promise<IUser>;
  
  // Hotel methods
  getAllHotels(): Promise<IHotel[]>;
  getHotel(id: string): Promise<IHotel | null>;
  createHotel(hotel: InsertHotel): Promise<IHotel>;
  updateHotel(id: string, hotel: Partial<InsertHotel>): Promise<IHotel | null>;
  deleteHotel(id: string): Promise<boolean>;
  
  // Hotel Amenity methods
  getHotelAmenities(hotelId: string): Promise<IHotelAmenity[]>;
  createHotelAmenity(amenity: InsertHotelAmenity): Promise<IHotelAmenity>;
  
  // Room methods
  getRoomsForHotel(hotelId: string): Promise<IRoom[]>;
  getRoom(id: string): Promise<IRoom | null>;
  createRoom(room: InsertRoom): Promise<IRoom>;
  updateRoom(id: string, room: Partial<InsertRoom>): Promise<IRoom | null>;
  deleteRoom(id: string): Promise<boolean>;
  
  // Room Amenity methods
  getRoomAmenities(roomId: string): Promise<IRoomAmenity[]>;
  createRoomAmenity(amenity: InsertRoomAmenity): Promise<IRoomAmenity>;
  
  // Booking methods
  getBooking(id: string): Promise<IBooking | null>;
  getUserBookings(userId: string): Promise<IBooking[]>;
  createBooking(booking: InsertBooking): Promise<IBooking>;
  updateBookingStatus(id: string, status: string): Promise<IBooking | null>;
  
  // Session store
  sessionStore: session.Store;
}

// MongoDB storage implementation
export class MongoStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: string): Promise<IUser | null> {
    try {
      return await User.findById(id);
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    try {
      return await User.findOne({ username });
    } catch (error) {
      console.error("Error getting user by username:", error);
      return null;
    }
  }

  async createUser(userData: InsertUser): Promise<IUser> {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Hotel methods
  async getAllHotels(): Promise<IHotel[]> {
    try {
      return await Hotel.find();
    } catch (error) {
      console.error("Error getting all hotels:", error);
      return [];
    }
  }

  async getHotel(id: string): Promise<IHotel | null> {
    try {
      return await Hotel.findById(id);
    } catch (error) {
      console.error("Error getting hotel:", error);
      return null;
    }
  }

  async createHotel(hotelData: InsertHotel): Promise<IHotel> {
    try {
      const hotel = new Hotel(hotelData);
      return await hotel.save();
    } catch (error) {
      console.error("Error creating hotel:", error);
      throw error;
    }
  }

  async updateHotel(id: string, hotelData: Partial<InsertHotel>): Promise<IHotel | null> {
    try {
      return await Hotel.findByIdAndUpdate(id, hotelData, { new: true });
    } catch (error) {
      console.error("Error updating hotel:", error);
      return null;
    }
  }

  async deleteHotel(id: string): Promise<boolean> {
    try {
      const result = await Hotel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error("Error deleting hotel:", error);
      return false;
    }
  }

  // Hotel Amenity methods
  async getHotelAmenities(hotelId: string): Promise<IHotelAmenity[]> {
    try {
      return await HotelAmenity.find({ hotelId });
    } catch (error) {
      console.error("Error getting hotel amenities:", error);
      return [];
    }
  }

  async createHotelAmenity(amenityData: InsertHotelAmenity): Promise<IHotelAmenity> {
    try {
      const amenity = new HotelAmenity(amenityData);
      return await amenity.save();
    } catch (error) {
      console.error("Error creating hotel amenity:", error);
      throw error;
    }
  }

  // Room methods
  async getRoomsForHotel(hotelId: string): Promise<IRoom[]> {
    try {
      return await Room.find({ hotelId });
    } catch (error) {
      console.error("Error getting rooms for hotel:", error);
      return [];
    }
  }

  async getRoom(id: string): Promise<IRoom | null> {
    try {
      return await Room.findById(id);
    } catch (error) {
      console.error("Error getting room:", error);
      return null;
    }
  }

  async createRoom(roomData: InsertRoom): Promise<IRoom> {
    try {
      const room = new Room(roomData);
      return await room.save();
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    }
  }

  async updateRoom(id: string, roomData: Partial<InsertRoom>): Promise<IRoom | null> {
    try {
      return await Room.findByIdAndUpdate(id, roomData, { new: true });
    } catch (error) {
      console.error("Error updating room:", error);
      return null;
    }
  }

  async deleteRoom(id: string): Promise<boolean> {
    try {
      const result = await Room.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error("Error deleting room:", error);
      return false;
    }
  }

  // Room Amenity methods
  async getRoomAmenities(roomId: string): Promise<IRoomAmenity[]> {
    try {
      return await RoomAmenity.find({ roomId });
    } catch (error) {
      console.error("Error getting room amenities:", error);
      return [];
    }
  }

  async createRoomAmenity(amenityData: InsertRoomAmenity): Promise<IRoomAmenity> {
    try {
      const amenity = new RoomAmenity(amenityData);
      return await amenity.save();
    } catch (error) {
      console.error("Error creating room amenity:", error);
      throw error;
    }
  }

  // Booking methods
  async getBooking(id: string): Promise<IBooking | null> {
    try {
      return await Booking.findById(id);
    } catch (error) {
      console.error("Error getting booking:", error);
      return null;
    }
  }

  async getUserBookings(userId: string): Promise<IBooking[]> {
    try {
      return await Booking.find({ userId });
    } catch (error) {
      console.error("Error getting user bookings:", error);
      return [];
    }
  }

  async createBooking(bookingData: InsertBooking): Promise<IBooking> {
    try {
      const booking = new Booking({
        ...bookingData,
        checkInDate: new Date(bookingData.checkInDate),
        checkOutDate: new Date(bookingData.checkOutDate)
      });
      return await booking.save();
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  }

  async updateBookingStatus(id: string, status: string): Promise<IBooking | null> {
    try {
      return await Booking.findByIdAndUpdate(id, { status }, { new: true });
    } catch (error) {
      console.error("Error updating booking status:", error);
      return null;
    }
  }
}

// Export a singleton instance
export const storage = new MongoStorage();