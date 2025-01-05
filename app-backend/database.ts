import mongoose from 'mongoose';
import * as dotenv from 'dotenv';


dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI as string; // Ensure type safety
    await mongoose.connect(mongoURI);
    console.log('MongoDB connection established successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit with failure
  }
};

export default connectDB;
