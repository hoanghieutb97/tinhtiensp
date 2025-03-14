'use client';
import { useState, useEffect } from 'react';
import LayerThemVLVariant from './layerThemVLVariant';
import { caculator_ShipingCost, tongTienLop, tinhCanNang, cal_Status, tinhTienVL, createChatLark, URL_upload_cloudinary, initialWHZ, tagUserType, postSanPham, putSanPham } from '@/lib/utils';
import { Box, InputLabel, MenuItem, FormControl, Select, TextField, InputAdornment, Button, Typography, IconButton, FormControlLabel, FormGroup, Switch, Modal } from '@mui/material';
import { Send as SendIcon, PhotoCamera, Add, Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Image from 'next/image';
import SelectPhuKien_CLL from './selectPhuKien_CLL';

export default function ThemSanPham(props) {
    let typeCPN = props.typeCPN;
    let ItemSua = { ...props.data };
    let styleSP = props.styleSP;
    let Rate = props.Rate;
    const [Product, setProduct] = useState("");
    const [variant, setvariant] = useState("");
    const [phuKienVariant, setphuKienVariant] = useState([]);
    const [PhuKienTong, setPhuKienTong] = useState([]);
    const [TongTatCa, setTongTatCa] = useState([]);
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
        vipaTuan: [0, 0, 0, 0, 0],
        vipChot: [0, 0, 0, 0, 0],
        vipSale: [[0, 0, 0, 0, 0]],
        noteVipSale: [""],
        canChageTST: true,
        idChat: "",
        dateCreate: Date.now()
    }
    const vatLieu = props.vatLieu;
    const phuKien = props.phuKien;

    let itemLayerLop = {
        name: "", value: [{
            chatLieu: "mica3mm",
            chieuDai: 0,
            chieuRong: 0,
            soMatIn: 1,
            catStatus: true,
            khacStatus: false
        }]
    }
    const [lop, setlop] = useState([itemLayerLop]);
    const [KichThuocVariant, setKichThuocVariant] = useState([]);
    const [isOpenSelectPK, setisOpenSelectPK] = useState(false);
    const [isOpenSelectPKTong, setisOpenSelectPKTong] = useState(false);

    const [thongSoTong, setThongSoTong] = useState(defaultThongSoTong);

    const [image, setImage] = useState(null);



    function CloseSelectPK(item) {
        setisOpenSelectPK(false);
        setphuKienVariant([...phuKienVariant, { name: "", value: item }])
    }
    function CloseSelectPKTong(item) {
        setisOpenSelectPKTong(false);
        setPhuKienTong([...PhuKienTong, item])
    }

    function handleDeletePhuKien(key) {
        let phuKienTST = [...phuKienVariant];
        phuKienTST.splice(key, 1);
        setphuKienVariant(phuKienTST)
    }

    function handleDeletePhuKienTong(key) {
        let phuKienTST = [...PhuKienTong];
        phuKienTST.splice(key, 1);
        setPhuKienTong(phuKienTST)
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
        // props.setLoading(false)
    };





    function handleAddLayer(key) {

        let lopxx = [...lop];
        lopxx[key].value.push(itemLayerLop.value[0]);
        setlop(lopxx)
    }
    function handleAddLopVariant() {
        setlop([...lop, itemLayerLop])
    }
    function handleDeleteLopVariant(key) {
        let lopxx = [...lop];
        lopxx.splice(key, 1);
        setlop(lopxx)
    }
    function changeLopCL(item, key, keyVariant) {
        var lopNew = [...lop];
        lopNew[keyVariant].value[key] = { ...item };
        setlop(lopNew);
    }
    function changeNameLopVariant(key, value) {
        var lopNew = [...lop];
        lopNew[key].name = value;
        setlop(lopNew);
    }

    function xoaLayer(key, keyL) {
        let lopxx = [...lop];

        lopxx[key].value.splice(keyL, 1);
        setlop(lopxx)
    }

    let statuscanChageTST = thongSoTong.canChageTST;




    let ListPhuKien = phuKienVariant.map(item => {
        let arrPK = phuKien.filter(itemF => itemF._id == item.value)
        if (arrPK.length > 0) return { name: item.name, value: arrPK[0] }

    });
    let ListPhuKienTong = PhuKienTong.map(item => {
        let arrPK = phuKien.filter(itemF => itemF._id == item)
        if (arrPK.length > 0) return arrPK[0]

    });

    function changePhuKienVariantName(key, value) {
        let lopxx = [...phuKienVariant];
        lopxx[key].name = value;
        setphuKienVariant(lopxx)
    }
    function handleAddKichThuocVariant() {
        setKichThuocVariant([...KichThuocVariant, { name: "", value: [0, 0] }])
    }
    function changeKichThuocVariant(key, value, keySTT) {
        let kt = [...KichThuocVariant];
        kt[key].value[keySTT] = value;
        setKichThuocVariant(kt)
    }
    function changeNameKichThuocVariant(key, value) {
        let kt = [...KichThuocVariant];
        kt[key].name = value;
        setKichThuocVariant(kt)
    }

    function xoaKichThuocVariant(key) {
        let kt = [...KichThuocVariant];
        kt.splice(key, 1);
        setKichThuocVariant(kt)
    }
    function tinhToanTongTatCa(lop, phuKienVariant, PhuKienTong, KichThuocVariant) {


        function mixData(lop, phuKienVariant, PhuKienTong, KichThuocVariant) {
            let result = [];

            // Nếu bất kỳ mảng nào rỗng, thay thế bằng mảng có một phần tử trống
            if (lop.length === 0) lop = [{ name: "", value: [] }];
            if (phuKienVariant.length === 0) phuKienVariant = [{ name: "", value: [] }];
            if (KichThuocVariant.length === 0) KichThuocVariant = [{ name: "", value: [] }];

            // Mix tất cả các mảng với nhau
            lop.forEach(l => {
                phuKienVariant.forEach(p => {
                    KichThuocVariant.forEach(k => {
                        result.push({
                            name: `${l.name} ${p.name} ${k.name}`.trim(),
                            value: {
                                lop: l.value.map(item => ({ ...item, chieuDai: k.value[0], chieuRong: k.value[1] })),
                                // lop: { ...l.value, lop: lop.map(item => ({ ...item, chieuDai: k.value[0], chieuRong: k.value[1] })) },
                                phukienVariant: p.value,
                                kichthuoc: k.value
                            }
                        });
                    });
                });
            });
            return result;
        }
        const mixedData = mixData(lop, phuKienVariant, PhuKienTong, KichThuocVariant);
        console.log(mixedData);
    }

    return (
        <div className="cngjgfh svdvs">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="themspsss">
                            <Button variant="contained" onClick={props.dongCTN} className="btn btn-danger btvrrr"  >X </Button>
                            <div className="container">
                                <div className="col-12">
                                    <button onClick={() => tinhToanTongTatCa([...lop], [...phuKienVariant], [...PhuKienTong], [...KichThuocVariant])}>Tính Toán Variant</button>
                                </div>
                                <div className="col-12">
                                    <Button variant="contained" onClick={() => handleAddKichThuocVariant()} >Thêm Kích Thước </Button>
                                    {KichThuocVariant.map((itemk, keyk) => <div className="vsdv sdvdsvds" key={keyk}  >
                                        {itemk.value.map((itemSTT, keySTT) => <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '20ch' } }} noValidate autoComplete="off">
                                            <TextField id="outlined-basic" label={keySTT == 0 ? "Chiều dài" : "chiều Rộng"} variant="outlined" type="number" size="small"
                                                value={itemSTT || ''}
                                                onChange={(e) => changeKichThuocVariant(keyk, _.toNumber(e.target.value), keySTT)}
                                                placeholder="Nhập số"
                                                slotProps={{ input: { endAdornment: <InputAdornment position="end">inch</InputAdornment>, }, }}
                                            />
                                        </Box>)}

                                        <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '20ch' } }} noValidate autoComplete="off">
                                            <TextField id="outlined-basic" label="nhập tên" variant="outlined" type="text" size="small"
                                                value={itemk.name || ''}
                                                onChange={(e) => changeNameKichThuocVariant(keyk, e.target.value)}
                                                placeholder="Tên"
                                                slotProps={{ input: { endAdornment: <InputAdornment position="end">Tên</InputAdornment>, }, }}
                                            />
                                        </Box>
                                        <button onClick={() => xoaKichThuocVariant(keyk)}>delete</button>
                                    </div>)}
                                </div>
                                <div className="row mt-2 mb-3 glrsjngsl">

                                    <div className="col-12">
                                        {lop.map((item, key) => <div className="col-12" key={key}>
                                            <div className="col-12">
                                                <Button variant="contained" onClick={() => handleAddLayer(key)} >Thêm lớp chất liệu </Button>
                                                <Button variant="contained" onClick={() => handleAddLopVariant(key)} >Thêm variant </Button>
                                                <Button variant="contained" onClick={() => handleDeleteLopVariant(key)} >Xóa Variant </Button>
                                            </div>

                                            <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '20ch' } }} noValidate autoComplete="off">
                                                <TextField id="outlined-basic" label="nhập tên" variant="outlined" type="text" size="small"
                                                    value={item.name || ''}
                                                    onChange={(e) => changeNameLopVariant(key, e.target.value)}
                                                    placeholder="Tên"
                                                    slotProps={{ input: { endAdornment: <InputAdornment position="end">Tên</InputAdornment>, }, }}
                                                />
                                            </Box>
                                            {item.value.map((itemL, keyL) => <LayerThemVLVariant keyL vatLieu={vatLieu} phuKien={phuKien} key={keyL} item={itemL} changeLopCL={changeLopCL} keyVariant={key} stt={keyL} xoaLayer={() => xoaLayer(key, keyL)} />)}

                                        </div>)}

                                    </div>

                                </div>


                                <div className="row glrsjngsl">
                                    <div className="col-12">
                                        <Button variant="contained" onClick={() => setisOpenSelectPK(true)} >Thêm Phụ Kiện</Button>
                                        <div className="row">
                                            {(ListPhuKien.length > 0) && ListPhuKien.map((item, key) => <div className="col-2" key={key}>
                                                <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '20ch' } }} noValidate autoComplete="off">
                                                    <TextField id="outlined-basic" label="nhập tên" variant="outlined" type="text" size="small"
                                                        value={item.name || ''}
                                                        onChange={(e) => changePhuKienVariantName(key, e.target.value)}
                                                        placeholder="Tên"
                                                        slotProps={{ input: { endAdornment: <InputAdornment position="end">Tên</InputAdornment>, }, }}
                                                    />
                                                </Box>
                                                <div className="divtongvl vsdv">
                                                    <IconButton aria-label="delete" className='iconbtdlelepk' onClick={() => handleDeletePhuKien(key)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <div className="tenpk">Tên: <span className="hhhg">{item.value.name}</span></div>
                                                    <div className="anhpkvl">
                                                        {item.value.imageUrl ? <Image priority src={item.value.imageUrl} alt="My GIF" width={500} height={300} className="anhpkvl" /> : <></>}
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
                                                <SelectPhuKien_CLL onClose={CloseSelectPK} phuKien={props.phuKien} />
                                            </Box>
                                        </Modal>
                                    </div>
                                </div>

                                //////////////////phu kien tong
                                <div className="row glrsjngsl">
                                    <div className="col-12">
                                        <Button variant="contained" onClick={() => setisOpenSelectPKTong(true)} >Thêm Phụ Kiện</Button>
                                        <div className="row">
                                            {(ListPhuKienTong.length > 0) && ListPhuKienTong.map((item, key) => <div className="col-2" key={key}>
                                                <div className="divtongvl vsdv">
                                                    <IconButton aria-label="delete" className='iconbtdlelepk' onClick={() => handleDeletePhuKienTong(key)}>
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
                                            open={isOpenSelectPKTong}
                                            onClose={CloseSelectPKTong}
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
                                                    onClick={CloseSelectPKTong}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        right: 8,
                                                        zIndex: 99,
                                                    }}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                                <SelectPhuKien_CLL onClose={CloseSelectPKTong} phuKien={props.phuKien} />
                                            </Box>
                                        </Modal>
                                    </div>
                                </div>


                                <div className="container">



                                    <div className="row">


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
                                                        value={Product || ''}
                                                        onChange={(e) => setProduct(e.target.value)}
                                                        placeholder="Nhập Product Name"
                                                        fullWidth
                                                    />
                                                    <TextField
                                                        label="Variant"
                                                        variant="standard"
                                                        color="warning"
                                                        focused
                                                        value={variant || ''}
                                                        onChange={(e) => setvariant(e.target.value)}
                                                        placeholder="Nhập Variant Name"
                                                        fullWidth
                                                    />
                                                </div>





                                            </div>




                                        </div>
                                        <div className="col-6">

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

                                                <div className="anhtailen">
                                                    <img src={(image) ? image : (thongSoTong.anh !== "") ? thongSoTong.anh : null} alt="Uploaded" className='amttt' />
                                                </div>


                                            </Box>

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




                    </div>
                </div>
            </div>
        </div>





    );
}
