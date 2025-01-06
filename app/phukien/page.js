
"use client";

import { useEffect, useState } from "react";
import ModalThemPK from "./ModalThemPK";
import Image from "next/image";
import { usePhukien } from "../context/PhukienContext";
import AllLoading from "../allLoading";

export default function ProductList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const defauState = {
    name: "",
    price: "",
    note: "",
    nameCode: "",
    image: null,
    _id: null,
    change: true,
    dateCreate: Date.now()
  }
  const { loading, phukien, setLoadingALL } = usePhukien();

  function handlesetIsModalOpen(params) {
    setIsModalOpen(params)
  }
  const [Items, setItems] = useState(defauState);
  function setValueItem(target, value) {
    if (target == "default") {
      setItems(defauState)
    } else {
      let itemxx = { ...Items };
      itemxx[target] = value;
      setItems(itemxx)
    }

  }
  function handleChangeActiveItem(item, key) {
    handlesetIsModalOpen(true);
    setItems(item);
  }
  console.log(phukien);

  if (loading) {
    return <AllLoading />;
  }
  return (

    <div>
      <ModalThemPK setLoadingALL={setLoadingALL} handlesetIsModalOpen={handlesetIsModalOpen} isModalOpen={isModalOpen} item={Items} setValueItem={setValueItem} />
      <h1>Danh sách sản phẩm</h1>
      <div className="container">
        <div className="row">
          {
            phukien.map((item, key) =>
              <div className="pkhh col-2" key={key} onClick={() => handleChangeActiveItem(item, key)}>
                <div className="tenpk">Tên: <span className="hhhg">{item.name}</span></div>
                <div className="tenpk">  Giá tiền: <span className="hhhg">{item.price}</span></div>
                <div className="tenpk">Ghi chú: <span className="hhhg">{item.note}</span></div>
                <div className="anhpk">   {item.imageUrl ? <Image priority src={item.imageUrl} alt="My GIF" width={500} height={300} className="anhpk" /> : <></>}</div>

              </div>)
          }
        </div>
      </div>

    </div>
  );
}
