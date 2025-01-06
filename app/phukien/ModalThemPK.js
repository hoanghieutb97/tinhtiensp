import React, { useState } from 'react';
import { usePhukien } from "../context/PhukienContext";
import { Typography, IconButton } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

function ModalThemPK(props) {
    let item = props.item;

    const [loading, setLoading] = useState(false);
    const { fetchPhukien } = usePhukien();




    const handleImageUpload = async (file) => {
        try {

            const response = await fetch("/api/cloudinary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ base64File: item.image }),
            });

            const data = await response.json();
            console.log(data);

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
    const handleChonAnh = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);

            // Chuyển đổi ảnh sang Base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                props.setValueItem("image", base64String)

            };
            reader.readAsDataURL(file); // Đọc file dưới dạng Data URL (Base64)

        }
        else {

            props.setValueItem("image", null)
            console.log("ko chon duoc anh");

        }
    };

    const handleSubmit = async () => {
        if (!item.name || !item.price || !item.note) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        props.setLoadingALL(true); // Bắt đầu trạng thái loading
        try {
            // Upload ảnh
            const imageUrl = await handleImageUpload(item.image);
            if (!imageUrl) {
                props.setLoadingALL(false);
                return;
            }
            console.log(imageUrl);


            const response = await fetch("/api/phukien", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: item.name,
                    price: item.price,
                    imageUrl: imageUrl,
                    note: item.note,
                    namecode: item.name.product.normalize("NFD") // Chuyển các ký tự có dấu thành dạng kết hợp (e.g., 'Hiếu' -> 'Hiếu')
                        .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu kết hợp
                        .replace(/[^a-zA-Z]/g, "") // Giữ lại các ký tự a-z, A-Z
                        .toLowerCase()
                }),
            });

            const result = await response.json();
            if (response.ok) {

                fetchPhukien();

                props.setValueItem("default");


                props.handlesetIsModalOpen(false);
                props.setLoadingALL(true);

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
                onClick={() => props.handlesetIsModalOpen(true)}
                data-bs-toggle="modal"
                data-bs-target="#addAccessoryModal"
            >
                Thêm phụ kiện
            </button>

            {/* Modal */}
            <div
                className={`modal fade ${props.isModalOpen ? "show d-block" : ""}`}
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
                                onClick={() => props.handlesetIsModalOpen(false)}
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
                                    value={item.name}
                                    onChange={(e) => props.setValueItem("name", e.target.value)}
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
                                    value={item.price}
                                    onChange={(e) => props.setValueItem("price", e.target.value)}
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
                                    value={item.note}
                                    onChange={(e) => props.setValueItem("note", e.target.value)}
                                />
                            </div>
                            <div className="mb-3">

                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Tải lên ảnh:
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        startIcon={<PhotoCamera />}
                                        color="primary"
                                    >
                                        Chọn ảnh
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleChonAnh}
                                            hidden
                                        />
                                    </Button>

                                    {item.image && (
                                        <div className="anhtailen">
                                            <img src={item.image} alt="Uploaded" className='amttt' />
                                        </div>

                                    )}
                                </Box>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={() => props.handlesetIsModalOpen(false)}
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