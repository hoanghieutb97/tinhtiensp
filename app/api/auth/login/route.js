import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, passWord } = body;

    if (!email || !passWord) {
      return NextResponse.json({ message: "Email và mật khẩu là bắt buộc!" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection("user").findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "Email không tồn tại!" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(passWord, user.passWord); 
    if (!isMatch) {
      return NextResponse.json({ message: "Mật khẩu không đúng!" }, { status: 401 });
    }

    // Tạo token JWT
    const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "100h",
    });

    console.log("Tạo token:", token);

    // Kiểm tra có đang chạy HTTPS không
    const isSecure = req.headers.get("x-forwarded-proto") === "https";

    // 🛠 Fix lỗi HTTP: Nếu không phải HTTPS, bỏ `secure: true`
    const cookieStore = cookies();
    await cookieStore.set({
      name: "authToken",
      value: token,
      httpOnly: true,
      secure: isSecure, // Chỉ bật secure nếu đang chạy HTTPS
      sameSite: "lax", // Fix lỗi cookie bị chặn trên IP
      path: "/",
      maxAge: 60 * 60, // 1h
    });

    return NextResponse.json({ message: "Đăng nhập thành công!", status: user.status }, { status: 200 });

  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return NextResponse.json({ message: "Lỗi khi đăng nhập", error }, { status: 500 });
  }
}
