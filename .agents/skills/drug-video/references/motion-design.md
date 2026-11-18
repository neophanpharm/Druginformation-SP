# Hướng dẫn motion design – video thông tin thuốc BV Xanh Pôn

Mục tiêu: video **sinh động, đẹp, đáng tin**. Cảm giác hướng tới giống một phim giải thích y khoa cao cấp: sạch, sáng, chiều sâu rõ, chuyển động mượt, chữ rõ, nhịp theo nhạc. Không lòe loẹt, không giật cục.

---

## 1. Thanh chất lượng (bắt buộc)

1. **Không có khung chết:** mọi khung phải có ít nhất một chuyển động, như camera trôi nhẹ, hạt lơ lửng hoặc ánh sáng "thở". Không có khoảng tĩnh hoàn toàn quá 2 giây, kể cả khi lời đọc đã hết.
2. **Ba lớp chiều sâu:** tiền cảnh mờ (hạt, khối nhòe), trung cảnh là chủ thể, hậu cảnh là gradient kèm hình mờ. Camera di chuyển tạo parallax (các lớp xa gần trượt với tốc độ khác nhau).
3. **Một điểm nhìn:** mỗi khoảnh khắc chỉ có một thứ chính chuyển động mạnh, các thứ khác chuyển động phụ.
4. **Easing có chủ đích:**
   - Không dùng chuyển động tuyến tính, trừ chuyển động lặp như dòng chảy hay quay đều.
   - Vào: `bezier(0.22, 1, 0.36, 1)`. Ra: `bezier(0.64, 0, 0.78, 0)`. Chuyển trạng thái: `bezier(0.65, 0, 0.35, 1)`.
   - Đối tượng bật vào khung dùng `spring` (damping 12–16).
5. **Xuất hiện so le:** các phần tử cùng nhóm hiện cách nhau 3–6 khung, không hiện đồng loạt.
6. **Nhịp:**
   - Thay đổi thị giác ít nhất mỗi 2–3 giây.
   - Cảnh dài trên 8 giây phải có ít nhất 2 "beat" (đổi góc camera hoặc thêm lớp thông tin mới).
   - Điểm nhấn trùng phách nhạc khi có thể.
7. **Chuyển cảnh có chủ đích:** chọn theo ý nghĩa ở mục 5, không lặp một kiểu quá 3 lần liên tiếp.
8. **Màu nhất quán:**
   - Theo bảng ký hiệu của video.
   - Hiệu chỉnh màu chung: nền sáng lạnh, chủ thể bão hòa vừa, vignette (tối viền) nhẹ 6–10%.
9. **Chữ luôn đọc được:** tương phản ≥ 4.5:1; chữ trên nền 3D có lớp nền mờ trắng 70–85% (bo 16–24 px) hoặc đổ bóng.
10. **Ổn định khi render:** mọi chuyển động phụ thuộc `useCurrentFrame()`. Ngẫu nhiên dùng `random(seed)` hoặc `@remotion/noise`. Không dùng `Math.random()`, `Date.now()` hay `useFrame` của R3F.

---

## 2. Chọn mức dựng hình theo cảnh

| Loại cảnh | Mức | Vì sao |
|---|---|---|
| Phân tử, thụ thể, kênh ion, synap, vi khuẩn, tế bào | **3D thật** | Chiều sâu và camera bay quanh giúp hiểu cơ chế |
| Cơ quan (thận, não, gan), dòng máu, dược động học | **3D** hoặc **2.5D** | 3D cho cảnh hero, 2.5D cho cảnh phụ |
| Biểu đồ (forest plot, đường cong nồng độ), số liệu, so sánh | **2.5D infographic** | Phẳng thì đọc chính xác hơn; thêm chiều sâu bằng thẻ nổi và đổ bóng |
| Checklist thực hành, timeline, yếu tố nguy cơ | **2.5D** | Chữ rõ, bố cục dạng thẻ |
| Logo, disclaimer, kết | **2D sạch** + ánh sáng | Bảo toàn nhận diện thương hiệu |

