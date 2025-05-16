/**
 * Database configuration file
 * This handles the database selection and connection
 */

// Set this to true to use MongoDB, false to use PostgreSQL
export const USE_MONGODB = true;

// MongoDB connection parameters
export const MONGODB_CONFIG = {
  url: process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_booking_app',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // 5 seconds timeout for server selection
    connectTimeoutMS: 10000, // 10 seconds timeout for initial connection
    socketTimeoutMS: 45000, // 45 seconds timeout for socket operations
  }
};

// PostgreSQL connection parameters (these are set by environment variables)
export const POSTGRES_CONFIG = {
  connectionString: process.env.DATABASE_URL,
};