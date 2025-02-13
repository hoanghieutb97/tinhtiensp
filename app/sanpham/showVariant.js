'use client';
import { useState, useEffect } from 'react';
import Image from "next/image";
import ThemSanPham from './themSamPham';
import { Box, Modal, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { functions } from 'lodash';
import { usePhukien } from "../context/PhukienContext";
import AddIcon from '@mui/icons-material/Add';
function ShowVariant(props) {
    const { getItemsByQuery } = usePhukien();

    let listItems = props.activeProduct.data;
    const [handleAddSP, sethandleAddSP] = useState(false);
    const [activeSuaSP, setactiveSuaSP] = useState([]);
    const [addNewStatus, setaddNewStatus] = useState(false);
    const [styleSP, setstyleSP] = useState("new");


    function dongCTN(params) {
        sethandleAddSP(false);
        setaddNewStatus(false);

    }
    function handleSuaSP(item) {
        setstyleSP("old");
        sethandleAddSP(true);
        setactiveSuaSP(item)
    }
    function themSPMoi(params) {
        setstyleSP("new");
        let item = { ...listItems[0] };
        for (let i = 0; i < item.lop.length; i++) {
            item.lop[i].chieuDai = "";
            item.lop[i].chieuRong = "";

        }
        item.thongSoTong.variant = "";
        setactiveSuaSP(item)
        setaddNewStatus(false);
        sethandleAddSP(true);




    }


    async function handleDeleteItem(item) {
        props.setLoading(true)
        const response = await fetch(`/api/sanpham?id=${item._id}`, {
            method: 'DELETE',
        });
        let result = await response.json();

        props.getItemsAll("sanpham");
        // props.setLoading(false)

    }
    async function addDuplicate(item) {
        const res = await fetch('/api/sanpham/duplicate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: item._id })
        });

        const data = await res.json();
        if (data.success) {

            console.log("Nhân đôi thành công, ID mới:", data.newId);
        } else {
            console.error("Lỗi:", data.error);
        }
        props.getItemsAll("sanpham");
    }
    async function chuyen(id) {


    }

    return (

        <>
            {handleAddSP && <ThemSanPham dongCTN={dongCTN} data={activeSuaSP} typeCPN={!addNewStatus ? "editProduct" : ""} styleSP={styleSP} phuKien={props.phuKien} vatLieu={props.vatLieu} setLoading={props.setLoading} getItemsAll={props.getItemsAll} Rate={props.Rate} ShippingCost={props.ShippingCost} />}


            {!handleAddSP && <div className="clickshowprd">
                <Button variant="contained" color="success" onClick={themSPMoi}>
                    Thêm Sản Phẩm variant
                </Button>

                <Button variant="contained" color="success" onClick={chuyen} >
                    Chuyển
                </Button>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="row">
                                {listItems.map((item, key) => <div className="col-2 motproduct11" key={key} >
                                    <div className="divtongsp">
                                        <IconButton aria-label="delete" className='iconbtdlele' onClick={() => handleDeleteItem(item)}>
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton aria-label="delete" className='iconbtdleleadd' onClick={() => addDuplicate(item)}>
                                            <AddIcon />
                                        </IconButton>
                                        <div className="tenpk">product: <span className="hhhg"> {item.thongSoTong.product}</span></div>
                                        <div className="tenpk">variant:<span className="hhhg">{item.thongSoTong.variant} </span> </div>
                                        <div className="tenpk">note:<span className="hhhg"> {item.thongSoTong.note}</span> </div>
                                        <div className="divanh">
                                            <Image priority src={item.thongSoTong.anh} alt="My GIF" width={500} height={300} className="anhpksp" />
                                        </div>
                                        <div className="ctnbtnsp">
                                            <button className="btn btn-primary bthgg" onClick={() => handleSuaSP(item)}> Sửa sản phẩm </button>
                                        </div>


                                    </div>
                                </div>)}
                            </div>
                        </div>
                    </div>
                </div>




            </div>}

        </>
    );
}

export default ShowVariant;