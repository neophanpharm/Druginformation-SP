# Drug Information Bulletin Pipeline (Bản Tin Thông Tin Thuốc)

Hệ thống pipeline hỗ trợ tiếp nhận, trích xuất dữ liệu lâm sàng và biên tập **Bản tin thông tin thuốc** tiếng Việt từ các tài liệu khoa học y dược đầu vào (PDF, DOCX, Markdown, TXT) dành cho nhân viên y tế và dược sĩ lâm sàng.

---

## 📌 Đặc điểm nổi bật

- **Chuẩn mực Y học Chứng cứ (EBM)**: Phân định ranh giới rõ ràng giữa các loại nguy cơ ($HR$, $RR$, $OR$), quy tắc tính toán $ARR$/$NNT$, thử nghiệm không thua kém (*non-inferiority*), và nghiêm cấm ngôn từ quảng cáo/tiếp thị.
- **Truy xuất bằng chứng (Evidence Traceability)**: Mọi nhận định, số liệu đều được gắn mã nguồn ($S01, S02...$), trang PDF, đoạn văn $P$ hoặc bảng biểu $T$ trong tài liệu gốc.
- **Phân tách trách nhiệm**: Script tự động chỉ trích xuất dữ liệu thô (ETL), việc phân tích, tổng hợp và kiểm tra lâm sàng do AI Agent và con người đảm nhiệm.

---

## 📂 Cấu trúc thư mục

```text
├── Input/               # Chứa tài liệu nguồn đầu vào (PDF, DOCX, MD, TXT)
├── output/              # Chứa bản tin hoàn thiện (output/<ten-ban-tin>.md)
├── templates/           # Thư mục chứa các mẫu bản tin (template) tham chiếu
│   └── ban-tin-mac-dinh.md
├── work/                # Thư mục hồ sơ làm việc trung gian (brief, manifest, evidence, qa)
│   ├── validate_setup.py
│   └── setup-validation.md
├── .agents/skills/drug-bulletin/
│   ├── SKILL.md         # Khai báo Agent Skill
│   ├── references/      # Quy chuẩn y khoa & checklist kiểm tra
│   │   └── protocol.md
│   └── scripts/         # Script trích xuất tài liệu
│       └── extract_sources.py
├── AGENTS.md            # Nguyên tắc hoạt động của Agent trong workspace
├── PIPELINE.md          # Quy trình chi tiết 7 giai đoạn biên tập
└── README.md
```

---

## 🔄 Quy trình biên tập 7 giai đoạn

| Giai đoạn | Việc thực hiện | Hồ sơ trong `work/` |
|---|---|---|
| **1. Tiếp nhận** | Chọn nguồn, xác định chủ đề, độc giả, mẫu và ngày chốt nguồn | `brief.md` |
| **2. Trích xuất** | Chuyển văn bản, giữ trang PDF hoặc đoạn/bảng DOCX; đánh dấu lỗi đọc | `extracted/`, `manifest.json` |
| **3. Lập bằng chứng** | Đọc toàn văn và bảng/biểu đồ, ghi số liệu cùng vị trí nguồn | `evidence.md` |
| **4. Lập dàn ý** | Chọn thông điệp, mức độ chắc chắn và giới hạn áp dụng | `outline.md` |
| **5. Viết nháp** | Viết tiếng Việt theo mẫu, gắn trích dẫn với phát biểu | `draft.md` |
| **6. Kiểm tra (QA)** | Đối chiếu số liệu, diễn giải, nguồn, cấu trúc và câu chữ theo checklist | `qa.md` |
| **7. Xuất bản** | Lưu bản tin đã kiểm tra hoàn tất | `output/<ten-ban-tin>.md` |

---

## 🚀 Hướng dẫn sử dụng

### 1. Yêu cầu môi trường
- Python 3.10+
- Thư viện đọc PDF: `pymupdf` (hoặc `pypdf`)
```bash
pip install pymupdf
```

### 2. Trích xuất tài liệu
Đặt các tài liệu tham khảo vào thư mục `Input/`, sau đó chạy:
```powershell
python .agents/skills/drug-bulletin/scripts/extract_sources.py --input Input --work work/<ten-ban-tin>
```
*(Thêm `--files "Input/bai-1.pdf"` nếu chỉ muốn trích xuất các file được chỉ định).*

### 3. Kiểm thử môi trường
Chạy script kiểm thử để xác minh toàn bộ tính năng trích xuất:
```powershell
python work/validate_setup.py
```
