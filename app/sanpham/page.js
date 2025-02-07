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
import { getItemsByQuery, fetchPhuKien, fetchVatLieu } from "@/lib/utils";
function page(props) {
    const [loading, setLoading] = useState(false); // Thêm trạng thái loading
    const [activeItems, setactiveItems] = useState([]);
    const [phuKien, setPhuKien] = useState([]);
    const [vatLieu, setVatLieu] = useState([]);

    useEffect(() => {
        fetchSanPham();
    }, []);

    var fetchSanPham = async () => {
        setLoading(true); // Bắt đầu trạng thái loading
        await getItemsAll("sanpham");
        let ItemsPK = await fetchPhuKien();
        let ItemsVL = await fetchVatLieu();

        setPhuKien(ItemsPK);
        setVatLieu(ItemsVL);
        setLoading(false); // Bắt đầu trạng thái loading

    }
    async function getItemsAll(param) {
        let items = await getItemsByQuery("/" + param, "");
        setactiveItems(items);
    }
    console.log(activeItems);
    if (loading) {
        return <AllLoading />;
    }


    return (
        <div className='vdsdvs'>


            <ShowSanPham listSP={activeItems} phuKien={phuKien} vatLieu={vatLieu} setLoading={(param) => setLoading(param)} getItemsAll={getItemsAll} />

        </div>
    );

}
export default page;