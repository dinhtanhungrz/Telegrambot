import { Bot, session } from "grammy";
import { limit } from "@grammyjs/ratelimiter"; // Thư viện chống Spam
import fs from "fs"; // Thư viện ghi file Log
import { router } from "./bot/router";
import { Handlers } from "./bot/handlers";
import { INITIAL_SESSION, MyContext } from "./types/session";
import { ENV } from "./config/env";

async function bootstrap() {
    // Khởi tạo Bot
    const bot = new Bot<MyContext>(ENV.BOT_TOKEN);

    // 1. 🧠 CÀI ĐẶT BỘ NHỚ (Session)
    bot.use(session({
        initial: () => ({ ...INITIAL_SESSION }),
    }));

    // 2. 🛡️ CÀI ĐẶT CHỐNG SPAM (Rate Limiter)
    // Giới hạn: 1 người chỉ được gửi 3 tin trong 2 giây
    bot.use(limit({
        timeFrame: 2000, 
        limit: 3,
        onLimitExceeded: async (ctx) => {
            // Chỉ cảnh báo nếu là chat riêng, trong nhóm admin thì thôi cho đỡ rác
            if (ctx.chat?.type === 'private') {
                await ctx.reply("⚠️ Bạn thao tác quá nhanh! Vui lòng chậm lại.");
            }
        },
        keyGenerator: (ctx) => ctx.from?.id.toString(), // Chặn theo ID người dùng
    }));

    // 3. 👮 CỔNG AN NINH (Phân quyền User/Admin)
    bot.use(async (ctx, next) => {
        const chatType = ctx.chat?.type;
        const chatId = ctx.chat?.id.toString();

        // A. Chat riêng (Khách mua hàng) -> CHO QUA
        if (chatType === 'private') {
            await next(); 
            return;
        }

        // B. Nhóm Admin (Quản lý) -> CHO QUA
        if (chatId === ENV.ADMIN_GROUP_ID) {
            await next();
            return;
        }

        // C. Nhóm lạ -> LỜ ĐI (Không trả lời)
        return;
    });

    // 4. ĐĂNG KÝ CÁC LỆNH
    bot.command("start", Handlers.onStart);
    bot.command("help", Handlers.onHelp);
    bot.command("cancel", Handlers.onCancel);

    // Lệnh test bot còn sống không (Chỉ Admin dùng)
    bot.command("ping", async (ctx) => {
        await ctx.reply(`⚡ Bot đang hoạt động tốt!`);
    });

    // 5. KÍCH HOẠT LUỒNG MUA BÁN (Router)
    bot.use(router);

    // 6. 📝 XỬ LÝ LỖI & GHI LOG (Anti-Crash)
    bot.catch((err) => {
        const ctx = err.ctx;
        const date = new Date().toLocaleString("vi-VN");
        const errorMsg = `[${date}] Lỗi tại update ID ${ctx.update.update_id}:`;
        
        // In ra màn hình console để xem ngay
        console.error(errorMsg, err.error);

        // Ghi vào file 'error.log' để lưu bằng chứng
        // (Nếu file chưa có nó tự tạo, nếu có rồi nó ghi nối tiếp)
        try {
            fs.appendFileSync("error.log", `${errorMsg} ${err.error}\n----------------\n`);
        } catch (e) {
            console.error("Không thể ghi file log:", e);
        }
    });

    // KHỞI ĐỘNG
    console.log("---------------------------------------");
    console.log("🚀 BOT ĐÃ KHỞI ĐỘNG THÀNH CÔNG!");
    console.log(`🛡️ Chế độ bảo vệ: BẬT (Rate Limit 3/2s)`);
    console.log(`📝 Ghi log lỗi: BẬT (error.log)`);
    console.log(`📡 Đang trực tại nhóm Admin: ${ENV.ADMIN_GROUP_ID}`);
    console.log("---------------------------------------");
    
    await bot.start();
}

bootstrap();