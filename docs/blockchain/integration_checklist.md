# Checklist Tích hợp Blockchain Network (Backend <-> Blockchain)

**Mục tiêu**: Kết nối Backend hiện tại với source Blockchain Network đã có sẵn.

## 1. Chuẩn bị Mạng Blockchain (Network Setup)
*   [x] **Khởi chạy Network**: Sử dụng source có sẵn để chạy mạng Hyperledger Besu/Quorum (thường là `docker-compose up`).
*   [x] **Verify Connection**: Đảm bảo node Besu đang chạy và mở port RPC (thường là `8545`).
    *   Test: `curl -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://localhost:8545`

## 2. Deploy Smart Contracts
Cần deploy bộ 4 contracts theo đúng thứ tự (do phụ thuộc lẫn nhau):

1.  [x] **ScholarPoint (SPT)**: Token ERC20.
2.  [x] **RewardManager**: Quản lý thưởng (Cần set là `minter` của SPT).
3.  [x] **ServiceManager**: Quản lý dịch vụ (Cần set là `burner` của SPT).
4.  [x] **ScholarshipRegistry**: Quản lý học bổng (Cần set là `operator` của RewardManager).

**Lưu ý sau khi deploy**:
*   [x] Ghi lại **địa chỉ (address)** của cả 4 contracts.
*   [x] Ghi lại **Private Key** của ví deployer (sẽ dùng làm Master Wallet).

## 3. Cấu hình Backend
Cập nhật thông tin vào Backend để kết nối mạng thật.

### 3.1. Cập nhật Contract Addresses
*   File: `backend/blockchain/contract_addresses.json`
*   Nội dung:
    ```json
    {
      "ScholarPoint": "0x...",
      "RewardManager": "0x...",
      "ServiceManager": "0x...",
      "ScholarshipRegistry": "0x..."
    }
    ```

### 3.2. Cập nhật Biến môi trường (.env)
*   File: `backend/.env` (hoặc `.env.blockchain`)
*   Variables:
    ```env
    BESU_RPC_URL=http://localhost:8545  # Hoặc IP của máy chạy blockchain
    BESU_NETWORK_ID=1337                # Chain ID của mạng
    MASTER_WALLET_ADDRESS=0x...         # Ví Admin/Deployer
    MASTER_WALLET_PRIVATE_KEY=...       # Private Key của ví Admin
    WALLET_ENCRYPTION_KEY=...           # Key mã hóa ví user (Fernet key)
    ```

## 4. Verification (Kiểm thử)
Sau khi cấu hình xong, restart Backend và test các luồng:

1.  [x] **Khởi động**: Log backend không còn báo "Warning: Cannot connect to Besu".
2.  [x] **Tạo ví**: User mới đăng ký -> Check log xem có tạo ví thành công không.
3.  [x] **Nhận thưởng**: Đăng bài viết -> Check balance user tăng lên.
4.  [x] **Dịch vụ**: Chạy AI Matching -> Check balance user giảm đi.

## 5. Troubleshooting Common Issues
*   **Nonce too low**: Do Master Wallet gửi transaction liên tục, cần reset nonce hoặc chờ block mới.
*   **Gas limit exceeded**: Tăng `GAS_LIMIT` trong `web3_client.py` nếu cần.
*   **Revert**: Check quyền (Role) trong Smart Contract (ví dụ: RewardManager chưa được cấp quyền Mint).
