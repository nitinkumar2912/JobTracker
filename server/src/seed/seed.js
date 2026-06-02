import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDb } from '../config/db.js';
import { ensureDemoAccount } from '../utils/seedDemoAccount.js';

dotenv.config();

const run = async () => {
  await connectDb();
  const user = await ensureDemoAccount({ reset: true });
  console.log(`Seeded demo data for ${user.email}`);
  await mongoose.connection.close();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
