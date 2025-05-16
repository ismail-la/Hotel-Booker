import mongoose from 'mongoose';

// Get MongoDB connection URL from environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotelapp';

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
      console.error('Invalid MongoDB URI format. Must start with mongodb:// or mongodb+srv://');
      return false;
    }
    
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
}

export { connectToMongoDB };