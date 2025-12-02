# Chi tiết Thiết kế Module AI (AI Module Design Details)

Tài liệu này cung cấp các thông tin chi tiết về kỹ thuật cho Module AI của dự án ScholarHub, dựa trên phân tích source code hiện tại.

## 1. Model & Algorithm Specifics

### Embedding Model
*   **Model**: `OpenAIEmbeddings` (LangChain).
*   **Chi tiết**: Sử dụng model mặc định của OpenAI là `text-embedding-ada-002`.
*   **Dimension**: 1536 chiều.
*   **Source Code**: `backend/ai/core/LLMs.py`

### LLM (Large Language Model)
*   **Model**: `gpt-4o-mini`.
*   **Provider**: OpenAI (thông qua `ChatOpenAI` của LangChain).
*   **Temperature**: 0 (để đảm bảo tính nhất quán của kết quả).
*   **Source Code**: `backend/ai/core/LLMs.py`

### Resume Parser
*   **Phương pháp**: LLM-based Extraction (không dùng rule-based parser truyền thống).
*   **Quy trình**:
    1.  **Loader**: Sử dụng `PyPDFLoader` (LangChain) để đọc text từ file PDF.
    2.  **Extraction**: Sử dụng `gpt-4o-mini` với prompt đặc tả (`resumeExtract_prompt`) để trích xuất thông tin và chấm điểm các tiêu chí.
*   **Source Code**: `backend/ai/ProfileMatching/services/ResumeExtract.py`

### Matching Algorithm
Thuật toán so khớp (Profile Matching) được chia thành 2 phần:

1.  **Ordinal Criteria (Tiêu chí xếp hạng)**:
    *   **Các tiêu chí**: Education, Experience, Research, Achievement, Certification.
    *   **Công thức**: Tính tích vô hướng (Dot Product) giữa vector điểm của Profile và vector điểm của Scholarship.
    *   `Score_Ordinal = Σ (Profile_Vector_i • Scholarship_Vector_i * Weight_i)`
    *   **Source Code**: `backend/ai/ProfileMatching/services/ProfileMatch.py` (hàm `match_ordinal_criteria`)

2.  **Binary Criteria (Tiêu chí nhị phân)**:
    *   **Các tiêu chí**: Gender, Nationality.
    *   **Công thức**: So sánh chính xác (Exact Match).
    *   `Score_Binary = (Số lượng tiêu chí khớp / Tổng số tiêu chí nhị phân) * Weight_Binary`
    *   **Source Code**: `backend/ai/ProfileMatching/services/ProfileMatch.py` (hàm `match_binary_criteria`)

3.  **Tổng điểm**: `Total_Score = Score_Ordinal + Score_Binary`

## 2. FAISS Configuration

*   **Library**: `langchain_community.vectorstores.FAISS` & `faiss-cpu`.
*   **Index Type**: `IndexFlatL2` (Euclidean Distance).
    *   *Lưu ý*: Mặc dù code sử dụng `IndexFlatL2`, logic lọc (filter) trong hàm `get_relevant_by_threshold` có kiểm tra `IndexFlatIP` (Cosine) để quyết định dùng `>=` hay `<=`. Với L2, khoảng cách càng nhỏ càng tốt.
*   **Dimension**: 1536 (tương ứng với `text-embedding-ada-002`).
*   **Clusters**: 0 (Flat index, không sử dụng IVF hay HNSW).
*   **Search Parameters**:
    *   `k`: Retrieve toàn bộ index (`k=index_size`).
    *   `threshold`: `0.6` (Distance threshold).
*   **Source Code**: `backend/ai/SmartSearch/v1/Retriever.py`

## 3. RAG Pipeline Details

### Document Chunking
*   **Splitter**: `RecursiveCharacterTextSplitter`.
*   **Chunk Size**: 500 characters.
*   **Overlap**: 126 characters.
*   **Length Function**: `len`.
*   **Source Code**: `backend/helpers/DataLoader.py`

### Retrieval Strategy
*   **Phương pháp**: Retrieve & Filter.
    1.  Embed query người dùng.
    2.  Tìm kiếm tất cả các documents trong vector store (`similarity_search_with_score_by_vector`).
    3.  Lọc kết quả dựa trên ngưỡng `threshold = 0.6`.
*   **Top-K**: Code hiện tại trả về toàn bộ các documents thỏa mãn ngưỡng threshold, sau đó `SmartSearch.py` dùng LLM để chọn lọc lại (`scholarship_select` task).

### Context Window & Prompt
*   **Context Window**: Phụ thuộc vào `gpt-4o-mini` (128k tokens).
*   **Prompt Templates**: Được định nghĩa chi tiết trong `backend/ai/core/Prompts.py`.
    *   `scholarshipSummary_prompt`: Tóm tắt học bổng (max 150-200 từ).
    *   `scholarshipSelect_prompt`: Chọn ID học bổng phù hợp từ danh sách.
    *   `profileMatching_prompt`: Đánh giá mức độ phù hợp của hồ sơ.

## 4. Performance Metrics & Training

### Performance Metrics
*   Hiện tại **chưa có cơ chế đo lường tự động** (logging/monitoring) cho các chỉ số:
    *   Matching accuracy/precision.
    *   Recommendation hit rate.
    *   FAISS search latency.
    *   LLM response time.
*   Các chỉ số này cần được đo lường thông qua thực nghiệm hoặc log hệ thống khi deploy production.

### Training/Evaluation
*   **Fine-tuning**: Không sử dụng fine-tuning. Hệ thống sử dụng pre-trained model `gpt-4o-mini` với kỹ thuật Prompt Engineering (Few-shot/Zero-shot).
*   **Dataset**: Không có dataset training riêng biệt trong codebase. Dữ liệu học bổng được load từ database hoặc file JSON (`backend/artifacts/WebScrape/data.json`) để tạo vector index.
*   **Evaluation Metrics**: Chưa được định nghĩa trong code.
