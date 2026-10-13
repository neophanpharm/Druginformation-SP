# Protocol xử lý bằng chứng và viết bản tin

## Tiếp nhận và đọc nguồn

Phân loại nghiên cứu gốc, tổng quan, hướng dẫn, cảnh báo an toàn, bình luận và phụ lục. Gắn mã S01, S02… theo manifest; khi bổ sung nguồn giữ mã đã dùng. Kiểm tra tên bài, tác giả, tạp chí/tổ chức, năm, phiên bản và DOI/URL có trong nguồn. Không dựng thông tin thư mục.

PDF dùng số trang file tính từ 1; có thể ghi thêm số trang in. DOCX dùng đoạn P và bảng T, MD/TXT dùng dòng L. Đọc trực quan bảng/hình cần dùng; văn bản nhiều cột có thể sai thứ tự. PDF quét cần OCR bằng công cụ phù hợp và kiểm tra lại số, ký hiệu, đơn vị. Không suy luận từ phần không đọc được. DOCX trích xuất phần thân/bảng; chú thích, hộp văn bản, header/footer và thay đổi theo dõi cần kiểm tra riêng khi liên quan.

Không âm thầm loại nguồn có kết quả khác. Nhận diện nhiều bài cùng thử nghiệm để tránh xem chúng là quần thể độc lập; chú ý trùng nghiên cứu giữa các tổng quan.

## Hồ sơ bằng chứng

Trong evidence.md ghi danh mục nguồn, tóm tắt nghiên cứu và bảng:

| ID | Phát biểu/số liệu dự kiến dùng | Nguồn và vị trí | Bối cảnh/đơn vị/mẫu số | Trạng thái kiểm tra |
|---|---|---|---|---|

Với nghiên cứu gốc, thu thập trường có liên quan:

- Câu hỏi; thiết kế; bối cảnh; tiêu chuẩn chọn/loại; số phân nhóm và số được phân tích.
- Thuốc, liều, đường dùng, thời gian điều trị, đối chứng và theo dõi.
- Tiêu chí chính/phụ, định nghĩa và thời điểm đo; ITT/per-protocol nếu có.
- Số biến cố/mẫu số hoặc trung bình và độ phân tán; hiệu số, RR, OR, HR đúng loại; khoảng tin cậy và p nếu báo cáo.
- Biến cố bất lợi, biến cố nghiêm trọng và ngừng thuốc; mẫu số phân tích an toàn.
- Hạn chế, tài trợ, xung đột lợi ích có trong nguồn và khả năng áp dụng.

Với tổng quan: ngày chốt tìm kiếm, số nghiên cứu/người tham gia, thiết kế, mô hình gộp, độ không đồng nhất, nguy cơ sai lệch, mức chắc chắn nếu tác giả đã đánh giá. Với hướng dẫn/cảnh báo: cơ quan, ngày, đối tượng, hành động và phạm vi áp dụng. Trường thiếu ghi “không báo cáo”, không tự điền.

## Số liệu và diễn giải

- Không đồng nhất HR, RR và OR; không đổi mức giảm tương đối thành mức giảm tuyệt đối. Giữ đúng đơn vị và mẫu số.
- “Không có ý nghĩa thống kê” không đồng nghĩa “tương đương” hoặc “không có tác dụng”; giữ khoảng tin cậy nếu quan trọng.
- Phân biệt tiêu chí thay thế với kết cục lâm sàng, phân nhóm/thăm dò với tiêu chí chính. Quan sát không chứng minh nhân quả.
- Với thử nghiệm không thua kém, giữ biên không thua kém, quần thể phân tích và chiều hiệu số nếu dùng kết luận này.
- Nếu tính ARR/NNT, chỉ dùng nguy cơ tuyệt đối so sánh được ở cùng thời điểm. Ghi công thức, dữ liệu đầu vào và thời gian trong evidence; đánh dấu là số biên tập tính thêm. Không tính NNT trực tiếp từ HR/OR hay tỷ suất biến cố khi không có cơ sở thích hợp.
- Chưa thấy tín hiệu an toàn không chứng minh an toàn ở mọi đối tượng. Giữ bối cảnh thời gian theo dõi.
- Không tự gắn GRADE khi chưa đánh giá đầy đủ; mô tả giới hạn về sai lệch, độ chính xác và khả năng áp dụng bằng lời.
- Khi nguồn mâu thuẫn, đối chiếu quần thể, liều, thiết kế, tiêu chí và thời điểm; trình bày khác biệt còn lại.
- Không chuyển một nghiên cứu thành khuyến cáo kê đơn/thay đổi liều hoặc khẳng định cấp phép. Thông tin hiện hành về hướng dẫn, nhãn và cảnh báo cần xác minh nguồn chính thức nếu đưa vào bài.

