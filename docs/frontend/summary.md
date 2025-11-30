# TỔNG KẾT DỰ ÁN SCHOLARHUB FRONTEND (ScholarHub-FE)

## 1. Giới thiệu
**ScholarHub-FE** là giao diện người dùng hiện đại cho nền tảng ScholarHub, được xây dựng để cung cấp trải nghiệm mượt mà trong việc tìm kiếm học bổng, quản lý hồ sơ cá nhân, và tương tác với các tính năng Blockchain/AI.

## 2. Công nghệ sử dụng (Tech Stack)
Dự án sử dụng các công nghệ tiên tiến nhất trong hệ sinh thái React:

*   **Core**: React 19, TypeScript, Vite (Build tool).
*   **Routing**: TanStack Router (File-based routing, type-safe).
*   **State Management & Data Fetching**: TanStack Query (React Query).
*   **Styling**: TailwindCSS v4, CSS Variables.
*   **UI Components**: shadcn/ui (Built on Radix UI & Tailwind CSS), Lucide React (Icons).
*   **Animations**: Framer Motion.
*   **Forms**: React Hook Form, Zod (Validation).
*   **Utilities**: Date-fns, clsx, tailwind-merge.

## 3. Cấu trúc dự án (`src/`)
Dự án được tổ chức theo kiến trúc **Feature-based**, giúp dễ dàng mở rộng và bảo trì:

*   **`features/`**: Chứa logic nghiệp vụ chính, chia thành các module:
    *   `auth`: Xác thực người dùng.
    *   `chatbot`: Tích hợp AI Chatbot hỗ trợ.
    *   `community`: Các tính năng mạng xã hội (bài đăng, bình luận).
    *   `landing`: Trang chủ và giới thiệu.
    *   `scholarship_management`: Quản lý đăng và duyệt học bổng.
    *   `scholarship_matching`: Tính năng AI gợi ý học bổng phù hợp.
    *   `scholarship_search`: Tìm kiếm và lọc học bổng.
    *   `user_profile`: Quản lý hồ sơ, CV, và ví điện tử (Wallet).
*   **`routes/`**: Định nghĩa các trang (Pages) dựa trên TanStack Router.
    *   `__root.tsx`: Layout chính.
    *   `_auth`: Layout cho các trang yêu cầu đăng nhập.
*   **`components/`**: Các UI component dùng chung (Button, Input, Modal...).
*   **`contexts/`**: React Context (Global state nếu cần).
*   **`hooks/`**: Custom Hooks.
*   **`lib/`**: Cấu hình thư viện bên thứ 3 (axios, utils...).

## 4. Tính năng chính (Frontend)

### 4.1. Tìm kiếm & Gợi ý Học bổng
*   Giao diện tìm kiếm nâng cao với nhiều bộ lọc.
*   Hiển thị kết quả matching từ AI.
*   Trang chi tiết học bổng trực quan.

### 4.2. Cộng đồng & Tương tác
*   Newsfeed hiển thị bài đăng từ người dùng khác.
*   Tính năng Like, Comment, Share.
*   Tích hợp hiển thị phần thưởng (Reward) nhận được từ Blockchain.

### 4.3. Hồ sơ người dùng & Ví (Wallet)
*   Trang cá nhân hiển thị thông tin, CV.
*   **Tích hợp Ví**:
    *   Hiển thị địa chỉ ví và số dư token SPT.
    *   **Tạo ví mới**: Hỗ trợ người dùng tạo ví trực tiếp trên UI nếu chưa có.
    *   **Tự động cập nhật**: Số dư SPT tự động refresh ngay sau khi nhận thưởng (Post, Comment...).
*   Lịch sử giao dịch và trạng thái các dịch vụ đã mua.

### 4.4. Quản trị (Dành cho Admin/Sponsor)
*   Dashboard quản lý bài đăng học bổng.
*   Giao diện duyệt bài và xem thống kê.

## 5. Tích hợp & Kết nối
*   **Backend API**: Kết nối qua RESTful API (được cấu hình trong `src/lib` hoặc `src/configs`).
*   **Blockchain**:
    *   Frontend **không** trực tiếp tương tác với Smart Contract (để đảm bảo bảo mật và đơn giản hóa UX).
    *   Thay vào đó, Frontend gọi API Backend -> Backend thực hiện giao dịch Blockchain -> Frontend hiển thị kết quả cập nhật.
*   **AI**: Hiển thị kết quả trả về từ các API AI (Chatbot, Matching).

## 6. Hướng dẫn chạy (Development)
1.  Cài đặt dependencies: `pnpm install`
2.  Chạy server dev: `pnpm run dev`
3.  Truy cập: `http://localhost:3080`
