import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createModels } from '@shared/mongoose-models';

let mongoServer: MongoMemoryServer | null = null;

/**
 * Connect to production MongoDB
 */
export async function connectToProductionMongoDB(): Promise<boolean> {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      console.error('Missing MONGODB_URI environment variable');
      return false;
    }
    
    console.log('Connecting to production MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected to production MongoDB successfully');
    
    // Initialize models
    createModels();
    
    return true;
  } catch (error) {
    console.error('Failed to connect to production MongoDB:', error);
    return false;
  }
}

/**
 * Starts an in-memory MongoDB server for development/testing
 */
export async function startInMemoryMongoDB(): Promise<string> {
  console.log('Starting in-memory MongoDB server...');
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  console.log(`MongoDB Memory Server running at ${uri}`);
  
  // Set environment variable for other parts of the application to use
  process.env.MONGODB_URI = uri;
  
  // Connect to the in-memory database
  await mongoose.connect(uri);
  console.log('Connected to in-memory MongoDB');
  
  // Initialize models
  createModels();
  
  return uri;
}

/**
 * Stops the in-memory MongoDB server
 */
export async function stopInMemoryMongoDB(): Promise<void> {
  if (mongoServer) {
    await mongoose.connection.close();
    await mongoServer.stop();
    console.log('In-memory MongoDB server stopped');
  }
}

// Initialize MongoDB based on environment
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  console.log('Production environment detected, using real MongoDB connection');
  connectToProductionMongoDB()
    .then(success => {
      if (!success) {
        console.error('Failed to connect to production MongoDB. Exiting...');
        process.exit(1);
      }
    })
    .catch(err => {
      console.error('Error connecting to production MongoDB:', err);
      process.exit(1);
    });
} else {
  console.log('Development environment detected, using in-memory MongoDB');
  startInMemoryMongoDB()
    .then(() => console.log('In-memory MongoDB setup complete'))
    .catch(err => {
      console.error('Failed to start in-memory MongoDB:', err);
      process.exit(1);
    });
}