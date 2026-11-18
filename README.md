# Drug Information Bulletin Pipeline (Bản Tin Thông Tin Thuốc)

Hệ thống pipeline hỗ trợ tiếp nhận, trích xuất dữ liệu lâm sàng và biên tập **Bản tin thông tin thuốc** tiếng Việt từ các tài liệu khoa học y dược đầu vào (PDF, DOCX, Markdown, TXT) dành cho nhân viên y tế và dược sĩ lâm sàng.

---

## 📌 Đặc điểm nổi bật

- **Chuẩn mực Y học Chứng cứ (EBM)**: Phân định ranh giới rõ ràng giữa các loại nguy cơ (HR, RR, OR), quy tắc tính toán ARR/NNT, thử nghiệm không thua kém (*non-inferiority*), và nghiêm cấm ngôn từ quảng cáo/tiếp thị.
- **Văn phong Y khoa Tiếng Việt Chuẩn mực (`drug-bulletin-writer`)**: Cấu trúc đoạn văn chuyên khảo 3 lớp, khử triệt để câu dịch máy lủng củng (`việc/sự`, bị động rườm rà, câu quá dài nhiều mệnh đề).
- **Truy xuất bằng chứng (Evidence Traceability)**: Mọi nhận định, số liệu đều được gắn mã nguồn (S01, S02...), trang PDF, đoạn văn P hoặc bảng biểu T trong tài liệu gốc.
- **Xuất bản song song Markdown & Word (.docx) chuẩn y tế**: Đồng bộ 100% phông chữ Times New Roman (không lỗi nhảy font tiếng Việt), khổ A4, bảng biểu lặp tiêu đề và danh mục tham khảo thụt lề treo độc lập 1–N.

---

## 📂 Cấu trúc thư mục

```text
├── Input/               # Chứa tài liệu nguồn đầu vào (PDF, DOCX, MD, TXT)
├── output/              # Chứa bản tin hoàn thiện (<ten-ban-tin>.md và <ten-ban-tin>.docx)
├── templates/           # Thư mục chứa các mẫu bản tin (template) tham chiếu
│   └── ban-tin-mac-dinh.md
├── work/                # Thư mục hồ sơ làm việc trung gian (brief, manifest, evidence, draft, qa)
│   ├── validate_setup.py
│   └── setup-validation.md
├── .agents/skills/
│   ├── drug-bulletin/           # Skill điều phối quy trình 7 giai đoạn
│   │   ├── SKILL.md
│   │   ├── references/
│   │   │   └── protocol.md
│   │   └── scripts/
│   │       ├── extract_sources.py
│   │       └── export_docx.py
│   ├── drug-bulletin-writer/    # Skill viết & gọt câu tiếng Việt y khoa (Giai đoạn 5 - draft.md)
│   │   └── SKILL.md
│   └── drug-video/              # Skill video animation 3D/2.5D thông tin thuốc (BV Xanh Pôn)
│       ├── SKILL.md
│       └── references/          # motion-design.md, qa-checklist.md
├── brand/               # Logo, brand.json (màu, font, slogan, disclaimer, nhạc, giọng đọc)
├── video-studio/        # Dự án Remotion dựng video (node_modules bị ignore)
├── scripts/video/       # elevenlabs_tts.py (lồng tiếng dự phòng qua API key)
├── AGENTS.md            # Nguyên tắc hoạt động của Agent trong workspace
├── PIPELINE.md          # Quy trình chi tiết 7 giai đoạn biên tập
├── PIPELINE-VIDEO.md    # Quy trình 10 bước làm video thông tin thuốc
└── README.md
```

---

## 🎬 Video thông tin thuốc

Pipeline 10 bước trong `PIPELINE-VIDEO.md`, skill `.agents/skills/drug-video/`:
1. tổng hợp `facts.md` có nguồn;
2. kịch bản (duyệt);
3. timestamp;
4. mô tả hình 3D/2.5D;
5. prototype (duyệt);
6. dựng Remotion;
7. lồng tiếng ElevenLabs, phụ đề karaoke, nhạc nền tự hạ âm lượng (duyệt credit);
8. render;
9. QA;
10. xuất bản MP4, SRT, thumbnail, file nguồn PMID và mô tả đăng bài vào `output/video/`.

Video có chữ, footer PMID ở mỗi cảnh, disclaimer, logo và slogan Bệnh viện Đa khoa Xanh Pôn.

---

## 🔄 Quy trình biên tập 7 giai đoạn

| Giai đoạn | Việc thực hiện | Hồ sơ trong `work/` |
|---|---|---|
| **1. Tiếp nhận** | Chọn nguồn, xác định chủ đề, độc giả, mẫu và ngày chốt nguồn | `brief.md` |
| **2. Trích xuất** | Chuyển văn bản, giữ trang PDF hoặc đoạn/bảng DOCX; đánh dấu lỗi đọc | `extracted/`, `manifest.json` |
| **3. Lập bằng chứng** | Đọc toàn văn và bảng/biểu đồ, ghi số liệu cùng vị trí nguồn | `evidence.md` |
| **4. Lập dàn ý** | Chọn thông điệp, mức độ chắc chắn và giới hạn áp dụng | `outline.md` |
| **5. Viết bản thảo** | Áp dụng `drug-bulletin-writer` để viết & gọt câu tiếng Việt chuyên khảo, gắn trích dẫn | `draft.md` |
| **6. Kiểm tra (QA)** | Đối chiếu số liệu, diễn giải, nguồn, cấu trúc và câu chữ theo checklist | `qa.md` |
| **7. Xuất bản** | Xuất bản tin song song ra Markdown và Word (.docx) chuẩn y tế | `output/<ten-ban-tin>.md`, `output/<ten-ban-tin>.docx` |

---

## 🚀 Hướng dẫn sử dụng

### 1. Yêu cầu môi trường
- Python 3.10+
- Thư viện đọc PDF: `pymupdf` (hoặc `pypdf`)
- Thư viện xuất Word: `python-docx`
```bash
pip install pymupdf python-docx
```

### 2. Trích xuất tài liệu
Đặt các tài liệu tham khảo vào thư mục `Input/`, sau đó chạy:
```powershell
python .agents/skills/drug-bulletin/scripts/extract_sources.py --input Input --work work/<ten-ban-tin>
```
*(Thêm `--files "Input/bai-1.pdf"` nếu chỉ muốn trích xuất các file được chỉ định).*

Mã thoát: `0` trích xuất đạt; `1` đã trích xuất nhưng có nguồn cần kiểm tra trực quan (`needs_review`, ví dụ trang PDF ít chữ); `2` có nguồn lỗi, không trích xuất được gì, hoặc file chỉ định bằng `--files` không được hỗ trợ. Khi quét cả thư mục, file ẩn (`.gitkeep`) và file khóa Office (`~$*`) được bỏ qua; file không hỗ trợ (ảnh, xlsx, pptx) chỉ được liệt kê, không làm lần chạy thất bại.

### 3. Xuất bản tin sang Word
```powershell
python .agents/skills/drug-bulletin/scripts/export_docx.py --input output/<ten-ban-tin>.md --output output/<ten-ban-tin>.docx
```
Script dừng (mã thoát 2, không tạo DOCX) nếu Markdown còn mã LaTeX thô hoặc tham chiếu hình không tồn tại; xem quy chuẩn định dạng và cú pháp được hỗ trợ trong `PIPELINE.md`.

### 4. Kiểm thử môi trường
Chạy script kiểm thử để xác minh tính năng trích xuất và xuất DOCX:
```powershell
python work/validate_setup.py
```
