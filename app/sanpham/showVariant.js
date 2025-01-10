'use client';
import { useState, useEffect } from 'react';
import Image from "next/image";
import ThemSanPham from './themSamPham';
import { Box, Modal, IconButton, Button } from '@mui/material';

function ShowVariant(props) {
    let listItems = props.activeProduct.data;
    const [handleAddSP, sethandleAddSP] = useState(false);
    const [activeSuaSP, setactiveSuaSP] = useState([]);
    const [addNewStatus, setaddNewStatus] = useState(false);
    function dongCTN(params) {
        sethandleAddSP(false);
        setaddNewStatus(false);

    }
    function handleSuaSP(params) {
        sethandleAddSP(true);
        setactiveSuaSP(params)
    }
    function themSPMoi(params) {
        setaddNewStatus(true);
        sethandleAddSP(true);


    }



    return (

        <>
            {handleAddSP && <ThemSanPham dongCTN={dongCTN} closeProduct={props.closeProduct} data={activeSuaSP} typeCPN={!addNewStatus ? "editProduct" : ""} />}


            <div className="clickshowprd">
                <Button variant="contained" color="success" onClick={themSPMoi}>
                    Thêm Sản Phẩm
                </Button>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 ">
                            {/* <Button variant="contained" onClick={props.closeProduct} className="btn btn-danger btvrrr"  >Xxx </Button> */}




                        </div>

                        <div className="col-12">
                            <div className="row">
                                {listItems.map((item, key) => <div className="col-3 motproduct11" key={key} >
                                    <div className="divtongsp">
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




            </div>

        </>
    );
}

export default ShowVariant;