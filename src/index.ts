import { Bot, session } from 'grammy';
import dotenv from 'dotenv';
import { MyContext, INITIAL_SESSION } from './types/session';

// Import handlers
import navigationHandlers from './bot/handlers/navigation';
import logicHandlers from './bot/handlers/logic';

dotenv.config();

async function main() {
    const token = process.env.BOT_TOKEN;
    if (!token) throw new Error("⚠️ Chưa có BOT_TOKEN");

    const bot = new Bot<MyContext>(token);

    // 1. CÀI ĐẶT SESSION (QUAN TRỌNG NHẤT - PHẢI ĐỨNG ĐẦU)
    bot.use(session({ 
        initial: () => JSON.parse(JSON.stringify(INITIAL_SESSION)) 
    }));

    // 2. LOGGER TRẠNG THÁI (Để bạn debug lỗi)
    bot.use(async (ctx, next) => {
        const user = ctx.from?.first_name || "User";
        const step = ctx.session?.step || "No Session";
        const text = ctx.message?.text || ctx.callbackQuery?.data || "Action";
        
        console.log(`------------------------------------------------`);
        console.log(`👤 [${user}] đang ở bước: [${step}]`);
        console.log(`📩 Gửi nội dung: "${text}"`);
        
        await next(); // Cho phép chạy tiếp xuống dưới
        
        // Log trạng thái mới sau khi xử lý xong
        console.log(`👉 Trạng thái mới: [${ctx.session.step}]`);
    });

    // 3. ĐĂNG KÝ HANDLER (Điều hướng chạy trước -> Logic chạy sau)
    bot.use(navigationHandlers);
    bot.use(logicHandlers);

    // 4. Xử lý lỗi
    bot.catch((err) => {
        console.error("❌ Lỗi hệ thống:", err);
    });

    console.log("🚀 Bot đã sẵn sàng! Đang chờ tin nhắn...");
    await bot.start();
}

main();