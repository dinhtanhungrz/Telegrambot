// Hàm tính phí
export const calculateFee = (amount: number, feePercent: number) => {
    const fee = amount * (feePercent / 100);
    return {
        original: amount,
        fee: fee,
        final: amount - fee
    };
};

// Hàm kiểm tra số tiền (Validate)
export const validateAmount = (amount: number, min: number) => {
    if (isNaN(amount) || amount <= 0) return "Số tiền không hợp lệ.";
    if (amount < min) return `Thấp hơn mức tối thiểu: ${min}`;
    return null;
};