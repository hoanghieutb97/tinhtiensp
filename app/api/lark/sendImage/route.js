import { downloadImage, uploadImageToLark, sendImageMessage } from '@/lib/larkUtils';
import path from 'path';
import axios from 'axios';
import fs from 'fs';

// Hàm lấy Tenant Access Token từ Lark
async function getTenantAccessToken() {
  const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: process.env.LARK_ID,
      app_secret: process.env.LARK_SECRET,
    }),
  });

  const data = await response.json();
  if (data.code !== 0) throw new Error(`Failed to get tenant access token: ${data.msg}`);
  return data.tenant_access_token;
}

export async function POST(req) {
  const { imageUrl, chatId } = await req.json(); // Lấy URL ảnh và chat ID từ body request

  const imagePath = path.join(process.cwd(), 'public', 'downloads', 'downloaded_image.JPEG');

  try {
    // Đảm bảo thư mục 'temp' tồn tại
    // if (!fs.existsSync(path.dirname(imagePath))) {
    //   fs.mkdirSync(path.dirname(imagePath), { recursive: true });
    // }

    // Lấy Tenant Access Token
    const tenantAccessToken = await getTenantAccessToken();

    // // Tải ảnh từ URL về máy
    // await downloadImage(imageUrl, imagePath);

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:3000/api/downloadImage?url=https://res.cloudinary.com/dxrfvjrq8/image/upload/v1735179462/vatlieu/shzadd1lnhypd2qvfbsw.jpg',
      headers: {}
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });



    // Upload ảnh lên Lark để lấy image_key
    const imageKey = await uploadImageToLark(imagePath, tenantAccessToken);

    // Gửi tin nhắn có ảnh
    const result = await sendImageMessage(chatId, imageKey, tenantAccessToken);

    return new Response(JSON.stringify({ message: 'Image message sent successfully!', result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    // Xóa ảnh tạm sau khi upload
    // if (fs.existsSync(imagePath)) {
    //   fs.unlinkSync(imagePath);
    // }
  }
}
