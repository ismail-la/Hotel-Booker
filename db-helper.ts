/**
 * Helper utility for database operations
 * Allows easy switching between PostgreSQL and MongoDB
 */

// Set this to 'mongodb' to use MongoDB, or 'postgres' to use PostgreSQL
export const DB_TYPE = process.env.DB_TYPE || 'postgres';

// Helper functions for ID conversion
export function convertToObjectId(id: string | number): string {
  return id.toString();
}

// Helper to handle different ID formats between databases
export function getIdFromObject(obj: any): string | number {
  if (!obj) return null;
  
  // MongoDB objects have _id
  if (obj._id) {
    return obj._id.toString();
  }
  
  // PostgreSQL objects have id as number
  if (obj.id) {
    return obj.id;
  }
  
  return null;
}

// Format object IDs in a database-agnostic way
export function formatIds(obj: any): any {
  if (!obj) return obj;
  
  // Handle MongoDB objects with _id
  if (obj._id) {
    return {
      ...obj,
      id: obj._id.toString(),
    };
  }
  
  return obj;
}