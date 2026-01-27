// Hàm tính toán phí
export const calculateFee = (amount: number, feePercent: number) => {
    const fee = amount * (feePercent / 100);
    return {
        original: amount,
        fee: fee,
        final: amount - fee
    };
};

// Hàm kiểm tra đầu vào (Logic Sprint 3)
export const validateAmount = (amount: number, min: number) => {
    if (isNaN(amount)) return "Số tiền không hợp lệ.";
    if (amount < min) return `Thấp hơn mức tối thiểu: ${min}`;
    return null; // Không có lỗi
};