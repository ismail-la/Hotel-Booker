import { 
  User, InsertUser, 
  Hotel, InsertHotel, 
  Room, InsertRoom, 
  Booking, InsertBooking,
  HotelAmenity, InsertHotelAmenity,
  RoomAmenity, InsertRoomAmenity
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Interface for storage methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Hotel methods
  getAllHotels(): Promise<Hotel[]>;
  getHotel(id: number): Promise<Hotel | undefined>;
  createHotel(hotel: InsertHotel): Promise<Hotel>;
  updateHotel(id: number, hotel: Partial<InsertHotel>): Promise<Hotel | undefined>;
  deleteHotel(id: number): Promise<boolean>;
  
  // Hotel Amenity methods
  getHotelAmenities(hotelId: number): Promise<HotelAmenity[]>;
  createHotelAmenity(amenity: InsertHotelAmenity): Promise<HotelAmenity>;
  
  // Room methods
  getRoomsForHotel(hotelId: number): Promise<Room[]>;
  getRoom(id: number): Promise<Room | undefined>;
  createRoom(room: InsertRoom): Promise<Room>;
  updateRoom(id: number, room: Partial<InsertRoom>): Promise<Room | undefined>;
  deleteRoom(id: number): Promise<boolean>;
  
  // Room Amenity methods
  getRoomAmenities(roomId: number): Promise<RoomAmenity[]>;
  createRoomAmenity(amenity: InsertRoomAmenity): Promise<RoomAmenity>;
  
  // Booking methods
  getBooking(id: number): Promise<Booking | undefined>;
  getUserBookings(userId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  
  // Session store
  sessionStore: session.SessionStore;
}

// In-memory implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private hotels: Map<number, Hotel>;
  private hotelAmenities: Map<number, HotelAmenity>;
  private rooms: Map<number, Room>;
  private roomAmenities: Map<number, RoomAmenity>;
  private bookings: Map<number, Booking>;
  
  sessionStore: session.SessionStore;
  
  // ID counters
  private userId: number;
  private hotelId: number;
  private hotelAmenityId: number;
  private roomId: number;
  private roomAmenityId: number;
  private bookingId: number;
  
  constructor() {
    this.users = new Map();
    this.hotels = new Map();
    this.hotelAmenities = new Map();
    this.rooms = new Map();
    this.roomAmenities = new Map();
    this.bookings = new Map();
    
    this.userId = 1;
    this.hotelId = 1;
    this.hotelAmenityId = 1;
    this.roomId = 1;
    this.roomAmenityId = 1;
    this.bookingId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Add sample admin user
    this.createUser({
      username: "admin",
      password: "$2b$10$GGdfZrCtBJ0Nms9NRhJiSuJCM1xgU6w3RGGqEZL5sK76j8Q79nIUa", // "admin123"
      firstName: "Admin",
      lastName: "User",
      email: "admin@stayease.com",
      isAdmin: true
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Hotel methods
  async getAllHotels(): Promise<Hotel[]> {
    return Array.from(this.hotels.values());
  }
  
  async getHotel(id: number): Promise<Hotel | undefined> {
    return this.hotels.get(id);
  }
  
  async createHotel(insertHotel: InsertHotel): Promise<Hotel> {
    const id = this.hotelId++;
    const hotel: Hotel = { ...insertHotel, id };
    this.hotels.set(id, hotel);
    return hotel;
  }
  
  async updateHotel(id: number, hotelData: Partial<InsertHotel>): Promise<Hotel | undefined> {
    const hotel = this.hotels.get(id);
    if (!hotel) return undefined;
    
    const updatedHotel = { ...hotel, ...hotelData };
    this.hotels.set(id, updatedHotel);
    return updatedHotel;
  }
  
  async deleteHotel(id: number): Promise<boolean> {
    return this.hotels.delete(id);
  }
  
  // Hotel Amenity methods
  async getHotelAmenities(hotelId: number): Promise<HotelAmenity[]> {
    return Array.from(this.hotelAmenities.values()).filter(
      (amenity) => amenity.hotelId === hotelId
    );
  }
  
  async createHotelAmenity(insertAmenity: InsertHotelAmenity): Promise<HotelAmenity> {
    const id = this.hotelAmenityId++;
    const amenity: HotelAmenity = { ...insertAmenity, id };
    this.hotelAmenities.set(id, amenity);
    return amenity;
  }
  
  // Room methods
  async getRoomsForHotel(hotelId: number): Promise<Room[]> {
    return Array.from(this.rooms.values()).filter(
      (room) => room.hotelId === hotelId
    );
  }
  
  async getRoom(id: number): Promise<Room | undefined> {
    return this.rooms.get(id);
  }
  
  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const id = this.roomId++;
    const room: Room = { ...insertRoom, id };
    this.rooms.set(id, room);
    return room;
  }
  
  async updateRoom(id: number, roomData: Partial<InsertRoom>): Promise<Room | undefined> {
    const room = this.rooms.get(id);
    if (!room) return undefined;
    
    const updatedRoom = { ...room, ...roomData };
    this.rooms.set(id, updatedRoom);
    return updatedRoom;
  }
  
  async deleteRoom(id: number): Promise<boolean> {
    return this.rooms.delete(id);
  }
  
  // Room Amenity methods
  async getRoomAmenities(roomId: number): Promise<RoomAmenity[]> {
    return Array.from(this.roomAmenities.values()).filter(
      (amenity) => amenity.roomId === roomId
    );
  }
  
  async createRoomAmenity(insertAmenity: InsertRoomAmenity): Promise<RoomAmenity> {
    const id = this.roomAmenityId++;
    const amenity: RoomAmenity = { ...insertAmenity, id };
    this.roomAmenities.set(id, amenity);
    return amenity;
  }
  
  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }
  
  async getUserBookings(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.userId === userId
    );
  }
  
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.bookingId++;
    const booking: Booking = { 
      ...insertBooking, 
      id, 
      createdAt: new Date() 
    };
    this.bookings.set(id, booking);
    return booking;
  }
  
  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, status };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }
}

