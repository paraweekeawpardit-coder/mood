import { MongoClient } from 'mongodb';
const client = new MongoClient("mongodb+srv://paraweekeawpardit_db_user:oU7yT2nBJJOzAO0u@cluster0.ty3vwpy.mongodb.net/");
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
