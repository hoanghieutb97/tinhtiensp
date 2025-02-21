
"use client";

import { useEffect, useState } from "react";
import ModalThemPK from "../components/ModalThemPK";
import Image from "next/image";
import { usePathname } from "next/navigation";
import AllLoading from "../allLoading";
import { Box, Typography, Button } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { getItemsByQuery, fetchPhuKien, fetchVatLieu, get_ShipingCost } from "@/lib/utils";
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
export default function ProductList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numberItem, setnumberItem] = useState(false);
  const [Items, setItems] = useState(defauState);
  const [activeItems, setactiveItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const pathname = usePathname(); // Lấy đường dẫn hiện tại
  const path = pathname.split("/").pop();



  useEffect(() => {
    fetchSanPham();
  }, []);

  var fetchSanPham = async () => {
    await getItemsAll(path);
  }

  function handlesetIsModalOpen(params) {
    setIsModalOpen(params);
    setItems(defauState)
  }

  async function getItemsAll(param) {
    setLoading(true);
    let items = await getItemsByQuery("/" + param, "");
    setactiveItems(items);
    setItems(defauState);
    setLoading(false);
    if (isModalOpen) setIsModalOpen(false);
    console.log("fetch......................");
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



  console.log(path);


  if (loading) {
    return <AllLoading />;
  }
  return (

    <div>
      {isModalOpen && <ModalThemPK setLoadingALL={(xx) => setLoading(xx)} handlesetIsModalOpen={handlesetIsModalOpen} isModalOpen={isModalOpen} item={Items} getItemsAll={getItemsAll} typeLink={path} />}

      <div className="container-fluid mt-2">
        <div className="row">
          <div className="col-12">
            <div className="row">
              <div className="col-8">
                <button
                  className="btn btn-primary w-100"
                  onClick={() => handlesetIsModalOpen(true)}
                  data-bs-toggle="modal"
                  data-bs-target="#addAccessoryModal"
                >
                  Thêm Vật Liệu
                </button>
              </div>
            </div>

          </div>

          <div className="col-8 mt-3">
            <div className="row">
              {
                activeItems.map((item, key) =>
                  <div className={("pkhh col-3")} key={key} onClick={() => handleClickItem(item, key)} >
                    <div className={("ctnbtnrrrr") + ((key == numberItem) ? " borderactive" : "")}>

                      <div className="tenpk">Tên: <span className="hhhg">{item.name}</span></div>
                      <div className="tenpk">  Giá tiền: <span className="hhhg">{(+item.price).toLocaleString("en-US")}</span></div>
                      <div className="tenpk">  Cân Nặng: <span className="hhhg">{(+item.canNang).toLocaleString("en-US")}  (g)</span></div>
                      <div className="anhpk"> <Image priority src={item.imageUrl} alt="My GIF" width={500} height={300} className="anhpk" /></div>
                      <div className="ctnbthgjf">
                        <Button variant="contained" color="success" className=' w-100 dvsdv' onClick={() => handleChangeActiveItem(item, key)}>
                          Sửa
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
