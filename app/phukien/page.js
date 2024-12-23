
"use client";

import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ModalThemPK from "./ModalThemPK";
import Image from "next/image";
import { usePhukien } from "../context/PhukienContext";

export default function ProductList() {
  // const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { phukien } = usePhukien();
  console.log(phukien);

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
      {
        phukien.map((item, key) =>
          <div className="" key={key}>
            <div className="">{item.name}</div>
            <div className="">{item.price}</div>
            {item.imageUrl ? <Image priority  src={item.imageUrl} alt="My GIF" width={500} height={300} /> : <></>}
          </div>)
      }
    </div>
  );
}
