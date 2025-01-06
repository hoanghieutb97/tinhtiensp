
export function macdinh(lop, giaVatLieu) {
    let tongtien = 0;
    let gia = giaVatLieu.filter(item => item.name == lop[i].chatLieu)[0].price;
    for (let i = 0; i < lop.length; i++) {

    }
    return tongtien
}

export function tinhTienVatLieu(lop, giaVatLieu) {
    let tongtien = 0;
    for (let i = 0; i < lop.length; i++) {
        let tenChatLieu = lop[i].chatLieu;
        if (tenChatLieu.startsWith("custom")) {
            tenChatLieu = tenChatLieu.replace(/^custom/, "").trim();
            return Math.floor(giaVatLieu.filter(item => item.name == tenChatLieu)[0].price);
        }


        let gia = giaVatLieu.filter(item => item.name == tenChatLieu)[0].price;


        gia = +gia;
        let type = tenChatLieu.slice(0, 2).toLowerCase();
        let dongia = 0
        if (type == "mi") {
            gia = gia / 3


            let chieuDai = (+ lop[i].chieuDai) * 2.54;
            let chieuRong = (+lop[i].chieuRong) * 2.54;
            let width, hight;
            if (chieuDai >= chieuRong) {
                width = chieuDai; // Chiều dài hơn hoặc bằng
                hight = chieuRong;
            } else {
                width = chieuRong; // Chiều rộng hơn
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




        }
        else if (type = "go") {

            let width = (+ lop[i].chieuDai) * 2.54;
            let hight = (+lop[i].chieuRong) * 2.54;



            let slWidth = Math.floor(91 / (width + 0.2));
            let slHight = Math.floor(91 / (hight + 0.2));
            var vlThuaW = 91 - (slWidth * (width + 0.2));
            var vlThuaH = 91 - (slHight * (hight + 0.2));
            console.log(vlThuaW, vlThuaH);


            if (vlThuaW > 10) {
                gia = gia - gia * (vlThuaW - 10) / 91;
            }


            if (vlThuaH > 10) {
                gia = gia - gia * (vlThuaH - 10) / 91;
            }


            dongia = Math.floor(gia / (slWidth * slHight));



        }
        tongtien = tongtien + dongia
        // console.log(dongia);
        // console.log(giaVatLieu);


    }


    return tongtien
}


export function tinhTienMuc(lop, giaVatLieu) {
    let tongtien = 0;
    let muc = giaVatLieu.filter(item => item.name == "tienmuc")[0].price;
    let mucM2 = muc / 30;



    for (let i = 0; i < lop.length; i++) {
        let soMatIn = (lop[i].soMatIn != "false") ? lop[i].soMatIn : 0;
        let chieuDai = (+ lop[i].chieuDai) * 2.54;
        let chieuRong = (+lop[i].chieuRong) * 2.54;
        let tienmuc = soMatIn * (chieuDai * chieuRong) * mucM2 / 10000;
        tongtien = tongtien + tienmuc
    }
    return tongtien
}

export function tinhTienTK(lop, giaVatLieu) {

    let tongtien = 2500 + ((lop.length == 0) ? 0 : (lop.length - 1)) * 1000;

    return tongtien
}
export function tinhTienIn(lop, giaVatLieu) {
    let tongtien = 0;
    let gia = giaVatLieu.filter(item => item.name == "luongcongnhan")[0].price;
    let tienCongPhut = gia / (24 * 8 * 60);


    for (let i = 0; i < lop.length; i++) {
        let soMatIn = (lop[i].soMatIn != "false") ? lop[i].soMatIn : 0;
        let tienin = 0
        let chieuDai = (+ lop[i].chieuDai);
        let chieuRong = (+lop[i].chieuRong);
        let maxLength = chieuDai * chieuRong;
        if (maxLength <= 25) tienin = tienCongPhut * 4
        else if (maxLength <= 400) tienin = ((maxLength / 25) * tienCongPhut * 1) + (tienCongPhut * 4);
        else tienin = ((maxLength / 25) * tienCongPhut * 0.8) + (tienCongPhut * 4);
        tienin = (soMatIn == 2 ? 1.5 : soMatIn) * tienin
        tongtien = tongtien + tienin
    }
    return tongtien
}
export function tinhTienCat(lop, giaVatLieu) {
    let tongtien = 0;
    let gia = giaVatLieu.filter(item => item.name == "luongcongnhan")[0].price;
    let tienCongPhut = gia / (24 * 8 * 60);
    for (let i = 0; i < lop.length; i++) {
        let heSoNhan = 2;
        let chatLieu = lop[i].chatLieu;



        let soMatIn = (lop[i].soMatIn != "false") ? lop[i].soMatIn : 0;
        let tienin = 0
        let chieuDai = (+ lop[i].chieuDai);
        let chieuRong = (+lop[i].chieuRong);
        let maxLength = chieuDai * chieuRong;
        if (maxLength <= 25) tienin = tienCongPhut * heSoNhan
        else if (maxLength <= 400) tienin = ((maxLength / 25) * tienCongPhut * 0.8) + (tienCongPhut * heSoNhan);
        else tienin = ((maxLength / 25) * tienCongPhut * 0.5) + (tienCongPhut * heSoNhan);
        tienin = (lop[i].catStatus == true ? 1 : 0) * tienin
        tongtien = tongtien + tienin;
        if (chatLieu.slice(-3) == "3mm") tongtien = tongtien * 1
        else if (chatLieu.slice(-4) == "15mm") tongtien = tongtien * 6.5
        else if (chatLieu.slice(-3) == "2mm") tongtien = tongtien * 0.9
        else if (chatLieu.slice(-3) == "4mm") tongtien = tongtien * 1.2
        else if (chatLieu.slice(-3) == "5mm") tongtien = tongtien * 1.5

    }
    return tongtien
}

export function tinhTienDIen(lop, giaVatLieu) {
    let tienIn = tinhTienIn(lop, giaVatLieu);
    let tienCat = tinhTienCat(lop, giaVatLieu);

    let tongtien = (tienIn + tienCat) / 5;

    return tongtien
}

export function tinhTienChietKhau(lop, giaVatLieu) {
    let tongtien = 0;
    let heSo = 1000;
    for (let i = 0; i < lop.length; i++) {
        let downTien = 0;
        let chieuDai = (+ lop[i].chieuDai);
        let chieuRong = (+lop[i].chieuRong);
        let maxLength = chieuDai * chieuRong;
        if (maxLength <= 25) downTien = heSo;
        else if (maxLength <= 400) downTien = heSo * 1.5;
        else downTien = heSo * 2.5;


        tongtien = tongtien + downTien;
    }

    return tongtien
}

export function tinhTienHop(lop, giaVatLieu, thongSoTong) {
    let tongtien = 0
    let maxW = + thongSoTong.chieuDoc;
    let maxH = +thongSoTong.chieuNgang;
    let maxZ = + thongSoTong.doCao;


    tongtien = ((maxW + maxZ * 4 + 3) * (maxZ * 4 + maxH * 2 + 3) / (100 * 100)) * 9000 * 1.2





    return tongtien
}
export function tinhTienThungDongHang(lop, giaVatLieu, thongSoTong) {


    let tienThung = (giaVatLieu.length == 0) ? 0 : + giaVatLieu.filter(item => item.name == "thungdonghang505050")[0].price;


    let tongtien = 0
    function calculateBoxesInContainer(containerDimensions, boxDimensions) {
        let { length: L_thung, width: W_thung, height: H_thung } = containerDimensions;
        let { length: a, width: b, height: z } = boxDimensions;

        // Số lượng hộp theo từng chiều
        let n_x = Math.floor(L_thung / a);
        let n_y = Math.floor(W_thung / b);
        let n_z = Math.floor(H_thung / z);

        // Tổng số hộp
        return n_x * n_y * n_z;
    }

    // Ví dụ: Kích thước thùng và hộp
    let container = { length: 50, width: 50, height: 50 }; // Thùng 50x50x50 cm
    let box = { length: thongSoTong.chieuDoc, width: thongSoTong.chieuDoc, height: thongSoTong.doCao };       // Hộp 10x20x15 cm
    let totalBoxes = calculateBoxesInContainer(container, box);



    tongtien = Math.floor(tienThung / totalBoxes)



    if (tongtien == Infinity) return 0
    return tongtien
}
export function tinhTienKeoDan(lop, giaVatLieu, thongSoTong) {
    var heso = 1;


    for (let i = 0; i < lop.length; i++) {

        let chieuDai = (+ lop[i].chieuDai);
        let chieuRong = (+lop[i].chieuRong);
        let maxLength = chieuDai * chieuRong;


        heso = maxLength / 16

    }

    let tongtien = heso * ((lop.length > 1) ? ((lop.length - 1) * 150) : 0);



    return tongtien
}

export function tinhTienBangDinh(lop, giaVatLieu, thongSoTong) {



    let maxW = + thongSoTong.chieuDoc;
    let maxH = +thongSoTong.chieuNgang;

    let dientich = 2 * (maxW + maxH)
    let heso = dientich / 16
    let tongtien = heso * 50;




    return tongtien
}

export function tinhTienXop(lop, giaVatLieu, thongSoTong) {
    let activeXop = thongSoTong.xop;


    let giaVL = (giaVatLieu.length != 0) ? Math.floor(giaVatLieu.filter(item => item.name == activeXop)[0].price) : 0;


    let tongtien = 0;
    let giaXopM2 = 0;
    switch (activeXop) {
        case "xop3mm":
            giaXopM2 = giaVL / (120 * 10000);
            break;
        case "xop5mm":
            giaXopM2 = giaVL / (120 * 10000);
            break;
        case "xop10mm":
            giaXopM2 = giaVL / (120 * 5000);
            break;
        case "xop20mm":
            giaXopM2 = giaVL / (120 * 2500);
            break;
        case "xopno":
            giaXopM2 = giaVL / (100 * 5000);
            break;
        case "xopmong":
            giaXopM2 = giaVL / (140 * 60000);
            break;


        default:
            break;
    }
    tongtien = Math.floor(2.5 * giaXopM2 * ((+ thongSoTong.chieuDoc) * (+thongSoTong.chieuNgang)));


    return tongtien
}

export function tinhTienMangBoc(lop, giaVatLieu, thongSoTong) {
    let activeXop = thongSoTong.xop;


    let giaVL = (giaVatLieu.length != 0) ? Math.floor(giaVatLieu.filter(item => item.name == activeXop)[0].price) : 0;


    let tongtien = 0;
    let giaXopM2 = 0.5;

    tongtien = Math.floor(2.5 * giaXopM2 * ((+ thongSoTong.chieuDoc) + (+thongSoTong.chieuNgang)));

    return tongtien
}