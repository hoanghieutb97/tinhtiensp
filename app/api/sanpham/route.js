import { MongoClient } from "mongodb";

// Lấy URI từ biến môi trường
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI không được cấu hình trong .env.local");
}
const client = new MongoClient(uri);

export async function POST(req) {
  try {
    const data = await req.json(); // Lấy dữ liệu từ body request
    await client.connect();
    const db = client.db("test"); // Tên database
    const collection = db.collection("sanpham"); // Tên collection
    const result = await collection.insertOne(data); // Thêm dữ liệu
    return new Response(JSON.stringify({ success: true, id: result.insertedId }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  } finally {
    await client.close();
  }
}


export async function GET() {
  
  
    try {
      await client.connect();
      const db = client.db("test"); // Tên database
      const collection = db.collection("sanpham"); // Tên collection
      const data = await collection.find({}).toArray(); // Lấy toàn bộ dữ liệu
      return new Response(JSON.stringify({ success: true, data }), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    } finally {
      await client.close();
    }
  }