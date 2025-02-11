'use client';
import React from 'react';
import ThemSanPham from './themSamPham';
import AllLoading from "../allLoading";
import { usePhukien } from "../context/PhukienContext";
import { useState, useEffect } from 'react';
import Image from "next/image";
import ShowSanPham from './showSanPham';
import Button from '@mui/material/Button';
import { logging } from '@/next.config';
import { getItemsByQuery, fetchPhuKien, fetchVatLieu, get_ShipingCost } from "@/lib/utils";
function page(props) {
    const [loading, setLoading] = useState(false); // Thêm trạng thái loading
    const [activeItems, setactiveItems] = useState([]);
    const [phuKien, setPhuKien] = useState([]);
    const [vatLieu, setVatLieu] = useState([]);
    const [Rate, setRate] = useState(0);
    const [ShippingCost, setShippingCost] = useState([]);
    async function fetchExchangeRate() {
        try {
            const response = await fetch(
                "https://open.er-api.com/v6/latest/USD?apikey=11742cfd1de9c29694fc8053 "
            );

            if (!response.ok) {
                throw new Error("Không thể lấy dữ liệu tỷ giá.");
            }

            const data = await response.json();


            return (data.rates.VND); // Lấy tỷ giá USD → VND
        } catch (err) {
            return 0.01
        } finally {

        }
    }
    useEffect(() => {
        fetchSanPham();
        async function getitems() {
            let items = await get_ShipingCost();
            setShippingCost(items)
        }
        getitems();
    }, []);

    var fetchSanPham = async () => {
        setLoading(true); // Bắt đầu trạng thái loading
        await getItemsAll("sanpham");
        let ItemsPK = await fetchPhuKien();
        let ItemsVL = await fetchVatLieu();
        let rate = await fetchExchangeRate();

        setPhuKien(ItemsPK);
        setVatLieu(ItemsVL);
        setRate(rate)
        setLoading(false); // Bắt đầu trạng thái loading

    }
    async function getItemsAll(param) {
        let items = await getItemsByQuery("/" + param, "");
        setactiveItems(items);
    }


    if (loading) {
        return <AllLoading />;
    }


    return (
        <div className='vdsdvs'>


            <ShowSanPham listSP={activeItems} phuKien={phuKien} vatLieu={vatLieu} setLoading={(param) => setLoading(param)} getItemsAll={getItemsAll} Rate={Rate} ShippingCost={ShippingCost}/>

        </div>
    );

}
export default page;