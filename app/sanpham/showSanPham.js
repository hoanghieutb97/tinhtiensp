'use client';
import { useState, useEffect } from 'react';
import Image from "next/image";
import ShowProduct from './showProduct';

function ShowSanPham(props) {
    const [activeProduct, setactiveProduct] = useState();
    const [showProduct, setshowProduct] = useState(false);
    const groupByProduct = (list) => {
        const grouped = {};

        list.forEach((item) => {
            const productName = item.thongSoTong.product.trim().toLowerCase();

            if (!grouped[productName]) {
                grouped[productName] = { data: [], image: "" };
            }

            grouped[productName].data.push(item);

            // Lấy `thongSoTong.anh` đầu tiên nếu chưa có image
            if (!grouped[productName].image) {
                grouped[productName].image = item.thongSoTong.anh || ""; // Lấy ảnh nếu có
            }
        });

        // Nếu không có ảnh đầu tiên, cố gắng lấy ảnh của phần tử thứ 2
        for (const product in grouped) {
            if (!grouped[product].image && grouped[product].data.length > 1) {
                grouped[product].image = grouped[product].data[1]?.thongSoTong?.anh || "";
            }
        }

        return Object.entries(grouped).map(([productName, { data, image }]) => ({
            productName,
            data,
            image,
        }));
    };
    function handleClickProduct(item) {
        setshowProduct(true);
        setactiveProduct(item)
    }
    // Kết quả
    let listSP_XL = groupByProduct(props.listSP);

    console.log(listSP_XL);


    return (
        <div className="container">
            {showProduct ? <ShowProduct activeProduct={activeProduct} closeProduct={() => setshowProduct(false)} fetchSanPham={props.fetchSanPham} /> : ""}
            <div className="row">

                {listSP_XL.map((item, key) => <div className="col-2 motproduct11" key={key} onClick={() => handleClickProduct(item)}>
                    <div className="divtongsp">
                        <p className="hhh"><span className="thththth">product: </span>{item.productName}</p>
                        <p className="hhh"><span className="thththth">Số lượng: </span>{item.data.length}</p>
                        <div className="divanh">
                            <Image priority src={item.image} alt="My GIF" width={500} height={300} className="anhpksp" />
                        </div>

                    </div>
                </div>)}


            </div>
        </div>
    );
}

export default ShowSanPham;