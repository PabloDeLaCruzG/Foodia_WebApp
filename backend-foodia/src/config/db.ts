import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL);
    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(`MongoDB connected to ${url}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};