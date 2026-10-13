# Pipeline bản tin thông tin thuốc

## Cách dùng

Đặt các bài báo vào `Input/`, rồi yêu cầu agent:

> Viết bản tin thông tin thuốc từ Input theo pipeline của workspace, xuất Markdown.

Hoặc chỉ định chủ đề và nguồn:

> Viết bản tin từ Input/nghien-cuu.pdf cho dược sĩ bệnh viện, khoảng 800 từ. Dùng mẫu templates/mau-benh-vien.md.

Ngôn ngữ đầu ra bắt buộc: tiếng Việt. Mặc định: độc giả là dược sĩ và nhân viên y tế, khoảng 600–1.000 từ cho phần thân bài. Độ dài được điều chỉnh theo lượng bằng chứng; không thêm nội dung để đủ từ. Đầu ra cuối chỉ cần Markdown. Chưa có tài liệu nguồn hoặc bản tin mẫu trong hai thư mục ban đầu.

## Các giai đoạn và đầu ra

| Giai đoạn | Việc thực hiện | Hồ sơ trong work/ |
|---|---|---|
| 1. Tiếp nhận | Chọn nguồn, xác định chủ đề, độc giả, mẫu và ngày chốt nguồn | brief.md |
| 2. Trích xuất | Chuyển văn bản, giữ trang PDF hoặc đoạn/bảng DOCX; đánh dấu lỗi đọc | extracted/, manifest.json |
| 3. Lập bằng chứng | Đọc toàn văn và bảng/biểu đồ, ghi số liệu cùng vị trí nguồn | evidence.md |
| 4. Lập dàn ý | Chọn thông điệp, mức độ chắc chắn và giới hạn áp dụng | outline.md |
| 5. Viết | Viết tiếng Việt theo mẫu, gắn trích dẫn với phát biểu | draft.md |
| 6. Kiểm tra | Đối chiếu số liệu, diễn giải, nguồn, cấu trúc và câu chữ | qa.md |
| 7. Xuất | Lưu bản tin đã kiểm tra dưới dạng Markdown và Word; báo rõ vướng mắc còn lại | output/ten-ban-tin.md, output/ten-ban-tin.docx |

`work/` có thể chứa MD và JSON phục vụ kiểm tra; bản tin giao cho người dùng gồm định dạng Markdown (`.md`) và tài liệu Word (`.docx`) chuẩn hóa trình bày. Không cần tạo hồ sơ mới nếu đang sửa một bản tin đã có đầy đủ hồ sơ phù hợp.

## Trích xuất bằng script

```powershell
# Dùng python (nếu đã có trong PATH):
python .agents/skills/drug-bulletin/scripts/extract_sources.py --input Input --work work/ten-ban-tin

# Hoặc dùng runtime cụ thể (như trên máy này):
& "D:/vampi/python.exe" .agents/skills/drug-bulletin/scripts/extract_sources.py --input Input --work work/ten-ban-tin
```

Thêm `--files "Input/bai-bao.pdf" "Input/phu-luc.docx"` để chỉ trích xuất nhóm đã chọn. Không có `--files` thì script kiểm kê và trích xuất toàn bộ định dạng hỗ trợ trong Input; việc này không quyết định chúng thuộc cùng một bản tin.

MD/TXT và DOCX dùng thư viện Python chuẩn; PDF cần PyMuPDF (`pymupdf`) hoặc `pypdf`. Runtime D:/vampi/python.exe hiện đã có PyMuPDF và đã được kiểm tra; có thể dùng python nếu PATH của phiên làm việc trỏ tới runtime tương đương. Script báo lỗi từng nguồn và trả mã khác 0 nếu nguồn bị lỗi hoặc cần kiểm tra. PDF ảnh quét cần OCR bằng công cụ phù hợp; script không tự OCR. `.doc` cũ cần chuyển thành `.docx` trước.

Trích xuất không thay thế kiểm tra PDF trực quan, đặc biệt với bảng nhiều cột, hình, biểu đồ và số liệu. DOCX được trích xuất phần thân và bảng; chú thích, hộp văn bản, header/footer và thay đổi theo dõi cần kiểm tra riêng nếu có thông tin cần dùng.

