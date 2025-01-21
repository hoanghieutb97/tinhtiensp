import React, { useState } from 'react';
import { usePhukien } from "../context/PhukienContext";
import { Typography, IconButton } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
function ModalThemPK(props) {
    let item = props.item;

    const { fetchPhukien, getItemsByQuery } = usePhukien();






    const handleImageUpload = async (file) => {
        try {

            const response = await fetch("/api/cloudinary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ base64File: item.image }),
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


        props.setLoadingALL(true); // Bắt đầu trạng thái loading
        try {


            let response;
            if (item._id == null) {
                if (!item.name || !item.price || !item.note || !item.canNang) {
                    alert("Vui lòng nhập đầy đủ thông tin!");
                    return;
                }
                // Upload ảnh
                let imageUrl = ""
                if (item.image) {
                    imageUrl = await handleImageUpload(item.image);
                    if (!imageUrl) {
                        props.setLoadingALL(false);
                        return;
                    }
                }
                let { image, ...updateFields } = item;
                response = await fetch("/api/vatlieu", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...updateFields,
                        imageUrl: imageUrl,
                        dateCreate: Date.now(),
                        nameCode: item.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
                    }),
                });
            }


            else {
                let { _id, image, ...updateFields } = item;


                response = await fetch("/api/vatlieu", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: item._id, // ID tài liệu bạn muốn sửa
                        updateData: {
                            ...updateFields,
                            imageUrl: (item.image == null) ? item.imageUrl : imageUrl,
                            nameCode: item.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/[^a-zA-Z0-9]/g, "").toLowerCase()

                        }
                    }), // Gửi dữ liệu PUT
                });
            }


            const result = await response.json();
            if (response.ok) {

                getItemsByQuery("/vatlieu", "");

                props.setValueItem("default");


                props.handlesetIsModalOpen(false);


            } else {
                alert(`Có lỗi xảy ra: ${result.error}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Không thể thêm phụ kiện!");
        } finally {


        }
    };


    async function xoaSanPham(params) {
        try {
            props.setLoadingALL(true);
            const response = await fetch(`/api/vatlieu?id=${item._id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                getItemsByQuery("/vatlieu", "");

                props.setValueItem("default");
            } else {
                console.error("Lỗi khi xóa:", result.error);
            }

        } catch (error) {
            console.error("Lỗi hệ thống:", error);
        }
        finally {
            props.handlesetIsModalOpen(false);
            props.setLoadingALL(false);
        }
    }
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
                // aria-hidden="true"
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
                                <TextField
                                    label="Tên SP"
                                    type="text"

                                    value={item.name}
                                    onChange={(e) => props.setValueItem("name", e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                />

                            </div>
                            <div className="mb-3">
                                <TextField
                                    label="Giá Tiền"
                                    type="number"
                                    minRows={4}
                                    value={item.price}
                                    onChange={(e) => props.setValueItem("price", e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                />

                            </div>
                            <div className="mb-3">
                                <TextField
                                    label="Cân nặng"
                                    type="number"
                                    minRows={4}
                                    value={item.canNang}
                                    onChange={(e) => props.setValueItem("canNang", e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                />

                            </div>

                            <div className="mb-3">

                                <TextField
                                    label="Note"
                                    multiline
                                    minRows={4}
                                    value={item.note}
                                    onChange={(e) => props.setValueItem("note", e.target.value)}
                                    variant="outlined"
                                    fullWidth
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
                                    {(!item.image) ? item.imageUrl && (
                                        <div className="anhtailen">
                                            <img src={item.imageUrl} alt="Uploaded" className='amttt' />
                                        </div>

                                    ) : ""}
                                </Box>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={xoaSanPham}
                            >
                                Xóa
                            </button>
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

                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ModalThemPK;