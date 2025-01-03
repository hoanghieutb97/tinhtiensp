import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI không được cấu hình trong .env.local");
}

let client;
let clientPromise;

// Kiểm tra nếu đã kết nối, nếu chưa thì khởi tạo
if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function POST(req) {
  try {
    const data = await req.json(); // Lấy dữ liệu từ body request
    const client = await clientPromise; // Sử dụng kết nối đã tái sử dụng
    const db = client.db("test"); // Tên database
    const collection = db.collection("sanpham"); // Tên collection
    const result = await collection.insertOne(data); // Thêm dữ liệu
    return new Response(JSON.stringify({ success: true, id: result.insertedId }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}



export async function PUT(req) {

  try {
    const { id, updateData } = await req.json(); // Lấy ID và dữ liệu cần cập nhật từ body
    console.log("req------------");

    if (!id || !updateData) {
      return new Response(
        JSON.stringify({ success: false, error: "Thiếu ID hoặc dữ liệu cần cập nhật" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("test"); // Tên database
    const collection = db.collection("sanpham"); // Tên collection


    const result = await collection.updateOne(
      { _id: new ObjectId(id) }, // Tìm tài liệu cần cập nhật
      { $set: updateData } // Cập nhật dữ liệu mới
    );
    console.log("------", result);
    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Không tìm thấy tài liệu phù hợp" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, modifiedCount: result.modifiedCount }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}


// export async function GET() {
//   try {
//     const client = await clientPromise; // Sử dụng kết nối đã tái sử dụng
//     const db = client.db("test"); // Tên database
//     const collection = db.collection("sanpham"); // Tên collection
//     const data = await collection.find({}).toArray(); // Lấy toàn bộ dữ liệu
//     return new Response(JSON.stringify({ success: true, data }), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
//   }
// }

export async function GET(req) {
  try {
    const url = new URL(req.url); // Lấy URL từ request
    const searchQuery = url.searchParams.get("q"); // Lấy tham số 'q' từ query string

    const client = await clientPromise; // Sử dụng kết nối đã tái sử dụng
    const db = client.db("test"); // Tên database
    const collection = db.collection("sanpham"); // Tên collection


    let data;
    if (searchQuery) {
      // Nếu có tham số tìm kiếm
      data = await collection
        .find({ name: { $regex: searchQuery, $options: "i" } }) // Tìm kiếm theo trường "name"
        .toArray();
        console.log(data);
    } else {
      // Nếu không có tham số, trả về toàn bộ dữ liệu
      data = await collection.find({}).toArray();
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

