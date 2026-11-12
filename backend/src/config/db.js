import mongoose from 'mongoose';

export let isConnectedToMongoDB = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log('Connecting to MongoDB Atlas / configured URI...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      isConnectedToMongoDB = true;
      console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.warn(`Failed to connect to MongoDB URI: ${error.message}`);
      console.log('Activating Built-In In-Memory Database store for instant local execution.');
      isConnectedToMongoDB = false;
      return null;
    }
  } else {
    console.log('No MONGODB_URI set in environment.');
    console.log('Activating Built-In In-Memory Database store (Ready for development & testing).');
    console.log('To connect MongoDB Atlas, provide MONGODB_URI in backend/.env');
    isConnectedToMongoDB = false;
    return null;
  }
};

export const closeDB = async () => {
  if (isConnectedToMongoDB) {
    await mongoose.connection.close();
  }
};
