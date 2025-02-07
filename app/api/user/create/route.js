import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json(); // Lấy dữ liệu từ request
    const { name, email } = body;

    if (!name || !email) {
      return new Response(JSON.stringify({ message: "Tên và email là bắt buộc!" }), {
        status: 400,
      });
    }

    const client = await clientPromise; // Kết nối MongoDB
    const db = client.db();

    // Kiểm tra nếu email đã tồn tại
    const existingUser = await db.collection("user").findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "Email đã được sử dụng!" }), {
        status: 409,
      });
    }

    // Lưu user mới vào database
    const newUser = {
      name,
      email,
      createdAt: new Date(),
    };

    await db.collection("user").insertOne(newUser);

    return new Response(
      JSON.stringify({ message: "Tạo user thành công!", user: newUser }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: "Lỗi khi tạo user", error }), {
      status: 500,
    });
  }
}
