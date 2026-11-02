import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServerInstance = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  console.log('[DB] MONGODB_URI loaded:', Boolean(uri));
  console.log('[DB] Connection type:', uri?.startsWith('mongodb+srv://') ? 'MongoDB Atlas' : 'Not Atlas');

  try {
    if (uri && !uri.includes('memory')) {
      // Set short serverSelectionTimeoutMS so if local mongod is not up, it falls back quickly
      mongoose.set('strictQuery', false);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 15000,
      });
      console.log(`[DB] Successfully connected to MongoDB at: ${uri.replace(/\/\/.*@/, '//***:***@')}`);
      return;
    }
  } catch (err) {
    console.error('[DB] Atlas connection error:', err);
    console.warn('[DB] Falling back to In-Memory MongoDB for local development...');
  }

  try {
    console.log('[DB] Initializing In-Memory MongoDB instance...');
    mongoMemoryServerInstance = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServerInstance.getUri();
    await mongoose.connect(memoryUri);
    console.log(`[DB] Connected to In-Memory MongoDB instance: ${memoryUri}`);
  } catch (memErr) {
    console.error('[DB] Critical error initializing database:', memErr.message);
    throw memErr;
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServerInstance) {
    await mongoMemoryServerInstance.stop();
  }
};

