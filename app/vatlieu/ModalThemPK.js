import React, { useState } from 'react';
import { usePhukien } from "../context/PhukienContext";

function ModalThemPK(props) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [note, setNote] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { fetchVatlieu } = usePhukien();
    const [image, setImage] = useState(null); // Trường lưu trữ file ảnh

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file); // Đọc file và chuyển sang Base64
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };
    const handleImageUpload = async (file) => {
        try {
            const base64File = await convertToBase64(file);
            const formData = new FormData();
            formData.append("file", file);
            console.log(file);

            const response = await fetch("/api/cloudinary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ base64File }),
            });

            const data = await response.json();
            if (data.success) {
                return data.url; // URL ảnh từ Cloudinary
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error("Image Upload Error:", error);
            alert("Không thể tải ảnh lên!");
            return null;
        }
    };


    const handleSubmit = async () => {
        if (!name || !price|| !note) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        setLoading(true); // Bắt đầu trạng thái loading
        try {
            // Upload ảnh
            const imageUrl = await handleImageUpload(image);
            if (!imageUrl) {
                setLoading(false);
                return;
            }


            const response = await fetch("/api/vatlieu", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, price, imageUrl: imageUrl , note}),
            });

            const result = await response.json();
            if (response.ok) {

                fetchVatlieu();
                setName("");
                setPrice("");
                setNote("");
                setImage(null);
                setIsModalOpen(false);
            } else {
                alert(`Có lỗi xảy ra: ${result.error}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Không thể thêm phụ kiện!");
        } finally {
            setLoading(false); // Kết thúc trạng thái loading
        }
    };;

    return (
        <div className="container mt-4">
            {/* Button mở modal */}
            <button
                className="btn btn-danger"
                onClick={() => setIsModalOpen(true)}
                data-bs-toggle="modal"
                data-bs-target="#addAccessoryModal"
            >
                Thêm Vật liệu
            </button>

            {/* Modal */}
            <div
                className={`modal fade ${isModalOpen ? "show d-block" : ""}`}
                id="addAccessoryModal"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="addAccessoryModalLabel"
                aria-hidden="true"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addAccessoryModalLabel">
                                Thêm phụ kiện mới
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => setIsModalOpen(false)}
                            ></button>
                        </div>
                        <div className="modal-body">
                            {/* Form thêm phụ kiện */}
                            <div className="mb-3">
                                <label htmlFor="accessoryName" className="form-label">
                                    Tên phụ kiện
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="accessoryName"
                                    placeholder="Nhập tên phụ kiện"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="accessoryPrice" className="form-label">
                                    Giá tiền (VNĐ)
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="accessoryPrice"
                                    placeholder="Nhập giá tiền"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="accessoryPrice" className="form-label">
                                    Note
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="accessoryPrice"
                                    placeholder="Ghi chú"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="accessoryImage" className="form-label">
                                    Ảnh phụ kiện
                                </label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="accessoryImage"
                                    onChange={(e) => setImage(e.target.files[0])}
                                />
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? "Đang thêm..." : "Thêm"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ModalThemPK;