import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, passWord } = body;

    console.log("Dữ liệu nhận từ client:", { email, passWord });

    if (!email || !passWord) {
      console.log("Thiếu email hoặc passWord");
      return Response.json({ message: "Email và mật khẩu là bắt buộc!" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    console.log("Đang tìm user với email:", email);
    const user = await db.collection("user").findOne({ email });

    if (!user) {
      console.log("Không tìm thấy user");
      return Response.json({ message: "Email không tồn tại!" }, { status: 401 });
    }
    console.log("passWord nhận từ client:", passWord);
    console.log("passWord trong database:", user.passWord);
    console.log("User tìm thấy:", user);
    const isMatch = await bcrypt.compare(passWord, user.passWord); 

    if (!isMatch) {
      console.log("Mật khẩu không khớp");
      return Response.json({ message: "Mật khẩu không đúng!" }, { status: 401 });
    }

    const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Tạo token thành công:", token);
    const response = Response.json({ message: "Đăng nhập thành công!",status: user.status }, { status: 200 });
    response.headers.append("Set-Cookie", `authToken=${token}; Path=/; HttpOnly; Secure`);
    return response;
  } catch (error) {
    console.error("Lỗi xảy ra trong quá trình đăng nhập:", error);
    return Response.json({ message: "Lỗi khi đăng nhập", error }, { status: 500 });
  }
}
