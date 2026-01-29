telegram-bot/
├── node_modules/          # Thư viện (Tự sinh ra khi npm install)
├── src/                   # Source code chính
│   ├── bot/
│   │   └── handlers/      # Các bộ xử lý sự kiện
│   │       ├── logic.ts       # Xử lý tính tiền, nhập liệu
│   │       ├── navigation.ts  # Xử lý Menu, lệnh /start, /cancel
│   │       └── settings.ts    # Xử lý đổi ngôn ngữ
│   ├── config/
│   │   └── countries.ts   # Cấu hình tỷ giá, Min/Max, Admin ID
│   ├── locales/           # Từ điển ngôn ngữ
│   │   ├── en.ts          # Tiếng Anh
│   │   └── vi.ts          # Tiếng Việt
│   ├── services/          # Các hàm phụ trợ
│   │   └── fee.service.ts # Hàm tính toán phí & validate số
│   ├── types/
│   │   └── session.ts     # Định nghĩa kiểu dữ liệu (Typescript)
│   |─ ui/                # Giao diện người dùng
│      └── user/
│          ├── keyboards.ts   # Các nút bấm (Buttons)
│          └── messages.ts    # Các mẫu tin nhắn (Hóa đơn, Thông báo)
│   
├── .env                   # Lưu Token (Bảo mật)
├── .gitignore             # File chặn Git (để không up file rác lên Github)
├── package.json           # Khai báo thư viện & lệnh chạy
├── README.md              # Hướng dẫn sử dụng dự án
└── tsconfig.json          # Cấu hình TypeScript
└── index.ts           FILE CHẠY CHÍNH (Main Entry)

 Hướng Dẫn Sử Dụng (Cho User)

1. Bắt đầu: Gõ `/start` để khởi động Bot.
2. Chọn Vùng:
   - 🇻🇳 Vietnam: Giao dịch VND/USDT (Ngôn ngữ Việt).
   - 🇺🇸 United States: Giao dịch USD/BTC (Ngôn ngữ Anh).
3. Đặt Lệnh:
   - Chọn Mua hoặc Bán
   - Chọn mệnh giá có sẵn hoặc nhập số vào khung chat
4. Xác Nhận:
   - Kiểm tra hóa đơn tạm tính.
   - Bấm Xác nhận để gửi đơn.
5. Kết Thúc: Admin sẽ nhận được tin nhắn và liên hệ lại với bạn.