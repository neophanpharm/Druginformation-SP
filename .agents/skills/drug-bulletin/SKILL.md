---
name: drug-bulletin
description: Viết và kiểm tra bản tin thông tin thuốc tiếng Việt từ PDF, DOCX, Markdown hoặc TXT, theo mẫu trong workspace và xuất song song Markdown và DOCX chuẩn y tế có truy xuất bằng chứng.
---

# Bản tin thông tin thuốc

Dùng khi viết, sửa hoặc kiểm tra bản tin trong workspace này. Đọc [protocol](references/protocol.md) trước khi viết. Các đường dẫn Input, output, work và templates tính từ gốc workspace.

## Luồng thực hiện

1. Kiểm kê Input và chọn nguồn liên quan theo yêu cầu. Tìm mẫu trong templates; nếu chưa có mẫu được chỉ định, dùng templates/ban-tin-mac-dinh.md. Chưa có nguồn thì báo thiếu nguồn, không tạo bài với dữ liệu giả.
2. Ghi work/<ten-ban-tin>/brief.md: chủ đề, nguồn được chọn, mẫu, độc giả, độ dài, ngày chốt nguồn và giả định. Bản tin đầu ra bắt buộc bằng tiếng Việt, mặc định cho dược sĩ/nhân viên y tế, thân bài khoảng 600–1.000 từ tùy bằng chứng.
3. Trích xuất bằng scripts/extract_sources.py. Đọc manifest.json; kiểm tra trực quan trang/bảng/hình chứa số liệu quan trọng với công cụ đọc PDF/DOCX phù hợp. Văn bản trích xuất không thay thế việc đọc nguồn gốc.
4. Lập evidence.md theo protocol, có mã nguồn và vị trí cho mỗi phát biểu quan trọng. Thông tin không có trong nguồn ghi “không báo cáo”.
5. Lập outline.md và draft.md. Phân biệt phát hiện nghiên cứu, kết luận tác giả và nhận định biên tập. Gắn trích dẫn gần phát biểu được hỗ trợ.
6. Đối chiếu số liệu, diễn giải, nguồn và cấu trúc theo checklist, rà soát loại bỏ triệt để mã công thức LaTeX thô, ghi qa.md. Sửa lỗi trước khi xuất. Nếu thiếu dữ liệu cốt lõi làm kết luận không đáng tin, giữ bản nháp và báo điểm chặn.
7. Xuất `output/<ten-ban-tin>.md`, sau đó chạy `scripts/export_docx.py` để tạo `output/<ten-ban-tin>.docx` (đồng bộ phông chữ Times New Roman chống lỗi nhảy font tiếng Việt, khổ A4, căn lề 2 bên, viền bảng và tiêu đề xanh Navy chuẩn y tế). Kiểm tra tiêu đề, đề mục, nội dung, chú thích và diễn giải bảng đều bằng tiếng Việt. Giữ tên hoạt chất, tên riêng, chữ viết tắt và thông tin thư mục gốc khi cần; giải thích thuật ngữ chuyên môn bằng tiếng Việt ở lần đầu. Trả đường dẫn và giới hạn có ảnh hưởng thực tế. Không ghi đè bản tin khác ngoài phạm vi yêu cầu.

## Học từ mẫu

Đọc bản tin mẫu người dùng cung cấp trước khi viết. Ghi templates/<ten-mau>-profile.md với thứ tự phần, độ dài, giọng văn, thuật ngữ, cách trình bày số liệu và trích dẫn. Giữ nguyên mẫu gốc. Chỉ học cấu trúc và phong cách, không tái dùng dữ liệu hoặc kết luận của mẫu cho chủ đề khác. Nếu mẫu không có mục hạn chế/an toàn, lồng thông tin cần thiết vào phần thích hợp. Không cần tạo skill riêng cho từng mẫu.

Không mặc định mở rộng tìm kiếm nếu nhiệm vụ chỉ là biên tập theo nguồn. Khi thêm khẳng định y khoa ngoài tài liệu hoặc xác minh thông tin hiện hành, tra nguồn chính thức, ghi ngày truy cập và phân biệt với nguồn được giao. Không xem việc kiểm tra theo nguồn là phê duyệt xuất bản của chuyên gia.

