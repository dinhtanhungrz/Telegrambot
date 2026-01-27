import { InlineKeyboard } from 'grammy';
// Import từ session.ts
import { MyContext } from '../../types/context'; 
// Import từ countries.ts (không có .config)
import { COUNTRIES } from '../../config/countries'; 

// Nút chọn quốc gia
export const countryKeyboard = () => {
    const keyboard = new InlineKeyboard();
    let index = 0;
    
    for (const c of Object.values(COUNTRIES)) {
        keyboard.text(`${c.flag} ${c.name}`, `country:${c.code}`);
        // Chia 2 cột
        if ((index + 1) % 2 === 0) keyboard.row();
        index++;
    }
    return keyboard;
};

// Nút chọn Mua/Bán
export const actionKeyboard = (ctx: MyContext, coinName: string) => {
    return new InlineKeyboard()
        .text(ctx.t('btn_buy', { coin: coinName }), 'type:BUY')
        .text(ctx.t('btn_sell', { coin: coinName }), 'type:SELL');
};