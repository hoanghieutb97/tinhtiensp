'use client';
import { useState, useEffect } from 'react';
import LayerThemVL from "./layerThemVL";
import { tinhTienVatLieu, tinhCanNang, tinhTienDongGoi, tinhTienPhuKien, tinhTienBangDinh, tinhTienXop, tinhTienMuc, tinhTienMangBoc, tinhTienTK, tinhTienIn, tinhTienCat, tinhTienDIen, tinhTienChietKhau, tinhTienHop, tinhTienThungDongHang, tinhTienKeoDan } from "@/lib/utils";
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
import { Typography, IconButton, FormControlLabel, FormGroup, Switch } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import SelectPhuKien_CLL from './selectPhuKien_CLL';
import { Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from "next/image";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import { sanpham_larkUser, createChatLark, URL_upload_cloudinary, initialWHZ, initialVIP, initialStateVL, tagUserType, postSanPham, putSanPham } from "@/lib/utils";


export default function ThemSanPham(props) {
    let typeCPN = props.typeCPN;
    let ItemSua = props.data;
    let styleSP = props.styleSP;


    const defaultThongSoTong = {
        doCao: 2.5,
        chieuNgang: 0,
        chieuDoc: 0,
        xop: "xop5mm",
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
        idChat: "",
        dateCreate: Date.now()
    }
    const vatLieu = props.vatLieu;
    const phuKien = props.phuKien;


    const [lop, setlop] = useState((typeCPN != "editProduct") ? [] : ItemSua.lop);
    const [isOpenSelectPK, setisOpenSelectPK] = useState(false);
    const [tienVL, setTienVL] = useState(initialStateVL);
    const [thongSoTong, setThongSoTong] = useState((typeCPN != "editProduct") ? defaultThongSoTong : { ...defaultThongSoTong, ...ItemSua.thongSoTong, canChageTST: (typeCPN == "editProduct" && styleSP == "new") ? true : false });
    const [image, setImage] = useState(null);
    function CloseSelectPK(item) {

        setisOpenSelectPK(false);
        handleChangeThongSoTong("phuKien", [...thongSoTong.phuKien, ...item])

    }

    const handleChonAnh = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setThongSoTong({ ...thongSoTong, anh: base64String }); // Cần định nghĩa setBase64Image trước
            };
            reader.readAsDataURL(file); // Đọc file dưới dạng Data URL (Base64)
        }
        else {
            setImage(null);
            setThongSoTong({ ...thongSoTong, anh: "" }); // Cần định nghĩa setBase64Image trước
        }
    };

    function checkNewMessenger(DataPost) {

        if (DataPost.thongSoTong.idChat == "") return true
        return false

    }


    const HandlethemSanPham = async () => {
        let DataPost = {
            thongSoTong: thongSoTong,
            lop: lop,
            // tienVL: tienVL,
            name: thongSoTong.product,
            namecode: thongSoTong.product.normalize("NFD") // Chuyển các ký tự có dấu thành dạng kết hợp (e.g., 'Hiếu' -> 'Hiếu')
                .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu kết hợp
                .replace(/[^a-zA-Z]/g, "") // Giữ lại các ký tự a-z, A-Z
                .toLowerCase(),
        }

        props.setLoading(true);

        if (styleSP == "new") {
            if (image == null && DataPost.thongSoTong.anh == "") { alert("thiếu ảnh..."); props.setLoading(false); return false }
            let imageUrl
            try {

                // kiểm tra xem up ảnh chưa, chưa up thì up
                if (!DataPost.thongSoTong.anh.startsWith("https")) {
                    imageUrl = await URL_upload_cloudinary(thongSoTong.anh);
                    if (!imageUrl) {
                        alert("lỗi up ảnh");
                        return false;
                    }
                    DataPost.thongSoTong.anh = imageUrl;
                }

                // nếu chưa tạo tin nhắn, thì giờ tạo
                if (checkNewMessenger(DataPost)) {
                    let ID_Messenger = await createChatLark((imageUrl) ? imageUrl : DataPost.thongSoTong.anh, DataPost.thongSoTong.type, thongSoTong.product);
                    DataPost.thongSoTong.idChat = ID_Messenger;
                } else {
                    const StatusTagUserType = await tagUserType(DataPost.thongSoTong);
                }

                let statusPostSanPham = await postSanPham(DataPost);



            } catch (error) {
                console.error("Error:", error);
                alert("Không thể thêm phụ kiện!");
            } finally {

            }
        }
        else if (styleSP == "old") {
            if (DataPost.namecode !== ItemSua.namecode) {
                // đổi product và 
            }
            if (DataPost.thongSoTong.variant !== ItemSua.thongSoTong.variant) {
                // đổi product và 
            }
            if (DataPost.thongSoTong.type !== ItemSua.thongSoTong.type) {
                const StatusTagUserType = await tagUserType(DataPost.thongSoTong);
            }

            let statusPutSanPham = await putSanPham(ItemSua._id, DataPost)

        }


        props.getItemsAll("sanpham");
        props.setLoading(false)
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
                tienMangBoc: Math.floor(tinhTienMangBoc(lop, vatLieu, thongSoTong)),
                tienPhuKien: Math.floor(tinhTienPhuKien(lop, vatLieu, thongSoTong, phuKien)),
                tienDongGoi: Math.floor(tinhTienDongGoi(lop, vatLieu, thongSoTong))
            })


            // setThongSoTong({ ...thongSoTong, canNang: Math.floor(tinhCanNang(lop, vatLieu, thongSoTong)) })
        }
        else setTienVL({
            ...initialStateVL,
            tienHop: Math.floor(tinhTienHop(lop, vatLieu, thongSoTong)),
            tienThungDongHang: Math.floor(tinhTienThungDongHang(lop, vatLieu, thongSoTong)),
            TienBangDinh: Math.floor(tinhTienBangDinh(lop, vatLieu, thongSoTong)),
            tienXop: Math.floor(tinhTienXop(lop, vatLieu, thongSoTong)),
            tienMangBoc: Math.floor(tinhTienMangBoc(lop, vatLieu, thongSoTong)),
            tienPhuKien: Math.floor(tinhTienPhuKien(lop, vatLieu, thongSoTong, phuKien)),
        });

    }, [lop, thongSoTong]);
    useEffect(() => {
        if (lop.length > 0) {


            if (thongSoTong.canChageTST) setThongSoTong({ ...thongSoTong, canNang: Math.floor(tinhCanNang(lop, vatLieu, thongSoTong)) })
        }

    }, [lop, thongSoTong.xop, thongSoTong.doCao, thongSoTong.chieuDoc, thongSoTong.chieuNgang, thongSoTong.phuKien]);



    function tongTien() {
        return Object.values(tienVL).reduce((sum, value) => sum + value, 0);
    }

    function handleAddLayer() {
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
        if (
            !statuscanChageTST &&
            (typeName == "chieuDai" || typeName == "chieuRong")
        ) {
            console.log("Không được thay đổi giá trị khi canChageTST = false và typeName là chieuDai hoặc chieuRong");
            return; // Dừng hàm nếu điều kiện không thỏa mãn
        }

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

    function handleCanChageTST() {
        let status = thongSoTong.canChageTST;

        handleChangeThongSoTong("canChageTST", !status)


    }
    let statuscanChageTST = thongSoTong.canChageTST;


    function handleDeletePhuKien(key) {
        let phuKienTST = thongSoTong.phuKien;
        phuKienTST.splice(key, 1);
        handleChangeThongSoTong("phuKien", phuKienTST)


    }

    let ListPhuKien = thongSoTong.phuKien.map(item => {
        let arrPK = phuKien.filter(itemF => itemF._id == item)
        if (arrPK.length > 0) return arrPK[0]

    });


    console.log(thongSoTong);
    let canNangTheTich = thongSoTong.chieuDoc * thongSoTong.chieuNgang * thongSoTong.doCao / 5000
    console.log(thongSoTong.chieuDoc * thongSoTong.chieuNgang * thongSoTong.doCao);

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
                            {(ListPhuKien.length > 0) && ListPhuKien.map((item, key) => <div className="col-2" key={key}>

                                <div className="divtongvl vsdv">
                                    <IconButton aria-label="delete" className='iconbtdlelepk' onClick={() => handleDeletePhuKien(key)}>
                                        <DeleteIcon />
                                    </IconButton>
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
                                    disabled={!statuscanChageTST}
                                    slotProps={{ input: { endAdornment: <InputAdornment position="end">{item.dv}</InputAdornment>, }, }}
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
                        <div className="col-3">
                            <div className="tenpk">Cân thể tích: <span className="hhhg">{canNangTheTich} (g)</span></div>
                            <div className="tenpk">Cân Tiền: <span className="hhhg re">{(thongSoTong.canNang > canNangTheTich) ? thongSoTong.canNang : canNangTheTich} (g)</span></div>

                        </div>
                        <div className="col-3">
                            <FormGroup>
                                <FormControlLabel control={<Switch color="warning" onChange={handleCanChageTST} checked={thongSoTong.canChageTST} />} label="Tự Động" />

                            </FormGroup>
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
                                        fullWidth
                                    />
                                    <TextField
                                        label="Variant"
                                        variant="standard"
                                        color="warning"
                                        focused
                                        value={thongSoTong.variant || ''}
                                        onChange={(e) => handleChangeThongSoTong("variant", e.target.value)}
                                        placeholder="Nhập Variant Name"
                                        fullWidth
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
                                        fullWidth
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

                                        {/* {image && (
                                            <div className="anhtailen">
                                                <img src={image} alt="Uploaded" className='amttt' />
                                            </div>

                                        )} */}

                                        <div className="anhtailen">
                                            <img src={(image) ? image : (thongSoTong.anh !== "") ? thongSoTong.anh : null} alt="Uploaded" className='amttt' />
                                        </div>


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
                                            <span className="giatiensp">{isNaN(value) ? "0" : (value).toLocaleString("en-US")}</span>
                                        </div>
                                    ))}
                                    <div className="tongtien">
                                        Tổng Tiền:    {tongTien().toLocaleString("en-US")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>




                <div className="container">
                    <div className="row">
                        <Button variant="contained" endIcon={<SendIcon />} onClick={HandlethemSanPham}>
                            Send
                        </Button>

                    </div>
                </div>
            </div>

        </div>



    );
}
