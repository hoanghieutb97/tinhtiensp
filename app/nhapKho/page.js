"use client";

import { useState, useEffect } from "react";

import { getItemsByQuery, fetchPhuKien, fetchVatLieu, get_ShipingCost } from "@/lib/utils";

export default function NhapKho() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [Rate, setRate] = useState(0);
    const [phuKien, setPhuKien] = useState([]);
    const [vatLieu, setVatLieu] = useState([]);
    
    // Thêm state cho input
    const [productInput, setProductInput] = useState("");
    const [variantInput, setVariantInput] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    // Hàm isMatch để so sánh variant
    function isMatch(Ap, Ex) {
        // Chuyển đổi dấu * trong B thành một phần regex phù hợp
        let pattern = Ex.replace(/\*/g, ".*");

        // Tạo biểu thức chính quy với pattern đã thay đổi
        let regex = new RegExp(`^${pattern}$`, "i");

        return regex.test(Ap);
    }

    var fetchSanPham = async () => {
        setLoading(true); // Bắt đầu trạng thái loading
        await getItemsAll("sanpham");
        let ItemsPK = await fetchPhuKien();
        let ItemsVL = await fetchVatLieu();

        let rate = 23000;
        // let rate = await fetchExchangeRate();
        console.log(rate);

        setPhuKien(ItemsPK);
        setVatLieu(ItemsVL);
        setRate(rate)
        setLoading(false); // Bắt đầu trạng thái loading
    }

    async function getItemsAll(param) {
        setLoading(true); // Bắt đầu trạng thái loading
        let items = await getItemsByQuery("/" + param, "");
        setItems(items);

        setLoading(false); // Bắt đầu trạng thái loading
    }

    // Hàm tìm kiếm sản phẩm
    const searchProduct = () => {
        if (!productInput.trim() || !variantInput.trim()) {
            alert("Vui lòng nhập đầy đủ Product và Variant!");
            return;
        }

        const foundItems = items.filter(item => 
            item.thongSoTong?.product?.trim().toLowerCase() === productInput.trim().toLowerCase() &&
            isMatch(variantInput.trim().toLowerCase(), item.thongSoTong?.variant?.trim().toLowerCase())
        );

        setSearchResult(foundItems.length > 0 ? foundItems : null);
        setHasSearched(true);
    };

    useEffect(() => {
        fetchSanPham();
    }, []);

    // Reset hasSearched khi user thay đổi input
    useEffect(() => {
        setHasSearched(false);
        setSearchResult(null);
    }, [productInput, variantInput]);

    // Tự động tìm kiếm khi có đủ thông tin
    useEffect(() => {
        if (productInput.trim() && variantInput.trim()) {
            searchProduct();
        } else {
            setHasSearched(false);
            setSearchResult(null);
        }
    }, [productInput, variantInput, items]);

    console.log(items);
    console.log(phuKien);
    console.log(vatLieu);
    console.log(Rate);

    return (
        <div className="container mt-4">
            <h1>Nhập Kho</h1>
            
            {/* Input fields */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="productInput" className="form-label">Product:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="productInput"
                            value={productInput}
                            onChange={(e) => setProductInput(e.target.value)}
                            placeholder="Nhập tên sản phẩm..."
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="variantInput" className="form-label">Variant:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="variantInput"
                            value={variantInput}
                            onChange={(e) => setVariantInput(e.target.value)}
                            placeholder="Nhập variant..."
                        />
                    </div>
                </div>
            </div>

            {/* Button Tìm kiếm */}
            <div className="text-center mb-4">
                <button 
                    className="btn btn-info btn-lg me-3"
                    onClick={searchProduct}
                    disabled={!productInput.trim() || !variantInput.trim()}
                >
                    🔍 Tìm Kiếm
                </button>
            </div>

            {/* Search Result */}
            {searchResult && (
                <div className="alert alert-success">
                    <h5>✅ Tìm thấy {searchResult.length} sản phẩm:</h5>
                    {searchResult.map((item, index) => (
                        <div key={index} className="mb-3 p-3 border rounded">
                            <h6>Sản phẩm {index + 1}:</h6>
                            <p><strong>Name:</strong> {item.name}</p>
                            <p><strong>Product:</strong> {item.thongSoTong?.product}</p>
                            <p><strong>Variant:</strong> {item.thongSoTong?.variant}</p>
                            <p><strong>Kích thước:</strong> {item.thongSoTong?.chieuNgang} x {item.thongSoTong?.chieuDoc} x {item.thongSoTong?.doCao}</p>
                            <p><strong>Cân nặng:</strong> {item.thongSoTong?.canNang}g</p>
                            <p><strong>ID:</strong> {item._id}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Thông báo không tìm thấy */}
            {searchResult === null && productInput && variantInput && hasSearched && (
                <div className="alert alert-warning">
                    <h5>⚠️ Không tìm thấy sản phẩm phù hợp</h5>
                    <p><strong>Product:</strong> "{productInput}"</p>
                    <p><strong>Variant:</strong> "{variantInput}"</p>
                    <p>Vui lòng kiểm tra lại thông tin hoặc thử tìm kiếm với từ khóa khác.</p>
                </div>
            )}
            
            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <div>
                    <p>hehe</p>
                    <p>Số lượng items: {items.length}</p>
                </div>
            )}
        </div>
    );
} 