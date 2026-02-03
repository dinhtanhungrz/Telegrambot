import { InlineKeyboard } from "grammy";
import { MyContext, Step } from "../types/session";
import { Keyboards } from "./keyboards";
import { Messages } from "./messages";
import { Formatter } from "../utils/formatter";
import { FeeService } from "../services/fee";
import { ENV } from "../config/env";
import { SUPPORT_INFO, MARKETS } from "../config/markets"; // 👈 Bắt buộc phải import MARKETS

// Helper chuyển cảnh
async function transition(ctx: MyContext, text: string, keyboard?: InlineKeyboard) {
    try {
        if (ctx.callbackQuery) {
            await ctx.editMessageText(text, { reply_markup: keyboard, parse_mode: 'HTML' });
        } else {
            if (ctx.session.lastMsgId) {
                try { await ctx.api.deleteMessage(ctx.chat!.id, ctx.session.lastMsgId); } catch {}
            }
            const msg = await ctx.reply(text, { reply_markup: keyboard, parse_mode: 'HTML' });
            ctx.session.lastMsgId = msg.message_id;
        }
    } catch {}
}

async function resetSession(ctx: MyContext) {
    ctx.session.step = Step.IDLE;
    ctx.session.draft = {};
    if (ctx.session.lastMsgId) {
        try { await ctx.api.deleteMessage(ctx.chat!.id, ctx.session.lastMsgId); } catch {}
    }
    const msg = await ctx.reply("🔄 <b>Giao dịch đã hủy.</b>\nBấm /start để bắt đầu lại.", { parse_mode: 'HTML' });
    ctx.session.lastMsgId = msg.message_id;
}

// Hàm kiểm tra an toàn
function validateSession(ctx: MyContext) {
    const d = ctx.session.draft;
    
    // 1. Kiểm tra session có ID quốc gia không
    if (!d.countryId || !d.areaId) {
        Handlers.onStart(ctx);
        return false;
    }

    // 2. 🔥 CHỐT CHẶN 1: Kiểm tra Quốc gia có tồn tại trong Config không?
    // (Tránh lỗi reading 'coins' of undefined)
    const market = MARKETS[d.countryId];
    if (!market) {
        Handlers.onStart(ctx);
        return false;
    }

    // 3. Kiểm tra Khu vực có thuộc Quốc gia đó không
    if (!market.areas[d.areaId]) {
        Handlers.onStart(ctx);
        return false;
    }
    return true;
}

