"use client"; // Đánh dấu đây là Client Component

import { createContext, useContext, useState, useEffect } from "react";
const host = process.env.NEXT_PUBLIC_HOST || "";

const PhukienContext = createContext();

export const PhukienProvider = ({ children }) => {
    const [phukien, setPhukien] = useState([]);

    var fetchPhukien = async () => {
        console.log("fetchPhukien................");
        
        try {
            const response = await fetch(host + "/api/phukien", { cache: "no-store" });

            const data = await response.json();


            setPhukien(data?.data || []);
        } catch (error) {
            console.error("Error fetching phukien:", error);
        }
    };
    useEffect(() => {
        fetchPhukien();
    }, []);


    return (
        <PhukienContext.Provider value={{ phukien, fetchPhukien }}>{children}</PhukienContext.Provider>
    );
};

export const usePhukien = () => useContext(PhukienContext);
