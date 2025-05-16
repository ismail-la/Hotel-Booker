import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage"; // Use PostgreSQL storage until MongoDB is fully connected
import { mongoStorage } from "./mongo-storage"; // Import MongoDB storage for future use
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertBookingSchema, insertHotelSchema, insertRoomSchema } from "@shared/schema";

// Determine which storage implementation to use
// Will use PostgreSQL by default until MongoDB is properly set up
const db = storage;

// Middleware to check authentication
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Middleware to check admin status
const isAdmin = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.status(403).json({ message: "Forbidden: Admin access required" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Hotel Routes
  app.get("/api/hotels", async (req, res) => {
    try {
      const hotels = await storage.getAllHotels();
      res.json(hotels);
    } catch (error) {
      res.status(500).json({ message: "Error fetching hotels" });
    }
  });

  app.get("/api/hotels/:id", async (req, res) => {
    try {
      // Get hotelId - support both number and string IDs for both DB types
      const hotelId = req.params.id;
      const hotel = await storage.getHotel(hotelId);
      
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      
      // Get hotel amenities
      const amenities = await storage.getHotelAmenities(hotelId);
      
      // Get rooms for this hotel
      const rooms = await storage.getRoomsForHotel(hotelId);
      
      // For each room, get its amenities
      const roomsWithAmenities = await Promise.all(
        rooms.map(async (room) => {
          const roomId = room.id?.toString() || room._id?.toString();
          const amenities = await storage.getRoomAmenities(roomId);
          return { ...room, amenities };
        })
      );
      
      res.json({
        ...hotel,
        amenities,
        rooms: roomsWithAmenities
      });
    } catch (error) {
      console.error("Error fetching hotel details:", error);
      res.status(500).json({ message: "Error fetching hotel details" });
    }
  });

  // Admin Hotel Routes
  app.post("/api/admin/hotels", isAdmin, async (req, res) => {
    try {
      const hotelData = insertHotelSchema.parse(req.body);
      const hotel = await storage.createHotel(hotelData);
      res.status(201).json(hotel);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Error creating hotel" });
    }
  });

  app.put("/api/admin/hotels/:id", isAdmin, async (req, res) => {
    try {
      const hotelId = parseInt(req.params.id);
      const hotelData = insertHotelSchema.partial().parse(req.body);
      
      const updatedHotel = await storage.updateHotel(hotelId, hotelData);
      
      if (!updatedHotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      
      res.json(updatedHotel);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Error updating hotel" });
    }
  });

  app.delete("/api/admin/hotels/:id", isAdmin, async (req, res) => {
    try {
      const hotelId = parseInt(req.params.id);
      const success = await storage.deleteHotel(hotelId);
      
      if (!success) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting hotel" });
    }
  });

  // Admin Room Routes
  app.post("/api/admin/rooms", isAdmin, async (req, res) => {
    try {
      const roomData = insertRoomSchema.parse(req.body);
      const room = await storage.createRoom(roomData);
      res.status(201).json(room);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Error creating room" });
    }
  });

  app.put("/api/admin/rooms/:id", isAdmin, async (req, res) => {
    try {
      const roomId = parseInt(req.params.id);
      const roomData = insertRoomSchema.partial().parse(req.body);
      
      const updatedRoom = await storage.updateRoom(roomId, roomData);
      
      if (!updatedRoom) {
        return res.status(404).json({ message: "Room not found" });
      }
      
      res.json(updatedRoom);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Error updating room" });
    }
  });

  app.delete("/api/admin/rooms/:id", isAdmin, async (req, res) => {
    try {
      const roomId = parseInt(req.params.id);
      const success = await storage.deleteRoom(roomId);
      
      if (!success) {
        return res.status(404).json({ message: "Room not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting room" });
    }
  });

  // Booking Routes
  app.post("/api/bookings", isAuthenticated, async (req, res) => {
    try {
      // Parse booking data
      const bookingData = insertBookingSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      // Check if room exists
      const room = await storage.getRoom(bookingData.roomId);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      
      // Check if hotel exists
      const hotel = await storage.getHotel(bookingData.hotelId);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      
      // Create booking
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Error creating booking" });
    }
  });

  app.get("/api/bookings", isAuthenticated, async (req, res) => {
    try {
      const bookings = await storage.getUserBookings(req.user.id);
      
      // Enhance bookings with hotel and room info
      const enhancedBookings = await Promise.all(
        bookings.map(async (booking) => {
          const hotel = await storage.getHotel(booking.hotelId);
          const room = await storage.getRoom(booking.roomId);
          
          return {
            ...booking,
            hotel: hotel ? { 
              id: hotel.id,
              name: hotel.name,
              location: hotel.location,
              image: hotel.image,
              rating: hotel.rating
            } : null,
            room: room ? {
              id: room.id,
              name: room.name,
              bedType: room.bedType,
              maxGuests: room.maxGuests
            } : null
          };
        })
      );
      
      res.json(enhancedBookings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching bookings" });
    }
  });

  app.get("/api/bookings/:id", isAuthenticated, async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Check if user owns this booking or is admin
      if (booking.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Get hotel and room info
      const hotel = await storage.getHotel(booking.hotelId);
      const room = await storage.getRoom(booking.roomId);
      
      res.json({
        ...booking,
        hotel: hotel ? { 
          id: hotel.id,
          name: hotel.name,
          location: hotel.location,
          image: hotel.image,
          rating: hotel.rating
        } : null,
        room: room ? {
          id: room.id,
          name: room.name,
          bedType: room.bedType,
          maxGuests: room.maxGuests
        } : null
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching booking" });
    }
  });

  app.patch("/api/bookings/:id/cancel", isAuthenticated, async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Check if user owns this booking or is admin
      if (booking.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Cancel booking
      const updatedBooking = await storage.updateBookingStatus(bookingId, "cancelled");
      
      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: "Error cancelling booking" });
    }
  });

  // Admin Booking Routes
  app.get("/api/admin/bookings", isAdmin, async (req, res) => {
    try {
      // Get all bookings from all users
      const allBookings = [];
      for (const user of Array.from(await storage.getAllHotels())) {
        const userBookings = await storage.getUserBookings(user.id);
        allBookings.push(...userBookings);
      }
      
      res.json(allBookings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching all bookings" });
    }
  });

  app.patch("/api/admin/bookings/:id/status", isAdmin, async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: "Status is required" });
      }
      
      // Update booking status
      const updatedBooking = await storage.updateBookingStatus(bookingId, status);
      
      if (!updatedBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: "Error updating booking status" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
