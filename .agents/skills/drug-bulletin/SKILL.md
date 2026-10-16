---
name: drug-bulletin
description: Viết và kiểm tra bản tin thông tin thuốc tiếng Việt từ PDF, DOCX, Markdown hoặc TXT, theo mẫu trong workspace và xuất song song Markdown và DOCX chuẩn y tế có truy xuất bằng chứng.
---

# Bản tin thông tin thuốc

Dùng khi viết, sửa hoặc kiểm tra bản tin trong workspace này. Đọc [protocol](references/protocol.md) trước khi viết. Các đường dẫn Input, output, work và templates tính từ gốc workspace.

## Nguyên tắc biên tập cốt lõi

1. **Văn phong chuyên khảo sâu & Đậm đặc thông tin (Narrative Density):** 
   - Ưu tiên cấu trúc các **đoạn văn phân tích hoàn chỉnh, lập luận logic, liền mạch** nhằm chuyển tải và kết nối lượng thông tin y dược dày dặn (cơ chế phân tử, vi sinh, thử nghiệm lâm sàng, dược động học/dược lực học PK/PD).
   - **Hạn chế tối đa việc sử dụng gạch đầu dòng liệt kê vụn vặt** trong phần thân bài. Các phần tóm tắt, cơ chế, bằng chứng lâm sàng và khuyến nghị thực hành đều được diễn giải thành câu văn và đoạn văn hoàn chỉnh.
2. **Chuẩn mực Y học Chứng cứ (EBM) & Truy xuất bằng chứng:**
   - Mọi số liệu, kết cục lâm sàng (tỷ lệ khỏi bệnh, tỷ lệ sống sót, tử vong, $f\text{T} > \text{MIC}$, MIC breakpoints) phải gắn liền với nguồn gốc, mẫu số và khoảng tin cậy nếu có.
   - Trích dẫn theo quy chuẩn Vancouver `[1], [2]...` xuất hiện tuần tự từ 1 đến N theo thứ tự xuất hiện lần đầu trong bài.
3. **Quy chuẩn xuất bản song song (Markdown & Word DOCX chuẩn y tế):**
   - File Markdown dùng Unicode tự nhiên (`Zn²⁺`, `Fe³⁺`, `β`, `≥`, `≤`, `µg/mL`), cấm để sót mã LaTeX thô (`$...$`).
   - Chạy `scripts/export_docx.py` để tạo DOCX chuẩn y tế: phông chữ Times New Roman đồng bộ 100% không lỗi nhảy font tiếng Việt có dấu (`w:rFonts` đầy đủ `ascii`, `hAnsi`, `cs`, `eastAsia`), khổ A4, căn lề 2 bên (Justified), bảng biểu lặp lại tiêu đề khi tràn trang (`tblHeader`) và chống cắt ngang dòng (`cantSplit`), danh mục tham khảo thụt lề treo (Hanging Indent) đánh số độc lập từ 1 đến N, chân trang tự động đánh số trang.

## Luồng thực hiện 7 giai đoạn

1. **Tiếp nhận:** Kiểm kê `Input/` và chọn nguồn liên quan theo yêu cầu. Tìm mẫu trong `templates/`; nếu chưa có mẫu được chỉ định, dùng `templates/ban-tin-mac-dinh.md`. Chưa có nguồn thì báo thiếu nguồn, không tạo bài với dữ liệu giả. Ghi `work/<ten-ban-tin>/brief.md`.
2. **Trích xuất:** Chạy `scripts/extract_sources.py`. Đọc `manifest.json`; kiểm tra trực quan trang/bảng/hình chứa số liệu quan trọng với công cụ đọc PDF/DOCX phù hợp.
3. **Lập bằng chứng:** Lập `work/<ten-ban-tin>/evidence.md` theo protocol, có mã bằng chứng (E01, E02...) và vị trí trang/đoạn/bảng cụ thể cho mỗi phát biểu. Thông tin không có trong nguồn ghi “không báo cáo”.
4. **Lập dàn ý:** Lập `work/<ten-ban-tin>/outline.md`, tổ chức bài viết thành các mục và đoạn văn phân tích mạch lạc, xác định thông điệp then chốt và phân tầng phác đồ.
5. **Viết bản thảo:** Viết `work/<ten-ban-tin>/draft.md` bằng tiếng Việt theo phong cách chuyên khảo, giàu đoạn văn, hạn chế gạch đầu dòng. Gắn trích dẫn `[1], [2]` sát phát biểu được hỗ trợ.
6. **Kiểm tra (QA):** Rà soát số liệu, câu văn, loại bỏ triệt để mã công thức LaTeX thô, đối chiếu 100% trích dẫn, ghi `work/<ten-ban-tin>/qa.md`.
7. **Xuất bản:** Lưu `output/<ten-ban-tin>.md`, sau đó chạy `scripts/export_docx.py` để tạo `output/<ten-ban-tin>.docx`. Kiểm tra tiêu đề, đề mục, nội dung, chú thích và bảng biểu đều chuẩn tiếng Việt và đúng quy cách thể thức y tế.

## Học từ mẫu

Đọc bản tin mẫu người dùng cung cấp trước khi viết. Ghi `templates/<ten-mau>-profile.md` với thứ tự phần, độ dài, giọng văn, thuật ngữ, cách trình bày số liệu và trích dẫn. Giữ nguyên mẫu gốc. Chỉ học cấu trúc và phong cách, không tái dùng dữ liệu hoặc kết luận của mẫu cho chủ đề khác. Không mặc định mở rộng tìm kiếm nếu nhiệm vụ chỉ là biên tập theo nguồn; khi cần xác minh thông tin hiện hành, tra nguồn chính thức và ghi chú rõ ràng.
