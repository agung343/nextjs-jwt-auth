import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect("");
  } catch (error) {
    console.error(error);
  }
}
