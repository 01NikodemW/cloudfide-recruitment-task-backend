import * as dotenv from 'dotenv';
dotenv.config();

export default {
  mongoUri: process.env.MONGODB_URI,
};
