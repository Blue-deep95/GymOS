
// mainly for connecting to mongodb database
const mongoose = require('mongoose')

async function connectMongoDB() {
    const mongoURI = process.env.MONGO_URI || "mongodb://admin:admin123@gym_mongo:27017/gymOS?authSource=admin";
    try {
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected successfully to:", mongoURI.replace(/:[^:@/]+@/, ':****@'));
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    }
}

module.exports = connectMongoDB;