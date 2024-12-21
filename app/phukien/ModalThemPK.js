import React, { useState } from 'react';
import { usePhukien } from "../context/PhukienContext";

function ModalThemPK(props) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { fetchPhukien } = usePhukien();

    const handleSubmit = async () => {
        if (!name || !price) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        setLoading(true); // Bắt đầu trạng thái loading
        try {
            const response = await fetch("/api/phukien", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, price }),
            });

            const result = await response.json();
            if (response.ok) {
              
                fetchPhukien();
                setName("");
                setPrice("");
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
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
                data-bs-toggle="modal"
                data-bs-target="#addAccessoryModal"
            >
                Thêm phụ kiện
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