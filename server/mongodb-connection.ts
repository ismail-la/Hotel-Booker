import mongoose from 'mongoose';
import { MONGODB_CONFIG } from './db-config';

/**
 * Connect to MongoDB function with retry logic
 * @returns Promise<boolean> - true if connected, false otherwise
 */
export async function connectToMongoDB(): Promise<boolean> {
  const { url, options } = MONGODB_CONFIG;
  
  // Validate MongoDB URI
  if (!url || !(url.startsWith('mongodb://') || url.startsWith('mongodb+srv://'))) {
    console.error('Invalid MongoDB URI format. URI must start with mongodb:// or mongodb+srv://');
    return false;
  }
  
  let retries = 3;
  let connected = false;
  
  while (retries > 0 && !connected) {
    try {
      // Log without showing sensitive info
      const maskedUrl = url.replace(/\/\/([^:]+):[^@]+@/, '//******:******@');
      console.log(`Connecting to MongoDB at: ${maskedUrl}`);
      
      await mongoose.connect(url, options);
      
      connected = true;
      console.log('Connected to MongoDB successfully!');
      
      // Setup connection event handlers
      mongoose.connection.on('error', err => {
        console.error('MongoDB connection error:', err);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected. Attempting to reconnect...');
      });
      
      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected successfully');
      });
      
      return true;
    } catch (error) {
      console.error(`MongoDB connection error (${retries} attempts left):`, error);
      retries--;
      
      if (retries > 0) {
        console.log(`Retrying in 3 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }
  
  if (!connected) {
    console.error('Failed to connect to MongoDB after multiple attempts. Please check your connection string and credentials.');
  }
  
  return connected;
}

// Export the connection
export default mongoose;