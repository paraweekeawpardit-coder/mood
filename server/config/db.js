const mongoose = require('mongoose');

const connectDB = async () => {
    try {

        await mongoose.connect( process.env.MONGO_URI || "mongodb://localhost:27017/wellnessData", {
        });
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Database connection error:", err);
    }
};

module.exports = connectDB;

// 76!vfHDMc+/usD4 supabase