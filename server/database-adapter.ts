import { storage as postgresStorage } from './storage';
import { mongoStorage } from './mongo-storage';
import { connectToMongoDB } from './mongodb-connector';

/**
 * This adapter lets you choose which database implementation to use.
 * You can switch between PostgreSQL and MongoDB without changing application code.
 */

// Whether to use MongoDB (true) or PostgreSQL (false)
const USE_MONGODB = process.env.USE_MONGODB === 'true';

// Try to connect to MongoDB if enabled
async function initialize() {
  if (USE_MONGODB) {
    try {
      const connected = await connectToMongoDB();
      console.log(`Using MongoDB for database storage: ${connected ? 'Connected successfully' : 'Connection failed, falling back to PostgreSQL'}`);
      
      if (!connected) {
        console.log('MongoDB connection failed, falling back to PostgreSQL');
        return postgresStorage;
      }
      
      return mongoStorage;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      console.log('Falling back to PostgreSQL');
      return postgresStorage;
    }
  }
  
  console.log('Using PostgreSQL for database storage');
  return postgresStorage;
}

export { initialize };