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
| 7. Xuất | Lưu bản tin đã kiểm tra; báo rõ vướng mắc còn lại | output/ten-ban-tin.md |

`work/` có thể chứa MD và JSON phục vụ kiểm tra; bản tin giao cho người dùng là MD. Không cần tạo hồ sơ mới nếu đang sửa một bản tin đã có đầy đủ hồ sơ phù hợp.

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


