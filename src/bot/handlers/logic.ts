import { Composer } from 'grammy';
import { MyContext } from '../../types/session';
import { COUNTRIES } from '../../config/countries';
import * as Service from '../../services/fee.service';
import * as UI_Msg from '../../ui/user/messages';
import * as UI_Kb from '../../ui/user/keyboards';

// 👇 Dòng này quan trọng: Khởi tạo Bot để không bị lỗi "Cannot find name 'bot'"
const bot = new Composer<MyContext>();

// 1. Nhận lệnh Trade
bot.callbackQuery(/^trade:(.+)$/, async (ctx) => {
    if (!ctx.session.draft) ctx.session.draft = {};
    if (!ctx.session.draft.countryCode) ctx.session.draft.countryCode = 'vn'; // Mặc định VN nếu lỗi

    ctx.session.draft.action = ctx.match[1] as any;
    ctx.session.step = 'INPUT_AMOUNT';

    await ctx.editMessageText(
        `${ctx.t('ask_amount_title', { action: ctx.match[1] })}\n` +
        `${ctx.t('ask_amount_desc')}\n\n` + 
        `👇 <b>${ctx.t('ask_amount_manual')}</b>`,
        {
            parse_mode: 'HTML',
            reply_markup: UI_Kb.kbAmountSuggestion(ctx)
        }
    );
    await ctx.answerCallbackQuery();
});

// 2. Xử lý bấm nút tiền (Fix lỗi Amount too low)
bot.callbackQuery(/^amt:(.+)$/, async (ctx) => {
    const val = parseFloat(ctx.match[1]);

    // Safety check: Khôi phục session nếu mất
    if (!ctx.session.draft) ctx.session.draft = { countryCode: 'vn' };
    if (!ctx.session.draft.countryCode) ctx.session.draft.countryCode = 'vn';

    // Gọi hàm xử lý
    await processInput(ctx, val);
    await ctx.answerCallbackQuery();
});

// 3. Xử lý nhập tay
bot.on("message:text", async (ctx) => {
    // Nếu là lệnh /cancel hoặc /start thì bỏ qua để file khác xử lý
    if (ctx.message.text.startsWith('/')) return;

    if (ctx.session.step !== 'INPUT_AMOUNT') {
         // Nếu chưa chọn Mua/Bán mà nhập số thì nhắc nhở
         if (!isNaN(parseFloat(ctx.message.text))) {
            return ctx.reply("⚠️ Vui lòng chọn Mua hoặc Bán trước!");
         }
         return;
    }

    let raw = ctx.message.text.replace(/,/g, '');
    if (ctx.session.draft?.countryCode === 'vn') {
        raw = raw.replace(/\./g, '').replace(/,/g, '');
    }
    
    const amount = parseFloat(raw);
    if (isNaN(amount)) return ctx.reply("⚠️ Vui lòng nhập số hợp lệ.");

    await processInput(ctx, amount);
});

// --- Hàm Logic Chung ---
async function processInput(ctx: MyContext, amount: number) {
    const draft = ctx.session.draft;
    const config = COUNTRIES[draft.countryCode || 'vn'];

    // Kiểm tra Min/Max
    const err = Service.validateAmount(amount, config.minAmount);
    
    if (err) {
        // Nếu lỗi, hiện thông báo Pop-up (Alert) thay vì chat
        if (ctx.callbackQuery) {
            return ctx.answerCallbackQuery({
                text: ctx.t('error_min', { min: config.minAmount }),
                show_alert: true 
            });
        } else {
            return ctx.reply(ctx.t('error_min', { min: config.minAmount }));
        }
    }

    // Tính toán
    const res = Service.calculateFee(amount, config.feePercent);
    draft.finalData = res;
    ctx.session.step = 'CONFIRM';

    // Hiện kết quả
    const msg = UI_Msg.getBillTemplate(ctx, config, res);
    const kb = { parse_mode: 'HTML', reply_markup: UI_Kb.kbConfirm(ctx) };

    if (ctx.callbackQuery) await ctx.editMessageText(msg, kb as any);
    else await ctx.reply(msg, kb as any);
}

// 4. Xác nhận
bot.callbackQuery("cmd:confirm", async (ctx) => {
    const draft = ctx.session.draft;
    const config = COUNTRIES[draft.countryCode || 'vn'];

    // Báo thành công cho khách
    await ctx.editMessageText(UI_Msg.getOrderSuccess(ctx, config, draft.finalData), {
        parse_mode: 'HTML'
    });

    // Báo cho Admin
    if (config.adminGroupId) {
        try {
            const userLink = `<a href="tg://user?id=${ctx.from?.id}">${ctx.from?.first_name}</a>`;
            const action = draft.action === 'BUY' ? "🟢 MUA" : "🔴 BÁN";
            const adminMsg = `🚨 <b>ĐƠN MỚI</b>\n👤 ${userLink}\n💵 ${action}: ${draft.finalData.original}\n💰 VND: ${draft.finalData.final}`;
            await ctx.api.sendMessage(config.adminGroupId, adminMsg, { parse_mode: 'HTML' });
        } catch (e) {}
    }
    ctx.session.step = 'IDLE';
});

// 5. Hủy
bot.callbackQuery("cmd:cancel", async (ctx) => {
    await ctx.editMessageText("❌ Đã hủy đơn hàng.");
    ctx.session.step = 'IDLE';
});

export default bot; // 👈 Quan trọng: Phải export bot ra ngoài