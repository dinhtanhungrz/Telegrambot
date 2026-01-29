import { InlineKeyboard } from 'grammy';
import { MyContext } from '../../types/session';

// 1. Menu Chọn Nước
export const kbSelectCountry = () => {
    return new InlineKeyboard()
        .text("🇻🇳 Vietnam", "country:vn")
        .text("🇺🇸 United States", "country:us");
};

// 2. Menu Chính
export const kbMainMenu = (ctx: MyContext, coinName: string) => {
    return new InlineKeyboard()
        .text(ctx.t('menu_buy', { coin: coinName }), "trade:BUY")
        .text(ctx.t('menu_sell', { coin: coinName }), "trade:SELL")
        .row()
        .text(ctx.t('btn_setting'), "settings:lang")
        .row()
        .text(ctx.t('btn_back'), "cmd:back_country");
};

// 3. Chọn tiền nhanh (Layout 3 cột đẹp mắt)
export const kbAmountSuggestion = (ctx: MyContext) => {
    return new InlineKeyboard()
        .text("50", "amt:50").text("100", "amt:100").text("200", "amt:200")
        .row()
        .text("500", "amt:500").text("1,000", "amt:1000").text("5,000", "amt:5000")
        .row()
        .text(ctx.t('btn_back'), "cmd:back_main");
};

// 4. Xác nhận giao dịch
export const kbConfirm = (ctx: MyContext) => {
    return new InlineKeyboard()
        .text(ctx.t('btn_confirm'), "cmd:confirm")
        .row()
        .text(ctx.t('btn_cancel'), "cmd:cancel");
};

// 5. Chọn Ngôn ngữ (Hàm này bị thiếu lúc nãy)
export const kbLanguage = () => {
    return new InlineKeyboard()
        .text("🇻🇳 Tiếng Việt", "lang:vi")
        .text("🇬🇧 English", "lang:en")
        .row()
        .text("🔙 Quay lại", "cmd:back_main");
};