import { Composer } from 'grammy';
import { MyContext } from '../../types/session';
import { COUNTRIES } from '../../config/countries';
import * as Service from '../../services/fee.service';
import * as UI_Msg from '../../ui/user/messages';
import * as UI_Kb from '../../ui/user/keyboards';

const bot = new Composer<MyContext>();

bot.callbackQuery(/^act:(.+)$/, async (ctx) => {
    if (!ctx.session.draft) ctx.session.draft = {};
    const action = ctx.match[1] as 'BUY' | 'SELL';
    ctx.session.draft.action = action;
    ctx.session.step = 'INPUT_AMOUNT'; 
    await ctx.editMessageText(`✍️ Bạn chọn ${action}.\nVui lòng nhập số tiền:`);
    await ctx.answerCallbackQuery();
});

bot.on("message:text", async (ctx) => {
    if (ctx.session.step !== 'INPUT_AMOUNT') return;

    // 1. Kiểm tra kỹ session
    if (!ctx.session.draft || !ctx.session.draft.countryCode) {
        return ctx.reply("⚠️ Lỗi phiên. Vui lòng bấm /start lại.");
    }

    const draft = ctx.session.draft;
    
    // 2. FIX LỖI UNDEFINED: Thêm dấu "!" vào cuối draft.countryCode
    const config = COUNTRIES[draft.countryCode!]; 
    
    let rawText = ctx.message.text;
    if (draft.countryCode === 'vn') {
        rawText = rawText.replace(/\./g, '').replace(/,/g, '');
    } else {
        rawText = rawText.replace(/,/g, '');
    }
    
    const amount = parseFloat(rawText);

    // Gọi Service (Giờ đã có hàm validateAmount)
    const error = Service.validateAmount(amount, config.minAmount);
    if (error) {
        return ctx.reply(`⚠️ ${error}`);
    }

    const result = Service.calculateFee(amount, config.feePercent);
    draft.finalData = result;
    ctx.session.step = 'CONFIRM'; 

    await ctx.reply(UI_Msg.msgBillSummary(result, config.currency), {
        parse_mode: "HTML",
        reply_markup: UI_Kb.kbConfirm()
    });
});

bot.callbackQuery("cmd:confirm", async (ctx) => {
    const draft = ctx.session.draft;
    if (!draft || !draft.countryCode || !draft.finalData) {
        return ctx.editMessageText("⚠️ Lỗi dữ liệu.");
    }

    // Fix lỗi tương tự: Thêm dấu !
    const config = COUNTRIES[draft.countryCode!];

    const adminMsg = `🚨 <b>NEW ORDER</b>
User: <a href="tg://user?id=${ctx.from.id}">${ctx.from.first_name}</a>
Action: ${draft.action}
Net: ${draft.finalData.final} ${config.currency}`;

    if (config.adminGroupId) {
        try {
            await ctx.api.sendMessage(config.adminGroupId, adminMsg, { parse_mode: 'HTML' });
        } catch (e) {
            console.error("Lỗi gửi Admin:", e);
        }
    }

    await ctx.editMessageText(`✅ Đã gửi đơn!`);
    ctx.session.step = 'IDLE'; 
    ctx.session.draft = {}; 
});

bot.callbackQuery("cmd:cancel", async (ctx) => {
    await ctx.editMessageText("❌ Đã hủy.");
    ctx.session.step = 'IDLE';
});

export default bot;