export interface CountryConfig {
    code: string;
    name: string;
    currency: string;
    rateId: string;
    feePercent: number;
    minAmount: number;
    adminGroupId: number; // Thêm dòng này để TS không báo lỗi
}

export const COUNTRIES: Record<string, CountryConfig> = {
    vn: {
        code: 'vn',
        name: 'Vietnam',
        currency: 'VND',
        rateId: 'USDT',
        feePercent: 2.5,
        minAmount: 100000,
        adminGroupId: -100123456789 // Điền ID nhóm Admin thật của bạn vào đây
    },
    us: {
        code: 'us',
        name: 'United States',
        currency: 'USD',
        rateId: 'BTC',
        feePercent: 3.0,
        minAmount: 50,
        adminGroupId: -100987654321
    }
};