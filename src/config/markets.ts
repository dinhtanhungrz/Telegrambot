export const MARKETS: any = {
    // 🇺🇸 THỊ TRƯỜNG MỸ (Dùng USD)
    US: {
        name: "🇺🇸 United States",
        currency: "USD",
        minAmount: 200, // Min 200$
        coins: ["USDT", "BTC", "ETH"],
        // 👇 Mốc tiền gợi ý riêng cho Mỹ
        amountPresets: [200, 500, 1000, 2000, 5000], 
        areas: {
            NYC: { name: "New York", buyFee: 8, sellFee: 5 },
            CALI: { name: "California", buyFee: 7, sellFee: 4 }
        }
    },

    // 🇻🇳 THỊ TRƯỜNG VIỆT NAM (Dùng VND)
    VN: {
        name: "🇻🇳 Vietnam",
        currency: "VND",
        minAmount: 1000000, // Min 1 triệu VND
        coins: ["USDT", "BTC", "ETH"],
        // 👇 Mốc tiền gợi ý riêng cho VN (Ví dụ khách VN hay mua ít hơn hoặc nhiều hơn tùy bạn chỉnh)
        amountPresets: [50, 100, 200, 500, 1000], 
        areas: {
            HCM: { name: "Hồ Chí Minh", buyFee: 2.5, sellFee: 1.5 },
            HN: { name: "Hà Nội", buyFee: 3.0, sellFee: 2.0 }
        }
    }
};

export const SUPPORT_INFO = {
    phone: "0987.654.321",
    email: "admin@crypto-exchange.com",
    telegram: "@AdminUsername"
};