"use client"; // Đánh dấu đây là Client Component

import { createContext, useContext, useState, useEffect } from "react";
const host = process.env.NEXT_PUBLIC_HOST || "";

const PhukienContext = createContext();


export const PhukienProvider = ({ children }) => {
    const [phukien, setPhukien] = useState([]);
    const [vatLieu, setVatLieu] = useState([]);
    const [activeItems, setactiveItems] = useState([]);
    const [loading, setLoading] = useState(true); // Thêm trạng thái loading
    var fetchPhukien = async () => {
        console.log("fetchPhukien................");

        try {
            setLoading(true); // Bắt đầu trạng thái loading
            const response = await fetch("/api/phukien", { cache: "no-store" });


            const data = await response.json();


            setPhukien(data?.data || []);
        } catch (error) {
            console.error("Error fetching phukien:", error);
        }
        finally {
            setLoading(false); // Kết thúc trạng thái loading
        }
    };
    var fetchVatlieu = async () => {
        console.log("fetchVatlieun................");

        try {
            setLoading(true); // Bắt đầu trạng thái loading
            const response = await fetch("/api/vatlieu", { cache: "no-store" });


            const data = await response.json();


            setVatLieu(data?.data || []);
        } catch (error) {
            console.error("Error fetching vatlieu:", error);
        } finally {
            setLoading(false); // Kết thúc trạng thái loading
        }
    };
    useEffect(() => {
        fetchPhukien();
        fetchVatlieu();
    }, []);

    function setLoadingALL(params) {
        setLoading(params)
    }
    async function getItemsByQuery(pathname, searchText) {

        try {

            const response = await fetch("/api" + pathname + "?q=" + searchText, { cache: "no-store" });
            const data = await response.json();
            setactiveItems(data.data)


        } catch (error) {
            console.error("Error fetching vatlieu:", error);
        } finally {

        }

    }
    return (
        <PhukienContext.Provider value={{ loading, phukien, fetchPhukien, vatLieu, fetchVatlieu, setLoadingALL, getItemsByQuery, activeItems }}>{children}</PhukienContext.Provider>
    );
};

export const usePhukien = () => useContext(PhukienContext);
