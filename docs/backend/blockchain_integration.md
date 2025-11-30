# Ghi chú Tích hợp Blockchain (Version 1)

**Ngày cập nhật**: 2025-12-01
**Trạng thái**: **Đã tích hợp Live Network** (Connected to Besu)

## 1. Các thay đổi chính

### 1.1. Services mới (`backend/services/blockchain/`)
*   **`reward_service.py`**:
    *   Quản lý việc phát thưởng (Grant Reward).
    *   Trigger các hành động: `CREATE_POST`, `CREATE_COMMENT`, `RECEIVE_REACTION`, `PUBLISH_SCHOLARSHIP`.
*   **`service_manager.py`**:
    *   Quản lý việc thanh toán dịch vụ (Purchase Service).
    *   Trigger: `AI_PROFILE_MATCHING`.

### 1.2. API Updates
*   **Profile API** (`GET /api/v1/user/personal`):
    *   Trả về thêm `wallet_address` và `spt_balance`.
    *   Có cơ chế try-catch để không crash nếu lỗi ví.
*   **Community API**:
    *   Tự động gọi `reward_service` khi tạo bài viết, bình luận, hoặc like.
*   **Scholarship API**:
    *   Tự động gọi `reward_service` khi đăng học bổng mới.
*   **AI API** (`/profile-matching`):
    *   Kiểm tra số dư và trừ tiền qua `service_manager` trước khi chạy AI.
    *   Kiểm tra số dư và trừ tiền qua `service_manager` trước khi chạy AI.
*   **Wallet API** (Mới):
    *   `POST /api/v1/user/wallet`: Tạo ví thủ công cho user cũ (chưa có ví).
    *   **Auto-Create**: API `/register` đã được cập nhật để tự động tạo ví cho user mới.
*   **Fixes**:
    *   Profile Media Upload: Fix lỗi 500 khi upload avatar/banner.
    *   Wallet Service: Fix lỗi crash khi chạy Mock Mode.
### 1.3. Database Models
*   **User Model**: Đã thêm relationship `wallet` để link với bảng `user_wallets`.

## 2. Chế độ Mock Mode (Giả lập)

Để đảm bảo Backend có thể chạy được ngay cả khi chưa setup xong mạng Blockchain, hệ thống đã được cấu hình cơ chế **Mock Mode**:

1.  **Web3Client**: Nếu không kết nối được tới Besu (port 8545), sẽ in cảnh báo và bỏ qua các lệnh gửi transaction (trả về hash giả `0x00...`).
2.  **WalletService**: Nếu không có `WALLET_ENCRYPTION_KEY` trong biến môi trường, sẽ tự động sinh key tạm thời.
3.  **Master Wallet**: Nếu không cấu hình ví Master, sẽ in cảnh báo thay vì crash app.

**Lợi ích**: Dev có thể phát triển tính năng Web2 bình thường mà không bị block bởi Blockchain.

## 3. Hướng dẫn Test & Deploy

### 3.1. Test (Hiện tại)
*   Chạy `docker compose up`.
*   Theo dõi log: `docker compose logs -f backend`.
*   Thao tác trên Frontend/API (Đăng bài, xem profile...).
*   Kết quả: Log sẽ báo "Blockchain not connected. Transaction skipped." -> Logic đã chạy đúng luồng.

### 3.2. Deploy Live (Kết nối thật)
Để chạy thật, cần thực hiện:
1.  Khởi chạy mạng Besu (theo docs dự án).
2.  Deploy Smart Contracts (ScholarPoint, RewardManager...).
3.  Cập nhật file `backend/blockchain/contract_addresses.json` với địa chỉ thật.
4.  Cập nhật file `.env` với:
    *   `BESU_RPC_URL`
    *   `MASTER_WALLET_ADDRESS`
    *   `MASTER_WALLET_PRIVATE_KEY`
    *   `WALLET_ENCRYPTION_KEY`
5.  Restart Backend.
5.  Restart Backend.

## 4. Live Integration Details (2025-12-01)
*   **Status**: ✅ **VERIFIED LIVE**
*   **Network**: Hyperledger Besu (Chain ID: 1337)
*   **RPC URL**: `http://host.docker.internal:8545`
*   **Contracts Loaded**: ScholarPoint, RewardManager, ServiceManager, ScholarshipRegistry.

#### Critical Fixes Applied:
1.  **ABI Loading**: Fixed issue where `web3.py` failed to load Hardhat artifacts. Added logic to extract `abi` field from JSON.
2.  **Wallet Approval**: Fixed critical bug where `approve` transaction was built but never sent. Implemented full `sign_transaction` -> `send_raw_transaction` -> `wait_for_receipt` flow.
3.  **Web3 Compatibility**: Updated code to use `signed_tx.raw_transaction` (snake_case) instead of `rawTransaction` (camelCase) to match installed `web3` library version.

#### Verification Proof:
*   **Action**: User Registration -> Auto Wallet Creation -> Auto Approve ServiceManager.
*   **Result**: Transaction confirmed on-chain.
*   **Sample Tx Hash**: `cd7e1f5687bebfeb019a991a7fabbb9549b592a8b9812ebc357d48428f7b0a08` (Block 353).
Hệ thống đã được kết nối thành công với mạng Blockchain thật:

*   **Network**: Hyperledger Besu (Local)
*   **RPC URL**: `http://host.docker.internal:8545` (Mapped from host)
*   **Contracts Loaded**:
    *   ScholarPoint
    *   RewardManager
    *   ServiceManager
    *   ScholarshipRegistry
*   **Configuration**:
    *   ABI Files: Đã cập nhật vào `backend/blockchain/abis/`.
    *   Addresses: Đã cập nhật vào `backend/blockchain/contract_addresses.json`.
    *   Env Vars: Đã cập nhật vào `backend/.env`.
