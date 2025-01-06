'use client';
import { useState, useEffect } from 'react';
import Image from "next/image";
import ThemSanPham from './themSamPham';
import Button from '@mui/material/Button';

function ShowProduct(props) {
    let listItems = props.activeProduct.data;
    const [handleAddSP, sethandleAddSP] = useState(false);
    const [activeSuaSP, setactiveSuaSP] = useState();
    function dongCTN(params) {
        sethandleAddSP(false)
    }
    function handleSuaSP(params) {
        sethandleAddSP(true);
        setactiveSuaSP(params)
    }

    console.log(listItems);

    return (


        <div className="row">
            {handleAddSP ? <ThemSanPham dongCTN={dongCTN} closeProduct={props.closeProduct} data={activeSuaSP} typeCPN={"editProduct"} fetchSanPham={props.fetchSanPham} /> : ""}
            <div className="clickshowprd">
                <div className="container">
                    <div className="row">
                        <div className="col-12 ">
                            <Button variant="contained" onClick={props.closeProduct} className="btn btn-danger btvrrr"  >X </Button>

                        </div>

                        <div className="col-12">
                            <div className="row">
                                {listItems.map((item, key) => <div className="col-2 motproduct11" key={key} >
                                    <div className="divtongsp">
                                        <p className="hhh"><span className="thththth">product: </span> {item.thongSoTong.product}</p>
                                        <p className="hhh"><span className="thththth">variant: </span> {item.thongSoTong.variant}</p>
                                        <p className="hhh"><span className="thththth">note: </span> {item.thongSoTong.note}</p>
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



        </div>
    );
}

export default ShowProduct;