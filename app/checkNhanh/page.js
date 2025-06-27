"use client";

import { useState, useEffect } from "react";

import { getItemsByQuery, fetchPhuKien, fetchVatLieu, get_ShipingCost, tinhTienMuc, tinhTienHop, tinhTienThungDongHang, tinhTienKeoDan, tinhTienBangDinh, tinhTienXop, tinhTienMangBoc, tinhTienTemNhan } from "@/lib/utils";

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

    // Thêm state cho modal
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Hàm isMatch để so sánh variant
    function isMatch(Ap, Ex) {
        // Chuyển đổi dấu * trong B thành một phần regex phù hợp
        let pattern = Ex.replace(/\*/g, ".*");

        // Tạo biểu thức chính quy với pattern đã thay đổi
        let regex = new RegExp(`^${pattern}$`, "i");

        return regex.test(Ap);
    }

    // Hàm mở modal
    const openModal = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    // Hàm đóng modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

    // Xử lý phím ESC
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                closeModal();
            }
        };

        if (showModal) {
            document.addEventListener('keydown', handleEsc);
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [showModal]);

    var fetchSanPham = async () => {
        setLoading(true); // Bắt đầu trạng thái loading
        await getItemsAll("sanpham");
        let ItemsPK = await fetchPhuKien();
        let ItemsVL = await fetchVatLieu();

        let rate = 23000;
        // let rate = await fetchExchangeRate();


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

    console.log(searchResult);
    if (searchResult !== null) console.log(tinhTienTungVatLieu(searchResult[0].lop, vatLieu));
    console.log(phuKien);
    if (loading) return <></>
    return (
        <div className="container mt-1">


            {/* Input fields */}
            <div className="row mb-2">
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
            <div className="text-center mb-2">
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
                <div className="alert alert-success backdvsvsd">
                    <h5>✅ Tìm thấy {searchResult.length} sản phẩm:</h5>
                    {searchResult.map((item, index) => (
                        <div key={index} className="mb-3 p-3 border rounded b-sdvvsd">
                            <div className="row">
                                {/* Cột trái - Thông tin text */}
                                <div className="col-md-8">

                                    <p className="m-1"><strong>Product:</strong> {item.thongSoTong?.product}</p>
                                    <p className="m-1"><strong>Variant:</strong> {item.thongSoTong?.variant}</p>
                                    <p className="m-1"><strong>Kích thước hộp:</strong> {item.thongSoTong?.chieuNgang} x {item.thongSoTong?.chieuDoc} x {item.thongSoTong?.doCao} cm</p>
                                    <p className="m-1"><strong>Cân nặng tổng:</strong> {item.thongSoTong?.canNang} g</p>
                                </div>

                                {/* Cột phải - Ảnh */}
                                <div className="col-md-4">
                                    {item.thongSoTong?.anh && (
                                        <div className="text-center">
                                            <img
                                                src={item.thongSoTong.anh}
                                                alt={`Hình ảnh ${item.name}`}
                                                className="img-fluid rounded"
                                                style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'block';
                                                }}
                                            />
                                            <p style={{ display: 'none', color: 'red' }}>Không thể tải hình ảnh</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Hiển thị tính tiền vật liệu và phụ kiện */}
                            <div className="mt-3">
                                <div className="row">
                                    {/* Cột trái - Vật liệu */}
                                    <div className="col-md-4">
                                        <div className="p-3 bg-light rounded h-100">
                                            <h6><strong>💰 Tính tiền vật liệu:</strong></h6>
                                            {item.lop ? (() => {
                                                const ketQuaTinhTien = tinhTienTungVatLieu(item.lop, vatLieu);
                                                return Object.keys(ketQuaTinhTien).length > 0 ? (
                                                    <div>
                                                        {Object.entries(ketQuaTinhTien).map(([tenVatLieu, thongTin], idx) => {
                                                            // Tìm item trong vatLieu để lấy imageUrl
                                                            let vatLieuItem = null;
                                                            if (thongTin.tenGoc.startsWith("custom")) {
                                                                let customId = thongTin.tenGoc.replace(/^custom/, "").trim();
                                                                vatLieuItem = vatLieu.filter(item => item._id == customId)[0];
                                                            } else {
                                                                vatLieuItem = vatLieu.filter(item => item.nameCode == thongTin.tenGoc)[0];
                                                            }

                                                            return (
                                                                <div key={idx} className="mb-2 p-2 border-start border-primary border-3">
                                                                    <div className="d-flex align-items-start">
                                                                        {vatLieuItem?.imageUrl && (
                                                                            <div className="me-3" style={{ minWidth: '60px' }}>
                                                                                <img
                                                                                    src={vatLieuItem.imageUrl}
                                                                                    alt={`Hình ảnh ${tenVatLieu}`}
                                                                                    className="img-fluid rounded"
                                                                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                                                    onError={(e) => {
                                                                                        e.target.style.display = 'none';
                                                                                    }}
                                                                                />
                                                                                <button
                                                                                    className="btn btn-sm btn-outline-info mt-1 p-1 "
                                                                                    onClick={() => openModal(vatLieuItem)}
                                                                                    disabled={!vatLieuItem}
                                                                                >
                                                                                    ℹ️ Chi tiết
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                        <div className="flex-grow-1">
                                                                            <p className="mb-1"><strong>📦 {tenVatLieu}:</strong></p>
                                                                            <p className="mb-1 ms-3">Số lượng: {thongTin.soLuong}</p>
                                                                            <p className="mb-0 ms-3">Tổng tiền: {Math.round(thongTin.tongTien).toLocaleString('vi-VN')} VNĐ</p>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                        <div className="mt-3 p-2 bg-primary text-white rounded">
                                                            <strong>Tổng cộng: {Math.round(Object.values(ketQuaTinhTien).reduce((sum, item) => sum + item.tongTien, 0)).toLocaleString('vi-VN')} VNĐ</strong>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-muted">Không có vật liệu để tính tiền</p>
                                                );
                                            })() : (
                                                <p className="text-muted">Không có thông tin vật liệu</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Cột giữa - Phụ kiện */}
                                    <div className="col-md-4">
                                        <div className="p-3 bg-light rounded h-100">
                                            <h6><strong>🔧 Tính tiền phụ kiện:</strong></h6>
                                            {item.thongSoTong?.phuKien && item.thongSoTong.phuKien.length > 0 ? (() => {
                                                const ketQuaPhuKien = tinhTienPhuKien(item.thongSoTong.phuKien, phuKien);
                                                return Object.keys(ketQuaPhuKien).length > 0 ? (
                                                    <div>
                                                        {Object.entries(ketQuaPhuKien).map(([tenPhuKien, thongTin], idx) => {
                                                            // Tìm item trong phuKien để lấy imageUrl
                                                            let phuKienItem = phuKien.filter(item => item._id == thongTin.tenGoc)[0];

                                                            return (
                                                                <div key={idx} className="mb-2 p-2 border-start border-success border-3">
                                                                    <div className="d-flex align-items-start">
                                                                        {phuKienItem?.imageUrl && (
                                                                            <div className="me-3" style={{ minWidth: '50px' }}>
                                                                                <img
                                                                                    src={phuKienItem.imageUrl}
                                                                                    alt={`Hình ảnh ${tenPhuKien}`}
                                                                                    className="img-fluid rounded"
                                                                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                                                    onError={(e) => {
                                                                                        e.target.style.display = 'none';
                                                                                    }}
                                                                                />
                                                                                <button
                                                                                    className="btn btn-sm btn-outline-success mt-1 p-1"
                                                                                    onClick={() => openModal(phuKienItem)}
                                                                                    disabled={!phuKienItem}
                                                                                >
                                                                                    ℹ️ Chi tiết
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                        <div className="flex-grow-1">
                                                                            <p className="mb-1"><strong>🔧 {tenPhuKien}:</strong></p>
                                                                            <p className="mb-1 ms-3">Số lượng: {thongTin.soLuong}</p>
                                                                            <p className="mb-0 ms-3">Tổng tiền: {Math.round(thongTin.tongTien).toLocaleString('vi-VN')} VNĐ</p>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                        <div className="mt-3 p-2 bg-success text-white rounded">
                                                            <strong>Tổng cộng: {Math.round(Object.values(ketQuaPhuKien).reduce((sum, item) => sum + item.tongTien, 0)).toLocaleString('vi-VN')} VNĐ</strong>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-muted">Không tìm thấy giá phụ kiện</p>
                                                );
                                            })() : (
                                                <p className="text-muted">Không có phụ kiện</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Cột phải - Các loại tiền khác */}
                                    <div className="col-md-4">
                                        <div className="p-3 bg-light rounded h-100">
                                            <h6><strong>💰 Các loại tiền khác:</strong></h6>
                                            <div className="row">
                                                {/* Cột 1 */}
                                                <div className="col-12">
                                                    <div className="p-1 bg-light rounded">
                                                        <strong>Tiền mực: </strong>
                                                        {item.lop ? (() => {
                                                            const tienMuc = Math.round(tinhTienMuc(item.lop, vatLieu));
                                                            console.log(tienMuc);

                                                            // Tìm giá mực trong vatLieu (thường có nameCode chứa "muc")
                                                            const giaMuc = vatLieu.find(item => item.nameCode && item.nameCode.includes('tienmuc'))?.price || 0;
                                                            console.log(giaMuc);

                                                            const phanTram = giaMuc > 0 ? Math.round((tienMuc / giaMuc) * 1000) : 0;
                                                            return (
                                                                <strong>{tienMuc.toLocaleString('vi-VN')} VNĐ
                                                                    <span className="text-muted"> ({phanTram} ml)</span>
                                                                </strong>
                                                            );
                                                        })() : (
                                                            <span className="text-muted">Không có thông tin</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Cột 2 */}
                                                <div className="col-12">
                                                    <div className="p-1 bg-light rounded">
                                                        <strong>Tiền hộp: </strong>
                                                        {item.lop && item.thongSoTong ? (
                                                            <strong>{Math.round(tinhTienHop(item.lop, vatLieu, item.thongSoTong)).toLocaleString('vi-VN')} VNĐ</strong>
                                                        ) : (
                                                            <span className="text-muted">Không có thông tin</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Cột 3 */}
                                                <div className="col-12">
                                                    <div className="p-1 bg-light rounded">
                                                        <strong>Tiền thùng hàng: </strong>
                                                        {item.lop && item.thongSoTong ? (
                                                            <strong>{Math.round(tinhTienThungDongHang(item.lop, vatLieu, item.thongSoTong)).toLocaleString('vi-VN')} VNĐ</strong>
                                                        ) : (
                                                            <span className="text-muted">Không có thông tin</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Cột 4 */}
                                                <div className="col-12">
                                                    <div className="p-1 bg-light rounded">
                                                        <strong>Tiền keo dán: </strong>
                                                        {item.lop && item.thongSoTong ? (
                                                            <strong>{Math.round(tinhTienKeoDan(item.lop, vatLieu, item.thongSoTong)).toLocaleString('vi-VN')} VNĐ</strong>
                                                        ) : (
                                                            <span className="text-muted">Không có thông tin</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Cột 5 */}
                                                <div className="col-12">
                                                    <div className="p-1 bg-light rounded">
                                                        <strong>Tiền băng dính: </strong>
                                                        {item.lop && item.thongSoTong ? (
                                                            <strong>{Math.round(tinhTienBangDinh(item.lop, vatLieu, item.thongSoTong)).toLocaleString('vi-VN')} VNĐ</strong>
                                                        ) : (
                                                            <span className="text-muted">Không có thông tin</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Cột 6 */}
                                                <div className="col-12">
                                                    <div className="p-1 bg-light rounded">
                                                        <strong>Tiền xốp: </strong>
                                                        {item.lop && item.thongSoTong ? (
                                                            <strong>{Math.round(tinhTienXop(item.lop, vatLieu, item.thongSoTong)).toLocaleString('vi-VN')} VNĐ</strong>
                                                        ) : (
                                                            <span className="text-muted">Không có thông tin</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Cột 7 */}
                                                <div className="col-12">
                                                    <div className="p-1 bg-light rounded">
                                                        <strong>Tiền màng bọc: </strong>
                                                        {item.lop && item.thongSoTong ? (
                                                            <strong>{Math.round(tinhTienMangBoc(item.lop, vatLieu, item.thongSoTong)).toLocaleString('vi-VN')} VNĐ</strong>
                                                        ) : (
                                                            <span className="text-muted">Không có thông tin</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Cột 8 */}
                                                <div className="col-12">
                                                    <div className="p-1 bg-light rounded">
                                                        <strong>Tiền tem nhãn: </strong>
                                                        {item.lop ? (
                                                            <strong>{Math.round(tinhTienTemNhan()).toLocaleString('vi-VN')} VNĐ</strong>
                                                        ) : (
                                                            <span className="text-muted">Không có thông tin</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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



            {/* Modal hiển thị chi tiết vật liệu */}
            {showModal && selectedItem && (
                <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">📦 Chi tiết vật liệu</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeModal}
                                    aria-label="Close"
                                    style={{ cursor: 'pointer' }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6><strong>Thông tin cơ bản:</strong></h6>
                                        <p><strong>ID:</strong> {selectedItem._id}</p>
                                        <p><strong>Tên:</strong> {selectedItem.name}</p>
                                        <p><strong>Mã:</strong> {selectedItem.nameCode}</p>
                                        <p><strong>Giá:</strong> {selectedItem.price?.toLocaleString('vi-VN')} VNĐ</p>
                                        <p><strong>Cân nặng:</strong> {selectedItem.canNang} g</p>
                                        {selectedItem.note && (
                                            <p><strong>Ghi chú:</strong> {selectedItem.note}</p>
                                        )}
                                        <p><strong>Ngày tạo:</strong> {new Date(selectedItem.dateCreate).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6><strong>Hình ảnh:</strong></h6>
                                        {selectedItem.imageUrl ? (
                                            <img
                                                src={selectedItem.imageUrl}
                                                alt={selectedItem.name}
                                                className="img-fluid rounded"
                                                style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'block';
                                                }}
                                            />
                                        ) : (
                                            <p className="text-muted">Không có hình ảnh</p>
                                        )}
                                        <p style={{ display: 'none', color: 'red' }}>Không thể tải hình ảnh</p>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}



export function tinhTienTungVatLieu(lop, giaVatLieu) {
    // Nhóm các vật liệu theo tên (không lọc bỏ custom)
    let nhomVatLieu = {};

    for (let i = 0; i < lop.length; i++) {
        let tenChatLieu = lop[i].chatLieu;
        let key = tenChatLieu;

        if (!nhomVatLieu[key]) {
            nhomVatLieu[key] = [];
        }
        nhomVatLieu[key].push(lop[i]);
    }

    let ketQua = {};

    // Tính tiền cho từng nhóm vật liệu
    for (let tenVatLieu in nhomVatLieu) {
        let tongtien = 0;
        let danhSachVatLieu = nhomVatLieu[tenVatLieu];
        let tenHienThi = tenVatLieu; // Tên để hiển thị

        for (let i = 0; i < danhSachVatLieu.length; i++) {
            let vatLieu = danhSachVatLieu[i];
            let tenChatLieu = vatLieu.chatLieu;
            let giaVatLieuItem = null;

            if (tenChatLieu.startsWith("custom")) {
                // Xử lý vật liệu custom: bỏ "custom" đi và tìm theo _id
                let customId = tenChatLieu.replace(/^custom/, "").trim();
                giaVatLieuItem = giaVatLieu.filter(item => item._id == customId)[0];
                if (!giaVatLieuItem) {
                    console.warn(`Không tìm thấy giá cho vật liệu custom: ${tenChatLieu} (ID: ${customId})`);
                    continue;
                }
                // Thay thế tên custom bằng tên thực tế
                if (i === 0) { // Chỉ thay đổi tên hiển thị một lần cho mỗi nhóm
                    tenHienThi = giaVatLieuItem.name;
                }
                // Với custom, sử dụng giá trực tiếp
                tongtien = tongtien + (+giaVatLieuItem.price);
            } else {
                // Xử lý vật liệu thông thường: tìm theo nameCode
                giaVatLieuItem = giaVatLieu.filter(item => item.nameCode == tenChatLieu)[0];
                if (!giaVatLieuItem) {
                    console.warn(`Không tìm thấy giá cho vật liệu: ${tenChatLieu}`);
                    continue;
                }

                let gia = giaVatLieuItem.price;
                gia = +gia;
                let type = tenChatLieu.slice(0, 2).toLowerCase();
                let dongia = 0;

                if (type == "mi") {
                    gia = gia / 3;
                    let chieuDai = (+vatLieu.chieuDai) * 2.54;
                    let chieuRong = (+vatLieu.chieuRong) * 2.54;
                    let width, hight;

                    if (chieuDai >= chieuRong) {
                        width = chieuDai;
                        hight = chieuRong;
                    } else {
                        width = chieuRong;
                        hight = chieuDai;
                    }

                    let slWidth = Math.floor(121 / (width + 0.2));
                    let slHight = Math.floor(81 / (hight + 0.2));
                    var vlThuaW = 121 - (slWidth * (width + 0.2));
                    var vlThuaH = 81 - (slHight * (hight + 0.2));

                    if (vlThuaW > 10) {
                        gia = gia - gia * (vlThuaW - 10) / 121;
                    }
                    if (vlThuaH > 10) {
                        gia = gia - gia * (vlThuaH - 10) / 81;
                    }
                    dongia = Math.floor(gia / (slWidth * slHight));
                } else if (type == "go") {
                    let width = (+vatLieu.chieuDai) * 2.54;
                    let hight = (+vatLieu.chieuRong) * 2.54;
                    let slWidth = Math.floor(91 / (width + 0.2));
                    let slHight = Math.floor(91 / (hight + 0.2));
                    var vlThuaW = 91 - (slWidth * (width + 0.2));
                    var vlThuaH = 91 - (slHight * (hight + 0.2));

                    if (vlThuaW > 10) {
                        gia = gia - gia * (vlThuaW - 10) / 91;
                    }
                    if (vlThuaH > 10) {
                        gia = gia - gia * (vlThuaH - 10) / 91;
                    }
                    dongia = Math.floor(gia / (slWidth * slHight));
                } else {
                    // Xử lý các loại vật liệu khác (glass, nhựa, v.v.)
                    // Sử dụng giá trực tiếp từ giaVatLieu
                    dongia = gia;
                }

                tongtien = tongtien + dongia;
            }
        }

        ketQua[tenHienThi] = {
            soLuong: danhSachVatLieu.length,
            tongTien: tongtien,
            danhSach: danhSachVatLieu,
            tenGoc: tenVatLieu // Giữ lại tên gốc để tham khảo
        };
    }

    return ketQua;
}

export function tinhTienPhuKien(danhSachPhuKien, giaPhuKien) {
    if (!danhSachPhuKien || danhSachPhuKien.length === 0) {
        return {};
    }

    // Nhóm các phụ kiện theo ID
    let nhomPhuKien = {};

    for (let i = 0; i < danhSachPhuKien.length; i++) {
        let phuKienId = danhSachPhuKien[i];
        let key = phuKienId;

        if (!nhomPhuKien[key]) {
            nhomPhuKien[key] = [];
        }
        nhomPhuKien[key].push(phuKienId);
    }

    let ketQua = {};

    // Tính tiền cho từng nhóm phụ kiện
    for (let phuKienId in nhomPhuKien) {
        let soLuong = nhomPhuKien[phuKienId].length;

        // Tìm phụ kiện trong danh sách giá
        let phuKienItem = giaPhuKien.filter(item => item._id == phuKienId)[0];
        if (!phuKienItem) {
            console.warn(`Không tìm thấy giá cho phụ kiện: ${phuKienId}`);
            continue;
        }

        let gia = +phuKienItem.price;
        let tongTien = gia * soLuong;

        ketQua[phuKienItem.name] = {
            soLuong: soLuong,
            tongTien: tongTien,
            danhSach: nhomPhuKien[phuKienId],
            tenGoc: phuKienId
        };
    }

    return ketQua;
}
