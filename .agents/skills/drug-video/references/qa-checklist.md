# Checklist QA – video thông tin thuốc BV Xanh Pôn

Sao chép vào `work/<chu-de>/video/qa.md`, đánh dấu từng mục, ghi bằng chứng (lệnh, ảnh, số đo) cho mục kỹ thuật.

## 0. Cổng tự động (phải ĐẠT trước khi rà bằng mắt)
- [ ] `node scripts/video/check_claims.mjs <timeline.json> <facts.md>` → ĐẠT (dán báo cáo vào `qa.md`).
- [ ] Sau khi chụp ảnh soát: chạy lại kèm `--rendered rendered-text.json` → ĐẠT.
- [ ] `node scripts/video/qa_frames.mjs <mp4> <dir>` → ĐẠT (không đứng yên > 2 s trong vùng nội dung, LUFS −14…−16, true peak ≤ −1). Đã xem từng contact sheet.
- [ ] `node scripts/video/review_hash.mjs verify review.json script` → HỢP LỆ (trước tiêu credit và render).
- [ ] Báo cáo subagent kiểm chứng độc lập: 0 phát hiện còn mở.
- [ ] `node scripts/video/review_hash.mjs verify review.json final` → HỢP LỆ (trước khi giao). Agent không tự đăng.

## A. Kỹ thuật
- [ ] ffprobe: H.264, đúng độ phân giải (1920×1080 / 1080×1920), 30 fps, AAC 48 kHz, thời lượng khớp `timestamp.md`.
- [ ] Log render đủ `Encoded N/N`, mã thoát 0 (`video-studio/out/render.log`).
- [ ] Âm lượng tổng −14 đến −16 LUFS, đỉnh ≤ −1 dBTP. Đo bằng `brand.json → tools.ffmpegFull` (`-af ebur128=peak=true`); chuẩn hóa bằng `loudnorm` nếu lệch. Ghi số đo trước và sau.
- [ ] Không có khung đen, khung trắng hay giật hình ở các chỗ chuyển cảnh: trích khung tại mỗi mốc chuyển ±5 khung.

## B. Hình ảnh và chuyển động
- [ ] Ảnh tĩnh ở 30/55/80% mỗi cảnh, cộng 12+ khung trích từ chính file MP4 đã xem.
- [ ] Không có khung chết quá 2 giây; mọi cảnh có camera hoặc lớp chuyển động.
- [ ] Không có đối tượng tràn khung, bị cắt, lộn ngược hay nằm sai vị trí.
- [ ] Màu đúng bảng ký hiệu; đỏ thương hiệu không bị dùng làm màu "nguy hiểm".

## C. Chữ và phụ đề
- [ ] Chính tả tiếng Việt và dấu đúng; tên hoạt chất đúng.
- [ ] Mỗi chữ và số trên màn hình khớp `facts.md` (ghi PMID hoặc mục nhãn cạnh từng số).
- [ ] Phụ đề khớp lời đọc, lệch ≤ 3 khung; không đè lên footer. Đã nối `captions.json` từng shot và so với `voiceover.json` (chỉ khác ở dạng hiển thị: β-lactam, GABA-A, 80%, 500 mg…).
- [ ] Phụ đề **chữ thường**: không karaoke, không gạch chân, không chip hay tô màu từ khóa.
- [ ] Ngắt cụm theo nghĩa (≤ 50 ký tự, luôn ngắt ở dấu chấm, không tách từ ghép); phụ đề trên hình và SRT cùng cách ngắt.
- [ ] Nhãn không vỡ cụm: "n = 102", "KTC 95%: a–b", "IQR 3–9", "500 mg/ngày", "hồi phục" giữ trên một dòng (NBSP / word-joiner).
- [ ] Mỗi câu lời đọc truy được về một fact trong `facts.md`, kể cả câu mở đầu (chỉ định, nhóm thuốc).
- [ ] Tương phản ≥ 4.5:1; mọi chữ nằm trong vùng an toàn (bản 9:16 tránh vùng nút bấm của ứng dụng).
- [ ] File `.srt` khớp thời gian video.

## D. Thương hiệu và pháp lý
- [ ] **Khung medical-clean** đúng `brand.json → frame`:
  - header bệnh viện cố định (2 logo, tên song ngữ, tiêu ngữ, viền đỏ đô), không mờ theo chuyển cảnh;
  - nền trắng;
  - phụ đề viên đỏ;
  - không có watermark hay họa tiết thừa.
- [ ] Logo đúng file gốc, không méo, **không cắt tròn, không vòng trang trí, không phóng to quá cỡ gốc** (header 112 px, outro 136 px); tên bệnh viện và tiêu ngữ đúng nguyên văn.
- [ ] Footer `NGUỒN: …` **hiện đủ mọi nguồn** (PMID gộp một cụm, tối đa 2 dòng, không "+n" hay "…") và `TRANG XX / YY` ở mọi cảnh nội dung và outro; nguồn khớp `-nguon.md`; số trang liên tục.
- [ ] Mở đầu là trang "LƯU Ý" trong khung (không có cảnh mở logo). Outro theo template: logo, nhãn Khoa Dược, tiêu đề đỏ không mồ côi chữ, câu lưu ý, phụ đề chạy theo lời đọc.
- [ ] Lời đọc outro theo mẫu "<thông điệp chốt>. Biên soạn bởi Khoa Dược, Bệnh viện Đa khoa Xanh Pôn."; **không đọc slogan**.
- [ ] Đã soát bằng mắt 6 giây đầu và toàn bộ outro (`qa_frames` bỏ qua hai đoạn này).
- [ ] Không vật thể hay chữ nào lấn vào header (y < 210) hay vùng phụ đề (y > 1652). Bản đăng Reels/TikTok dùng biến thể an toàn.
- [ ] Disclaimer ở trang lưu ý đầu video (khai báo `onScreen` với `role: "disclaimer"`) và câu lưu ý trong outro, đúng `brand.json`; trạng thái `approved` (nếu còn `draft`: chỉ dùng nội bộ).
- [ ] Giấy phép nhạc, SFX và asset 3D đã xác nhận và ghi trong `-nguon.md`.
- [ ] Giấy phép Remotion (Company License) đã xác nhận trước khi đăng công khai.

## E. Chuyên môn
- [ ] Không có từ ngữ quảng cáo hay cảm tính; không so sánh vượt quá bằng chứng.
- [ ] Mức chắc chắn thấp được thể hiện (khoảng tin cậy, "bằng chứng hạn chế").
- [ ] Dược sĩ/bác sĩ duyệt: họ tên ______ · chức danh ______ · ngày ______
