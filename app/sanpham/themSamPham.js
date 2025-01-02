'use client';
import { useState, useEffect } from 'react';
import LayerThemVL from "./layerThemVL";
import { tinhTienVatLieu, tinhTienBangDinh, tinhTienXop, tinhTienMuc, tinhTienMangBoc, tinhTienTK, tinhTienIn, tinhTienCat, tinhTienDIen, tinhTienChietKhau, tinhTienHop, tinhTienThungDongHang, tinhTienKeoDan } from "./tinhtien";
import { usePhukien } from "../context/PhukienContext";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { Typography, IconButton } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
export default function ThemSanPham(props) {
    let typeCPN = props.typeCPN;
    let ItemSua = props.data;
    const initialStateVL = {
        tienVatLieu: 0, // có thể chọn ngoài
        tienMuc: 0,
        tienThietke: 0,
        tienIn: 0,
        tienCat: 0,
        tienDien: 0,
        tienChietKhauMay: 0,
        tienHop: 0, // có thể chọn ngoài
        tienThungDongHang: 0,
        tienMatBang: 766,
        tienTemNhan: 400,
        TienBangDinh: 0,
        tienKeoDan: 0,
        tienXop: 0,
        tienMangBoc: 0,
    }
    const defaultThongSoTong = {
        doCao: 0,
        chieuNgang: 0,
        chieuDoc: 0,
        xop: "xopmong",
        anh: "",
        product: "",
        variant: "",
        note: "",
        type: "demo"
    }
    const { vatLieu } = usePhukien();
    const [lop, setlop] = useState((typeCPN != "editProduct") ? [] : ItemSua.lop);

    const [tienVL, setTienVL] = useState(initialStateVL);
    const [thongSoTong, setThongSoTong] = useState((typeCPN != "editProduct") ? defaultThongSoTong : ItemSua.thongSoTong);
    const [image, setImage] = useState(null);
    const handleChonAnh = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
            // Chuyển đổi ảnh sang Base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;

                // Lưu Base64 vào state hoặc xử lý tiếp
                setThongSoTong({ ...thongSoTong, anh: base64String }); // Cần định nghĩa setBase64Image trước
            };
            reader.readAsDataURL(file); // Đọc file dưới dạng Data URL (Base64)
        }
        else {
            setImage(null)
            console.log("ko chon duoc anh");

        }
    };
    const handleImageUpload = async () => {
        try {
            const response = await fetch("/api/cloudinary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ base64File: thongSoTong.anh }),
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
    const themSanPham = async () => {
        if (typeCPN != "editProduct") {
            var DataPost = {
                thongSoTong: thongSoTong,
                lop: lop,
                tienVL: tienVL

            }


            try {
                // Upload ảnh
                const imageUrl = await handleImageUpload();
                if (!imageUrl) {
                    // setLoading(false);
                    return;
                }
                DataPost.thongSoTong.anh = imageUrl;

                const response = await fetch("/api/sanpham", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(DataPost),
                });

                const result = await response.json();
                if (result.success) {
                    props.dongCTN();
                    props.fetchSanPham();
                } else {
                    alert(`Có lỗi xảy ra: ${result.error}`);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Không thể thêm phụ kiện!");
            } finally {

            }
        }
        else if (typeCPN == "editProduct") {
            var DataPost = {
                thongSoTong: thongSoTong,
                lop: lop,
                tienVL: tienVL

            }
            let DataPut = {
                id: ItemSua._id, // ID tài liệu bạn muốn sửa
                updateData: DataPost
            };



            const response = await fetch("/api/sanpham", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(DataPut), // Gửi dữ liệu PUT
            });

            const result = await response.json(); // Lấy phản hồi từ server
            if (result.success) {
                props.dongCTN();
                props.fetchSanPham();
            } else {
                console.error("Cập nhật thất bại:", result.error);
            }
        }

    };
    useEffect(() => {
        if (lop.length > 0)
            setTienVL({
                ...tienVL,
                tienVatLieu: Math.floor(tinhTienVatLieu(lop, vatLieu)),
                tienMuc: Math.floor(tinhTienMuc(lop, vatLieu)),
                tienThietke: Math.floor(tinhTienTK(lop, vatLieu)),
                tienIn: Math.floor(tinhTienIn(lop, vatLieu)),
                tienDien: Math.floor(tinhTienDIen(lop, vatLieu)),
                tienChietKhauMay: Math.floor(tinhTienChietKhau(lop, vatLieu)),
                tienCat: Math.floor(tinhTienCat(lop, vatLieu)),
                tienKeoDan: Math.floor(tinhTienKeoDan(lop, vatLieu, thongSoTong)),
                tienHop: Math.floor(tinhTienHop(lop, vatLieu, thongSoTong)),
                TienBangDinh: Math.floor(tinhTienBangDinh(lop, vatLieu, thongSoTong)),
                tienThungDongHang: Math.floor(tinhTienThungDongHang(lop, vatLieu, thongSoTong)),
                tienXop: Math.floor(tinhTienXop(lop, vatLieu, thongSoTong)),
                tienMangBoc: Math.floor(tinhTienMangBoc(lop, vatLieu, thongSoTong))
            })
        else setTienVL({
            ...initialStateVL,
            tienHop: Math.floor(tinhTienHop(lop, vatLieu, thongSoTong)),
            tienThungDongHang: Math.floor(tinhTienThungDongHang(lop, vatLieu, thongSoTong)),
            TienBangDinh: Math.floor(tinhTienBangDinh(lop, vatLieu, thongSoTong)),
            tienXop: Math.floor(tinhTienXop(lop, vatLieu, thongSoTong)),
            tienMangBoc: Math.floor(tinhTienMangBoc(lop, vatLieu, thongSoTong))
        });
    }, [lop, thongSoTong]);
    function tongTien() {
        return Object.values(tienVL).reduce((sum, value) => sum + value, 0);
    }
    function handleAddLayer(params) {
        var item = {
            chatLieu: "mica3mm",
            chieuDai: 0,
            chieuRong: 0,
            soMatIn: 1,
            catStatus: true,
            khacStatus: false
        }
        setlop([...lop, item])
    }
    function changeLopCL(item, key) {
        var lopNew = [...lop];
        lopNew[key] = item;
        setlop(lopNew);
    }
    function xoaLayer(key) {
        setlop((prevLop) => prevLop.filter((_, index) => index !== key));
    }
    const handleChangeThongSoTong = (type, value) => {
        let val = value;




        setThongSoTong((prevState) => ({
            ...prevState,
            [type]: val,
        }));
    };

    return (


        <div className="themspsss">
            <Button variant="contained" onClick={props.dongCTN} className="btn btn-danger btvrrr"  >X </Button>
            <div className="container">

                <div className="row mt-2 mb-3 glrsjngsl">
                    <div className="col-12">
                        <Button variant="contained" onClick={handleAddLayer} >Thêm lớp chất liệu </Button>
                    </div>
                    <div className="col-12">
                        {lop.map((item, key) => <LayerThemVL key={key} item={item} changeLopCL={changeLopCL} stt={key} xoaLayer={xoaLayer} />)}
                    </div>
                </div>



                <div className="container">
                    <div className="row">
                        <div className="col-3">

                            <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidate autoComplete="off">
                                <TextField id="outlined-basic" label="Chiều Ngang Hộp" variant="outlined" type="number" size="small"
                                    value={thongSoTong.chieuNgang}
                                    onChange={(e) => handleChangeThongSoTong("chieuNgang", e.target.value)}
                                    placeholder="Nhập số"
                                    slotProps={{ input: { endAdornment: <InputAdornment position="end">cm</InputAdornment>, }, }}
                                />
                            </Box>


                        </div>
                        <div className="col-3">
                            <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidate autoComplete="off">
                                <TextField id="outlined-basic" label="Chiều Dọc Hộp" variant="outlined" type="number" size="small"
                                    value={thongSoTong.chieuDoc}
                                    onChange={(e) => handleChangeThongSoTong("chieuDoc", e.target.value)}
                                    placeholder="Nhập số"
                                    slotProps={{ input: { endAdornment: <InputAdornment position="end">cm</InputAdornment>, }, }}
                                />
                            </Box>

                        </div>
                        <div className="col-3">
                            <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidate autoComplete="off">
                                <TextField id="outlined-basic" label="Chiều Cao Hộp" variant="outlined" type="number" size="small"
                                    value={thongSoTong.doCao}
                                    onChange={(e) => handleChangeThongSoTong("doCao", e.target.value)}
                                    placeholder="Nhập số"
                                    slotProps={{ input: { endAdornment: <InputAdornment position="end">cm</InputAdornment>, }, }}
                                />
                            </Box>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-6">
                            <div className="row">
                                <div className="col-12">
                                    <TextField
                                        label="Product"
                                        variant="standard"
                                        color="warning"
                                        focused
                                        value={thongSoTong.product || ''}
                                        onChange={(e) => handleChangeThongSoTong("product", e.target.value)}
                                        placeholder="Nhập Product Name"
                                    />
                                </div>
                                <div className="col-12">
                                    <TextField
                                        label="Variant"
                                        variant="standard"
                                        color="warning"
                                        focused
                                        value={thongSoTong.variant || ''}
                                        onChange={(e) => handleChangeThongSoTong("variant", e.target.value)}
                                        placeholder="Nhập Variant Name"

                                    />
                                </div>
                                <div className="col-12">
                                    <TextField
                                        label="note"
                                        variant="standard"

                                        focused
                                        value={thongSoTong.note || ''}
                                        onChange={(e) => handleChangeThongSoTong("note", e.target.value)}
                                        placeholder="Nhập note"

                                    />
                                </div>

                                <div className="col-12">
                                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                        <InputLabel id="demo-simple-select-standard-label">Chất Liệu</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={thongSoTong.xop}
                                            onChange={(e) => handleChangeThongSoTong("xop", e.target.value)}
                                            label="Chọn Loại Xôp"
                                        >
                                            <MenuItem value="xopmong">xốp 0.5mm</MenuItem>
                                            <MenuItem value="xop3mm">xốp 3mm</MenuItem>
                                            <MenuItem value="xop5mm">xốp 5mm</MenuItem>
                                            <MenuItem value="xop10mm">xốp 10mm</MenuItem>
                                            <MenuItem value="xop20mm">xốp 20mm</MenuItem>
                                            <MenuItem value="xopno">xốp nổ</MenuItem>


                                        </Select>
                                    </FormControl>
                                </div>

                                <div className="col-12">
                                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                        <InputLabel id="demo-simple-select-standard-label">Loại thẻ</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={thongSoTong.type}
                                            onChange={(e) => handleChangeThongSoTong("type", e.target.value)}
                                            label="Loại thẻ"
                                        >
                                            <MenuItem value="demo">demo</MenuItem>
                                            <MenuItem value="publish">publish</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-12">
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

                                        {image && (
                                            <div className="anhtailen">
                                                <img src={image} alt="Uploaded" className='amttt' />
                                            </div>

                                        )}
                                    </Box>
                                </div>
                            </div>




                        </div>


                        <div className="col-6">
                            <div>

                                <div className="thoingtintien">
                                    {Object.entries(tienVL).map(([key, value], index) => (
                                        <div key={index} className="thongtina">
                                            <span>{key.replace(/([A-Z])/g, " $1")}: </span>
                                            <span className="giatiensp">{isNaN(value) ? "0" : value}</span>
                                        </div>
                                    ))}
                                    <div className="tongtien">
                                        Tổng Tiền:    {tongTien()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>




                <div className="container">
                    <div className="row">
                        <Button variant="contained" endIcon={<SendIcon />}>
                            Send
                        </Button>

                    </div>
                </div>
            </div>

        </div>



    );
}
