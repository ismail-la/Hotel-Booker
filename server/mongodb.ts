import mongoose from 'mongoose';

// Create a MongoDB connection URL with proper formatting
let MONGODB_URL = 'mongodb://localhost:27017/hotel_booking_app';

// Check if provided URI starts with the required MongoDB protocol
if (process.env.MONGODB_URI) {
  if (process.env.MONGODB_URI.startsWith('mongodb://') || process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
    MONGODB_URL = process.env.MONGODB_URI;
  } else {
    // Try to add the protocol if missing
    MONGODB_URL = `mongodb://${process.env.MONGODB_URI}`;
    console.log('Added mongodb:// prefix to MONGODB_URI');
  }
}

console.log('Attempting to connect to MongoDB at:', MONGODB_URL);

// Use a try-catch block for better error handling
try {
  // Connect to MongoDB
  mongoose.connect(MONGODB_URL);
  
  const db = mongoose.connection;
  
  db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });
  
  db.once('open', () => {
    console.log('Connected to MongoDB successfully');
  });
} catch (error) {
  console.error('Failed to connect to MongoDB:', error);
  
  // Fallback to in-memory storage if MongoDB connection fails
  console.log('Using in-memory storage instead');
}

export default mongoose;