'use client';
import { useState, useEffect } from 'react';
import LayerThemVL from "./layerThemVL";
import { tinhTienVatLieu, tinhCanNang, tinhTienBangDinh, tinhTienXop, tinhTienMuc, tinhTienMangBoc, tinhTienTK, tinhTienIn, tinhTienCat, tinhTienDIen, tinhTienChietKhau, tinhTienHop, tinhTienThungDongHang, tinhTienKeoDan } from "./tinhtien";
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
import SelectPhuKien_CLL from './selectPhuKien_CLL';
import { Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from "next/image";
import axios from "axios";



export default function ThemSanPham(props) {
    let typeCPN = props.typeCPN;
    let ItemSua = props.data;

    const initialWHZ = [
        {
            nameSTT: "Chiều Ngắn Hộp",
            valueSTT: "chieuNgang"
        },
        {
            nameSTT: "Chiều Dài Hộp",
            valueSTT: "chieuDoc",
        },
        {
            nameSTT: "Độ Cao Hộp",
            valueSTT: "doCao",
        },
        {
            nameSTT: "Cân Nặng Hộp",
            valueSTT: "canNang",
        }]
    const initialVIP = [
        {
            nameSTT: "VIP 1",
            valueSTT: "vip1"
        },
        {
            nameSTT: "VIP 2",
            valueSTT: "vip2",
        },
        {
            nameSTT: "VIP 3",
            valueSTT: "vip3",
        }]
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
        doCao: 2.5,
        chieuNgang: 0,
        chieuDoc: 0,
        xop: "xopmong",
        anh: "",
        product: "",
        variant: "",
        note: "",
        type: "demo",
        canNang: 0,
        phuKien: [],
        vip1: 0,
        vip2: 0,
        vip3: 0,
        canChageTST: true,
        idChat: ""
    }
    const { vatLieu, getItemsByQuery } = usePhukien();
    const [lop, setlop] = useState((typeCPN != "editProduct") ? [] : ItemSua.lop);
    const [isOpenSelectPK, setisOpenSelectPK] = useState(false);
    const [tienVL, setTienVL] = useState(initialStateVL);
    const [thongSoTong, setThongSoTong] = useState((typeCPN != "editProduct") ? defaultThongSoTong : { ...defaultThongSoTong, ...ItemSua.thongSoTong });
    const [image, setImage] = useState(null);
    function CloseSelectPK(item) {

        setisOpenSelectPK(false);
        handleChangeThongSoTong("phuKien", item)

    }
    async function Get_MongoDB_UserCongDoan(type) {
        let items = await axios.get(`/api/larkUser`)
            .then(response => {
                return response.data.data[0].data
            })
            .catch(error => {
                return false
            });
        console.log(items);
        console.log(type);

        return items.filter((item => item.type == type))[0].value.map(item => item.member_id)
    }

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
    async function createChatLark(urlCloudinary, type) {

        console.log(type);

        let userMess = await Get_MongoDB_UserCongDoan(type);



        try {
            const response = await axios.post('/api/lark/sendImage_Chat', {
                imageUrl: urlCloudinary,
                product: thongSoTong.product,
                type: type,
                userMess: userMess
            });
            return response.data.ID_Messenger;


        } catch (error) {

            console.error('Error posting data:', error);
            return false
        }
    };

    const themSanPham = async () => {
        let DataPost = {
            thongSoTong: thongSoTong,
            lop: lop,
            tienVL: tienVL,
            name: thongSoTong.product,
            namecode: thongSoTong.product.normalize("NFD") // Chuyển các ký tự có dấu thành dạng kết hợp (e.g., 'Hiếu' -> 'Hiếu')
                .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu kết hợp
                .replace(/[^a-zA-Z]/g, "") // Giữ lại các ký tự a-z, A-Z
                .toLowerCase()

        }
        if (typeCPN != "editProduct") {



            try {
                // Upload ảnh
                const imageUrl = await handleImageUpload();
                if (!imageUrl) {
                    // setLoading(false);
                    return;
                }
                console.log(DataPost);


                DataPost.thongSoTong.anh = imageUrl;
                let ID_Messenger = await createChatLark(imageUrl, DataPost.thongSoTong.type);
                DataPost.thongSoTong.idChat = ID_Messenger;
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
                    getItemsByQuery("/sanpham", "");

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
            if (DataPost.namecode !== ItemSua.namecode) {
                // đổi product và 
            }
            if (DataPost.thongSoTong.variant !== ItemSua.thongSoTong.variant) {
                // đổi product và 
            }


            if (DataPost.thongSoTong.type !== ItemSua.thongSoTong.type) {
                let userMess = await Get_MongoDB_UserCongDoan(DataPost.thongSoTong.type);
                console.log(userMess);

                let dataF = {
                    ID_Messenger: DataPost.thongSoTong.idChat,
                    userMess: userMess,
                    type: DataPost.thongSoTong.type

                }

                let response = await fetch("/api/lark/tagUserType", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataF),
                });
                console.log(response);


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
                getItemsByQuery("/sanpham", "");

            } else {
                console.error("Cập nhật thất bại:", result.error);
            }
        }
        getItemsByQuery("/sanpham", "");
        props.dongCTN();
        if (typeCPN == "editProduct")
            props.closeProduct();

    };
    useEffect(() => {
        if (lop.length > 0) {
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


            // setThongSoTong({ ...thongSoTong, canNang: Math.floor(tinhCanNang(lop, vatLieu, thongSoTong)) })
        }
        else setTienVL({
            ...initialStateVL,
            tienHop: Math.floor(tinhTienHop(lop, vatLieu, thongSoTong)),
            tienThungDongHang: Math.floor(tinhTienThungDongHang(lop, vatLieu, thongSoTong)),
            TienBangDinh: Math.floor(tinhTienBangDinh(lop, vatLieu, thongSoTong)),
            tienXop: Math.floor(tinhTienXop(lop, vatLieu, thongSoTong)),
            tienMangBoc: Math.floor(tinhTienMangBoc(lop, vatLieu, thongSoTong))
        });

    }, [lop, thongSoTong]);
    useEffect(() => {
        if (lop.length > 0) {

            setThongSoTong({ ...thongSoTong, canNang: Math.floor(tinhCanNang(lop, vatLieu, thongSoTong)) })
        }

    }, [lop, thongSoTong.xop, thongSoTong.doCao, thongSoTong.chieuDoc, thongSoTong.chieuNgang]);
    console.log(thongSoTong);


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
        let typeName = type;
        let val = value;

        if (typeName == "chieuDai") {
            typeName = "chieuNgang";
            for (let i = 0; i < lop.length; i++) {
                if (parseFloat(val) < parseFloat(lop[i].chieuDai)) {
                    val = parseFloat(lop[i].chieuDai);

                }
            }
            val = parseFloat(val) * 2.54 + 1.5


        }
        else if (typeName == "chieuRong") {
            typeName = "chieuDoc";
            for (let i = 0; i < lop.length; i++) {
                if (parseFloat(val) < parseFloat(lop[i].chieuRong)) {
                    val = parseFloat(lop[i].chieuRong);

                }
            }
            val = parseFloat(val) * 2.54 + 1.5


        }


        setThongSoTong((prevState) => ({
            ...prevState,
            [typeName]: val,
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
                        {lop.map((item, key) => <LayerThemVL key={key} item={item} handleChangeThongSoTong={handleChangeThongSoTong} changeLopCL={changeLopCL} stt={key} xoaLayer={xoaLayer} />)}
                    </div>

                </div>


                <div className="row glrsjngsl">
                    <div className="col-12">
                        <Button variant="contained" onClick={() => setisOpenSelectPK(true)} >Thêm Phụ Kiện</Button>
                        <div className="row">
                            {(thongSoTong.phuKien.length > 0) && thongSoTong.phuKien.map((item, key) => <div className="col-2" key={key}>
                                sdsvs
                                <div className="divtongvl">
                                    <div className="tenpk">Tên: <span className="hhhg">{item.name}</span></div>
                                    <div className="anhpkvl">
                                        {item.imageUrl ? <Image priority src={item.imageUrl} alt="My GIF" width={500} height={300} className="anhpkvl" /> : <></>}
                                    </div>

                                </div>
                            </div>)
                            }

                        </div>

                        <Modal
                            open={isOpenSelectPK}
                            onClose={CloseSelectPK}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Box
                                sx={{
                                    width: '94vw',
                                    height: '90vh',
                                    bgcolor: 'background.paper',
                                    boxShadow: 24,
                                    p: 4,
                                    overflow: 'auto', position: 'relative', // Để định vị button trong modal
                                    background: "#dfdfdf"
                                }}
                            >

                                <IconButton
                                    onClick={CloseSelectPK}
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        zIndex: 99,
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                                <SelectPhuKien_CLL onClose={CloseSelectPK} />
                            </Box>
                        </Modal>
                    </div>
                </div>


                <div className="container">
                    <div className="row">
                        {initialWHZ.map((item, key) => <div className="col-3" key={key}>
                            <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidate autoComplete="off">
                                <TextField id="outlined-basic" label={item.nameSTT} variant="outlined" type="number" size="small"
                                    value={thongSoTong[item.valueSTT]}
                                    onChange={(e) => handleChangeThongSoTong(item.valueSTT, e.target.value)}
                                    placeholder="Nhập số"
                                    slotProps={{ input: { endAdornment: <InputAdornment position="end">cm</InputAdornment>, }, }}
                                />
                            </Box>
                        </div>)}

                    </div>
                    <div className="row">
                        {initialVIP.map((item, key) => <div className="col-3" key={key}>
                            <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidate autoComplete="off">
                                <TextField id="outlined-basic" label={item.nameSTT} variant="outlined" type="number" size="small"
                                    value={thongSoTong[item.valueSTT]}
                                    onChange={(e) => handleChangeThongSoTong(item.valueSTT, e.target.value)}
                                    placeholder="Nhập số"
                                    slotProps={{ input: { endAdornment: <InputAdornment position="end">USD</InputAdornment>, }, }}
                                />
                            </Box>
                        </div>)}

                    </div>
                    initialVIP

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
                                            <MenuItem value="test">test</MenuItem>
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
                        <Button variant="contained" endIcon={<SendIcon />} onClick={themSanPham}>
                            Send
                        </Button>

                    </div>
                </div>
            </div>

        </div>



    );
}
