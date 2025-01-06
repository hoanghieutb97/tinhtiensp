
"use client";

import { useEffect, useState } from "react";
import ModalThemPK from "./ModalThemPK";
import Image from "next/image";
import { usePhukien } from "../context/PhukienContext";

export default function ProductList() {

  const { vatLieu } = usePhukien();

  return (
    <div>
      <ModalThemPK />
      <h1>Danh sách sản phẩm</h1>
      <div className="container">
        <div className="row">
          {
            vatLieu.map((item, key) =>
              <div className="pkhh col-2" key={key}>
                <div className="tenpk">Tên: <span className="hhhg">{item.name}</span></div>
                <div className="tenpk">  Giá tiền: <span className="hhhg">{item.price}</span></div>
                <div className="tenpk">Ghi chú: <span className="hhhg">{item.note}</span></div>
                <div className="anhpk">        {item.imageUrl ? <Image priority src={item.imageUrl} alt="My GIF" width={500} height={300} className="anhpk" /> : <></>} </div>

              </div>)
          }
        </div>
      </div>

    </div>
  );
}
