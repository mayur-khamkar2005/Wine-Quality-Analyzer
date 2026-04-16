import mongoose from 'mongoose';

import { env } from './env.js';

export const connectDatabase = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.mongodbUri);
    console.info('MongoDB connection established');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
};
