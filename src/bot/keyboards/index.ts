import { InlineKeyboard } from "grammy";
import { MARKETS } from "../../config/markets";
import { Formatter } from "../../utils/formatter";

// 👇 BỘ TỪ ĐIỂN CHO NÚT BẤM
const LABELS: any = {
    VN: { back: "🔙 Quay lại", buy: "🟢 MUA", sell: "🔴 BÁN", cancel: "❌ Hủy bỏ", confirm: "✅ GỬI ĐƠN", edit: "🔙 Sửa lại", bank: "🏦 Chuyển khoản", cash: "💵 Tiền mặt" },
    US: { back: "🔙 Back", buy: "🟢 BUY", sell: "🔴 SELL", cancel: "❌ Cancel", confirm: "✅ SUBMIT", edit: "🔙 Edit", bank: "🏦 Bank Transfer", cash: "💵 Cash / In-person" }
};

const getLb = (id: string) => LABELS[id] || LABELS['VN'];

export const Keyboards = {
    selectCountry: () => {
        const kb = new InlineKeyboard();
        Object.keys(MARKETS).forEach(k => kb.text(MARKETS[k].name, `ctry:${k}`).row());
        kb.text("❌ Cancel / Hủy", "cmd:cancel"); // Nút hủy song ngữ
        return kb;
    },

    selectArea: (countryId: string) => {
        const kb = new InlineKeyboard();
        const areas = MARKETS[countryId].areas;
        const lb = getLb(countryId); // Lấy ngôn ngữ
        Object.keys(areas).forEach(k => kb.text(areas[k].name, `area:${k}`).row());
        kb.text(lb.back, "back:country");
        return kb;
    },

    selectCoin: (countryId: string) => {
        const kb = new InlineKeyboard();
        const lb = getLb(countryId);
        MARKETS[countryId].coins.forEach((c: string) => kb.text(`💰 ${c}`, `coin:${c}`).row());
        kb.text(lb.back, "back:area");
        return kb;
    },
    
    selectAction: (coin: string, countryId: string) => { // Thêm param countryId
        const lb = getLb(countryId);
        return new InlineKeyboard()
            .text(`${lb.buy} ${coin}`, "act:BUY").text(`${lb.sell} ${coin}`, "act:SELL").row()
            .text(lb.back, "back:coin");
    },

    selectAmount: (countryId: string, areaId: string, action: 'BUY'|'SELL', coin: string) => {
        const kb = new InlineKeyboard();
        const m = MARKETS[countryId];
        const area = m.areas[areaId];
        const presets = m.amountPresets;
        const lb = getLb(countryId);

        const feePercent = action === 'BUY' ? area.buyFee : area.sellFee;

        presets.forEach((amt: number) => {
            const feeVal = amt * (feePercent / 100);
            const realVal = action === 'BUY' ? (amt + feeVal) : (amt - feeVal);
            const rounded = Formatter.roundCoin(realVal);
            
            // Label hiển thị số tiền
            kb.text(`${amt} (≈${rounded})`, `amt:${amt}`); 
            if (presets.indexOf(amt) % 2 !== 0) kb.row(); 
        });
        
        if (presets.length % 2 !== 0) kb.row();
        kb.text(lb.back, "back:action");
        return kb;
    },

    selectMethod: (countryId: string) => {
        const lb = getLb(countryId);
        return new InlineKeyboard()
            .text(lb.bank, "met:BANK").row()
            .text(lb.cash, "met:CASH").row()
            .text(lb.back, "back:amount");
    },

    confirm: (countryId: string) => {
        const lb = getLb(countryId);
        return new InlineKeyboard()
            .text(lb.confirm, "cmd:submit").row()
            .text(lb.edit, "back:method")
            .text(lb.cancel, "cmd:cancel");
    },

    onlyBack: (target: string, countryId: string) => {
        const lb = getLb(countryId);
        return new InlineKeyboard().text(lb.back, target);
    }
};