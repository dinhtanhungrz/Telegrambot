import { Composer } from 'grammy';
import { MyContext } from '../../types/session';
import { COUNTRIES } from '../../config/countries';
import * as UI from '../../ui/user/keyboards';

const bot = new Composer<MyContext>();

// 👇 1. XỬ LÝ LỆNH /CANCEL (Thêm đoạn này)
bot.command("cancel", async (ctx) => {
    // Xóa session, reset về trạng thái ban đầu
    ctx.session.step = 'IDLE';
    ctx.session.draft = {};
    
    await ctx.reply("❌ Đã hủy giao dịch. Bấm /start để bắt đầu lại.", {
        reply_markup: { remove_keyboard: true }
    });
});

// 👇 2. XỬ LÝ LỆNH /START
bot.command("start", async (ctx) => {
    ctx.session.step = 'IDLE';
    ctx.session.draft = {}; 
    await ctx.reply(ctx.t('welcome'), { reply_markup: UI.kbSelectCountry() });
});

// Xử lý chọn Quốc gia
bot.callbackQuery(/^country:(.+)$/, async (ctx) => {
    const code = ctx.match[1];
    const config = COUNTRIES[code];

    ctx.session.draft.countryCode = code as any;
    if (ctx.i18n && config.lang) ctx.i18n.setLocale(config.lang);

    await ctx.editMessageText(ctx.t('welcome'), {
        reply_markup: UI.kbMainMenu(ctx, config.rateId)
    });
});

// Nút Back
bot.callbackQuery("cmd:back_country", async (ctx) => {
    ctx.session.step = 'IDLE';
    await ctx.editMessageText(ctx.t('welcome'), { reply_markup: UI.kbSelectCountry() });
});

export default bot;