### 3D trong Remotion (`@remotion/three`)
- Dùng `<ThreeCanvas>` với `width/height` của composition, `camera={{ fov: 35 }}`.
- **Vật liệu:**
  - `MeshPhysicalMaterial` cho phân tử: `roughness` 0.25–0.4, `clearcoat` 0.6, tùy chọn `transmission` 0.2 cho màng.
  - `MeshStandardMaterial` cho cơ quan: `roughness` 0.6.
- **Ánh sáng 3 điểm:**
  - đèn chính ấm (key), cường độ 1.2, ở góc trên trái;
  - đèn phụ lạnh (fill), 0.4;
  - đèn viền (rim), 0.8, ở sau phải để tách chủ thể khỏi nền;
  - thêm `ambientLight` 0.25.
- **Hiệu ứng ống kính (tùy chọn):** nhòe theo độ sâu ở tiền cảnh bằng lớp mờ 2D, rẻ hơn hậu kỳ 3D; bloom nhẹ cho phần phát sáng (thuốc, neuron kích thích).
- **Camera:** luôn trôi chậm (dolly 2–4% hoặc orbit 6–12° mỗi cảnh). Đổi góc mạnh chỉ ở các beat.
- **Hình khối dựng bằng code:**
  - phân tử: cầu + liên kết dạng trụ, vòng β-lactam là khối 4 cạnh;
  - thụ thể GABA-A: 5 khối trụ bo tròn xếp vòng, có lỗ trung tâm;
  - vi khuẩn: khối viên nang;
  - neuron: cầu + nhánh bằng đường cong 3D (`TubeGeometry`).
- **Hiệu năng:** render `--gl=angle` trên Windows, `--concurrency` 2–4. Giới hạn số đối tượng có đổ bóng.

### 2.5D
- Tách lớp: nền gradient, hình minh họa SVG, thẻ chữ.
- Camera dùng `transform: perspective(1600px) rotateX/rotateY` hoặc scale/translate theo từng lớp với hệ số parallax 0.2 / 0.5 / 1.0.
- Thẻ nổi: trắng, bo 24 px, đổ bóng `0 12px 40px rgba(0,32,96,0.12)`.

---

## 3. Typography

- **Font:** Be Vietnam Pro, các độ đậm 400 / 600 / 700 / 800.
- **Thang cỡ chữ (16:9):** 96 (số hero), 64 (tiêu đề), 44 (phụ đề), 32 (callout), 24 (nhãn), 17 (footer).
- **Màu chữ:** chữ chính navy `#0B1F3A`; nhấn bằng xanh ngọc của thuốc chính, hoặc cam-đỏ `#E4572E` cho cảnh báo. Không dùng đỏ thương hiệu cho nội dung cảnh báo.
- **Hiệu ứng chữ:**
  - tiêu đề: từng từ trượt lên 24 px và mờ dần vào, so le 3 khung;
  - số liệu: số chạy từ 0 đến giá trị trong 20–30 khung, dừng chính xác ở giá trị nguồn (giữ số lẻ thập phân như nguồn);
  - nhãn: đường dẫn vẽ dần, rồi chữ hiện.
- **Không:** chữ chạy ngang liên tục, chữ xoay 3D khó đọc, quá 3 cỡ chữ trong một khung.

## 4. Phụ đề nổi bật (KineticCaption)

- **Dữ liệu:** `voiceover/<id>.words.json` lấy từ `creative_transcribe_audio`, đã sửa chính tả theo kịch bản. Chuyển sang dạng `Caption[]` của `@remotion/captions`, rồi `createTikTokStyleCaptions({ combineTokensWithinMilliseconds: 900 })`.
- **Hiển thị:** tối đa 2 dòng, ≤ 42 ký tự mỗi dòng, căn giữa, phía trên footer.
- **Trạng thái từng từ:**
  - chưa đọc: trắng 60% trên thanh nền navy 80% bo 14 px;
  - đang đọc: trắng 100%, scale 1.06;
  - từ khóa (`captionKeywords`): xanh ngọc hoặc vàng `#F2B134`, đậm 800.
