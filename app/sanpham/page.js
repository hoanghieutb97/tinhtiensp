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

function page(props) {
    const { vatLieu, loading, setLoadingALL, activeItems, getItemsByQuery } = usePhukien();
    const [handleAddSP, sethandleAddSP] = useState(false);
    function dongCTN(params) {
        sethandleAddSP(false)
    }
    const [listSP, setListSP] = useState([]);
    var fetchSanPham = async () => {
        try {
            setLoadingALL(true); // Bắt đầu trạng thái loading
            getItemsByQuery("/sanpham", "");
          



        } catch (error) {

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
            <Button variant="contained" color="success" onClick={() => sethandleAddSP(true)}>
                Thêm Sản Phẩm
            </Button>

            <ShowSanPham listSP={activeItems} fetchSanPham={fetchSanPham} />

        </div>
    );
}

export default page;