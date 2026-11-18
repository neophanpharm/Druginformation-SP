# Checklist QA – video thông tin thuốc BV Xanh Pôn

Sao chép vào `work/<chu-de>/video/qa.md`, đánh dấu từng mục, ghi bằng chứng (lệnh, ảnh, số đo) cho mục kỹ thuật.

## A. Kỹ thuật
- [ ] ffprobe: H.264, đúng độ phân giải (1920×1080 / 1080×1920), 30 fps, AAC 48 kHz, thời lượng khớp `timestamp.md`.
- [ ] Log render đủ `Encoded N/N`, mã thoát 0 (`video-studio/out/render.log`).
- [ ] Âm lượng tổng −14 đến −16 LUFS, đỉnh ≤ −1 dBTP (Video Cleanup hoặc ffmpeg đầy đủ). Ghi số đo.
- [ ] Không có khung đen, khung trắng hay giật hình ở các chỗ chuyển cảnh: trích khung tại mỗi mốc chuyển ±5 khung.

## B. Hình ảnh và chuyển động
- [ ] Ảnh tĩnh ở 30/55/80% mỗi cảnh, cộng 12+ khung trích từ chính file MP4 đã xem.
- [ ] Không có khung chết quá 2 giây; mọi cảnh có camera hoặc lớp chuyển động.
- [ ] Không có đối tượng tràn khung, bị cắt, lộn ngược hay nằm sai vị trí.
- [ ] Màu đúng bảng ký hiệu; đỏ thương hiệu không bị dùng làm màu "nguy hiểm".

## C. Chữ và phụ đề
- [ ] Chính tả tiếng Việt và dấu đúng; tên hoạt chất đúng.
- [ ] Mỗi chữ và số trên màn hình khớp `facts.md` (ghi PMID hoặc mục nhãn cạnh từng số).
- [ ] Phụ đề khớp lời đọc, lệch ≤ 3 khung; ≤ 2 dòng; từ khóa được tô màu; không đè lên footer.
- [ ] Tương phản ≥ 4.5:1; mọi chữ nằm trong vùng an toàn (bản 9:16 tránh vùng nút bấm của ứng dụng).
- [ ] File `.srt` khớp thời gian video.

## D. Thương hiệu và pháp lý
- [ ] Logo đúng file gốc, không méo; slogan đúng nguyên văn; watermark SPH có mặt.
- [ ] Footer PMID ở mọi cảnh nội dung, khớp `-nguon.md`.
- [ ] Disclaimer ở đầu video và cảnh kết, đúng `brand.json`; trạng thái `approved` (nếu còn `draft`: chỉ dùng nội bộ).
- [ ] Giấy phép nhạc, SFX và asset 3D đã xác nhận và ghi trong `-nguon.md`.
- [ ] Giấy phép Remotion (Company License) đã xác nhận trước khi đăng công khai.

## E. Chuyên môn
- [ ] Không có từ ngữ quảng cáo hay cảm tính; không so sánh vượt quá bằng chứng.
- [ ] Mức chắc chắn thấp được thể hiện (khoảng tin cậy, "bằng chứng hạn chế").
- [ ] Dược sĩ/bác sĩ duyệt: họ tên ______ · chức danh ______ · ngày ______
