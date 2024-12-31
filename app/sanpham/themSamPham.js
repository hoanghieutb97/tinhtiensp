'use client';

import { useState, useEffect } from 'react';
import LayerThemVL from "./layerThemVL";

import { tinhTienVatLieu, tinhTienBangDinh, tinhTienXop, tinhTienMuc, tinhTienMangBoc, tinhTienTK, tinhTienIn, tinhTienCat, tinhTienDIen, tinhTienChietKhau, tinhTienHop, tinhTienThungDongHang, tinhTienKeoDan } from "./tinhtien";
import { usePhukien } from "../context/PhukienContext";

export default function ThemSanPham() {
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
    const { vatLieu } = usePhukien();
    const [lop, setlop] = useState([]);
    const [tienVL, setTienVL] = useState(initialStateVL);
    const [thongSoTong, setThongSoTong] = useState({
        doCao: 0,
        chieuNgang: 0,
        chieuDoc: 0,
        xop: "xopmong"
    });
    const [image, setImage] = useState(null);
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
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
            <button className="btn btn-primary" onClick={handleAddLayer}  >   Thêm lớp chất liệu  </button>
            {lop.map((item, key) => <LayerThemVL key={key} item={item} changeLopCL={changeLopCL} stt={key} xoaLayer={xoaLayer} />)}
            <div className="container">

                <div className="row">

                    <div className="col-2">
                        <div className="mb-3">
                            <label htmlFor="heightInput" className="form-label">
                                Chiều Ngang hộp:(cm)
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                id="heightInput"
                                placeholder="in"
                                value={thongSoTong.chieuNgang}
                                onChange={(e) => handleChangeThongSoTong("chieuNgang", e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="mb-3">
                            <label htmlFor="heightInput" className="form-label">
                                Chiều Dọc hộp:(cm)
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                id="heightInput"
                                placeholder="in"
                                value={thongSoTong.chieuDoc}
                                onChange={(e) => handleChangeThongSoTong("chieuDoc", e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="mb-3">
                            <label htmlFor="heightInput" className="form-label">
                                Nhập độ cao:(cm)
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                id="heightInput"
                                placeholder="in"
                                value={thongSoTong.doCao}
                                onChange={(e) => handleChangeThongSoTong("doCao", e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <div className="kvsvlsvls">
                            <label htmlFor="numFaces" className="kvsvvfflsvlffs">
                                chọn xốp
                            </label>
                            <select
                                id="numFaces"
                                name="numFaces"
                                value={thongSoTong.xop}
                                onChange={(e) => handleChangeThongSoTong("xop", e.target.value)}
                                className="kvsvvffvvlsvlffs"
                            >
                                <option value="xopmong">xốp 0.5mm</option>
                                <option value="xop3mm">xốp 3mm</option>
                                <option value="xop5mm">xốp 5mm</option>
                                <option value="xop10mm">xốp 10mm</option>
                                <option value="xop20mm">xốp 20mm</option>
                                <option value="xopno">xốp nổ</option>


                            </select>
                        </div>
                    </div>
                    <div className="col-6">
                        <div>
                            <h3>Tải lên ảnh:</h3>
                            <input type="file" accept="image/*" onChange={handleImageUpload} />
                            {image && (
                                <div style={{ marginTop: '20px' }}>
                                    <p>Ảnh đã tải lên:</p>
                                    <img src={image} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto', border: '1px solid #ddd' }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


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



    );
}
