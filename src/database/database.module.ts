import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://admin:password@localhost:27017/trading?authSource=admin';

@Module({
  imports: [MongooseModule.forRoot(MONGODB_URI)],
})
export class DatabaseModule {}
