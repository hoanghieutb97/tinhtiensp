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
    useEffect(() => {

        fetchSanPham();
    }, []);
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
    if (loading) {
        return <AllLoading />;
    }
    return (
        <div className='vdsdvs'>


            <ShowSanPham listSP={activeItems} />

        </div>
    );
}

export default page;