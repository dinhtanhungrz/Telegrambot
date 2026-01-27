
Bước 1: Chuẩn hóa đầu vào (Input Sanitization)Người dùng nhập: 500,000 hoặc 500.000.Bot xử lý: Xóa toàn bộ dấu phẩy, dấu chấm để lấy số nguyên 500000.
Bước 2: Kiểm tra điều kiện (Validation)VN: Nếu nhập < 100,000 $\rightarrow$ Báo lỗi: "⚠️ Thấp hơn mức tối thiểu: 100,000 VND".US: Nếu nhập < 50 $\rightarrow$ Báo lỗi: "⚠️ Below minimum limit: 50 USD"
Bước 3: Công thức tính toán (Core Math)Phí (Fee) = Số tiền * % Phí (tùy nước).Thực nhận (Final) = Số tiền - Phí.
Bước 4: Xuất Hóa Đơn (Billing)VN Template:Plaintext🧾 HÓA ĐƠN TẠM TÍNH
Lệnh: MUA
Số tiền: 500.000 ₫
Phí sàn: -12.500 ₫
💰 THỰC NHẬN: 487.500 ₫
US Template:Plaintext🧾 BILL
Order: BUY
Amount: $100.00
Fee: -$3.00
💰 NET RECEIVE: $97.00
4. Tóm tắt kỹ thuật (Dành cho Dev)Để code chạy được như mô tả trên, Bot sử dụng các công nghệ sau:Grammy Session: Để nhớ người dùng đang ở nước nào (ctx.session.draft.country).Grammy i18n: Để tự động đổi chữ Mua/Bán sang Buy/Sell (ctx.t('text_buy')).Intl.NumberFormat: Để tự động format tiền tệ (Dấu chấm cho VN, dấu phẩy cho US).