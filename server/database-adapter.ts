/**
 * Database Adapter
 * This provides a unified interface to switch between PostgreSQL and MongoDB
 */

import { USE_MONGODB } from './db-config';
import { storage as postgresStorage } from './storage';
import { mongoStorage } from './mongo-storage';
import { connectToMongoDB } from './mongodb-connection';

// Dynamically select the appropriate storage implementation
export const storage = USE_MONGODB ? mongoStorage : postgresStorage;

// Initialize the database connection
async function initialize() {
  if (USE_MONGODB) {
    // Connect to MongoDB
    const connected = await connectToMongoDB();
    if (!connected) {
      console.error('Warning: Failed to connect to MongoDB. Some features may not work properly.');
    }
  }
  
  // Add any database initialization code here
  return true;
}

export { initialize };