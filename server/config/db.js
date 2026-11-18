import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI || "mongodb+srv://paraweekeawpardit_db_user:oU7yT2nBJJOzAO0u@cluster0.ty3vwpy.mongodb.net/wellnessData?retryWrites=true&w=majority";

const client = new MongoClient(uri);

// เปลี่ยนชื่อฟังก์ชันกลับมาเป็น connectDB ตรงนี้ครับ
export async function connectDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

export async function disconnectFromMongoDB() {
  await client.close();
}
