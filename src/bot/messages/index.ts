import { User } from "grammy/types";
import { OrderDraft } from "../../types/session";
import { MARKETS } from "../../config/markets";
import { Formatter } from "../../utils/formatter";

// 1. BỘ TỪ ĐIỂN SONG NGỮ (Cập nhật đầy đủ các trường Review)
const TEXTS: any = {
    VN: {
        askArea: "📍 Bạn tiếp tục chọn **Khu vực** nhé:",
        askCoin: "🪙 Bạn muốn giao dịch loại Coin nào?",
        askAction: (c: string) => `⚖️ Bạn muốn Mua hay Bán <b>${c}</b>?`,
        askAmount: (c: string, action: string) => `💵 Nhập số lượng <b>${c}</b> muốn <b>${action}</b>:`,
        askMethod: "💳 Chọn phương thức thanh toán:",
        askCash: "📍 Nhập <b>Địa chỉ & Thời gian</b> giao dịch:",
        askPhone: "📞 Nhập <b>Số điện thoại</b> (Zalo/Tele) để Admin liên hệ:",
        review: "📋 <b>XÁC NHẬN ĐƠN HÀNG</b>",
        success: "✅ <b>ĐƠN HÀNG ĐÃ GỬI THÀNH CÔNG!</b>\nAdmin sẽ liên hệ bạn sớm nhất.",
        min: "Min quy đổi",
        
        // 👇 Phần mới thêm cho Review
        lblMarket: "🌍 Khu vực",
        lblCoin: "🪙 Loại Coin",
        lblAction: "⚖️ Lệnh",
        lblAmount: "📦 Số lượng",
        lblFee: "⚡ Phí",
        lblReal: "💎 THỰC NHẬN",
        lblMethod: "📡 Phương thức",
        lblCcy: "💱 Tiền tệ"
    },
    US: {
        askArea: "📍 Please select your **Area**:",
        askCoin: "🪙 Which Coin do you want to trade?",
        askAction: (c: string) => `⚖️ Do you want to BUY or SELL <b>${c}</b>?`,
        askAmount: (c: string, action: string) => `💵 Enter amount of <b>${c}</b> to <b>${action}</b>:`,
        askMethod: "💳 Choose payment method:",
        askCash: "📍 Enter <b>Location & Time</b> for meeting:",
        askPhone: "📞 Enter your <b>Phone Number</b> (WhatsApp/Tele):",
        review: "📋 <b>ORDER REVIEW</b>",
        success: "✅ <b>ORDER SUBMITTED SUCCESSFULLY!</b>\nAdmin will contact you shortly.",
        min: "Minimum amount",

        // 👇 Phần mới thêm cho Review
        lblMarket: "🌍 Market",
        lblCoin: "🪙 Coin",
        lblAction: "⚖️ Action",
        lblAmount: "📦 Amount",
        lblFee: "⚡ Fee",
        lblReal: "💎 REAL RECEIVE",
        lblMethod: "📡 Method",
        lblCcy: "💱 Currency"
    }
};

const getTxt = (id: string) => TEXTS[id] || TEXTS['VN'];

export const Messages = {
    welcome: "🌏 <b>Welcome! / Xin chào!</b>\nPlease select a Market / Chọn thị trường:",
    
    askArea: (countryId: string) => `📍 ${MARKETS[countryId].name}\n${getTxt(countryId).askArea}`,

    askCoin: (countryId: string) => getTxt(countryId).askCoin,

    askAction: (countryId: string, coin: string) => getTxt(countryId).askAction(coin),

    askAmount: (draft: OrderDraft) => {
        const t = getTxt(draft.countryId!);
        const m = MARKETS[draft.countryId!];
        return `${t.askAmount(draft.coin, draft.action)}\n` +
               `<i>(Ex: 1000, 0.5, 10k)</i>\n\n` +
               `⚠️ ${t.min}: <b>${Formatter.formatCurrency(m.minAmount, m.currency)}</b>`;
    },

    // 🔥 SỬA LẠI HÀM NÀY ĐỂ DÙNG TỪ ĐIỂN
    reviewOrder: (draft: OrderDraft, calcResult: any) => {
        const t = getTxt(draft.countryId!);
        const m = MARKETS[draft.countryId!];
        
        return `${t.review}\n` +
               `--------------------\n` +
               `${t.lblMarket}: ${draft.areaId} (${m.name})\n` +
               `${t.lblCoin}: <b>${draft.coin}</b>\n` +
               `${t.lblAction}: <b>${draft.action}</b>\n` +
               `${t.lblAmount}: ${draft.amount}\n` +
               `${t.lblFee} (${calcResult.feePercent}%): ${calcResult.feeAmount}\n` +
               `${t.lblReal}: <b>${calcResult.finalAmount} ${draft.coin}</b>\n` +
               `--------------------\n` +
               `${t.lblMethod}: ${draft.method} ${draft.zipCode ? `(${draft.zipCode})` : ''}\n` +
               `${t.lblCcy}: <b>${m.currency}</b>`;
    },

    // Tin nhắn Admin giữ nguyên (Admin đọc tiếng Việt/Anh đều được, nhưng thường để chuẩn Form)
    adminNotify: (user: User | undefined, draft: OrderDraft, calcResult: any) => {
        const usernameDisplay = user?.username ? `@${user.username}` : "<i>(No username)</i>";
        const fullname = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
        const profileLink = `<a href="tg://user?id=${user?.id}">${fullname}</a>`;
        const actionIcon = draft.action === 'BUY' ? "🟢 MUA" : "🔴 BÁN";
        const marketIcon = draft.countryId === 'VN' ? "🇻🇳" : "🇺🇸";

        return `<b>🔔 ĐƠN HÀNG MỚI / NEW ORDER</b>\n` +
               `➖➖➖➖➖➖➖➖➖➖➖\n` +
               `👤 <b>KHÁCH / CLIENT</b>\n` +
               `├ Name: ${profileLink}\n` +
               `├ User: ${usernameDisplay}\n` +
               `└ ID: <code>${user?.id}</code>\n\n` +
               `📑 <b>CHI TIẾT / DETAILS</b>\n` +
               `├ Market: ${marketIcon} <b>${draft.areaId}</b>\n` +
               `├ Type: <b>${actionIcon}</b>\n` +
               `├ Amount: <b>${draft.amount} ${draft.coin}</b>\n` +
               `└ Receive: <code>${calcResult.finalAmount} ${draft.coin}</code>\n\n` +
               `📞 <b>LIÊN HỆ / CONTACT</b>\n` +
               `├ Phone: <code>${draft.contactPhone}</code>\n` +
               `├ Method: <b>${draft.method}</b>\n` +
               (draft.zipCode ? `└ Info: ${draft.zipCode}\n` : `└ Note: <i>Banking</i>\n`) +
               `➖➖➖➖➖➖➖➖➖➖➖\n`;
    }
};