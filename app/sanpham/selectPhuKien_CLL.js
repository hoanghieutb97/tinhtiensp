'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { usePhukien } from "../context/PhukienContext";
import Image from "next/image";


export default function SelectPhuKien_CLL({ onClose }) {
    const { phukien } = usePhukien();

    const [customValue, setCustomValue] = useState("");
    const [activeCL, setactiveCL] = useState(false);
    const [activeItem, setactiveItem] = useState(false);

    const handleSave = () => {

        closePopUp(activeItem)
    };
    function SelectChatLieuLop(item, key) {
        setactiveCL(key);
        setactiveItem(item);


    }
    function closePopUp(activeItem) {
        onClose([activeItem]); // Đóng cửa sổ sau khi lưu
        setactiveCL(false);
        setactiveItem(false);

    }

    return (
        <div className='yyb'>
            <div className='tytytyty'>

                <h1>Danh sách sản phẩm</h1>

                <div className='bthtyth'>

                    <button onClick={handleSave} className='btn btn-primary'>
                        Lưu
                    </button>
                    {/* <button onClick={onClose} className='btn btn-danger'>
                        Đóng
                    </button> */}
                </div>
                <div className="container">
                    <div className="row">
                        {
                            phukien.map((item, key) =>
                                <div className={"pkhh col-3 motproduct11 " + ((key === activeCL) ? "activeCL" : "")} key={key} onClick={() => SelectChatLieuLop(item, key)} >
                                    <div className="ctnbtnrrrr">
                                        <div className="tenpk">Tên: <span className="hhhg">{item.name}</span></div>
                                        <div className="tenpk">  Giá tiền: <span className="hhhg">{item.price}</span></div>
                                        <div className="tenpk">Ghi chú: <span className="hhhg">{item.note}</span></div>
                                        {item.imageUrl ? <Image priority src={item.imageUrl} alt="My GIF" width={500} height={300} className="anhpk" /> : <></>}
                                    </div>
                                </div>)
                        }
                    </div>
                </div>

            </div>
        </div>
    );
}

