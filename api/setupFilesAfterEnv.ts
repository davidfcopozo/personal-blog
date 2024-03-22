import { connectDB } from "./src/config/connect";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

/* Connecting to the database before all tests. */
beforeAll(async () => {
  await connectDB(process.env.MONGO_DB as string);
});

/* Closing database connection after all tests. */
afterAll(async () => {
  await mongoose.connection.close();
});
