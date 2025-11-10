import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        if (process.env.NODE_ENV !== 'production') {
            console.log("MongoDB Connected");
        }
    } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
            console.error("Database Connection Failed:", err.message);
        }
        process.exit(1);
    }
};
