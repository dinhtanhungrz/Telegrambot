export interface CountryConfig {
    code: string;
    name: string;
    currency: string;
    rateId: string;
    feePercent: number;
    minAmount: number;
    adminGroupId: number;
    lang: string;
}

export const COUNTRIES: Record<string, CountryConfig> = {
    vn: {
        code: 'vn',
        name: 'Vietnam',
        currency: 'VND',
        rateId: 'USDT',
        feePercent: 2.5,
      
        minAmount: 10, 

        adminGroupId: -100123456789, 
        lang: 'vi'
    },
    us: {
        code: 'us',
        name: 'United States',
        currency: 'USD',
        rateId: 'BTC',
        feePercent: 3.0,
        minAmount: 0.001,
        adminGroupId: -100123456789,
        lang: 'en'
    }
};