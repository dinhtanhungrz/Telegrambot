export const msgBillSummary = (data: any, currency: string) => {
    // Format tiền đẹp (ví dụ: 100,000 VND)
    const fmt = (n: number) => new Intl.NumberFormat().format(n) + ' ' + currency;

    return `🧾 <b>HÓA ĐƠN TẠM TÍNH</b>
--------------------
💵 Số tiền: ${fmt(data.original)}
📉 Phí: -${fmt(data.fee)}
💰 <b>THỰC NHẬN: ${fmt(data.final)}</b>
--------------------
<i>Vui lòng xác nhận để gửi đơn cho Admin.</i>`;
};