const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
if (!uri) throw new Error("MONGO_URI is not set");

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
  maxPoolSize: 10,
});

const connectDB = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client;
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    throw err;
  }
};

module.exports = connectDB;
