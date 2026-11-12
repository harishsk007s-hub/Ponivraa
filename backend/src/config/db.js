import mongoose from 'mongoose';

export let isConnectedToMongoDB = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  const isProduction = process.env.NODE_ENV === 'production';

  if (uri && uri.trim() !== '') {
    try {
      console.log('Connecting to MongoDB Atlas database...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
      });
      isConnectedToMongoDB = true;
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`❌ MongoDB connection error: ${error.message}`);
      if (isProduction) {
        throw new Error(
          `Production database connection failed: ${error.message}. In-memory fallback is disabled in production to protect data persistence.`
        );
      }
      console.warn('⚠️ Development warning: Connecting to Atlas failed. Activating in-memory store for local testing.');
      isConnectedToMongoDB = false;
      return null;
    }
  } else {
    if (isProduction) {
      throw new Error(
        'Fatal: MONGODB_URI environment variable is missing in production. Refusing to start with in-memory storage.'
      );
    }
    console.warn('⚠️ No MONGODB_URI set. Running with built-in in-memory database store (development only).');
    isConnectedToMongoDB = false;
    return null;
  }
};

export const closeDB = async () => {
  if (isConnectedToMongoDB) {
    await mongoose.connection.close();
    isConnectedToMongoDB = false;
  }
};
