"use client";

import { useState } from "react";

export default function CreateUserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [passWord, setpassWord] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/user/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, passWord, status }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Tạo user thành công!");
      setName("");
      setEmail("");
    } else {
      setMessage(data.message || "Lỗi khi tạo user.");
    }
  };
  function generatepassWord(length = 12) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let passWord = "";
    for (let i = 0; i < length; i++) {
      passWord += charset[Math.floor(Math.random() * charset.length)];
    }
    return passWord;
  }
  console.log(passWord ? generatepassWord() : passWord);


  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Tạo User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="pass"
          value={passWord == undefined ? generatepassWord() : passWord}
          onChange={(e) => setpassWord(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <select
          className="w-full p-2 border rounded mb-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Chọn trạng thái</option>
          <option value="admin">admin</option>
          <option value="pro">pro</option>
          <option value="kho">kho</option>
          <option value="taosp">tạo SP</option>

        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tạo User
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
