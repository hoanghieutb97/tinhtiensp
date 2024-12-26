'use client';

import { useState, useEffect } from 'react';
import LayerThemVL from "./layerThemVL";
import { tinhTienVatLieu, tinhTienMuc, tinhTienTK, tinhTienIn, tinhTienCat } from "./tinhtien";
import { usePhukien } from "../context/PhukienContext";

export default function DropdownWithcustomChatLieuNgoai() {
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
        tienMatBang: 0,
        tienTemNhan: 0,
        TienBangDinh: 0,
        tienKeoDan: 0,
        tienXop3mm: 0,
        tienXop5mm: 0,
        tienXop10mm: 0,
        tienXop20mm: 0,
        tienMangBoc: 0,
        tienXopNo: 0,

    }
    const { vatLieu } = usePhukien();
    const [lop, setlop] = useState([]);
    const [tienVL, setTienVL] = useState(initialStateVL);

    useEffect(() => {
        console.log(lop);

        if (lop.length > 0)
            setTienVL({
                ...tienVL,
                tienVatLieu: tinhTienVatLieu(lop, vatLieu),
                tienMuc: tinhTienMuc(lop, vatLieu),
                tienThietke: tinhTienTK(lop, vatLieu),
                tienIn: tinhTienIn(lop, vatLieu),
                tienCat: tinhTienCat(lop, vatLieu)
            })
        else setTienVL(initialStateVL)
    }, [lop]);



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



    return (

        <>
            <button className="btn btn-primary" onClick={handleAddLayer}  >   Thêm lớp chất liệu  </button>
            {lop.map((item, key) => <LayerThemVL key={key} item={item} changeLopCL={changeLopCL} stt={key} xoaLayer={xoaLayer} />)}

            <div className="thoingtintien">
                {Object.entries(tienVL).map(([key, value], index) => (
                    <div key={index} className="thongtina">
                        <span>{key.replace(/([A-Z])/g, " $1")}: </span>
                        <span className="giatiensp">{value}</span>
                    </div>
                ))}
            </div>

        </>


    );
}
