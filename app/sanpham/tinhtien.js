
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
        let gia = giaVatLieu.filter(item => item.name == lop[i].chatLieu)[0].price;
        gia = +gia;
        let type = lop[i].chatLieu.slice(0, 2).toLowerCase();
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

        let chatLieu = lop[i].chatLieu;

        console.log(chatLieu);

        let soMatIn = (lop[i].soMatIn != "false") ? lop[i].soMatIn : 0;
        let tienin = 0
        let chieuDai = (+ lop[i].chieuDai);
        let chieuRong = (+lop[i].chieuRong);
        let maxLength = chieuDai * chieuRong;
        if (maxLength <= 25) tienin = tienCongPhut * 3
        else if (maxLength <= 400) tienin = ((maxLength / 25) * tienCongPhut * 0.8) + (tienCongPhut * 3);
        else tienin = ((maxLength / 25) * tienCongPhut * 0.6) + (tienCongPhut * 3);
        tienin = (lop[i].catStatus == true ? 1 : 0) * tienin
        tongtien = tongtien + tienin;
        if (chatLieu.slice(-3) == "3mm") tongtien = tongtien * 1
        else if (chatLieu.slice(-3) == "5mm") tongtien = tongtien * 1.5
    }
    return tongtien
}