// Initialize storage
export const storage = new MemStorage();

// Seed some hotels for testing
(async () => {
  const hotel1 = await storage.createHotel({
    name: "Luxor Grand Hotel",
    location: "Downtown, New York City",
    description: "The Luxor Grand Hotel is a 5-star luxury hotel located in the heart of Downtown New York City. Just steps away from major attractions, shopping districts, and business centers.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    rating: 5,
    reviewCount: 356,
    pricePerNight: 220,
    discountPercentage: 20,
    status: "active"
  });
  
  const hotel2 = await storage.createHotel({
    name: "Seaside Resort & Spa",
    location: "Beachfront, Miami",
    description: "A beautiful beachfront resort with stunning ocean views and luxurious spa facilities.",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd",
    rating: 4,
    reviewCount: 289,
    pricePerNight: 245,
    discountPercentage: 0,
    status: "active"
  });
  
  const hotel3 = await storage.createHotel({
    name: "Urban Boutique Hotel",
    location: "City Center, San Francisco",
    description: "A trendy boutique hotel in the heart of San Francisco with modern amenities and stylish design.",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
    rating: 4.5,
    reviewCount: 178,
    pricePerNight: 189,
    discountPercentage: 0,
    status: "active"
  });
  
  // Add amenities for Hotel 1
  await storage.createHotelAmenity({ hotelId: hotel1.id, name: "Free WiFi", icon: "ri-wifi-line" });
  await storage.createHotelAmenity({ hotelId: hotel1.id, name: "Restaurant", icon: "ri-restaurant-line" });
  await storage.createHotelAmenity({ hotelId: hotel1.id, name: "Parking", icon: "ri-parking-box-line" });
  await storage.createHotelAmenity({ hotelId: hotel1.id, name: "Room Service", icon: "ri-hotel-bed-line" });
  await storage.createHotelAmenity({ hotelId: hotel1.id, name: "Spa Services", icon: "ri-user-heart-line" });
  await storage.createHotelAmenity({ hotelId: hotel1.id, name: "Swimming Pool", icon: "ri-swimming-pool-line" });
  await storage.createHotelAmenity({ hotelId: hotel1.id, name: "Bar/Lounge", icon: "ri-goblet-line" });
  await storage.createHotelAmenity({ hotelId: hotel1.id, name: "Accessibility", icon: "ri-wheelchair-line" });
  
  // Add rooms for Hotel 1
  const room1 = await storage.createRoom({
    hotelId: hotel1.id,
    name: "Deluxe King Room",
    description: "Our Deluxe King Room features a luxurious king-size bed, modern bathroom with rainfall shower, work desk, and panoramic city views.",
    image: "https://images.unsplash.com/photo-1560185007-5f0bb1866cab",
    maxGuests: 2,
    bedType: "King Bed",
    size: "40m²",
    view: "City View",
    pricePerNight: 220,
    discountPercentage: 20
  });
  
  const room2 = await storage.createRoom({
    hotelId: hotel1.id,
    name: "Junior Suite",
    description: "Our Junior Suite offers a spacious layout with separate sleeping and living areas, king-size bed, luxury bathroom with tub and shower, and premium city views.",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
    maxGuests: 3,
    bedType: "King Bed",
    size: "55m²",
    view: "City View",
    pricePerNight: 255,
    discountPercentage: 0
  });
  
  // Add room amenities
  await storage.createRoomAmenity({ roomId: room1.id, name: "Free WiFi", icon: "ri-wifi-line" });
  await storage.createRoomAmenity({ roomId: room1.id, name: "Mini Bar", icon: "ri-fridge-line" });
  await storage.createRoomAmenity({ roomId: room1.id, name: "Flat-screen TV", icon: "ri-tv-line" });
  await storage.createRoomAmenity({ roomId: room1.id, name: "Coffee Maker", icon: "ri-cup-line" });
})();
