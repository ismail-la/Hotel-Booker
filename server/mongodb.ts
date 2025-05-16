import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createModels } from '@shared/mongoose-models';

let mongoServer: MongoMemoryServer | null = null;

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

// Start the in-memory MongoDB when this module is imported
startInMemoryMongoDB()
  .then(() => console.log('In-memory MongoDB setup complete'))
  .catch(err => console.error('Failed to start in-memory MongoDB:', err));