# Ghi chú Tích hợp Blockchain (Version 1)

**Ngày cập nhật**: 2025-12-01
**Trạng thái**: ✅ **HOÀN TOÀN HOẠT ĐỘNG** (Live Network + Social Rewards)

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

## 5. Social Rewards Implementation (2025-12-01)

### 5.1. Features Implemented
✅ **Automatic Rewards** for social interactions:
*   **Create Post**: 10 SPT
*   **Create Comment**: 2 SPT
*   **Receive Reaction (Like)**: 1 SPT (awarded to post author)
*   **Publish Scholarship**: 50 SPT
*   **Scholarship Approved**: 100 SPT (bonus)

### 5.2. Critical Fixes Applied
1.  **Operator Permission**: Added Master Wallet as Operator in RewardManager contract
    *   Issue: All reward transactions were reverting (Status: 0)
    *   Fix: Called `RewardManager.addOperator(master_wallet)`
    *   Tx: `f5e7a45e0aed4728e8e3ca1926c103448aee47203e487b53fc25fd2652b6eb60`

2.  **Balance Display Format**: Convert Wei to Ether in backend
    *   Issue: Frontend displayed `12000000000000000000` instead of `12`
    *   Fix: Modified `wallet_service.get_balance()` to divide by `10^18`
    *   Location: `backend/services/blockchain/wallet_service.py:121-128`

3.  **Balance Sync Issue**: Wait for transaction confirmation
    *   Issue: Balance "lagged by 1 action" (race condition)
    *   Fix: Added `wait_for_receipt()` in `reward_service.grant_reward_by_address()`
    *   Trade-off: API response ~1-2s slower, but balance always accurate
    *   Location: `backend/services/blockchain/reward_service.py:47-56`

### 5.3. Files Modified
*   `backend/services/blockchain/web3_client.py`: Fixed `raw_transaction` attribute
*   `backend/services/blockchain/reward_service.py`: Implemented reward granting with receipt wait
*   `backend/services/blockchain/wallet_service.py`: Wei to Ether conversion
*   `backend/api/v1/community/Posts.py`: Reward calls already present (verified working)

### 5.4. Verification Results
*   **On-chain Balance**: Verified correct (12 SPT for 1 Post + 1 Comment)
*   **Transaction Status**: All reward transactions confirmed (Status: 1)
*   **Frontend Display**: Correct balance display after refresh
*   **Scholarship Rewards**: Tested and working

## 6. AI Service Payment Implementation (2025-12-01)

### 6.1. Features Implemented
✅ **Pay-per-use AI Services**:
*   **Profile Re-evaluation** (`PUT /api/v1/user/re-evaluate`): 3 SPT
*   **Profile Matching** (`POST /api/v1/profile-matching`): 5 SPT
*   **Scholarship Recommendation** (`GET /api/v1/scholarship?suggest=true`): FREE (browsing only)

### 6.2. Architecture

**Service Provider Model**:
- Backend acts as a Service Provider in the `ServiceManager` contract
- Uses `consumeService(userAddress, serviceType)` to charge users
- Master Wallet must be added as a Service Provider

**Payment Flow**:
1. User calls AI endpoint (e.g., `/re-evaluate`)
2. Backend checks user's wallet and balance
3. Backend calls `ServiceManager.consumeService()` to burn SPT from user
4. Transaction waits for confirmation (~1-2s)
5. If successful, AI service is provided
6. If failed, returns 402 Payment Required

### 6.3. Critical Fixes Applied

1.  **Service Provider Permission**: Added Master Wallet as Service Provider
    *   Issue: `consumeService` requires caller to be a Service Provider
    *   Fix: Called `ServiceManager.addServiceProvider(master_wallet)`
    *   Tx: `50345f9d39fe70b77606204c0225ec0748435cb8463dac402579fd3909f2deb4`

2.  **Wrong Contract Function**: Changed from `purchaseService` to `consumeService`
    *   Issue: `purchaseService` uses `msg.sender` as user (would be Master Wallet)
    *   Fix: Use `consumeService(userAddress, serviceType)` designed for service providers
    *   Location: `backend/services/blockchain/service_manager.py:23-38`

3.  **Endpoint Selection**: Moved payment to correct endpoints
    *   Issue: User wanted payment only for `/re-evaluate`, not regular recommendation
    *   Fix: Removed payment from `GET /scholarship?suggest=true`
    *   Added payment to `PUT /user/re-evaluate`
    *   Locations: 
        - `backend/api/v1/scholarship.py:35-37`
        - `backend/api/v1/profile/profile.py:74-98`

### 6.4. Files Modified
*   `backend/services/blockchain/service_manager.py`: Changed to use `consumeService`
*   `backend/api/v1/profile/profile.py`: Added payment to `/re-evaluate` endpoint
*   `backend/api/v1/scholarship.py`: Removed payment from recommendation (kept free)

### 6.5. Verification Results
*   **Service Provider**: Master Wallet successfully added
*   **Payment Flow**: Tested and working
*   **Balance Deduction**: Correctly burns SPT from user
*   **Error Handling**: Returns 402 when insufficient balance

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
