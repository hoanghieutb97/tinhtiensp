
"use client";

import { useEffect, useState } from "react";
import ModalThemPK from "./ModalThemPK";
import Image from "next/image";
import { usePhukien } from "../context/PhukienContext";
import AllLoading from "../allLoading";
import { Box, Typography, Button } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
export default function ProductList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numberItem, setnumberItem] = useState(false);
  const defauState = {
    name: "",
    price: "",
    note: "",
    nameCode: "",
    image: null,
    _id: null,
    change: true,
    canNang: 0,
    dateCreate: Date.now()
  }
  const { loading, phukien, setLoadingALL, getItemsByQuery, activeItems } = usePhukien();
  useEffect(() => {
    getItemsByQuery("/phukien", "");
  }, []);

  function handlesetIsModalOpen(params) {
    setIsModalOpen(params);
    setItems(defauState)
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
    setnumberItem(key)

    setItems(item);
  }
  let selectItem = (numberItem !== false) ? activeItems[numberItem] : false
  function handleClickItem(item, key) {
    setnumberItem(key)
    setItems(item);
  }




  if (loading) {
    return <AllLoading />;
  }
  return (

    <div>
      <ModalThemPK setLoadingALL={setLoadingALL} handlesetIsModalOpen={handlesetIsModalOpen} isModalOpen={isModalOpen} item={Items} setValueItem={setValueItem} />
  
      <div className="container-fluid mt-2">
        <div className="row">
          <div className="col-8">
            <div className="row">
              {
                activeItems.map((item, key) =>
                  <div className={("pkhh col-3")} key={key} onClick={() => handleClickItem(item, key)} >
                    <div className={("ctnbtnrrrr") + ((key == numberItem) ? " borderactive" : "")}>

                      <div className="tenpk">Tên: <span className="hhhg">{item.name}</span></div>
                      <div className="tenpk">  Giá tiền: <span className="hhhg">{(+item.price).toLocaleString("en-US")}</span></div>
                      <div className="tenpk">  Cân Nặng: <span className="hhhg">{(+item.canNang).toLocaleString("en-US")}  (g)</span></div>
                      <div className="anhpk"> <Image priority src={item.imageUrl} alt="My GIF" width={500} height={300} className="anhpk" /></div>
                      <div className="divsuabtn" onClick={() => handleChangeActiveItem(item, key)}>
                        <Button
                          variant="contained"
                          startIcon={<BorderColorIcon />}
                          color="primary"
                          className="btnsuapk"
                          size="small"
                        >
                          sửa
                        </Button>
                      </div>
                    </div>

                  </div>)
              }
            </div>
          </div>
          <div className="col-4 gfgfg">
            {(selectItem) && <div className="col4-thongtin ghrh">
              <div className="ctnbtnrrrr ">

                <div className="tenpk">Tên: <span className="hhhg">{selectItem.name}</span></div>
                <div className="tenpk">  Giá tiền: <span className="hhhg">{(+selectItem.price).toLocaleString("en-US")}</span></div>


                <p className="tenpk">Ghi chú: <span className="hhhg notepk">{selectItem.note}</span></p>
                <div className="anhpk">   {selectItem.imageUrl ? <Image priority src={selectItem.imageUrl} alt="My GIF" width={500} height={300} className="anhpk" /> : <></>}</div>

              </div>
            </div>}
          </div>

        </div>
      </div>

    </div>
  );
}