## Cấu trúc và văn phong

Dùng mẫu được chỉ định; nếu chưa có dùng templates/ban-tin-mac-dinh.md. Tiêu đề trung tính. Nêu bối cảnh, thiết kế, hiệu quả, an toàn, hạn chế và ý nghĩa thực hành. Kết luận không mạnh hơn bằng chứng. Ưu tiên tên hoạt chất; giải thích viết tắt ở lần đầu. Không dùng lời quảng cáo như “đột phá”, “an toàn tuyệt đối”. Có thể dùng bảng nhỏ hoặc bullet khi giúp người đọc.

Trích dẫn [1], [2] gần phát biểu. Tài liệu tham khảo đánh số theo lần xuất hiện, có DOI/URL khi có và xác minh được. Evidence dùng S01 + vị trí; lưu ánh xạ S01 → [1] trong qa. Mọi kết quả chính và dữ liệu an toàn phải truy được về nguồn. Nguồn ngoài bài ghi ngày truy cập. Hồ sơ nội bộ không đưa vào bản tin cuối.

## Checklist trước khi xuất

Ghi đạt / cần sửa / không áp dụng với ghi chú cụ thể trong qa.md:

- Nguồn đủ đọc, rõ xuất xứ; bảng/hình quan trọng được kiểm tra trực quan.
- Thuốc, liều, đối tượng, mẫu số, thời gian và tiêu chí khớp nguồn.
- Số, dấu, đơn vị, khoảng tin cậy và phép tính thêm được đối chiếu.
- Trích dẫn hỗ trợ đúng phát biểu, thông tin thư mục không tự dựng.
- Hiệu quả, an toàn, giới hạn và khả năng áp dụng được diễn giải đúng mức.
- Tiêu đề, đề mục, nội dung, chú thích và diễn giải bảng bằng tiếng Việt; chỉ giữ tên riêng, tên hoạt chất, chữ viết tắt và thông tin thư mục gốc khi cần chính xác. Thuật ngữ chuyên môn được giải thích bằng tiếng Việt ở lần đầu.
- Giọng văn đúng mẫu; viết tắt được giải thích; không còn chỉ dẫn template.
- Thông tin bổ sung/hiện hành có nguồn xác minh và ngày truy cập.
- Đã rà soát loại bỏ triệt để mã công thức LaTeX thô (`$...$`, `$$...$$`, `\text{...}`), chuyển sang ký tự Unicode y khoa tự nhiên.
- Định dạng file Word (.docx) đạt chuẩn y tế: phông chữ Times New Roman đồng bộ 100% không nhảy font tiếng Việt, khổ A4, căn lề 2 bên (Justified), bảng biểu có viền sắc nét và tiêu đề màu xanh Navy, hộp ghi chú đóng khung rõ ràng.

Sửa lỗi nội dung trước khi xuất. Có thể xuất với giới hạn được nêu rõ khi chỉ thiếu trường không thiết yếu. Nếu còn lỗi nguồn/số liệu cốt lõi, giữ draft trong work và báo điểm chặn. Trạng thái “đã kiểm tra theo nguồn” không đồng nghĩa được đơn vị/chuyên gia duyệt xuất bản.

