import mongoose from "mongoose";

const mongoConnection = async () => {
    // If we're already connected, don't try to connect again
    if (mongoose.connection.readyState >= 1) return;

    try {
        const mongo_url = process.env.mongoUrl;
        
        if (!mongo_url) {
            console.error("❌ CRITICAL error: 'mongoUrl' environment variable is MISSING in Vercel settings!");
            return;
        }

        console.log("📡 Attempting to connect to MongoDB Atlas...");
        
        await mongoose.connect(mongo_url, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 10
        });

        console.log("✅ Database connected successfully!");
    } catch (error) {
        console.error("❌ Database connection failed:");
        console.error(error.message);
    }
}

export default mongoConnection;
