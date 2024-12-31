'use client';
import React from 'react';
import ThemSanPham from './themSamPham';
import AllLoading from "../allLoading";
import { usePhukien } from "../context/PhukienContext";
import { useState, useEffect } from 'react';

function page(props) {
    const { vatLieu, loading } = usePhukien();
    const [handleAddSP, sethandleAddSP] = useState(false);

    if (loading) {
        return <AllLoading />;
    }
    return (
        <div>
            {handleAddSP ? <ThemSanPham  /> : ""}
            <button className="btn btn-primary" onClick={() => sethandleAddSP(true)}>
                them
            </button>

        </div>
    );
}

export default page;