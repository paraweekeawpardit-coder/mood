const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI || "mongodb+srv://paraweekeawpardit_db_user:oU7yT2nBJJOzAO0u@cluster0.ty3vwpy.mongodb.net/wellnessData?retryWrites=true&w=majority";

const client = new MongoClient(uri);

// เปลี่ยนมาใช้ชื่อ connectDB และ module.exports แบบเดิม
const connectDB = async () => {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
};

const disconnectFromMongoDB = async () => {
  await client.close();
};

module.exports = connectDB; // ส่งออกตรงๆ ให้ตรงกับที่ server.js เรียกใช้
