"use client"; // Đánh dấu đây là Client Component

import { createContext, useContext, useState, useEffect } from "react";
const host = process.env.NEXT_PUBLIC_HOST || "";

const PhukienContext = createContext();


export const PhukienProvider = ({ children }) => {
    const [phukien, setPhukien] = useState([]);
    const [vatLieu, setVatLieu] = useState([]);

    var fetchPhukien = async () => {
        console.log("fetchPhukien................");
        
        try {
            const response = await fetch("/api/phukien", { cache: "no-store" });
            const data = await response.json();


            setPhukien(data?.data || []);
        } catch (error) {
            console.error("Error fetching phukien:", error);
        }
    };
    var fetchVatlieu = async () => {
        console.log("fetchVatlieun................");
        
        try {
            const response = await fetch("/api/vatlieu", { cache: "no-store" });
            const data = await response.json();


            setVatLieu(data?.data || []);
        } catch (error) {
            console.error("Error fetching vatlieu:", error);
        }
    };
    useEffect(() => {
        fetchPhukien();
        fetchVatlieu();
    }, []);


    return (
        <PhukienContext.Provider value={{ phukien, fetchPhukien,vatLieu,fetchVatlieu }}>{children}</PhukienContext.Provider>
    );
};

export const usePhukien = () => useContext(PhukienContext);
