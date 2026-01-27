import { Composer } from 'grammy';
import { MyContext } from '../../types/session';
import { COUNTRIES } from '../../config/countries';
import * as UI from '../../ui/user/keyboards'; // Import UI tách biệt

const bot = new Composer<MyContext>();

// Xử lý lệnh /start
bot.command("start", async (ctx) => {
    ctx.session.step = 'SELECT_COUNTRY';
    await ctx.reply("Chào mừng! Vui lòng chọn quốc gia:", {
        reply_markup: UI.kbSelectCountry() // Gọi UI
    });
});

// Xử lý chọn Nước
bot.callbackQuery(/^country:(.+)$/, async (ctx) => {
    const code = ctx.match[1] as 'vn' | 'us';
    const config = COUNTRIES[code];
    
    // Update Session
    ctx.session.draft.countryCode = code;
    ctx.session.step = 'SELECT_ACTION';

    // Update View
    await ctx.editMessageText(`Bạn đã chọn: ${config.name}\nBạn muốn làm gì?`, {
        reply_markup: UI.kbSelectAction(config.rateId) // Gọi UI
    });
});

export default bot;