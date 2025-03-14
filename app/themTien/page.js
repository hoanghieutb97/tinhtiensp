'use client';

import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { getItemsByQuery, fetchPhuKien, fetchVatLieu, get_ShipingCost, putSanPham } from "@/lib/utils";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import copy from 'copy-to-clipboard';
export default function UploadPage() {
  const [jsonData, setJsonData] = useState([]);
  const [error, setError] = useState(null);
  const [activeItems, setactiveItems] = useState([]);
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading
  const [query, setQuery] = useState("");
  const [activeKey, setactiveKey] = useState(0);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) {
        setError('File không hợp lệ. Vui lòng chọn file .xls hoặc .xlsx.');
        return;
      }
      setError(null);

      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          setJsonData(json);
        } catch (err) {
          setError('Lỗi khi xử lý file. Vui lòng thử lại.');
          console.error('Error parsing file:', err);
        }
      };

      reader.readAsArrayBuffer(file);
    },
  });

  const [ItemSuaVip, setItemSuaVip] = useState([]);
  const [ItemSuaVariant, setItemSuaVariant] = useState([]);
  useEffect(() => {
    fetchSanPham();
  }, []);

  var fetchSanPham = async () => {
    setLoading(true); // Bắt đầu trạng thái loading
    await getItemsAll("sanpham");
    setLoading(false); // Bắt đầu trạng thái loading

  }
  async function getItemsAll(param) {
    setLoading(true); // Bắt đầu trạng thái loading
    let items = await getItemsByQuery("/" + param, "");
    setactiveItems(items);
    console.log(items);

    setQuery("")
    setLoading(false); // Bắt đầu trạng thái loading

  }

  if (jsonData.length > 0 && activeItems.length > 0) {
    let itemsAPP = [...activeItems]
    let arrLoc = [];
    let items_Map_Vip = [] // items khớp nhưng không trùng vip

    let items_Map_Variant = [] // items khớp variant
    let items_False_Variant = [] // items khớp variant

    for (let i = 0; i < activeItems.length; i++) {
      arrLoc = jsonData.filter(item => {
        return activeItems[i].thongSoTong.product.trim().toLowerCase() == item.ProductName.trim().toLowerCase()
      })
      let canMatch = false;

      for (let k = 0; k < arrLoc.length; k++) {

        if (isMatch(arrLoc[k].Variant.trim().toLowerCase(), activeItems[i].thongSoTong.variant.trim().toLowerCase())) {
          canMatch = true;
          let itemABC = { ...activeItems[i] };
          items_Map_Variant.push({ ...activeItems[i] })
          if (itemABC.thongSoTong.vipChot == undefined) itemABC.thongSoTong.vipChot = [0, 0, 0, 0, 0]

          if (!(itemABC.thongSoTong.vipChot[0] == arrLoc[k].VIP1 && itemABC.thongSoTong.vipChot[3] == arrLoc[k].VIP4)) {

            itemABC.thongSoTong.vipChot = [arrLoc[k].VIP1, arrLoc[k].VIP2, arrLoc[k].VIP3, arrLoc[k].VIP4, 0];
            items_Map_Vip.push(itemABC);
          }
          break;

        }

      }
      if (canMatch == false) items_False_Variant.push(activeItems[i])

    }

    if (items_False_Variant.length != ItemSuaVariant.length) setItemSuaVariant(items_False_Variant);
    if (items_Map_Vip.length != ItemSuaVip.length) setItemSuaVip(items_Map_Vip);

    console.log(items_False_Variant);
    console.log(items_Map_Vip);



  }
  async function suaVIpApp() {
    for (let i = 0; i < ItemSuaVip.length; i++) {
      let DataPost = {
        thongSoTong: ItemSuaVip[i].thongSoTong,
        lop: ItemSuaVip[i].lop,
        name: ItemSuaVip[i].name,
        namecode: ItemSuaVip[i].namecode
      }
      let xxx = await putSanPham(ItemSuaVip[i]._id, DataPost);
      console.log(xxx);


    }

  }

  function isMatch(Ap, Ex) {


    // Chuyển đổi dấu * trong B thành một phần regex phù hợp
    let pattern = Ex.replace(/\*/g, ".*");

    // Tạo biểu thức chính quy với pattern đã thay đổi
    let regex = new RegExp(`^${pattern}$`, "i");

    return regex.test(Ap);
  }

  function hangClickItem(params, index) {
    copy(params);
    setactiveKey(index);
  }
  return (
    <>
      <div className="p-6 flex flex-col items-center gap-4">
        <div {...getRootProps()} className="border-dashed border-2 p-6 cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
          <input {...getInputProps()} />
          <p className="text-gray-600">Kéo & thả file Excel vào đây hoặc nhấp để chọn file</p>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <h4 className="khongtrungvp">khớp variant- sai VI {ItemSuaVip.length}</h4>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Product</strong></TableCell>
              <TableCell><strong>Variant</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ItemSuaVip.map((item, index) => (
              <TableRow key={index} hover className={index == activeKey ? "activekety" : ""}>
                <TableCell onClick={() => hangClickItem(item.thongSoTong.product, index)}>{item.thongSoTong.product}</TableCell>
                <TableCell onClick={() => hangClickItem(item.thongSoTong.variant, index)}>{item.thongSoTong.variant}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <button onClick={suaVIpApp}> sửa VIP trên app </button>

      <hr />
      <hr />
      <hr />
      <h4 className="khongtrungvp">sai Variant trên app tính tiền  {ItemSuaVariant.length}</h4>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Product</strong></TableCell>
              <TableCell><strong>Variant</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ItemSuaVariant.map((item, index) => (
              <TableRow key={index} hover className={index == activeKey ? "activekety" : ""}>
                <TableCell onClick={() => hangClickItem(item.thongSoTong.product, index)}>{item.thongSoTong.product}</TableCell>
                <TableCell onClick={() => hangClickItem(item.thongSoTong.variant, index)}>{item.thongSoTong.variant}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
