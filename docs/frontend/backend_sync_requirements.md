# Yêu cầu Cập nhật Frontend (Backend Sync)

**Ngày tạo**: 2025-12-01
**Mục đích**: Đồng bộ Frontend với các tính năng Blockchain vừa được tích hợp vào Backend.

## 1. Tính năng AI Profile Matching (`/profile-matching`)
Backend hiện đã tính phí dịch vụ này (trừ SPT token).

*   **Logic**: Khi gọi API, Backend sẽ kiểm tra số dư và trừ tiền.
*   **Yêu cầu FE**:
    *   **Handle Error 402**: Nếu API trả về status `402 Payment Required`, hiển thị thông báo lỗi: *"Số dư SPT không đủ để thực hiện matching."*
    *   **Handle Error 400**: Nếu API trả về status `400 Bad Request` (liên quan đến ví), hiển thị: *"Vui lòng tạo ví Blockchain trước khi sử dụng dịch vụ."*

## 2. Tính năng Thưởng (Rewards)
Các hành động sau sẽ tự động được cộng SPT:
*   Tạo bài viết (Post)
*   Bình luận (Comment)
*   Thả cảm xúc (Reaction/Like)
*   Đăng học bổng (Scholarship)

*   **Yêu cầu FE**:
    *   **Auto Refresh Balance**: Sau khi user thực hiện thành công các hành động trên (API trả về 200/201), FE cần **gọi lại API Personal** (`/api/v1/user/personal`) để cập nhật số dư hiển thị trên UI ngay lập tức.
    *   **UX**: Nên hiển thị Toast/Notification nhỏ (ví dụ: *"Đăng bài thành công! (Đã nhận thưởng)"*) để user biết.

## 3. Tính năng Tạo Ví (Wallet Creation) - Mới
*   **User Mới**: Hệ thống **TỰ ĐỘNG** tạo ví khi đăng ký. FE không cần làm gì thêm.
*   **User Cũ** (đã đăng ký trước đây): Sẽ chưa có ví (`wallet_address: null`).
*   **Giải pháp cho User Cũ**:
    *   Backend đã thêm API: `POST /api/v1/user/wallet` (Không cần body).
    *   **Yêu cầu FE**:
        *   Tại trang Profile (hoặc Mini Profile), nếu `wallet_address` là null -> Hiển thị nút **"Tạo ví Blockchain"** (hoặc "Connect Wallet").
        *   Khi bấm nút -> Gọi API trên -> Nếu thành công (201) -> Refresh lại thông tin Profile để hiện địa chỉ ví mới.

## 4. Lưu ý về Mock Mode
Backend đang chạy chế độ giả lập (Mock Mode) nếu chưa kết nối Blockchain thật.

*   **Behavior**:
    *   Các API trên vẫn trả về Success (200/201).
    *   Tuy nhiên, **số dư (balance) có thể KHÔNG thay đổi** (do không có transaction thật).
    *   **Lưu ý cho Dev**: Đây là behavior bình thường trong môi trường dev/mock, không phải lỗi FE.
