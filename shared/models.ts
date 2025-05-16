import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

// Define interface for User document
export interface IUser extends Document {
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  isAdmin: boolean;
}

// User Schema
const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  isAdmin: { type: Boolean, default: false }
});

// User model
export const User = mongoose.model<IUser>('User', userSchema);

// Define interface for Hotel document
export interface IHotel extends Document {
  name: string;
  location: string;
  description: string;
  image?: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  discountPercentage: number;
  status: string;
}

// Hotel Schema
const hotelSchema = new Schema<IHotel>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  rating: { type: Number, required: true },
  reviewCount: { type: Number, default: 0 },
  pricePerNight: { type: Number, required: true },
  discountPercentage: { type: Number, default: 0 },
  status: { type: String, default: 'active' }
});

// Hotel model
export const Hotel = mongoose.model<IHotel>('Hotel', hotelSchema);

// Define interface for HotelAmenity document
export interface IHotelAmenity extends Document {
  hotelId: Schema.Types.ObjectId;
  name: string;
  icon?: string;
}

// HotelAmenity Schema
const hotelAmenitySchema = new Schema<IHotelAmenity>({
  hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
  name: { type: String, required: true },
  icon: { type: String }
});

// HotelAmenity model
export const HotelAmenity = mongoose.model<IHotelAmenity>('HotelAmenity', hotelAmenitySchema);

// Define interface for Room document
export interface IRoom extends Document {
  hotelId: Schema.Types.ObjectId;
  name: string;
  description: string;
  image?: string;
  maxGuests: number;
  bedType: string;
  size?: string;
  view?: string;
  pricePerNight: number;
  discountPercentage: number;
}

// Room Schema
const roomSchema = new Schema<IRoom>({
  hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  maxGuests: { type: Number, required: true },
  bedType: { type: String, required: true },
  size: { type: String },
  view: { type: String },
  pricePerNight: { type: Number, required: true },
  discountPercentage: { type: Number, default: 0 }
});

// Room model
export const Room = mongoose.model<IRoom>('Room', roomSchema);

// Define interface for RoomAmenity document
export interface IRoomAmenity extends Document {
  roomId: Schema.Types.ObjectId;
  name: string;
  icon?: string;
}

// RoomAmenity Schema
const roomAmenitySchema = new Schema<IRoomAmenity>({
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  name: { type: String, required: true },
  icon: { type: String }
});

// RoomAmenity model
export const RoomAmenity = mongoose.model<IRoomAmenity>('RoomAmenity', roomAmenitySchema);

// Define interface for Booking document
export interface IBooking extends Document {
  userId: Schema.Types.ObjectId;
  hotelId: Schema.Types.ObjectId;
  roomId: Schema.Types.ObjectId;
  checkInDate: Date;
  checkOutDate: Date;
  guestCount: number;
  totalPrice: number;
  status: string;
  specialRequests?: string;
  createdAt: Date;
}

// Booking Schema
const bookingSchema = new Schema<IBooking>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  guestCount: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'confirmed' },
  specialRequests: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Booking model
export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);

// Zod Schemas for validation
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  isAdmin: z.boolean().optional()
});

export const insertHotelSchema = z.object({
  name: z.string(),
  location: z.string(),
  description: z.string(),
  image: z.string().optional(),
  rating: z.number(),
  reviewCount: z.number().optional(),
  pricePerNight: z.number(),
  discountPercentage: z.number().optional(),
  status: z.string().optional()
});

export const insertHotelAmenitySchema = z.object({
  hotelId: z.string(),
  name: z.string(),
  icon: z.string().optional()
});

export const insertRoomSchema = z.object({
  hotelId: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string().optional(),
  maxGuests: z.number(),
  bedType: z.string(),
  size: z.string().optional(),
  view: z.string().optional(),
  pricePerNight: z.number(),
  discountPercentage: z.number().optional()
});

export const insertRoomAmenitySchema = z.object({
  roomId: z.string(),
  name: z.string(),
  icon: z.string().optional()
});

export const insertBookingSchema = z.object({
  userId: z.string(),
  hotelId: z.string(),
  roomId: z.string(),
  checkInDate: z.string().or(z.date()),
  checkOutDate: z.string().or(z.date()),
  guestCount: z.number(),
  totalPrice: z.number(),
  status: z.string().optional(),
  specialRequests: z.string().optional()
});

// Type definitions using Zod inferences
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertHotel = z.infer<typeof insertHotelSchema>;
export type InsertHotelAmenity = z.infer<typeof insertHotelAmenitySchema>;
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type InsertRoomAmenity = z.infer<typeof insertRoomAmenitySchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;