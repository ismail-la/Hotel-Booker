import { pgTable, text, serial, integer, boolean, date, doublePrecision, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  isAdmin: boolean("is_admin").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
  isAdmin: true,
});

// Hotels Table
export const hotels = pgTable("hotels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  rating: integer("rating").notNull(),
  reviewCount: integer("review_count").default(0),
  pricePerNight: doublePrecision("price_per_night").notNull(),
  discountPercentage: integer("discount_percentage").default(0),
  status: text("status").default("active"),
});

export const insertHotelSchema = createInsertSchema(hotels).pick({
  name: true,
  location: true,
  description: true,
  image: true,
  rating: true,
  reviewCount: true,
  pricePerNight: true,
  discountPercentage: true,
  status: true,
});

// Hotel Amenities Table
export const hotelAmenities = pgTable("hotel_amenities", {
  id: serial("id").primaryKey(),
  hotelId: integer("hotel_id").notNull(),
  name: text("name").notNull(),
  icon: text("icon"),
});

export const insertHotelAmenitySchema = createInsertSchema(hotelAmenities).pick({
  hotelId: true,
  name: true,
  icon: true,
});

// Rooms Table
export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  hotelId: integer("hotel_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  maxGuests: integer("max_guests").notNull(),
  bedType: text("bed_type").notNull(),
  size: text("size"),
  view: text("view"),
  pricePerNight: doublePrecision("price_per_night").notNull(),
  discountPercentage: integer("discount_percentage").default(0),
});

export const insertRoomSchema = createInsertSchema(rooms).pick({
  hotelId: true,
  name: true,
  description: true,
  image: true,
  maxGuests: true,
  bedType: true,
  size: true,
  view: true,
  pricePerNight: true,
  discountPercentage: true,
});

// Room Amenities Table
export const roomAmenities = pgTable("room_amenities", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(),
  name: text("name").notNull(),
  icon: text("icon"),
});

export const insertRoomAmenitySchema = createInsertSchema(roomAmenities).pick({
  roomId: true,
  name: true,
  icon: true,
});

// Bookings Table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  hotelId: integer("hotel_id").notNull(),
  roomId: integer("room_id").notNull(),
  checkInDate: date("check_in_date").notNull(),
  checkOutDate: date("check_out_date").notNull(),
  guestCount: integer("guest_count").notNull(),
  totalPrice: doublePrecision("total_price").notNull(),
  status: text("status").default("confirmed"),
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  userId: true,
  hotelId: true,
  roomId: true,
  checkInDate: true,
  checkOutDate: true,
  guestCount: true,
  totalPrice: true,
  status: true,
  specialRequests: true,
});

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Hotel = typeof hotels.$inferSelect;
export type InsertHotel = z.infer<typeof insertHotelSchema>;

export type HotelAmenity = typeof hotelAmenities.$inferSelect;
export type InsertHotelAmenity = z.infer<typeof insertHotelAmenitySchema>;

export type Room = typeof rooms.$inferSelect;
export type InsertRoom = z.infer<typeof insertRoomSchema>;

export type RoomAmenity = typeof roomAmenities.$inferSelect;
export type InsertRoomAmenity = z.infer<typeof insertRoomAmenitySchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
