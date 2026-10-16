# Pipeline bản tin thông tin thuốc

## Cách dùng

Đặt các bài báo hoặc hướng dẫn lâm sàng vào `Input/`, rồi yêu cầu agent:

> Viết bản tin thông tin thuốc từ Input theo pipeline của workspace, xuất song song Markdown và Word.

Hoặc chỉ định chủ đề, đối tượng và nguồn:

> Viết chuyên đề từ Input/IDSA 2026.pdf cho dược sĩ lâm sàng và bác sĩ điều trị, trình bày dạng đoạn văn chuyên khảo sâu, hạn chế gạch đầu dòng.

Ngôn ngữ đầu ra bắt buộc: **tiếng Việt**. Mặc định: độc giả là dược sĩ và nhân viên y tế. Thân bài được trình bày dưới dạng các đoạn văn phân tích chuyên khảo hoàn chỉnh, lập luận logic, liên kết chặt chẽ để tóm tắt và truyền tải lượng dữ liệu lâm sàng/vi sinh lớn nhất.

---

## Các giai đoạn và hồ sơ công việc

| Giai đoạn | Việc thực hiện | Hồ sơ trong `work/` |
|---|---|---|
| **1. Tiếp nhận** | Chọn nguồn, xác định chủ đề, độc giả, mẫu và ngày chốt nguồn | `brief.md` |
| **2. Trích xuất** | Chuyển văn bản, giữ trang PDF hoặc đoạn/bảng DOCX; đánh dấu lỗi đọc | `extracted/`, `manifest.json` |
| **3. Lập bằng chứng** | Đọc toàn văn và bảng/biểu đồ, ghi số liệu cùng vị trí nguồn cụ thể | `evidence.md` |
| **4. Lập dàn ý** | Tổ chức bài viết thành các mục và đoạn văn phân tích mạch lạc | `outline.md` |
| **5. Viết bản thảo** | Viết tiếng Việt chuyên khảo, giàu đoạn văn, gắn trích dẫn Vancouver | `draft.md` |
| **6. Kiểm tra (QA)** | Đối chiếu số liệu, loại bỏ LaTeX thô, kiểm tra danh mục tham khảo 1–N | `qa.md` |
| **7. Xuất bản** | Lưu bản tin Markdown và chạy script tạo tài liệu Word chuẩn y tế | `output/<ten>.md`, `output/<ten>.docx` |

`work/` lưu trữ hồ sơ phục vụ kiểm tra và truy xuất nguồn gốc; ấn bản giao cho người dùng gồm định dạng Markdown (`.md`) và tài liệu Word (`.docx`) chuẩn hóa trình bày.

---

## Tiêu chuẩn văn phong: Đoạn văn chuyên khảo (Narrative Density)

1. **Ưu tiên cấu trúc đoạn văn hoàn chỉnh:**
   - Thay vì liệt kê các ý vụn vặt bằng gạch đầu dòng, bài viết sử dụng các **đoạn văn phân tích chuyên sâu** kết nối logic giữa cơ chế phân tử, đặc điểm vi sinh, kết quả thử nghiệm lâm sàng và ý nghĩa thực hành.
   - Các phần Tóm tắt then chốt và Khuyến nghị thực hành đều được diễn giải thành câu văn mạch lạc, chặt chẽ.
2. **Hạn chế gạch đầu dòng:**
   - Gạch đầu dòng chỉ được sử dụng khi thực sự cần thiết (ví dụ: các thuốc trong phác đồ phối hợp, các dòng trong bảng hoặc danh mục liệt kê thuốc). Thân bài tuyệt đối không lạm dụng bullet points.
3. **Chuẩn mực Y học Chứng cứ (EBM):**
   - Phân định rõ ràng giữa các loại nguy cơ ($HR$, $RR$, $OR$), quy tắc tính toán $ARR$/$NNT$, thử nghiệm không thua kém (*non-inferiority*), và nghiêm cấm ngôn từ quảng cáo/tiếp thị.
   - Gắn trích dẫn `[1]`, `[2]` sát các số liệu và nhận định lâm sàng.

---

## Trích xuất bằng script

```powershell
# Chạy script trích xuất tài liệu từ Input:
py .agents/skills/drug-bulletin/scripts/extract_sources.py --input Input --work work/<ten-ban-tin>
```

Thêm `--files "Input/bai-bao.pdf"` để chỉ định nhóm tài liệu cần trích xuất. Script hỗ trợ PDF (PyMuPDF), DOCX, Markdown và TXT.

---

## Xuất bản tin sang định dạng DOCX chuẩn y tế

Bản tin cuối được xuất song song sang định dạng `.docx` bằng script chuyên dụng:

```powershell
# Chuyển đổi bản tin Markdown sang DOCX:
py .agents/skills/drug-bulletin/scripts/export_docx.py --input output/<ten-ban-tin>.md --output output/<ten-ban-tin>.docx
```

### Quy chuẩn thể thức file Word (.docx) chuẩn y tế:
1. **Phông chữ chuẩn hóa:** Đồng bộ 100% phông chữ **Times New Roman** (chuẩn Nghị định 30/2020/NĐ-CP).
2. **Khắc phục triệt để lỗi nhảy font tiếng Việt:** Script tự động tiêm cấu hình OpenXML `w:rFonts` ngay tại đầu `w:rPr` (index 0) cho mọi phân đoạn (Run):
   `<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman" w:eastAsia="Times New Roman"/>`.
3. **Danh mục tài liệu tham khảo chuẩn xác 1–N:**
   - Sử dụng định dạng **thụt lề treo (Hanging Indent 0.35 inch)** với số thứ tự cố định, thay thế kiểu `List Number` tự động của Word.
   - Đảm bảo danh mục tham khảo luôn bắt đầu độc lập từ `1.` đến `N.` (khớp 100% với trích dẫn `[1]`–`[N]` trong bài), không bao giờ bị Word cộng dồn số thứ tự từ thân bài.
4. **Khổ giấy & Căn lề chuẩn:**
   - Khổ giấy A4 (21,0 cm × 29,7 cm).
   - Căn lề: Trái 2,5 cm; Phải 2,0 cm; Trên 2,0 cm; Dưới 2,0 cm.
   - Thân bài căn đều hai bên (**Justified**), khoảng cách dòng 1.15, cách đoạn dưới 4–5 pt.
5. **Định dạng bảng biểu & Hộp ghi chú:**
   - Bảng biểu có viền kẻ màu xám xanh (`#B0C4DE`), tiêu đề bảng nền xanh Navy (`#003366`) chữ trắng in đậm, các dòng xen kẽ trắng và xám nhạt (`#F7F9FB`).
   - Tự động lặp lại hàng tiêu đề khi sang trang mới (`w:tblHeader`) và chống cắt ngang dòng (`w:cantSplit`).
   - Hộp ghi chú (Callout box): Đóng khung có viền trái xanh đậm 3 pt (`#003366`) và nền xám xanh nhạt (`#F0F4F8`).
6. **Chân trang (Footer):**
   - Đánh số trang tự động căn phải (*`Bản tin Thông tin thuốc | Trang X`*).
7. **Làm sạch ký hiệu toán & công thức thô:**
   - Loại bỏ hoàn toàn mã LaTeX thô (`$...$`, `$$...$$`, `\text{...}`) trong văn bản xuất bản; chuyển sang ký tự Unicode tự nhiên (`Zn²⁺`, `Fe³⁺`, `β`, `≥`, `≤`, `µg/mL`).
