// connect MongoDB with mongoose and dotenv packages
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://AthulJestin:Z2LnSKNJezGwC3x7@hash.nmrhjun.mongodb.net/?retryWrites=true&w=majority&appName=Hash", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};