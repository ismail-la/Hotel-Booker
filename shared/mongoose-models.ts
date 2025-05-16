import mongoose, { Schema, Document } from 'mongoose';

// User model
export interface IUser extends Document {
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  isAdmin: boolean;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  isAdmin: { type: Boolean, default: false }
});

// Hotel model
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

// Hotel Amenity model
export interface IHotelAmenity extends Document {
  hotelId: Schema.Types.ObjectId;
  name: string;
  icon?: string;
}

const hotelAmenitySchema = new Schema<IHotelAmenity>({
  hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
  name: { type: String, required: true },
  icon: { type: String }
});

// Room model
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

// Room Amenity model
export interface IRoomAmenity extends Document {
  roomId: Schema.Types.ObjectId;
  name: string;
  icon?: string;
}

const roomAmenitySchema = new Schema<IRoomAmenity>({
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  name: { type: String, required: true },
  icon: { type: String }
});

// Booking model
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

// Export models - Create them only if mongoose is connected
export function createModels() {
  // Create models only if they don't already exist
  const UserModel = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
  const HotelModel = mongoose.models.Hotel || mongoose.model<IHotel>('Hotel', hotelSchema);
  const HotelAmenityModel = mongoose.models.HotelAmenity || mongoose.model<IHotelAmenity>('HotelAmenity', hotelAmenitySchema);
  const RoomModel = mongoose.models.Room || mongoose.model<IRoom>('Room', roomSchema);
  const RoomAmenityModel = mongoose.models.RoomAmenity || mongoose.model<IRoomAmenity>('RoomAmenity', roomAmenitySchema);
  const BookingModel = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);

  return {
    User: UserModel,
    Hotel: HotelModel,
    HotelAmenity: HotelAmenityModel,
    Room: RoomModel,
    RoomAmenity: RoomAmenityModel,
    Booking: BookingModel
  };
}