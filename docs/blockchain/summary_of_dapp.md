# Phân tích ScholarhubPoint DApp

## 1. Tổng quan hệ thống
**ScholarhubPoint** là một hệ thống uy tín và trả thưởng phi tập trung được thiết kế cho nền tảng ScholarHub. Hệ thống sử dụng token ERC20 (**SPT**) để khuyến khích người dùng đóng góp (như chia sẻ học bổng) và kiếm tiền từ các dịch vụ cao cấp (như AI matching).

Hệ thống được xây dựng trên **Hardhat** và thiết kế để chạy trên mạng tương thích EVM (cụ thể là Hyperledger Besu trong dự án này).

## 2. Kiến trúc & Thành phần

Hệ thống bao gồm 4 smart contract cốt lõi tương tác với nhau để tạo thành một nền kinh tế token khép kín:

```mermaid
graph TD
    Owner[Admin/Owner] -->|Quản lý| SPT[ScholarPoint (SPT)]
    Owner -->|Quản lý| RM[RewardManager]
    Owner -->|Quản lý| SM[ServiceManager]
    Owner -->|Quản lý| SR[ScholarshipRegistry]

    RM -->|Mint (In)| SPT
    SM -->|Burn (Đốt)| SPT
    
    SR -->|Kích hoạt thưởng| RM
    
    User -->|Đăng bài| SR
    User -->|Mua dịch vụ| SM
    User -->|Nhận| SPT
```

### 2.1. ScholarPoint (SPT) - Token
*   **Loại**: ERC20 (OpenZeppelin).
*   **Vai trò**: Tiền tệ của hệ sinh thái.
*   **Tính năng chính**:
    *   **Kiểm soát truy cập**: Sử dụng mapping `minters` và `burners`. Chỉ các contract được ủy quyền mới có thể in hoặc đốt token.
    *   **Hạn chế chuyển khoản**: Có cờ `transfersRestricted`. Khi được bật (mặc định), người dùng chỉ có thể chuyển token đến các địa chỉ trong danh sách trắng (`allowedRecipients`). Điều này gợi ý mô hình token "Soulbound" hoặc bán hạn chế, nơi điểm thưởng được dùng để tích lũy và tiêu dùng trong nền tảng, không phải để giao dịch tự do ngay lập tức.
    *   **Giới hạn cung**: Tùy chọn `maxSupply`.

### 2.2. RewardManager - Nguồn vào (Faucet)
*   **Vai trò**: Phân phối SPT cho người dùng khi có hành động tích cực.
*   **Quyền hạn**: Phải là `minter` trong contract `ScholarPoint`.
*   **Hành động được thưởng**:
    *   `CREATE_POST`, `CREATE_COMMENT`, `RECEIVE_REACTION`: Tương tác cộng đồng.
    *   `PUBLISH_SCHOLARSHIP`, `SCHOLARSHIP_APPROVED`: Đóng góp nội dung.
*   **Cơ chế chống lạm dụng**:
    *   **Cooldowns (Thời gian chờ)**: Thời gian tối thiểu giữa các hành động (ví dụ: không thể spam bình luận liên tục).
    *   **Daily Limits (Giới hạn ngày)**: Số lượng SPT tối đa người dùng có thể kiếm mỗi ngày cho từng loại hành động.
*   **Operators**: Chỉ các `operators` được ủy quyền (thường là backend services hoặc contract khác như `ScholarshipRegistry`) mới có thể kích hoạt hàm `grantReward`.

### 2.3. ServiceManager - Nguồn ra (Sink)
*   **Vai trò**: Thu hồi SPT để đổi lấy dịch vụ.
*   **Quyền hạn**: Phải là `burner` trong contract `ScholarPoint`.
*   **Dịch vụ**:
    *   `AI_RECOMMENDATION`: 3 SPT.
    *   `AI_PROFILE_MATCHING`: 5 SPT.
*   **Cơ chế**: Khi người dùng mua dịch vụ, số SPT tương ứng sẽ bị **đốt** (loại bỏ khỏi lưu thông), tạo áp lực giảm phát.
*   **Tính năng**: Hỗ trợ dịch vụ theo thời gian (có ngày hết hạn) và dịch vụ dùng một lần.