export const Handlers = {
    async onCancel(ctx: MyContext) {
        try { await ctx.deleteMessage(); } catch {}
        await resetSession(ctx);
    },

    async onHelp(ctx: MyContext) {
        try { await ctx.deleteMessage(); } catch {} 
        const text = `🆘 Hotline: ${SUPPORT_INFO.phone}`;
        const msg = await ctx.reply(text);
        setTimeout(() => { ctx.api.deleteMessage(ctx.chat!.id, msg.message_id).catch(()=>{}); }, 10000);
    },

    async onStart(ctx: MyContext) {
        try { await ctx.deleteMessage(); } catch {}
        ctx.session.step = Step.SELECT_COUNTRY;
        ctx.session.draft = {}; 
        await transition(ctx, `<b>[1/7]</b> ${Messages.welcome}`, Keyboards.selectCountry());
    },

    async onSelectCountry(ctx: MyContext) {
        if (ctx.callbackQuery?.data === 'back:country') return Handlers.onStart(ctx);
        if (!ctx.callbackQuery) return;

        const id = ctx.callbackQuery.data!.split(':')[1];

        // 🔥 FIX LỖI CRASH 1: Kiểm tra ID gửi lên có tồn tại trong MARKETS không?
        // Nếu bấm nút cũ (ID lạ) -> Reset về Start ngay, không cho chạy tiếp
        if (!MARKETS[id]) {
            return Handlers.onStart(ctx);
        }

        ctx.session.draft = { countryId: id }; 
        ctx.session.step = Step.SELECT_AREA;
        await transition(ctx, `<b>[2/7]</b> ${Messages.askArea(id)}`, Keyboards.selectArea(id));
    },

    async onSelectArea(ctx: MyContext) {
        // 🔥 FIX LỖI CRASH 2: Kiểm tra session trước khi dùng
        if (!ctx.session.draft.countryId || !MARKETS[ctx.session.draft.countryId]) {
            return Handlers.onStart(ctx);
        }

        if (ctx.callbackQuery?.data === 'back:area') {
            const oldId = ctx.session.draft.countryId;
            ctx.callbackQuery.data = `ctry:${oldId}`; 
            return Handlers.onSelectCountry(ctx);
        }

        const id = ctx.callbackQuery!.data!.split(':')[1];
        ctx.session.draft.areaId = id;
        
        const ctry = ctx.session.draft.countryId!; 
        ctx.session.step = Step.SELECT_COIN;
        await transition(ctx, `<b>[3/7]</b> ${Messages.askCoin(ctry)}`, Keyboards.selectCoin(ctry));
    },

    async onSelectCoin(ctx: MyContext) {
        if (!validateSession(ctx)) return; // Đã bao gồm check MARKETS bên trong

        if (ctx.callbackQuery?.data === 'back:coin') {
            ctx.callbackQuery.data = `area:${ctx.session.draft.areaId}`;
            return Handlers.onSelectArea(ctx); 
        }

        const coin = ctx.callbackQuery!.data!.split(':')[1];
        ctx.session.draft.coin = coin;
        
        const ctry = ctx.session.draft.countryId!;
        ctx.session.step = Step.SELECT_ACTION;
        await transition(ctx, `<b>[4/7]</b> ${Messages.askAction(ctry, coin)}`, Keyboards.selectAction(coin, ctry));
    },

    async onSelectAction(ctx: MyContext) {
        if (!validateSession(ctx) || !ctx.session.draft.coin) return Handlers.onStart(ctx);

        if (ctx.callbackQuery?.data === 'back:action') {
            ctx.callbackQuery.data = `coin:${ctx.session.draft.coin}`;
            return Handlers.onSelectCoin(ctx);
        }

        const action = ctx.callbackQuery!.data!.split(':')[1] as any;
        ctx.session.draft.action = action;
        
        ctx.session.step = Step.INPUT_AMOUNT;
        const d = ctx.session.draft;
        const kb = Keyboards.selectAmount(d.countryId!, d.areaId!, action, d.coin!);
        
        await transition(ctx, `<b>[5/7]</b> ${Messages.askAmount(d)}`, kb);
    },

    async onInputAmount(ctx: MyContext) {
        if (ctx.callbackQuery?.data === 'back:action') {
            ctx.callbackQuery.data = `coin:${ctx.session.draft.coin}`;
            return Handlers.onSelectCoin(ctx);
        }
        if (ctx.callbackQuery?.data === 'back:amount') {
            ctx.callbackQuery.data = `act:${ctx.session.draft.action}`;
            return Handlers.onSelectAction(ctx);
        }

        let amount = 0;
        if (ctx.callbackQuery?.data?.startsWith('amt:')) {
            amount = parseFloat(ctx.callbackQuery.data.split(':')[1]);
        } else if (ctx.message?.text) {
            try { await ctx.deleteMessage(); } catch {}
            amount = Formatter.parseMoney(ctx.message.text);
        } else return;

        if (isNaN(amount) || amount <= 0) {
            const err = await ctx.reply("❌ Error / Lỗi số tiền!");
            setTimeout(() => ctx.api.deleteMessage(ctx.chat!.id, err.message_id).catch(()=>{}), 3000);
            return;
        }

        ctx.session.draft.amount = amount;
        ctx.session.step = Step.SELECT_METHOD;
        
        const ctry = ctx.session.draft.countryId || 'VN';
        const coinName = ctx.session.draft.coin || "Coin";
        const txt = ctry === 'VN'
            ? `<b>[6/7]</b> ✅ Đã chọn: <b>${amount} ${coinName}</b>\nTiếp theo, chọn phương thức:`
            : `<b>[6/7]</b> ✅ Selected: <b>${amount} ${coinName}</b>\nNext, choose payment method:`;

        await transition(ctx, txt, Keyboards.selectMethod(ctry));
    },

    async onSelectMethod(ctx: MyContext) {
        if (ctx.callbackQuery?.data === 'back:amount') {
             ctx.callbackQuery.data = `act:${ctx.session.draft.action}`;
             return Handlers.onSelectAction(ctx);
        }
        
        if (ctx.callbackQuery?.data === 'back:method') {
             const ctry = ctx.session.draft.countryId || 'VN';
             return transition(ctx, `<b>[6/7]</b> Chọn lại:`, Keyboards.selectMethod(ctry));
        }

        const method = ctx.callbackQuery!.data!.split(':')[1] as any;
        ctx.session.draft.method = method;
        const ctry = ctx.session.draft.countryId || 'VN';
        
        if (method !== 'BANK' && method !== 'CASH') return;

        if (method === 'CASH') {
            ctx.session.step = Step.INPUT_CASH_INFO;
            const txt = ctry === 'VN' 
                ? "<b>[7/7]</b> 📍 Nhập <b>Địa chỉ & Thời gian</b>:" 
                : "<b>[7/7]</b> 📍 Enter <b>Location & Time</b>:";
            await transition(ctx, txt, Keyboards.onlyBack("back:amount", ctry));
        } else {
            ctx.session.step = Step.INPUT_PHONE;
            const txt = ctry === 'VN'
                ? "<b>[7/7]</b> 📞 Nhập <b>SĐT</b> liên hệ:"
                : "<b>[7/7]</b> 📞 Enter <b>Phone Number</b>:";
            await transition(ctx, txt, Keyboards.onlyBack("back:amount", ctry));
        }
    },

    async onInputCashInfo(ctx: MyContext) {
        if (ctx.callbackQuery?.data === 'back:amount') {
             ctx.callbackQuery.data = `act:${ctx.session.draft.action}`;
             return Handlers.onSelectAction(ctx);
        }
        
        if (!ctx.message?.text) return;

        try { await ctx.deleteMessage(); } catch {}
        ctx.session.draft.zipCode = ctx.message.text;
        
        const ctry = ctx.session.draft.countryId || 'VN';
        ctx.session.step = Step.INPUT_PHONE;
        
        const txt = ctry === 'VN'
            ? "<b>[7/7]</b> 📞 Nhập <b>SĐT</b> liên hệ:"
            : "<b>[7/7]</b> 📞 Enter <b>Phone Number</b>:";
        await transition(ctx, txt, Keyboards.onlyBack("back:amount", ctry));
    },

    async onInputPhone(ctx: MyContext) {
        if (ctx.callbackQuery?.data === 'back:amount') {
             ctx.callbackQuery.data = `act:${ctx.session.draft.action}`;
             return Handlers.onSelectAction(ctx);
        }
        
        if (!ctx.message?.text) return;

        try { await ctx.deleteMessage(); } catch {}
        ctx.session.draft.contactPhone = ctx.message.text;
        await Handlers.showReview(ctx);
    },

    async showReview(ctx: MyContext) {
        if (!validateSession(ctx)) return;

        ctx.session.step = Step.REVIEW;
        const result = FeeService.calculate(ctx.session.draft);
        ctx.session.draft.finalResult = result;
        const ctry = ctx.session.draft.countryId!;
        
        const lblContact = ctry === 'VN' ? "📞 Liên hệ" : "📞 Contact";
        const reviewText = Messages.reviewOrder(ctx.session.draft, result) + 
                           `\n${lblContact}: <b>${ctx.session.draft.contactPhone}</b>`;
        
        const title = ctry === 'VN' ? "🏁 <b>XÁC NHẬN (Bước cuối)</b>" : "🏁 <b>CONFIRMATION</b>";
        await transition(ctx, `${title}\n\n` + reviewText, Keyboards.confirm(ctry));
    },

    async onSubmit(ctx: MyContext) {
        if (ctx.callbackQuery?.data === 'cmd:cancel') return Handlers.onCancel(ctx);
        if (ctx.callbackQuery?.data !== 'cmd:submit') return;

        const msg = Messages.adminNotify(ctx.from, ctx.session.draft, ctx.session.draft.finalResult);
        try { await ctx.api.sendMessage(ENV.ADMIN_GROUP_ID, msg, { parse_mode: 'HTML' }); } catch {}

        const ctry = ctx.session.draft.countryId || 'VN';
        const successTxt = ctry === 'VN'
            ? `✅ <b>ĐƠN HÀNG ĐÃ GỬI THÀNH CÔNG!</b>\n\nVui lòng chờ Admin liên hệ qua SĐT: <b>${ctx.session.draft.contactPhone}</b>`
            : `✅ <b>ORDER SENT SUCCESSFULLY!</b>\n\nPlease wait for Admin to contact via Phone: <b>${ctx.session.draft.contactPhone}</b>`;

        await transition(ctx, successTxt, undefined);
        ctx.session.step = Step.IDLE;
        ctx.session.draft = {};
    }
};