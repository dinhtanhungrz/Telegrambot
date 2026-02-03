export const Formatter = {
    // Chuyển đổi "10k" -> 10000, "10,000" -> 10000
    parseMoney(input: string): number {
        let raw = input.toLowerCase().replace(/,/g, '').replace(/_/g, '');
        if (raw.includes('k')) raw = raw.replace('k', '000');
        return parseFloat(raw);
    },

    // Hiển thị số đẹp (10,000)
    formatCurrency(amount: number, currency: string = ""): string {
        return `${amount.toLocaleString('en-US')} ${currency}`.trim();
    },

    // Làm tròn số coin (4 chữ số thập phân)
    roundCoin(amount: number): number {
        return Math.round(amount * 10000) / 10000;
    }
};