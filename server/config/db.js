import { MongoClient } from 'mongodb';

// ใช้ process.env.MONGO_URI และระบุชื่อฐานข้อมูล /wellnessData ต่อท้าย
const uri = process.env.MONGO_URI || "mongodb+srv://paraweekeawpardit_db_user:oU7yT2nBJJOzAO0u@cluster0.ty3vwpy.mongodb.net/wellnessData?retryWrites=true&w=majority";

const client = new MongoClient(uri);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  await client.close();
}
