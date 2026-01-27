import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
    BOT_TOKEN: process.env.BOT_TOKEN || "",
};

if (!ENV.BOT_TOKEN) {
    console.error("❌ LỖI NGHIÊM TRỌNG: Không tìm thấy BOT_TOKEN trong file .env");
    process.exit(1); 
}