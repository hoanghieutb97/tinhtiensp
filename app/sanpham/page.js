'use client';
import React from 'react';
import ThemSanPham from './themSamPham';
import AllLoading from "../allLoading";
import { usePhukien } from "../context/PhukienContext";
import { useState, useEffect } from 'react';
import Image from "next/image";
import ShowSanPham from './showSanPham';

function page(props) {
    const { vatLieu, loading, setLoadingALL } = usePhukien();
    const [handleAddSP, sethandleAddSP] = useState(false);
    function dongCTN(params) {
        sethandleAddSP(false)
    }
    const [listSP, setListSP] = useState([]);
    var fetchSanPham = async () => {
        try {
            setLoadingALL(true); // Bắt đầu trạng thái loading
            const response = await fetch("/api/sanpham", { cache: "no-store" });
            const data = await response.json();

            setListSP(data.data)


        } catch (error) {
            setListSP([])
            console.error("Error fetching phukien:", error);
        }
        finally {
            setLoadingALL(false); // Kết thúc trạng thái loading
        }
    };
    useEffect(() => {

        fetchSanPham();
    }, []);



    if (loading) {
        return <AllLoading />;
    }
    return (
        <div className='vdsdvs'>
            {handleAddSP ? <ThemSanPham dongCTN={dongCTN} fetchSanPham={fetchSanPham} /> : ""}
            <button className="btn btn-primary" onClick={() => sethandleAddSP(true)}>
                them
            </button>
            <ShowSanPham listSP={listSP} fetchSanPham={fetchSanPham} />

        </div>
    );
}

export default page;