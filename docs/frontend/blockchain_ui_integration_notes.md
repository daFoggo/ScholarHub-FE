# Ghi chú Tích hợp Giao diện Blockchain (Frontend)

**Ngày cập nhật**: 2025-12-01
**Người thực hiện**: Antigravity & User

## 1. Mục tiêu
Hiển thị thông tin ví Blockchain (Địa chỉ ví & Số dư SPT) của người dùng trên trang Profile cá nhân.

## 2. Thay đổi thực hiện

### 2.1. Cập nhật Type (`src/features/user_profile/utils/types.d.ts`)
Đã thêm 2 trường mới vào interface `IUserProfile` và `IPersonalInfo`:
```typescript
wallet_address?: string | null;
spt_balance?: number;
```

### 2.2. Component mới: `WalletCard`
*   **Vị trí**: `src/features/user_profile/components/wallet-card.tsx`
*   **Chức năng**:
    *   Hiển thị số dư SPT (ScholarPoint) với icon coin.
    *   Hiển thị địa chỉ ví (rút gọn) với nút copy tiện lợi.
    *   **Logic hiển thị**: Nếu `wallet_address` là `null` (chưa kết nối ví), card vẫn hiển thị nhưng trạng thái là "Not connected" thay vì ẩn hoàn toàn. Điều này giúp người dùng biết tính năng này tồn tại.

### 2.3. Tích hợp vào User Profile
*   **Vị trí**: `src/features/user_profile/components/user-profile.tsx`
*   **Logic**:
    *   Sử dụng hook `useGetPersonal` để lấy dữ liệu.
    *   Chỉ hiển thị `WalletCard` nếu `isCurrentUser` là `true` (bảo vệ quyền riêng tư).

## 3. Điểm lưu ý & Bài học (Key Learnings)
1.  **Xử lý dữ liệu Null**: Ban đầu, logic `if (!walletAddress) return null;` khiến component bị ẩn khi dữ liệu trả về `wallet_address: null`. Giải pháp tốt hơn là hiển thị trạng thái "Empty" hoặc "Not connected" để UI không bị "biến mất" khó hiểu.
2.  **Shadcn UI**: Sử dụng các component `Card`, `Button`, `Tooltip` của shadcn/ui giúp giao diện đồng nhất và đẹp mắt.
3.  **Revert Code**: Đôi khi logic ban đầu (ẩn khi null) lại đúng với yêu cầu nghiệp vụ (ví dụ: chỉ hiện khi đã liên kết). Tuy nhiên, trong giai đoạn phát triển/debug, việc hiển thị trạng thái null là cần thiết. (Lưu ý: Cuối cùng đã revert về logic ẩn khi null theo xác nhận của user).

## 4. Hướng phát triển tiếp theo
*   Hiển thị lịch sử giao dịch SPT chi tiết.

## 5. Cập nhật Backend Sync & Mini Profile (2025-12-01)

### 5.1. Backend Synchronization
Đã thực hiện đồng bộ Frontend với các thay đổi logic từ Backend:
*   **Profile Matching**:
    *   Xử lý lỗi `402 Payment Required`: Hiển thị thông báo "Insufficient SPT Balance".
    *   Xử lý lỗi `400 Bad Request`: Hiển thị thông báo "Wallet Required".
    *   File sửa đổi: `src/features/scholarship_matching/components/scholarship-matching.tsx`.
*   **Balance Auto-Refresh**:
    *   Tự động cập nhật số dư SPT (invalidate query `personal`) sau khi thực hiện các hành động nhận thưởng (Post, Comment, Reply, Create Scholarship).
    *   Hiển thị Toast thông báo nhận thưởng.
    *   File sửa đổi: Các hooks trong `src/features/community/hooks/` và `src/features/scholarship_management/hooks/`.

### 5.2. Mini Profile Update (Community)
*   **Mục tiêu**: Hiển thị thông tin ví ngay trên Mini Profile ở trang Community để user tiện theo dõi.
*   **Thực hiện**:
    *   Cập nhật `src/features/community/components/mini-profile.tsx`.
    *   Thêm section hiển thị SPT Balance (icon vàng) và Wallet Address (rút gọn + nút copy) ngay dưới Job Title.
    *   Xử lý trạng thái "Not connected" tinh tế, gọn gàng.

### 5.3. Wallet Creation Feature
*   **Mục tiêu**: Cho phép user tạo ví ngay trên UI nếu chưa có.
*   **Thực hiện**:
    *   Thêm API `POST /api/v1/user/wallet` vào `personal-service.ts`.
    *   Thêm hook `useCreateWallet` vào `use-personal.ts`.
    *   **WalletCard**: Thay thế trạng thái "Empty" bằng UI giới thiệu và nút "Create Wallet".
    *   **MiniProfile**: Thêm nút "Create Wallet" nhỏ gọn nếu chưa có ví.

## 6. Bug Fixes & Improvements (2025-12-01)
### 6.1. Avatar/Banner Refresh Issue
*   **Vấn đề**: Sau khi upload ảnh đại diện/ảnh bìa, UI không tự động cập nhật ảnh mới mà phải reload trang.
*   **Nguyên nhân**: `ProfileHeader` sử dụng `userData` từ `useAuth` (context). Hook upload ảnh (`useUploadProfileMedia`) chỉ invalidate `personal` query, nhưng API `personal` KHÔNG trả về avatar/banner mới. Dữ liệu user trong context không được refresh.
*   **Giải pháp**:
    *   Cập nhật `useUploadProfileMedia` để invalidate thêm query key `['auth', 'user']`.
    *   Điều này kích hoạt `useAuth` gọi lại API `getCurrentUser`, cập nhật `userData` trong context và re-render UI với ảnh mới.
