import mongoose from "mongoose";

const mongoURI = "mongodb://localhost:27017/pizzurger";

export async function connectToMongo() {
  if (mongoose.connection.readyState >= 1) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    await mongoose.connect(mongoURI);

    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