- **Thời gian:** hiện trước tiếng 2 khung, ẩn sau tiếng 6 khung. Lệch ≤ 3 khung so với tiếng.
- **Bản 9:16:** phụ đề to hơn (52–60 px), ở khoảng 62–70% chiều cao màn hình.
- **Luôn xuất thêm `.srt`** để nền tảng hỗ trợ phụ đề tắt/bật.

## 5. Chuyển cảnh

| Ý nghĩa | Kiểu |
|---|---|
| Đi sâu vào bên trong (cơ thể → tế bào → phân tử) | Zoom xuyên qua đối tượng (match cut theo vật thể) hoặc `iris` |
| Chuyển chương (dược lý → ADR → thực hành) | `slide` hoặc wipe có màu thương hiệu, kèm whoosh nhẹ |
| Cùng chủ đề, đổi góc nhìn | Fade 10–15 khung hoặc camera tiếp tục chuyển động sang cảnh mới |
| Cảnh báo, điểm quan trọng | Hạ sáng nền + callout, kèm khoảng lặng nhạc 0,3–0,5 giây |

## 6. Âm thanh và nhịp

- **Nhạc:** chuẩn bị bản đồ phách (đánh dấu thủ công 4–8 điểm nhấn trong `timeline.json → music.beats`) và đặt các chuyển cảnh lớn vào đó.
- **Ducking:** khi có lời 0,12–0,18; khi không có lời 0,35–0,45; chuyển mức trong 8–12 khung.
- **SFX:** whoosh khi chuyển chương, "tick" khi hiện số, "pop" nhẹ khi thẻ bật vào khung. Âm lượng 0,2–0,35. Chỉ dùng nguồn có giấy phép.

## 7. Công thức cảnh (gợi ý dựng)

| Cảnh | Công thức |
|---|---|
| Hook lâm sàng | Phòng bệnh 2.5D, camera đẩy chậm vào bệnh nhân; tiêu đề câu hỏi; nhịp tim hoặc điện não đồ chạy nền |
| Nhóm thuốc | Cây β-lactam 3D xoay chậm; nhánh carbapenem sáng; 4 phân tử bay ra kèm nhãn tên |
| Dược lực học | Bay vào thành vi khuẩn 3D; PBP bị khóa; thành thủng; vi khuẩn vỡ thành hạt; nhãn "PBP" và "ESBL" |
| Dược động học | Lòng mạch 3D có albumin chở thuốc; StatCard "Gắn protein 85–95%", "t½ ≈ 4 giờ", "≈ 80% qua nước tiểu" |
| Cơ chế ADR | Synap 3D: GABA gắn → kênh mở → Cl⁻ vào; ertapenem chiếm chỗ → kênh đóng → neuron đổi màu; điện não đồ chuyển sang gai nhọn |
| Khởi phát | Timeline 14 ngày dạng thẻ 2.5D; vùng IQR 3–9; mốc trung vị ngày 4 phát sáng; số đếm "Ngày 4" |
| Nguy cơ | Đồng hồ đo 2.5D; 5 thẻ yếu tố bay vào và đẩy kim; callout "kể cả khi liều đúng" |
| So sánh | Forest plot 2.5D (OR, 95% CI, thang log), nhãn tên thuốc và số OR; nhấn khoảng tin cậy rộng của ertapenem |
| Tương tác | Bể nồng độ valproat 2.5D tụt khỏi vùng điều trị; callout "Tránh phối hợp" |
| Thực hành | Checklist 5 thẻ, mỗi thẻ một icon 3D nhỏ xoay và tiêu đề ≤ 5 từ; dấu tích hiện dần |
| Thông điệp chốt | Một câu lớn trên nền mờ, kèm 3 gạch đầu dòng ngắn |
