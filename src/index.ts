import { Bot, session } from 'grammy';
import dotenv from 'dotenv';
import { MyContext, INITIAL_SESSION } from './types/session';

// Import Handlers
import navigationHandlers from './bot/handlers/navigation';
import logicHandlers from './bot/handlers/logic';
import settingsHandlers from './bot/handlers/settings';

// Import Ngôn ngữ
import { vi } from './locales/vi';
import { en } from './locales/en';

dotenv.config();

async function main() {
    const token = process.env.BOT_TOKEN;
    if (!token) throw new Error("⚠️ Chưa có BOT_TOKEN");

    const bot = new Bot<MyContext>(token);

    console.log("⏳ Đang khởi động Bot...");

    // 1. SESSION
    bot.use(session({ initial: () => JSON.parse(JSON.stringify(INITIAL_SESSION)) }));

    // 2. LOGGER (Giữ nguyên)
    bot.use(async (ctx, next) => {
        const user = ctx.from?.first_name || "Unknown";
        let content = ctx.message?.text || ctx.callbackQuery?.data || "Action";
        console.log(`📩 [${user}]: ${content} | Lang: ${ctx.session.lang}`);
        await next();
    });

    // 3. MIDDLEWARE NGÔN NGỮ (FIX LỖI TẠI ĐÂY)
    bot.use(async (ctx, next) => {
        // 👇 KHÔNG khai báo const dictionary ở đây nữa (vì nó sẽ bị cũ)
        
        // Cập nhật hàm dịch "Thông minh hơn"
        ctx.t = (key: string, params?: any) => {
            // 1. Lấy ngôn ngữ MỚI NHẤT từ session ngay lúc gọi hàm
            const currentLang = ctx.session.lang || 'en'; 
            const dict = currentLang === 'vi' ? vi : en; // Chọn từ điển tại chỗ

            // 2. Dịch
            let text = (dict as any)[key] || key;
            if (params) {
                Object.entries(params).forEach(([k, v]) => {
                    text = text.replace(`{${k}}`, String(v));
                });
            }
            return text;
        };

        // Hàm đổi ngôn ngữ
        ctx.i18n = {
            getLocale: () => ctx.session.lang || 'en',
            setLocale: (l: string) => { 
                ctx.session.lang = l; 
                console.log(`♻️ Đã đổi ngôn ngữ sang: ${l}`);
            }
        };

        await next();
    });

    // 4. HANDLERS
    bot.use(navigationHandlers);
    bot.use(settingsHandlers);
    bot.use(logicHandlers);

    // 5. START
    bot.catch((err) => console.error("❌ Error:", err));
    console.log("🚀 BOT ĐÃ SẴN SÀNG!");
    await bot.start();
}

main();