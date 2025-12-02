# Chi tiết Kỹ thuật Module Blockchain

## 1. Triển khai Smart Contract

### Tối ưu hóa Gas
*   **Các kỹ thuật được sử dụng:**
    *   **Xử lý hàng loạt (Batch Processing):** `RewardManager.grantBatchRewards` và `ScholarshipRegistry.batchApproveScholarships` cho phép xử lý nhiều mục trong một giao dịch duy nhất để giảm chi phí giao dịch cơ bản.
    *   **Kiểm tra đầu vào & Giới hạn:** Các vòng lặp trong các hàm batch được giới hạn rõ ràng (ví dụ: `require(users.length <= 100)` trong `RewardManager`) để ngăn chặn các cuộc tấn công "Out of Gas" (DoS).
    *   **Logic ngắt mạch (Short-circuiting):** Logic trong các vòng lặp sử dụng `continue` để bỏ qua các mục không hợp lệ (ví dụ: địa chỉ 0 hoặc phần thưởng bằng 0) sớm, tiết kiệm gas cho các thao tác ghi storage không cần thiết.
    *   **Lưu trữ hiệu quả:** Sử dụng `mapping` cho thời gian truy cập O(1). Các struct `Scholarship` sử dụng kiểu `string` động cho IPFS hash và tiêu đề (cần thiết dù tốn gas), nhưng logic cốt lõi dựa trên ID `uint256`.
*   **Chi phí Gas trung bình:**
    *   *Lưu ý: Chi phí chính xác phụ thuộc vào điều kiện mạng và kích thước dữ liệu.*
    *   **Minting (Trả thưởng):** ~65,000 - 80,000 gas (SSTORE cho số dư + Events).
    *   **Burning (Dịch vụ):** ~65,000 - 80,000 gas.
    *   **Thao tác hàng loạt:** ~30,000 gas cơ bản + ~40,000 gas mỗi mục (Hiệu quả hơn so với các giao dịch riêng lẻ).

### Cấu trúc Events
**ScholarPoint (SPT)**
*   `MinterAdded(address indexed minter)`
*   `BurnerAdded(address indexed burner)`
*   `RecipientWhitelisted(address indexed recipient, bool status)`
*   `TransfersRestrictedUpdated(bool restricted)`
*   `MaxSupplyUpdated(uint256 newMaxSupply)`

**RewardManager**
*   `OperatorAdded(address indexed operator)`
*   `OperatorRemoved(address indexed operator)`
*   `RewardClaimed(address indexed user, ActionType actionType, uint256 amount)`
*   `RewardAmountUpdated(ActionType actionType, uint256 newAmount)`
*   `CooldownUpdated(ActionType actionType, uint256 newCooldown)`
*   `DailyLimitUpdated(ActionType actionType, uint256 newLimit)`

**ServiceManager**
*   `ServiceProviderAdded(address indexed provider)`
*   `ServiceProviderRemoved(address indexed provider)`
*   `ServicePurchased(address indexed user, ServiceType indexed serviceType, uint256 cost, uint256 expiryTimestamp)`
*   `ServiceCostUpdated(ServiceType indexed serviceType, uint256 newCost)`
*   `TokensBurned(address indexed user, uint256 amount)`

**ScholarshipRegistry**
*   `ScholarshipPublished(uint256 indexed id, address indexed publisher, string ipfsHash, string title)`
*   `ScholarshipApproved(uint256 indexed id)`
*   `ScholarshipRejected(uint256 indexed id)`
*   `RewardManagerUpdated(address indexed newRewardManager)`

### Chi tiết Kiểm soát Truy cập
*   **Cơ chế:** Hệ thống sử dụng `Ownable` (admin đơn lẻ) kết hợp với các mapping boolean tùy chỉnh để quản lý vai trò chi tiết. Hệ thống **không** sử dụng `AccessControl` của OpenZeppelin (các role bytes32).
*   **Các vai trò:**
    *   **Owner:** Super-admin cho tất cả các contract (có thể thêm/xóa các role khác).
    *   **Minter (trong ScholarPoint):** Có thể mint token mới. Được gán cho `RewardManager`.
    *   **Burner (trong ScholarPoint):** Có thể burn token của người dùng. Được gán cho `ServiceManager`.
    *   **Operator (trong RewardManager):** Có thể kích hoạt phân phối phần thưởng.
    *   **ServiceProvider (trong ServiceManager):** Có thể kích hoạt cấp/tiêu thụ dịch vụ.

## 2. Chi tiết Token Economics