## Nguồn và mẫu

Mẫu mặc định: `templates/ban-tin-mac-dinh.md`. Hướng dẫn chi tiết nằm trong `.agents/skills/drug-bulletin/references/protocol.md`.

Khi có bản tin mẫu, lưu nó vào `templates/`, phân tích cấu trúc/giọng văn/độ dài/cách trích dẫn và ghi thành hồ sơ mẫu. Chỉ học cách viết; không tái sử dụng số liệu hoặc kết luận của mẫu cho chủ đề khác.

Pipeline dùng nguồn được giao. Khi cần xác minh hướng dẫn, tình trạng cấp phép, cảnh báo an toàn hoặc nội dung y khoa ngoài tài liệu, agent tra nguồn chính thức cập nhật và ghi riêng nguồn bổ sung, ngày truy cập. Không âm thầm biến kết quả một nghiên cứu thành khuyến cáo hiện hành.

## Xuất bản tin sang định dạng DOCX

Bản tin cuối được xuất song song sang định dạng `.docx` bằng script chuyên dụng nhằm phục vụ in ấn, lưu hành trong bệnh viện hoặc trình Hội đồng Thuốc và Điều trị:

```powershell
# Chuyển đổi bản tin Markdown sang DOCX với định dạng bảng biểu, tiêu đề chuẩn y tế:
& "D:/vampi/python.exe" .agents/skills/drug-bulletin/scripts/export_docx.py --input output/ten-ban-tin.md --output output/ten-ban-tin.docx
```

### Quy chuẩn thể thức file Word (.docx) chuẩn y tế:
1. **Phông chữ chuẩn hóa:** Đồng bộ 100% phông chữ **Times New Roman** (chuẩn thể thức văn bản y tế và hành chính theo Nghị định 30/2020/NĐ-CP).
2. **Khắc phục triệt để lỗi nhảy font tiếng Việt:** Script tự động tiêm cấu hình OpenXML XML `w:rFonts` cho mọi phân đoạn (Run):
   `<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman" w:eastAsia="Times New Roman"/>`.
   Điều này đảm bảo mọi nguyên âm tiếng Việt có dấu (*ơ, ư, ệ, ế, ẩ, ỗ, ặ...*) không bao giờ bị nhảy sang phông chữ dự phòng khác.
3. **Khổ giấy & Căn lề chuẩn:**
   - Khổ giấy A4 (21,0 cm × 29,7 cm).
   - Căn lề: Trái 2,5 cm; Phải 2,0 cm; Trên 2,0 cm; Dưới 2,0 cm.
4. **Trình bày đoạn văn & Tiêu đề:**
   - Tiêu đề chính: 16 pt, Đậm, Xanh Navy (`#003366`), căn giữa.
   - Đề mục lớn: 13,5 pt, Đậm, Xanh (`#003C78`).
   - Đề mục nhỏ: 12,5 pt, Đậm, Xanh (`#144B82`).
   - Thân bài: 12 pt, căn đều hai bên (**Justified**), khoảng cách dòng 1.15, cách đoạn dưới 4–5 pt.
5. **Định dạng bảng biểu & Hộp ghi chú:**
   - Bảng biểu có viền kẻ mỏng sắc nét màu xám xanh (`#B0C4DE`), tiêu đề bảng nền xanh Navy (`#003366`) chữ trắng in đậm, các dòng dữ liệu xen kẽ trắng và xám nhạt (`#F7F9FB`), căn giữa theo chiều dọc.
   - Hộp ghi chú (Callout box): Đóng khung có viền trái xanh đậm 3 pt (`#003366`) và nền xám xanh nhạt (`#F0F4F8`) cho các cảnh báo, lưu ý và phác đồ cứu vãn.
6. **Làm sạch ký hiệu toán & công thức thô:**
   - Loại bỏ hoàn toàn mã LaTeX thô (`$...$`, `$$...$$`, `\text{...}`) trong văn bản xuất bản; chuyển sang ký tự Unicode tự nhiên (`Zn²⁺`, `Fe³⁺`, `β`, `≥`, `≤`, `µg/mL`).




