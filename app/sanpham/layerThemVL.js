'use client';

import { useState, useEffect } from 'react';

export default function LayerThemVL(props) {
    const [selectedChatLieu, setSelectedChatLieu] = useState('');
    const handleChatLieuNgoai = (e) => {
        setCustomChatLieuNgoai(e.target.value);
    };

    function xoaLayer() {
        props.xoaLayer(props.stt)

    }


    function changeThongtinLop(name, value) {
        if (value == "true") value = true;
        if (value == "false") value = false;
        let item = props.item;
        

        item[name] = value
        props.changeLopCL(item, props.stt);



    }


    return (
        <>
            <div className='ggg'>
                <div>{/* vật liệu */}
                    <label htmlFor="material">Chọn vật liệu:</label>
                    <select id="material" name="material" onChange={(e) => changeThongtinLop("chatLieu", e.target.value)} value={props.item.chatLieu}>
                        <option value="mica2mm">Mica 2mm</option>
                        <option value="mica3mm">Mica 3mm</option>
                        <option value="mica4mm">Mica 4mm</option>
                        <option value="mica5mm">Mica 5mm</option>
                        <option value="mica15mm">Mica 15mm</option>
                        <option value="go3mm">Gỗ 3mm</option>
                        <option value="go5mm">Gỗ 5mm</option>
                        <option value="custom">Phôi sẵn (Tùy chỉnh)</option>
                    </select>
                    {selectedChatLieu === 'custom' && (
                        <input
                            type="text"
                            placeholder="Nhập vật liệu tùy chỉnh"
                            value={props.item.chatLieu}
                            onChange={handleChatLieuNgoai}
                        />
                    )}
                </div>

                {/* Chiều dài */}

                <div className="kvsvlsvlffs">
                    <label htmlFor="chieudai" className="kvsvfflsvlffs">
                        Chiều dài:
                    </label>
                    <input
                        id="chieudai"
                        type="number"
                        value={props.item.chieuDai || ''}
                        onChange={(e) => changeThongtinLop("chieuDai", e.target.value)}
                        placeholder="Nhập chiều dài"
                        className="kvdsvvffvvlsvlffs"

                    />
                </div>

                {/* chiều rộng */}
                <div className="kvsvlsvlffs">
                    <label htmlFor="chieurong" className="kvsvfflsvlffs">
                        Chiều rộng:
                    </label>
                    <input
                        id="chieurong"
                        type="number"
                        value={props.item.chieuRong || ''}
                        onChange={(e) => changeThongtinLop("chieuRong", e.target.value)}
                        placeholder="Nhập chiều rộng"
                        className="kvdsvvffvvlsvlffs"

                    />
                </div>



                {/* số mặt */}
                <div className="kvsvlsvls">
                    <label htmlFor="numFaces" className="kvsvvfflsvlffs">
                        Số mặt in:
                    </label>
                    <select
                        id="numFaces"
                        name="numFaces"
                        value={props.item.soMatIn}
                        onChange={(e) => changeThongtinLop("soMatIn", e.target.value)}
                        className="kvsvvffvvlsvlffs"
                    >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value={false}>không in</option>
                    </select>
                </div>


                {/* có cắt không */}
                <div className="kvsvlsvls">
                    <label htmlFor="numFaces" className="kvsvvfflsvlffs">
                        Có cắt không
                    </label>
                    <select
                        id="numFaces"
                        name="numFaces"
                        value={props.item.catStatus}
                        onChange={(e) => changeThongtinLop("catStatus", e.target.value)}
                        className="kvsvvffvvlsvlffs"
                    >
                        <option value={true}>có</option>
                        <option value={false}>không</option>

                    </select>
                </div>


                {/* có khắc không */}
                <div className="kvsvlsvls">
                    <label htmlFor="numFaces" className="kvsvvfflsvlffs">
                        Có khắc không
                    </label>
                    <select
                        id="numFaces"
                        name="numFaces"
                        value={props.item.khacStatus}
                        onChange={(e) => changeThongtinLop("khacStatus", e.target.value)}
                        className="kvsvvffvvlsvlffs"
                    >
                        <option value={true}>có</option>
                        <option value={false}>không</option>

                    </select>
                </div>


                <button
                    className="btn btn-primary"
                    onClick={xoaLayer}
                >
                    Xóa
                </button>




            </div>
        </>



    );
}