### 2.4. ScholarshipRegistry - Logic cốt lõi
*   **Vai trò**: Quản lý vòng đời của các bài đăng học bổng.
*   **Quy trình**:
    1.  **Đăng bài**: Người dùng gọi `publishScholarship`. Contract lưu IPFS hash và metadata. -> Kích hoạt `RewardManager` để thưởng cho người đăng.
    2.  **Duyệt/Từ chối**: Admin gọi `approveScholarship`. -> Kích hoạt `RewardManager` để tặng "Thưởng thêm" (Bonus Reward) khi được duyệt.
*   **Tích hợp**: Chứa tham chiếu đến `RewardManager` để tự động hóa quy trình trả thưởng.

## 3. Phân tích luồng hoạt động

### 3.1. Luồng kiếm điểm (Minting)
1.  Người dùng đăng học bổng qua `ScholarshipRegistry`.
2.  `ScholarshipRegistry` ghi nhận dữ liệu.
3.  `ScholarshipRegistry` gọi `RewardManager.grantReward(user, PUBLISH_SCHOLARSHIP)`.
4.  `RewardManager` kiểm tra giới hạn/thời gian chờ.
5.  `RewardManager` gọi `ScholarPoint.mint(user, amount)`.
6.  Người dùng nhận được SPT.

### 3.2. Luồng tiêu điểm (Burning)
1.  Người dùng muốn sử dụng "AI Profile Matching".
2.  Người dùng gọi `ServiceManager.purchaseService(AI_PROFILE_MATCHING)`.
3.  `ServiceManager` kiểm tra số dư người dùng.
4.  `ServiceManager` gọi `ScholarPoint.burnFrom(user, cost)`.
5.  `ServiceManager` ghi nhận thời hạn/lượt dùng dịch vụ.
6.  Người dùng được cấp quyền truy cập dịch vụ AI off-chain (xác minh qua hàm `hasActiveService`).

## 4. Bảo mật & Kiểm soát truy cập
*   **Ownable**: Tất cả contract đều kế thừa `Ownable`. Chủ sở hữu (Owner) có quyền lực lớn (thêm/xóa minter, thay đổi mức thưởng, duyệt học bổng).
*   **ReentrancyGuard**: Được sử dụng trong `RewardManager`, `ServiceManager`, và `ScholarshipRegistry` để ngăn chặn tấn công tái nhập (reentrancy attacks).
*   **Phân quyền**:
    *   `ScholarPoint` tách biệt vai trò `minter` và `burner`.
    *   `RewardManager` sử dụng `operators` để hạn chế ai có thể kích hoạt trả thưởng (ngăn người dùng tự gọi `grantReward`).

## 5. Kết luận
Hệ thống **ScholarhubPoint** là một nền kinh tế token khép kín được cấu trúc tốt. Nó cân bằng hiệu quả giữa **khuyến khích** (thông qua `RewardManager`) và **tính bền vững** (thông qua cơ chế đốt của `ServiceManager`).

**Điểm mạnh**:
*   **Thiết kế mô-đun**: Tách biệt rõ ràng các mối quan tâm (Token vs Thưởng vs Dịch vụ vs Registry).
*   **Chống Spam**: Cơ chế cooldown và giới hạn ngày là rất quan trọng cho hệ thống trả thưởng.
*   **Giá trị**: Cơ chế đốt đảm bảo token có tính ứng dụng và không bị lạm phát vô hạn.
*   **Kiểm soát lưu thông**: Tính năng hạn chế chuyển khoản cho phép nền tảng ngăn chặn đầu cơ sớm hoặc giao dịch chợ đen.

**Cải thiện/Ghi chú**:
*   **Tập trung hóa**: Hệ thống phụ thuộc nhiều vào `Owner` để phê duyệt và cấu hình.
*   **Phụ thuộc Oracle**: Các `operators` trong `RewardManager` có thể đóng vai trò như oracle cho các hoạt động off-chain (như bình luận/bài đăng nếu chúng không nằm on-chain).
*   **Khả năng nâng cấp**: Các contract hiện tại không có khả năng nâng cấp (không thấy sử dụng Proxy pattern). Nếu logic cần thay đổi, việc di chuyển (migration) có thể phức tạp.

## 6. Trạng thái Tích hợp (Cập nhật 2025-12-01)
*   **Blockchain Network**: Đã khởi chạy thành công (Quorum Dev Quickstart).
*   **Smart Contracts**: Đã deploy thành công lên mạng testnet nội bộ.
*   **Backend Integration**:
    *   Đã kết nối thành công với RPC node.
    *   Đã thực hiện được transaction tạo ví và cấp quyền (Approve) cho ServiceManager.
    *   Đã xác minh transaction hiển thị trên Block Explorer/Web Interface.
