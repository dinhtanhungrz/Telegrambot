import { InlineKeyboard } from 'grammy';

// UI: Bàn phím chọn nước
export const kbSelectCountry = () => {
    return new InlineKeyboard()
        .text("🇻🇳 Vietnam", "country:vn")
        .text("🇺🇸 USA", "country:us");
};

// UI: Bàn phím Mua/Bán (Có nút Back)
export const kbSelectAction = (coinName: string) => {
    return new InlineKeyboard()
        .text(`🟢 Mua ${coinName}`, "act:BUY")
        .text(`🔴 Bán ${coinName}`, "act:SELL")
        .row()
        .text("🔙 Quay lại", "cmd:back"); // Nút điều hướng
};

// UI: Bàn phím Xác nhận (Sprint 3 sẽ dùng)
export const kbConfirm = () => {
    return new InlineKeyboard()
        .text("✅ Đồng ý & Gửi đơn", "cmd:confirm")
        .text("❌ Hủy bỏ", "cmd:cancel");
};  