import { Composer } from 'grammy';
import { MyContext } from '../../types/session';
import { COUNTRIES } from '../../config/countries';
import * as UI from '../../ui/user/keyboards';

const bot = new Composer<MyContext>();

// 1. Khi bấm nút "⚙️ Cài đặt / Ngôn ngữ"
bot.callbackQuery("settings:lang", async (ctx) => {
    // Hiện bảng chọn ngôn ngữ (Tiếng Việt / English)
    await ctx.editMessageText("🌐 Select Language / Chọn Ngôn ngữ:", {
        reply_markup: UI.kbLanguage() 
    });
    await ctx.answerCallbackQuery();
});

// 2. Khi người dùng chọn ngôn ngữ (lang:vi hoặc lang:en)
bot.callbackQuery(/^lang:(.+)$/, async (ctx) => {
    const newLang = ctx.match[1]; // Lấy mã 'vi' hoặc 'en'
    
    // 🔥 LỆNH QUAN TRỌNG: Đổi ngôn ngữ lập tức
    await ctx.i18n.setLocale(newLang); 

    // Lấy thông tin coin hiện tại để vẽ lại Menu chính
    const draft = ctx.session.draft;
    const countryCode = draft.countryCode || 'vn'; 
    const config = COUNTRIES[countryCode];

    // Thông báo nhỏ (Toast message)
    const toast = newLang === 'vi' ? "✅ Đã chuyển sang Tiếng Việt" : "✅ Switched to English";
    await ctx.answerCallbackQuery(toast);

    // Quay về màn hình chính với giao diện mới
    await ctx.editMessageText(ctx.t('welcome_back'), {
        reply_markup: UI.kbMainMenu(ctx, config.rateId)
    });
});

// 3. Nút Quay lại màn hình chính
bot.callbackQuery("cmd:back_main", async (ctx) => {
    const draft = ctx.session.draft;
    const countryCode = draft.countryCode || 'vn';
    const config = COUNTRIES[countryCode];

    await ctx.editMessageText(ctx.t('welcome_back'), {
        reply_markup: UI.kbMainMenu(ctx, config.rateId)
    });
});

export default bot;