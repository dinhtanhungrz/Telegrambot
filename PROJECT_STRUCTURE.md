PROJECT-ROOT/
├── docker-compose.yml       # Cấu hình Redis Local
├── .env                     # Biến môi trường
├── src/
│   ├── config/
│   │   ├── env.ts           # Validate .env (zod)
│   │   └── markets.ts       # Cấu hình Fee, Min Amount theo Market
│   ├── types/
│   │   └── session.ts       # Định nghĩa State Machine & Data
│   ├── services/
│   │   ├── redis.ts         # Kết nối Redis
│   │   └── fee.ts           # Logic tính toán phí
│   ├── utils/
│   │   └── formatter.ts     # Format tiền tệ, ngày tháng
│   ├── bot/
│   │   ├── filters/         # Các hàm check điều kiện (Guard)
│   │   ├── keyboards/       # Inline Keyboards (Nút bấm)
│   │   ├── messages/        # Văn bản hiển thị (UI)
│   │   ├── router.ts        # Bộ điều hướng State Machine (QUAN TRỌNG)
│   │   └── handlers.ts      # Xử lý logic từng bước
│   └── index.ts             # Entry point
└── package.json