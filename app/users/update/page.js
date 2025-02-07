"use client";

import { useState, useEffect } from "react";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");

    // Lấy danh sách user từ API
    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch("/api/user/getAll");
            const data = await res.json();
            setUsers(data);
        };

        fetchUsers();
    }, []);
    console.log(users);

    // Xử lý cập nhật trạng thái
    const handleUpdateStatus = async () => {
        let { _id, ...updateFields } = selectedUser;
        if (!selectedUser || !status) {
            setMessage("Vui lòng chọn user và trạng thái!");
            return;
        }

        const res = await fetch("/api/user/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: selectedUser._id, updateData: { ...updateFields, status } }),
        });

        const data = await res.json();

        if (res.ok) {
            setMessage(`Cập nhật thành công: ${selectedUser.email} -> ${status}`);
            setUsers(users.map(user =>
                user.email === selectedUser.email ? { ...user, status } : user
            ));
        } else {
            setMessage(data.message);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Danh sách User</h1>

            {/* Dropdown chọn user */}
            <select
                className="w-full p-2 border rounded mb-2"
                onChange={(e) => {
                    const user = users.find(user => user.email === e.target.value);
                    setSelectedUser(user);
                    setStatus(user?.status || "");
                }}
            >
                <option value="">Chọn user</option>
                {users.map((user) => (
                    <option key={user.email} value={user.email}>
                        {user.name} - {user.email} ({user.status})
                    </option>
                ))}
            </select>

            {/* Dropdown chọn trạng thái */}
            {selectedUser && (
                <>
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

                    {/* Nút cập nhật trạng thái */}
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={handleUpdateStatus}
                    >
                        Cập nhật Trạng thái
                    </button>
                </>
            )}

            {/* Hiển thị thông báo */}
            {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>
    );
}
