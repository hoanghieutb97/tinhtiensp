import fetch from 'node-fetch';
import fs from 'fs';
import axios from 'axios';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';


const streamPipeline = promisify(pipeline);

export async function downloadImage(url, filePath) {

    try {

        // Đường dẫn lưu ảnh
        const filePath = path.join(process.cwd(), 'public', 'downloaded_image.JPEG');

        // Tạo thư mục nếu chưa tồn tại
        if (!fs.existsSync(path.dirname(filePath))) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
        }

        // Tải ảnh về và lưu
        const response = await axios({
            url: imageUrl,
            method: 'GET',
            responseType: 'stream',
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        // Đợi ghi file hoàn tất
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

    } catch (error) {
        console.error('Error downloading image:', error);

    }






    // try {
    //     const response = await axios({
    //         url,
    //         method: 'GET',
    //         responseType: 'stream', // Để nhận dữ liệu dưới dạng stream
    //     });

    //     const writer = fs.createWriteStream(filePath);

    //     // Ghi dữ liệu từ stream vào file
    //     response.data.pipe(writer);

    //     // Đợi ghi file hoàn tất
    //     return new Promise((resolve, reject) => {
    //         writer.on('finish', resolve);
    //         writer.on('error', reject);
    //     });
    // } catch (error) {
    //     console.error('Error downloading image:', error);

    // }
}

export async function uploadImageToLark(filePath, tenantAccessToken) {


    const formData = new FormData();
    formData.append('image', fs.createReadStream(filePath));
    formData.append('image_type', 'message');
    console.log("formData.....", formData);

    const response = await fetch('https://open.feishu.cn/open-apis/im/v1/images', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${tenantAccessToken}`,
        },
        body: formData,
    });

    const data = await response.json();
    console.log("data....", data);

    if (data.code !== 0) throw new Error(`Failed to upload image: ${data.msg}`);
    return data.data.image_key;
}

// Hàm gửi tin nhắn có ảnh
export async function sendImageMessage(chatId, imageKey, tenantAccessToken) {
    const response = await fetch(`https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=chat_id`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${tenantAccessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            receive_id: chatId,
            msg_type: 'image',
            content: {
                image_key: imageKey,
            },
        }),
    });

    const data = await response.json();
    if (data.code !== 0) throw new Error(`Failed to send message: ${data.msg}`);
    return data;
}
