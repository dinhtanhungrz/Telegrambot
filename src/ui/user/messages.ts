import { MyContext } from '../../types/session';
import { CountryConfig } from '../../config/countries';

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);

// 1. HÓA ĐƠN (Giữ nguyên)
export const getBillTemplate = (ctx: MyContext, config: CountryConfig, data: any) => {
    return `
🧾 <b>PHIẾU TẠM TÍNH (ESTIMATE)</b>
<code>------------------------------</code>
💵 Số lượng:     <b>${fmt(data.original)} ${config.rateId}</b>
📉 Tỷ giá:       <b>${fmt(25400)} ${config.currency}</b>
💸 Phí sàn:      -${fmt(data.fee)} ${config.rateId}
<code>------------------------------</code>
💰 <b>THỰC NHẬN:   ${fmt(data.final)} ${config.currency}</b>

👇 <i>Bấm xác nhận để gửi đơn hàng cho Admin.</i>
    `;
};

// 2. THÔNG BÁO THÀNH CÔNG (Mới - Thay cho PaymentInstruction)
export const getOrderSuccess = (ctx: MyContext, config: CountryConfig, data: any) => {
    return `
✅ <b>GỬI ĐƠN HÀNG THÀNH CÔNG!</b>

Cảm ơn bạn đã xác nhận giao dịch:
- <b>${fmt(data.original)} ${config.rateId}</b> ➡️ <b>${fmt(data.final)} ${config.currency}</b>

🔔 <b>Admin đã nhận được đơn và sẽ liên hệ với bạn ngay lập tức!</b>
Vui lòng chú ý tin nhắn chờ.
    `;
};