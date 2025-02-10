"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [passWord, setpassWord] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Gửi request đến /api/auth/login:", { email, passWord });

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, passWord }),
    });

    const data = await res.json();
    console.log("Phản hồi từ server:", data);

    if (res.ok) {
      setMessage("Đăng nhập thành công!");
      localStorage.setItem("userStatus", data.status);
      router.push("/sanpham"); // Chuyển hướng sau khi đăng nhập
    } else {
      setMessage(data.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Đăng Nhập</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={passWord}
          onChange={(e) => setpassWord((e.target.value).toString())}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Đăng Nhập
        </button>
      </form>
      {message && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );
}
