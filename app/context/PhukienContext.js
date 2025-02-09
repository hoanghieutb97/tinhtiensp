"use client"; // Đánh dấu đây là Client Component

import { createContext, useContext, useState, useEffect } from "react";
const host = process.env.NEXT_PUBLIC_HOST || "";

const PhukienContext = createContext();


export const PhukienProvider = ({ children }) => {
    const [phukien, setPhukien] = useState([]);
    const [vatLieu, setVatLieu] = useState([]);
    const [larkUser, setlarkUser] = useState([]);
    const [activeItems, setactiveItems] = useState([]);
    const [loading, setLoading] = useState(true); // Thêm trạng thái loading
    var fetchPhukien = async () => {


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
    var fetchLakUser = async () => {


        try {
            setLoading(true); // Bắt đầu trạng thái loading
            const response = await fetch("/api/larkUser", { cache: "no-store" });


            const data = await response.json();


            setlarkUser(data?.data || []);
        } catch (error) {
            console.error("Error fetching vatlieu:", error);
        } finally {
            setLoading(false); // Kết thúc trạng thái loading
        }
    };
    useEffect(() => {
        fetchPhukien();
        fetchVatlieu();
        fetchLakUser();
    }, []);
    // console.log("phukien...", phukien);
    // console.log("vatLieu...", vatLieu);


    function setLoadingALL(params) {
        setLoading(params)
    }
    async function getItemsByQuery(pathname, searchText) {
        setactiveItems([])


        if (searchText !== "activeItemsToDedault")

            try {
                setLoading(true); // Kết thúc trạng thái loading
                const response = await fetch("/api" + pathname + "?q=" + searchText, { cache: "no-store" });
                const data = await response.json();
                setactiveItems(data.data)


            } catch (error) {
                console.error("Error fetching vatlieu:", error);
            } finally {
                setLoading(false); // Kết thúc trạng thái loading
            }
        else {
            setactiveItems([])
        }
    }
    return (
        <PhukienContext.Provider value={{ loading, setLoadingALL, phukien, fetchPhukien, vatLieu, fetchVatlieu, larkUser, fetchLakUser, getItemsByQuery, activeItems }}>{children}</PhukienContext.Provider>
    );
};

export const usePhukien = () => useContext(PhukienContext);
