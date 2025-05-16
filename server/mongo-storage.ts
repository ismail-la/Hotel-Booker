import { createModels } from '../shared/mongoose-models';
import mongoose from 'mongoose';
import session from 'express-session';
import createMemoryStore from 'memorystore';
import { 
  insertUserSchema, 
  insertHotelSchema, 
  insertRoomSchema, 
  insertBookingSchema, 
  insertHotelAmenitySchema, 
  insertRoomAmenitySchema 
} from '../shared/schema';

// Create the MongoDB models
const Models = createModels();

// Interface for storage methods
export interface IMongoStorage {
  // User methods
  getUser(id: string): Promise<any | null>;
  getUserByUsername(username: string): Promise<any | null>;
  createUser(user: any): Promise<any>;
  
  // Hotel methods
  getAllHotels(): Promise<any[]>;
  getHotel(id: string): Promise<any | null>;
  createHotel(hotel: any): Promise<any>;
  updateHotel(id: string, hotel: Partial<any>): Promise<any | null>;
  deleteHotel(id: string): Promise<boolean>;
  
  // Hotel Amenity methods
  getHotelAmenities(hotelId: string): Promise<any[]>;
  createHotelAmenity(amenity: any): Promise<any>;
  
  // Room methods
  getRoomsForHotel(hotelId: string): Promise<any[]>;
  getRoom(id: string): Promise<any | null>;
  createRoom(room: any): Promise<any>;
  updateRoom(id: string, room: Partial<any>): Promise<any | null>;
  deleteRoom(id: string): Promise<boolean>;
  
  // Room Amenity methods
  getRoomAmenities(roomId: string): Promise<any[]>;
  createRoomAmenity(amenity: any): Promise<any>;
  
  // Booking methods
  getBooking(id: string): Promise<any | null>;
  getUserBookings(userId: string): Promise<any[]>;
  createBooking(booking: any): Promise<any>;
  updateBookingStatus(id: string, status: string): Promise<any | null>;
  
  // Session store
  sessionStore: session.Store;
}

// MongoDB storage implementation
export class MongoStorage implements IMongoStorage {
  sessionStore: session.Store;

  constructor() {
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // Helper function to handle MongoDB connection errors
  private async handleDBOperation<T>(operation: () => Promise<T>, errorMessage: string): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      console.error(`MongoDB Error - ${errorMessage}:`, error);
      return null;
    }
  }

  // User methods
  async getUser(id: string): Promise<any | null> {
    return this.handleDBOperation(async () => {
      return await Models.User.findById(id);
    }, "Error getting user");
  }

  async getUserByUsername(username: string): Promise<any | null> {
    return this.handleDBOperation(async () => {
      return await Models.User.findOne({ username });
    }, "Error getting user by username");
  }

  async createUser(userData: any): Promise<any> {
    return this.handleDBOperation(async () => {
      const user = new Models.User(userData);
      await user.save();
      return user;
    }, "Error creating user");
  }

  // Hotel methods
  async getAllHotels(): Promise<any[]> {
    return this.handleDBOperation(async () => {
      return await Models.Hotel.find();
    }, "Error getting all hotels") || [];
  }

  async getHotel(id: string): Promise<any | null> {
    return this.handleDBOperation(async () => {
      return await Models.Hotel.findById(id);
    }, "Error getting hotel");
  }

  async createHotel(hotelData: any): Promise<any> {
    return this.handleDBOperation(async () => {
      const hotel = new Models.Hotel(hotelData);
      await hotel.save();
      return hotel;
    }, "Error creating hotel");
  }

  async updateHotel(id: string, hotelData: Partial<any>): Promise<any | null> {
    return this.handleDBOperation(async () => {
      return await Models.Hotel.findByIdAndUpdate(id, hotelData, { new: true });
    }, "Error updating hotel");
  }

  async deleteHotel(id: string): Promise<boolean> {
    return this.handleDBOperation(async () => {
      const result = await Models.Hotel.findByIdAndDelete(id);
      return !!result;
    }, "Error deleting hotel") || false;
  }

  // Hotel Amenity methods
  async getHotelAmenities(hotelId: string): Promise<any[]> {
    return this.handleDBOperation(async () => {
      return await Models.HotelAmenity.find({ hotelId });
    }, "Error getting hotel amenities") || [];
  }

  async createHotelAmenity(amenityData: any): Promise<any> {
    return this.handleDBOperation(async () => {
      const amenity = new Models.HotelAmenity(amenityData);
      await amenity.save();
      return amenity;
    }, "Error creating hotel amenity");
  }

  // Room methods
  async getRoomsForHotel(hotelId: string): Promise<any[]> {
    return this.handleDBOperation(async () => {
      return await Models.Room.find({ hotelId });
    }, "Error getting rooms for hotel") || [];
  }

  async getRoom(id: string): Promise<any | null> {
    return this.handleDBOperation(async () => {
      return await Models.Room.findById(id);
    }, "Error getting room");
  }

  async createRoom(roomData: any): Promise<any> {
    return this.handleDBOperation(async () => {
      const room = new Models.Room(roomData);
      await room.save();
      return room;
    }, "Error creating room");
  }

  async updateRoom(id: string, roomData: Partial<any>): Promise<any | null> {
    return this.handleDBOperation(async () => {
      return await Models.Room.findByIdAndUpdate(id, roomData, { new: true });
    }, "Error updating room");
  }

  async deleteRoom(id: string): Promise<boolean> {
    return this.handleDBOperation(async () => {
      const result = await Models.Room.findByIdAndDelete(id);
      return !!result;
    }, "Error deleting room") || false;
  }

  // Room Amenity methods
  async getRoomAmenities(roomId: string): Promise<any[]> {
    return this.handleDBOperation(async () => {
      return await Models.RoomAmenity.find({ roomId });
    }, "Error getting room amenities") || [];
  }

  async createRoomAmenity(amenityData: any): Promise<any> {
    return this.handleDBOperation(async () => {
      const amenity = new Models.RoomAmenity(amenityData);
      await amenity.save();
      return amenity;
    }, "Error creating room amenity");
  }

  // Booking methods
  async getBooking(id: string): Promise<any | null> {
    return this.handleDBOperation(async () => {
      return await Models.Booking.findById(id);
    }, "Error getting booking");
  }

  async getUserBookings(userId: string): Promise<any[]> {
    return this.handleDBOperation(async () => {
      return await Models.Booking.find({ userId });
    }, "Error getting user bookings") || [];
  }

  async createBooking(bookingData: any): Promise<any> {
    return this.handleDBOperation(async () => {
      const booking = new Models.Booking({
        ...bookingData,
        // Ensure dates are converted properly
        checkInDate: new Date(bookingData.checkInDate),
        checkOutDate: new Date(bookingData.checkOutDate)
      });
      await booking.save();
      return booking;
    }, "Error creating booking");
  }

  async updateBookingStatus(id: string, status: string): Promise<any | null> {
    return this.handleDBOperation(async () => {
      return await Models.Booking.findByIdAndUpdate(id, { status }, { new: true });
    }, "Error updating booking status");
  }
}

// Export a singleton instance
export const mongoStorage = new MongoStorage();