### Nguồn cung ban đầu (Initial Supply)
*   **Phân bổ Genesis:** File `QBFTgenesis.json` xác định phân bổ ban đầu cho một số địa chỉ.
*   **Các phân bổ chính:**
    *   5 tài khoản được cấp trước **1,000,000,000 SPT** (1 Tỷ) mỗi tài khoản.
    *   2 tài khoản được cấp trước **90,000 SPT**.
    *   1 tài khoản với ~13 SPT.
*   **Tổng cung ban đầu:** ~5,000,180,013 SPT.

### Nguồn cung tối đa (Max Supply)
*   **Cap:** Có thể cấu hình qua biến `maxSupply` trong `ScholarPoint`.
*   **Trạng thái hiện tại:** Constructor cho phép thiết lập cap. Nếu đặt là `0`, nguồn cung là không giới hạn.
*   **Điều chỉnh:** Owner có thể cập nhật max supply bằng hàm `setMaxSupply`, miễn là cap mới không thấp hơn tổng cung hiện tại.

### Phân phối (Distribution)
*   **Minting (Lạm phát):** Token được mint động bởi `RewardManager` khi người dùng thực hiện các hành động có giá trị (Tạo bài viết, bình luận, học bổng).
    *   *Tạo bài viết:* 10 SPT
    *   *Tạo bình luận:* 2 SPT
    *   *Nhận reaction:* 1 SPT
    *   *Đăng học bổng:* 50 SPT
    *   *Học bổng được duyệt:* 100 SPT
*   **Burning (Giảm phát):** Token bị burn bởi `ServiceManager` khi người dùng mua các dịch vụ AI.
    *   *Gợi ý AI (AI Recommendation):* 3 SPT
    *   *Khớp hồ sơ AI (AI Profile Matching):* 5 SPT

### Tỷ lệ lạm phát
*   **Động:** Không có tỷ lệ lạm phát cố định. Nguồn cung mở rộng dựa trên hoạt động của người dùng (thưởng) và thu hẹp dựa trên việc sử dụng dịch vụ (burn).

## 3. Cơ chế Bảo mật

### Chi tiết chống lạm dụng (Anti-abuse)
*   **Cooldown (Thời gian chờ):** Cấu hình được cho từng loại hành động trong `RewardManager`.
    *   *Mặc định:* 0 giây (trừ khi được admin cập nhật).
*   **Giới hạn ngày (Daily Limits):** Cấu hình được cho từng loại hành động trong `RewardManager`.
    *   *Nhận Reaction:* Tối đa 50 SPT/ngày.
    *   *Tạo bình luận:* Tối đa 20 SPT/ngày.
*   **Quản lý Nonce:** Được xử lý tự nhiên bởi client Besu và giao thức Ethereum.

### Bảo mật Hợp đồng
*   **Chống Reentrancy:** `ReentrancyGuard` (OpenZeppelin) được sử dụng trên tất cả các hàm external thay đổi trạng thái (`grantReward`, `purchaseService`, `publishScholarship`, v.v.) để ngăn chặn tấn công tái nhập.
*   **Kiểm soát truy cập:** Kiểm tra `onlyOwner` chặt chẽ cho các thay đổi cấu hình.
*   **Dừng khẩn cấp (Emergency Pause):** **Chưa triển khai.** Không có chức năng `Pausable` để đóng băng contract trong trường hợp khẩn cấp.
*   **Trạng thái Audit:** Chỉ review nội bộ. Chưa được audit bởi CertiK hay OpenZeppelin.

## 4. Chi tiết Mạng Blockchain

### Đồng thuận QBFT (Quorum Byzantine Fault Tolerance)
*   **Thời gian Block:** 5 giây (`blockperiodseconds`: 5).
*   **Độ dài Epoch:** 30,000 blocks.
*   **Request Timeout:** 10 giây.
*   **Giới hạn kích thước Block (Gas Limit):** `0xf7b760` (khoảng 16,234,336 gas).
*   **Thông lượng giao dịch (TPS):** Phụ thuộc vào phần cứng node, nhưng QBFT thường hỗ trợ hàng trăm TPS với thời gian block 5s.

### Cấu hình Node
*   **Client:** Hyperledger Besu.
*   **Quy mô mạng:** 4 Validators + 1 RPC Node + 3 Member Nodes (Tổng cộng 8 node Besu).
*   **Riêng tư:** Tessera được cấu hình cho các Member node (chế độ Orion) để cho phép giao dịch riêng tư.
*   **Yêu cầu tài nguyên:**
    *   *Lưu ý:* Không có giới hạn tài nguyên (CPU/RAM) cụ thể được định nghĩa trong `docker-compose.yml`.
    *   *Khuyến nghị:* Yêu cầu tiêu chuẩn của Besu (ví dụ: 8GB+ RAM, 2-4 vCPUs) để đảm bảo đồng thuận QBFT ổn định.
