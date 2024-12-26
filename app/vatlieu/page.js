
"use client";

import { useEffect, useState } from "react";
import ModalThemPK from "./ModalThemPK";
import Image from "next/image";
import { usePhukien } from "../context/PhukienContext";

export default function ProductList() {
  // const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { vatLieu } = usePhukien();
  console.log(vatLieu);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await fetch("/api/phukien"); // Gọi API
  //       const result = await res.json();
  //       if (result.success) {
  //         setProducts(result.data); // Lưu dữ liệu vào state


  //       } else {
  //         alert(`Lỗi: ${result.error}`);
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       alert("Có lỗi xảy ra khi tải dữ liệu!");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);

  // if (loading) return <p>Đang tải dữ liệu...</p>;

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
                {item.imageUrl ? <Image priority src={item.imageUrl} alt="My GIF" width={500} height={300} className="anhpk" /> : <></>}
              </div>)
          }
        </div>
      </div>

    </div>
  );
}
