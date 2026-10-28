# Kế hoạch portfolio: hungdv.io.vn

Tài liệu này mô tả ý tưởng, nội dung, thiết kế và cách xây dựng website portfolio của Đoàn Việt Hưng. Đây là bản chốt ý tưởng để duyệt, chưa phải code.

**Các quyết định đã chốt**

| Hạng mục | Quyết định |
|---|---|
| Hướng đi | Phương án A: site tĩnh, mọi phần tương tác chạy trong trình duyệt, không có backend |
| Công nghệ | Next.js + React (xuất tĩnh bằng `output: 'export'`), TypeScript, Tailwind CSS v4, shadcn/ui, Motion (xem mục 8.4) |
| Dự án | Anomaly_LineScan, IntelliDoc OCR (`ocr_new`), Vision_Measurement_Toolkit, demo_mvp |
| Mục tiêu | Đồng thời xin việc và hồ sơ du học |
| Ngôn ngữ | Tiếng Việt và tiếng Anh, ngang hàng nhau |
| Hosting | VPS hiện có, Nginx phục vụ file tĩnh, tên miền hungdv.io.vn |

---

## 1. Ý tưởng chủ đạo

Trang web cư xử như một **thiết bị kiểm tra bằng thị giác máy**. Người xem thấy cách bạn nghĩ trước khi đọc bất kỳ đoạn giới thiệu nào.

- **Hero** là một camera line-scan quét qua bề mặt tổng hợp, đánh dấu các vùng bất thường. Người xem kéo thanh ngưỡng phát hiện: thấp thì bắt hết lỗi nhưng báo nhầm nhiều, cao thì ngược lại. Đây là đánh đổi có mặt trong mọi dự án kiểm tra lỗi, và là điểm nhớ chính của cả trang.
- Mỗi dự án có **một mô hình tương tác riêng**, bám sát logic thật trong repo, không phải hoạt ảnh trang trí.
- Mọi thứ còn lại giữ yên tĩnh và kỷ luật để hero và các mô hình nổi bật.

Nguyên tắc nội dung: **chỉ nói điều có thể kiểm chứng trong repo**, nêu rõ giới hạn (ví dụ "đang thử nghiệm nội bộ"), và không phóng đại. Với nhà tuyển dụng đây là bằng chứng bạn làm việc cẩn thận; với hội đồng xét tuyển đây là tinh thần nghiên cứu.

---

## 2. Hai mục tiêu, một trang

| | Nhà tuyển dụng / kỹ sư | Hội đồng xét tuyển / giáo sư |
|---|---|---|
| Họ tìm gì | Hệ thống chạy được, độ trễ, triển khai thực tế, stack | Tư duy nghiên cứu, phương pháp đánh giá, khả năng viết rõ ràng |
| Họ có bao nhiêu thời gian | 1 đến 2 phút | 3 đến 5 phút, đọc kỹ hơn |
| Phần trang phục vụ họ | Hero, 4 dự án, số liệu độ trễ, bài học triển khai | Phần "Phương pháp đánh giá", Mối quan tâm nghiên cứu, Ghi chú kỹ thuật, CV tiếng Anh |

Cách dung hòa: giữ **một luồng chính ngắn** (hero → dự án → liên hệ) cho người xem vội, và đặt phần chiều sâu ở các khối có thể mở rộng hoặc trang riêng để người xem kỹ tự đào sâu.

Những thứ riêng cho hồ sơ du học, đều nên có từ bản đầu:

1. **Bản tiếng Anh đầy đủ**, không phải bản dịch cẩu thả. Chuyển ngôn ngữ giữ nguyên vị trí cuộn.
2. **Khối "Phương pháp đánh giá"** trong dự án Anomaly_LineScan (xem mục 5.1): ngân sách ảnh nhỏ, nhiều seed, kiểm chứng lồng nhau. Đây là loại bằng chứng hội đồng đánh giá cao hơn một con số recall.
3. **Mối quan tâm nghiên cứu**: 3 đến 4 câu nêu các câu hỏi bạn muốn đào sâu (xem mục 6.2). Chỉ viết điều thật sự bạn quan tâm.
4. **Nút tải CV** (PDF tiếng Anh, và tiếng Việt nếu có).
5. **Ghi chú kỹ thuật** (giai đoạn sau): 2 đến 3 bài ngắn trình bày thí nghiệm hoặc bài học. Xem mục 11.

Lưu ý: kế hoạch du học cụ thể (quốc gia, thời điểm) **không đưa lên site**. Site chỉ cần cho thấy năng lực và định hướng.

---

## 3. Cấu trúc trang

Một trang cuộn chính cho mỗi ngôn ngữ, cộng một vài trang phụ ở giai đoạn sau.

```
/vi/                 Trang chính tiếng Việt
/en/                 Trang chính tiếng Anh
/vi/notes/...        Ghi chú kỹ thuật (giai đoạn 2, MDX)
/en/notes/...
/cv/Doan-Viet-Hung-CV-en.pdf
```

Trang chính, từ trên xuống:

| # | Khối | Mục đích |
|---|---|---|
| 1 | Thanh đầu trang | Logo, 3 liên kết, VI/EN, sáng/tối |
| 2 | Hero | Câu mở đầu + camera quét lỗi tương tác |
| 3 | Dự án (4 phần) | Phần chính: bài toán, cách làm, kết quả, mô hình tương tác |
| 4 | Lĩnh vực & mối quan tâm nghiên cứu | Cho thấy bề rộng ngoài 4 dự án, và hướng nghiên cứu |
| 5 | Học vấn & CV | Đại học Khoa học Tự nhiên, ĐHQG-HCM, nút tải CV |
| 6 | Liên hệ | GitHub, email, LinkedIn |
| 7 | Chân trang | Ghi chú về việc đã rút gọn dự án riêng tư |

Phác thảo hero (desktop):

```
┌──────────────────────────────────────────────────────────────┐
│ ▯ hungdv                      Dự án  Lĩnh vực  Liên hệ  VI|EN ◐│
├──────────────────────────────────────────────────────────────┤
│ Mình xây hệ thống thị giác                                   │
│ máy tính chạy được ngoài                                     │
│ đời thật.                                                    │
│ Kỹ sư thị giác máy tính tại Việt Nam. Phát hiện lỗi công     │
│ nghiệp, nhận dạng khuôn mặt và biển số, đọc tài liệu...      │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ DÒNG 0896 / 1792                              THR 0,50   │ │
│ │  [vùng đã quét: khung hồng + điểm số] ║ [vùng chưa quét] │ │
│ └──────────────────────────────────────────────────────────┘ │
│ Ngưỡng ▬▬▬▬●▬▬▬  Đã đánh dấu 4 │ Lỗi thật 4/5 │ Báo nhầm 0  [Quét lại]│
│ Bề mặt tổng hợp, sinh ngẫu nhiên, không phải dữ liệu thật.   │
└──────────────────────────────────────────────────────────────┘
```

Phác thảo một khối dự án (desktop, ≥ 960 px; trên mobile xếp một cột):

```
────────────────────────────────────────────────────────────────
Tên dự án (lớn)                    Câu dẫn 1 đến 2 dòng
● Mã nguồn riêng tư
────────────────────────────────────────────────────────────────
Bài toán      ...             ┌────────────────────────────┐
Cách làm      ...             │  Mô hình tương tác         │
Kết quả       ...             │  (cố định khi cuộn qua     │
[số liệu]                     │   phần chữ bên trái)       │
Bài học triển khai            │                            │
Công nghệ: [tag] [tag]        └────────────────────────────┘
```

---

## 4. Hero chi tiết

**Câu mở đầu**

- VI: *Mình xây hệ thống thị giác máy tính chạy được ngoài đời thật.*
- EN: *I build computer vision systems that work outside the lab.*
- Dòng phụ VI: *Kỹ sư thị giác máy tính tại Việt Nam. Phát hiện lỗi công nghiệp, nhận dạng khuôn mặt và biển số, đọc tài liệu, đo đạc bằng camera.*
- Dòng phụ EN: *Computer vision engineer based in Vietnam. Industrial defect detection, face and license plate recognition, document OCR, and camera-based measurement.*

**Mô phỏng quét**

- Canvas vẽ một bề mặt vải/kim loại sinh ngẫu nhiên (thuật toán procedural, có hạt giống). Trên đó có 9 "ứng viên": 5 lỗi thật (vết bẩn, vết xước, lỗ) và 4 dấu vô hại (vệt mờ, bụi). Mỗi ứng viên có điểm bất thường, lỗi thật điểm cao hơn nhưng có chồng lấn.
- Đầu quét chạy từ trái sang phải khoảng 6,5 giây, giống ảnh được dựng từng dòng như camera line-scan. Vùng đã quét sáng, vùng chưa quét tối đi.
- Khi đầu quét đi qua, mỗi ứng viên hiện bản đồ nhiệt (màu theo điểm). Nếu điểm ≥ ngưỡng thì hiện khung và nhãn điểm số.
- Quét xong, khung đổi màu: hồng cho lỗi thật, hổ phách cho báo nhầm, kèm nhãn chữ ("lỗi thật" / "báo nhầm").
- **Thanh ngưỡng** cập nhật ngay: số ứng viên được đánh dấu, số lỗi thật bắt được trên tổng, số báo nhầm. Người xem tự thấy: ngưỡng thấp bắt đủ 5/5 nhưng báo nhầm nhiều, ngưỡng cao ít báo nhầm nhưng bỏ sót.
- Nút "Quét lại" sinh bề mặt mới.
- Chú thích dưới hero luôn ghi rõ: *Bề mặt tổng hợp, sinh ngẫu nhiên trong trình duyệt, không phải dữ liệu thật.*

**Hành vi cần đảm bảo**

- Chỉ chạy khi hero nằm trong khung nhìn; tạm dừng khi cuộn đi.
- Màn hình hẹp (< 560 px): ít ứng viên hơn (3 thật, 2 giả) và nhỏ hơn để nhãn không chồng nhau.
- `prefers-reduced-motion`: bỏ hoạt ảnh quét, hiện thẳng kết quả cuối; thanh ngưỡng vẫn dùng được.
- Thanh ngưỡng là `input[type=range]` thật, dùng được bằng bàn phím, kết quả đọc được qua `aria-live`.
- Canvas có `aria-label` mô tả; thông tin chính (số liệu) nằm ở dạng chữ bên ngoài canvas.

---

## 5. Bốn dự án

Mỗi dự án theo cùng một khung: **Bài toán → Cách làm → Kết quả**, thêm công nghệ, và một mô hình tương tác. Dưới đây là nội dung và ý tưởng chi tiết. Các câu tiếng Việt là bản nháp gần cuối; bản tiếng Anh viết song song ở giai đoạn dựng.

### 5.1. Kiểm tra lỗi bề mặt bằng camera line-scan (Anomaly_LineScan, private)

**Thông điệp:** phát hiện bất thường chỉ cần học từ ảnh đạt chuẩn, và đã chạy được trong khuôn khổ thời gian của dây chuyền.

**Câu dẫn (VI):** Hệ thống phát hiện bất thường chỉ cần học từ ảnh đạt chuẩn, không cần ảnh lỗi. Mỗi ảnh trả về OK hoặc NOK, bản đồ bất thường, mask và khung quanh vùng nghi lỗi.

**Bài toán:** Lỗi bề mặt hiếm và muôn hình muôn vẻ, khó gom đủ ảnh lỗi để huấn luyện. Dây chuyền cần quyết định cho mỗi ảnh trong khoảng 50 ms.

**Cách làm (đều lấy từ README và docs của repo):**
- PatchCore với MobileNetV3-Large (lấy đặc trưng ở `blocks.4` và `blocks.6`), chạy FP16.
- Ảnh cố định 1024 × 1792 được cắt thành tile 448 px, chồng lấn 0,20; mỗi tile tìm láng giềng gần nhất trong memory bank xây từ 10 ảnh đạt chuẩn (coreset 0,10).
- Điểm các tile được ghép bằng cửa sổ Hann, làm mượt Gaussian, chuẩn hóa theo thống kê của ảnh đạt chuẩn và giới hạn trong ROI. Ngưỡng hiệu chuẩn trên 50 ảnh đạt chuẩn khác.
- Dashboard vận hành: aiohttp, React 19, TypeScript, Vite, shadcn/ui; lịch sử lưu SQLite; nhận ảnh từ camera Basler (pypylon); có tab Train & Setup để tạo sản phẩm mới, tải ảnh đạt chuẩn, huấn luyện và kích hoạt ngay trên trình duyệt.

**Kết quả (cần xác nhận trước khi công bố, xem mục 9):**

| Số liệu | Giá trị | Ghi chú |
|---|---|---|
| Recall | 24/26 (92,3%) | 133 ảnh kiểm thử gồm 26 lỗi, 107 tốt |
| Báo nhầm | 3/107 (2,8%) | cùng tập kiểm thử |
| Độ trễ P50 | 43 ms | RTX A4000, FP16, batch 15, 3.990 frame liên tục; P95 là 44 ms |
| CPU | khoảng 683 ms | OpenVINO FP32, 2× Xeon Gold 6138; README ghi đây là kết quả lịch sử |

**Bài học triển khai** (lấy từ `docs/EXPERIENCED.md`, chọn 2 trong số đó, giọng khiêm tốn và cụ thể):
1. Camera line-scan kích hoạt theo encoder chỉ xuất ảnh khi bàn quay. Không có frame lúc motor đứng yên là hành vi đúng, không phải lỗi mạng.
2. Cáp camera cắm qua cổng PLC chỉ chạy 100 Mbps. Ở khoảng 64 Mbit/s thì ổn, tăng tốc độ bàn gần 98 Mbit/s là bắt đầu mất frame.

**Khối "Phương pháp đánh giá" (dành cho hồ sơ du học, có thể thu gọn):** các thí nghiệm few-shot trong ngân sách 10 hoặc 15 ảnh đạt chuẩn được chạy qua 8 seed, kiểm chứng lồng nhau (nested leave-one-out), cho ra 160 điểm vận hành; kết luận được ghi nhận cả khi **không** cải thiện (ví dụ "chưa có cải thiện đồng thời recall và tỉ lệ báo nhầm"). Việc ghi cả kết quả âm là điểm cộng lớn về tính trung thực khoa học.

**Mô hình tương tác: "Chia tile và chồng lấn"**
- Ảnh 1024 × 1792 vẽ bằng SVG, các tile 448 px phủ lên.
- Thanh "Độ chồng lấn" từ 0 đến 0,5 (bước 0,05). Số tile, bước nhảy, lưới (cột × hàng) cập nhật ngay.
- Ở 0,20 ra đúng lưới 3 × 5 = 15 tile, khớp với batch 15 dùng khi đo độ trễ; ở 0,50 ra 4 × 7 = 28 tile.
- Công tắc "Tô màu vùng được nhiều tile phủ": vùng chồng lấn có độ đậm tăng theo số tile phủ, cho thấy vì sao cần cửa sổ Hann để không lộ đường nối.
- Di chuột lên tile để làm nổi bật.

### 5.2. IntelliDoc OCR: số hóa văn bản hành chính tiếng Việt (ocr_new, private)

**Thông điệp:** một hệ thống đủ nghiêm túc để dùng thật: có người duyệt, có truy vết, có phân quyền.

**Câu dẫn (VI):** Hệ thống nhận PDF, trích xuất nội dung bằng OCR, để người rà soát sửa và phê duyệt từng trường, rồi lưu bằng chứng để kiểm tra lại về sau.

**Bài toán:** Văn bản hành chính, bìa hồ sơ và hồ sơ gộp có bố cục khác nhau. OCR sai thì phải có người sửa, và mọi chỉnh sửa đều phải truy vết được.

**Cách làm:**
- Giao diện Next.js; FastAPI nhận job; Celery và Redis chạy hàng đợi; Nginx đứng trước; tất cả trong Docker Compose.
- Endpoint OCR tương thích OpenAI, do máy chủ cấu hình; khóa và URL không bao giờ xuống trình duyệt. Có hộp xác nhận khi endpoint là bên ngoài.
- Đăng nhập bằng mật khẩu băm, phiên có khóa bí mật. Kết quả lưu thành JSON, PDF và artifact theo từng job; Redis chỉ làm hàng đợi.

**Kết quả:** 3 chế độ xử lý; phân đoạn hồ sơ gộp có bước người xác nhận ranh giới; vẽ crop thủ công làm bằng chứng; nhật ký kiểm toán; theo dõi job, chi phí OCR và System Monitor; giao diện VI/EN. Tối đa 15 PDF mỗi job, tổng 200 MiB.

**Trạng thái (nói thẳng):** hoàn tất hai milestone ở môi trường cục bộ, đang ở giai đoạn thử nghiệm nội bộ, chưa phải phê duyệt cho khách hàng.

**Mô hình tương tác: "Một job OCR đi qua những bước nào"**
- Công tắc 3 chế độ: *Văn bản hành chính*, *Bìa hồ sơ*, *Hồ sơ gộp*.
- Sáu bước (Tải PDF → Phân đoạn hồ sơ → OCR từng trang → Rà soát và sửa → Phê duyệt → Lưu JSON, PDF, nhật ký) sáng lên lần lượt khi đổi chế độ. Bước "Phân đoạn" bị làm mờ và gạch nét đứt ở hai chế độ đầu vì không dùng đến.
- Bước nào cần **người quyết định** (phân đoạn, rà soát, phê duyệt) có nhãn riêng: nhấn mạnh thiết kế "người trong vòng lặp".
- Bên dưới là 2 ảnh giao diện thật (Danh sách công việc, Không gian rà soát), lấy từ `docs/ui-parity/` mà README ghi là ảnh ẩn danh; dữ liệu trong ảnh là dữ liệu thử.

### 5.3. Vision Measurement Toolkit: đo khoảng cách và tốc độ từ camera (public)

**Thông điệp:** hiểu hình học đằng sau con số, không chỉ gọi thư viện. Đây là dự án mở nên có link GitHub, người xem kiểm tra được ngay.

**Câu dẫn (VI):** Bộ công cụ gộp hiệu chuẩn camera, đo khoảng cách trên mặt phẳng, đo 3D bằng ước lượng độ sâu từ một camera và đo tốc độ xe theo làn.

**Bài toán:** Muốn ra mét từ ảnh 2D thì phải biết một pixel ứng với bao nhiêu mét, và con số đó đổi theo khoảng cách tới camera.

**Cách làm:**
- Homography từ mặt phẳng đường sang ảnh; hiệu chuẩn camera bằng bàn cờ; giữ ổn định hiệu chuẩn bằng optical flow.
- Phát hiện bằng YOLO, ước lượng độ sâu bằng Depth Anything; hai bên chạy ở worker độc lập để không chặn nhau; có chọn mục tiêu bằng cú nhấp chuột và theo dõi KCF.
- Phần tốc độ có script đối chiếu với dữ liệu ground truth.

**Kết quả:** ba ứng dụng dòng lệnh (đo khoảng cách và chiều cao, đo độ sâu realtime, đo tốc độ theo làn). Hai repo thử nghiệm riêng (`Distance_calculation`, `Velocity_detection`) được tái cấu trúc thành một package có test.

**Mô hình tương tác: "Vì sao đo mét từ ảnh cần hiệu chuẩn"**
- Canvas vẽ mặt đường 3,5 m × 30 m, có vạch mốc mỗi 5 m, một vùng hiệu chuẩn 3,5 × 10 m (nét đứt, 4 điểm góc), và một xe chạy qua.
- Thanh "Góc nhìn" trượt liên tục từ **nhìn từ camera** (phối cảnh) sang **nhìn từ trên xuống** (bird's-eye): mọi điểm nội suy giữa hai phép chiếu, thể hiện việc homography "mở phẳng" mặt đường.
- Thanh "Tốc độ xe" (20 đến 100 km/h); hoạt ảnh chạy chậm 4 lần để dễ nhìn, có ghi chú.
- Hai số đọc trực tiếp:
  - "1 pixel ứng với … cm" tại vị trí xe hiện tại.
  - "Sai lệch nếu lệch 1 pixel … km/h" qua hai khung cách nhau 0,5 s.
- Ý nghĩa thấy được: xe càng xa camera thì 1 pixel càng ứng với nhiều mét (từ vài cm ở gần đến hàng mét ở xa), nên sai số tốc độ tăng mạnh. Câu chốt: *cần hiệu chuẩn mặt phẳng và kiểm chứng số đo bằng dữ liệu thật*, khớp với script ground truth của repo.

### 5.4. Giám sát an toàn lao động bằng pipeline nhiều tầng (demo_mvp, private)

**Thông điệp:** biết chia bài toán cho đúng model, đúng vùng ảnh, và tối ưu cho realtime.

**Câu dẫn (VI):** Pipeline sáu tầng phát hiện và theo dõi người, kiểm tra mũ, áo phản quang, khẩu trang, găng tay và các hành vi như dùng điện thoại trên luồng video realtime.

**Bài toán:** Mỗi kiểm tra cần một góc nhìn khác nhau: mũ và áo nhìn trên toàn khung hình, khẩu trang nhìn ở vùng mặt, găng tay nhìn ở vùng tay. Chạy mọi model trên cả khung hình thì vừa chậm vừa nhiễu.

**Cách làm:**
- Sáu tầng: phát hiện và theo dõi người → PPE (mũ, áo) → tách vùng (đầu-mặt, tay, thân) → khẩu trang → găng tay → hành vi.
- Cắt mỗi người thành các vùng rồi mới đưa vào model phân loại tương ứng. Kết quả khẩu trang và găng tay được lưu theo `track_id` và làm mới theo chu kỳ để giảm tải.
- Nhánh PPE và hành vi chạy **song song trên khung hình gốc**, không phụ thuộc bước tách vùng.

**Kết quả:** cùng một code chạy ở web realtime, RTSP và CLI batch. Các model PyTorch xuất sang ONNX để chạy bằng ONNX Runtime; riêng găng tay chạy TFLite trên CPU.

**Mô hình tương tác: "Mỗi model nhìn đúng vùng của nó"**
- SVG một hình người cách điệu; chọn giữa hai cảnh: *Đủ đồ bảo hộ* (mũ, áo, khẩu trang, găng tay) và *Thiếu đồ bảo hộ* (không mũ, áo; cầm điện thoại).
- Năm nút bật/tắt từng tầng: Người, Mũ & áo, Khẩu trang, Găng tay, Hành vi. Mỗi tầng vẽ khung và nhãn tương ứng; khung xanh khi đạt, hồng khi vi phạm.
- **Phản ánh đúng logic phụ thuộc:** tắt "Người" thì "Khẩu trang" và "Găng tay" tự vô hiệu (vì chúng cần vùng cắt từ người), còn "Mũ & áo" và "Hành vi" vẫn chạy (nhánh độc lập).
- Khung kết quả dạng văn bản cho `track #7` cập nhật theo lựa chọn.
- Chú thích bắt buộc: *minh họa luồng kết quả; độ tin cậy trong hình là số giả định, không phải đầu ra thật.*

---

## 6. Các khối còn lại

### 6.1. Lĩnh vực làm việc
Bốn mục ngắn, mỗi mục một câu: Nhận dạng khuôn mặt (chọn và benchmark detector, landmark, embedding); Chống giả mạo khuôn mặt; Nhận dạng biển số ALPR (benchmark biển số Việt Nam, pipeline nhiều camera); Phát hiện bất thường công nghiệp. Kèm 3 repo public làm bằng chứng: `Motion-Search-Demo`, `Semantic_Search_Test` (đánh giá Recall@20 cho truy vấn tiếng Việt và tiếng Anh), `LPR_only_trad_ml`. Chỉ nêu những gì thật sự có trong mô tả repo.

### 6.2. Mối quan tâm nghiên cứu (cho hồ sơ du học)
Viết 3 đến 4 câu hỏi cụ thể bằng giọng của bạn, ví dụ theo hướng các bài bạn đã làm: phát hiện bất thường với rất ít ảnh đạt chuẩn; cân bằng recall và tỉ lệ báo nhầm khi triển khai; anti-spoofing có khả năng tổng quát qua nhiều thiết bị; đo lường từ camera đơn. **Bạn nên tự viết hoặc duyệt kỹ phần này**, vì nó phải khớp với thư động lực và định hướng thật của bạn. Mình chỉ đề xuất khung.

### 6.3. Học vấn & CV
Cử nhân, Đại học Khoa học Tự nhiên, ĐHQG-HCM. Nút tải CV. Nếu có thành tích, giải thưởng hoặc ấn phẩm, thêm một dòng mỗi mục; nếu chưa có thì đừng tạo khối trống.

### 6.4. Liên hệ
GitHub (bắt buộc). Email và LinkedIn **chỉ hiện nếu bạn chọn công khai**. Nên dùng một địa chỉ email riêng cho mục đích này để tránh thư rác.

---

## 7. Thiết kế

**Màu sắc (nền sáng, có bản tối)**

| Vai trò | Sáng | Tối |
|---|---|---|
| Nền | `#ECEFF2` | `#0C141C` |
| Bề mặt khối | `#F8FAFB` | `#131E29` |
| Chữ | `#0F1B26` | `#E6ECF1` |
| Chữ phụ | `#566574` | `#8C9CAA` |
| Đường kẻ | `#C7D0D7` | `#263442` |
| Nhấn chính (cobalt) | `#2A47F0` | `#7C93FF` |
| Lỗi / vùng bất thường | `#FF3B6B` | `#FF5C85` |
| Đạt | `#17936A` | `#35C28F` |

Màu hồng-đỏ **chỉ** dùng cho thứ gì liên quan đến lỗi, vi phạm hay chỉ báo trên thước, để nó giữ ý nghĩa. Bản đồ nhiệt trong hero dùng dải từ tím đậm qua hồng, cam đến vàng (kiểu inferno).

**Chữ**
- Tiêu đề: **Bricolage Grotesque** (trục độ đậm, có đủ ký tự tiếng Việt), đậm 650 đến 700, giãn chữ hơi âm.
- Nội dung: **IBM Plex Sans** 400/500/600, cỡ khoảng 16,5 px, giãn dòng 1,65.
- Số liệu thiết bị trên canvas: **IBM Plex Mono**, chỉ dùng cho chỉ số trên mô phỏng và khung kết quả.
- Độ dài dòng tối đa khoảng 70 ký tự. Tất cả font tự host (xem mục 8).
- Tránh: nhấn một chữ đơn lẻ trong tiêu đề bằng màu khác, nhãn viết hoa toàn bộ phía trên mỗi tiêu đề, đánh số 01/02/03 cho các khối không phải một chuỗi thật.

**Bố cục**
- Căn trái toàn trang. Lưới 12 cột, rộng tối đa khoảng 1180 px. Hai cột 5/7 cho mỗi dự án (chữ trái, mô hình phải); dưới 960 px xếp một cột.
- Mô hình tương tác dùng `position: sticky` để đứng yên bên cạnh khi người xem đọc phần chữ dài.
- Mỗi dự án mở đầu bằng một đường kẻ đậm, không dùng thẻ bo tròn giống hệt nhau cho mọi thứ.

**Một chi tiết dấu ấn:** thước đo cố định ở mép trái (chỉ hiện từ màn hình ≥ 1280 px), có vạch chia và một cọc hồng di chuyển theo vị trí cuộn. Vừa là thanh tiến độ vừa nhắc đến chủ đề đo đạc.

**Chuyển động:** chỉ hero (một lần khi tải) và phản hồi trực tiếp khi người xem thao tác. Không có hiệu ứng trượt-hiện cho từng khối.

**Chất lượng nền:** đủ độ tương phản (WCAG AA), viền focus rõ cho mọi điều khiển, dùng được bằng bàn phím, hỗ trợ `prefers-reduced-motion` và `prefers-color-scheme`, không cuộn ngang trên điện thoại 390 px.

---

## 8. Kiến trúc kỹ thuật (Next.js, xuất tĩnh)

### 8.1. Cấu hình then chốt

```ts
// next.config.ts
const config = {
  output: 'export',          // sinh thư mục out/ gồm file tĩnh, VPS không cần Node
  trailingSlash: true,       // /vi/ thay vì /vi, hợp với try_files của Nginx
  images: { unoptimized: true },   // xuất tĩnh không có bộ tối ưu ảnh của server
};
export default config;
```

Hệ quả của xuất tĩnh cần nhớ:
- **Không có middleware, không có redirect phía server.** Việc chuyển `/` sang `/vi/` hoặc `/en/` theo ngôn ngữ trình duyệt làm ở **Nginx** (mục 9), kèm một script nhỏ dự phòng trong trang gốc.
- Không có API route động. Mọi dữ liệu nằm sẵn trong file TypeScript hoặc MDX và được nhúng lúc build.
- Ảnh tối ưu thủ công trước khi đưa vào (nén, đổi kích thước, WebP/AVIF khi có thể).

### 8.2. Cấu trúc thư mục

```
hungdv-portfolio/
├─ app/
│  ├─ [lang]/
│  │  ├─ layout.tsx          # <html lang>, font, thanh đầu, chân trang
│  │  ├─ page.tsx            # trang chính
│  │  └─ notes/[slug]/page.tsx   # (giai đoạn 2) ghi chú kỹ thuật
│  ├─ layout.tsx
│  ├─ page.tsx               # trang gốc: chuyển hướng dự phòng
│  ├─ sitemap.ts, robots.ts  # xuất tĩnh bằng force-static
│  └─ globals.css            # token màu, font, khung
├─ components/
│  ├─ hero/ScopeCanvas.tsx   # 'use client': mô phỏng quét lỗi
│  ├─ labs/TileLab.tsx       # dự án 1
│  ├─ labs/FlowLab.tsx       # dự án 2
│  ├─ labs/BevLab.tsx        # dự án 3
│  ├─ labs/SafetyLab.tsx     # dự án 4
│  ├─ ProjectSection.tsx     # khung Bài toán / Cách làm / Kết quả
│  ├─ ui/                    # shadcn/ui: Slider, Tabs, ToggleGroup, Toggle, Tooltip, Button
│  ├─ Ruler.tsx, LangSwitch.tsx, ThemeToggle.tsx, Tags.tsx
├─ content/
│  ├─ types.ts               # kiểu Content dùng chung cho 2 ngôn ngữ
│  ├─ vi.ts
│  ├─ en.ts
│  └─ projects.ts            # phần không đổi theo ngôn ngữ: id, stack, liên kết
├─ lib/
│  ├─ rng.ts                 # bộ sinh số ngẫu nhiên có hạt giống
│  └─ i18n.ts                # chọn từ điển theo [lang]
├─ public/
│  ├─ fonts/  assets/  cv/
├─ scripts/make-og.mjs       # sinh ảnh OG lúc build
└─ package.json, tsconfig.json, next.config.ts
```

### 8.3. Quyết định kỹ thuật

| Vấn đề | Quyết định | Lý do |
|---|---|---|
| Ngôn ngữ | Route `/[lang]/` với `generateStaticParams`, `dynamicParams = false` | Mỗi ngôn ngữ có URL riêng, tốt cho SEO và chia sẻ |
| Từ điển | Hai file TypeScript cùng một kiểu `Content` | Thiếu một chuỗi ở ngôn ngữ nào là **lỗi biên dịch**, không lọt ra trang |
| Thư viện i18n | Không dùng; từ điển tự viết | Trang chỉ một cấu trúc, không cần số nhiều hay định dạng phức tạp, bớt phụ thuộc |
| CSS | Tailwind CSS v4, token màu và font khai báo một chỗ bằng biến CSS (`@theme`) | Đi cùng shadcn/ui; bạn đã dùng đúng bộ này trong dashboard của Anomaly_LineScan (React 19, Tailwind 4, shadcn/ui) nên quen tay |
| Thành phần điều khiển | shadcn/ui (dựa trên Radix UI), tùy biến hoàn toàn | Slider, Tabs, ToggleGroup đã có sẵn bàn phím và ARIA, khỏi tự viết lại |
| Font | `next/font/local` với file đã tải về, hoặc `next/font/google` (tự tải lúc build, phục vụ từ chính domain) | Không gọi Google lúc chạy, có tiếng Việt, tránh nhấp nháy chữ |
| Canvas, SVG | Component client (`'use client'`), vẽ trong `useEffect`, dọn dẹp `requestAnimationFrame`/observer khi hủy | Chạy được với xuất tĩnh, không lỗi hydration |
| Dữ liệu ngẫu nhiên | Sinh **sau khi mount** (hạt giống từ `Math.random` trong effect), không sinh lúc render | Tránh lệch giữa HTML tĩnh và client |
| Theme | Thuộc tính `data-theme` trên `<html>`, script nhỏ chạy trước khi vẽ để không nháy | Tránh flash sáng/tối |
| Trạng thái | State cục bộ trong từng lab, không cần Redux hay Zustand | Các lab độc lập nhau |
| Ghi chú kỹ thuật | MDX (giai đoạn 2) | Viết bằng Markdown, có thể nhúng lại các lab |

**Hiệu năng**
- Mục tiêu: Lighthouse Performance ≥ 95 trên mobile, LCP dưới 2,5 s, không dịch bố cục (CLS ≈ 0).
- Tải chậm các lab bên dưới màn hình đầu (`next/dynamic` hoặc chỉ khởi tạo khi vào khung nhìn).
- Bề mặt hero sinh bằng mã (không ảnh), thời gian tạo cần đo trên điện thoại tầm thấp; nếu chậm thì giảm độ phân giải bề mặt trên mobile hoặc chuyển phần tạo sang `OffscreenCanvas` trong Web Worker.
- Chỉ tải các subset font cần thiết (latin, latin-ext, vietnamese).

**SEO và chia sẻ**
- `<title>` và `description` riêng cho mỗi ngôn ngữ, `hreflang` trỏ qua lại giữa `/vi/` và `/en/`.
- Ảnh Open Graph 1200 × 630 sinh lúc build; dữ liệu có cấu trúc `Person` (JSON-LD).
- Nội dung chính là HTML tĩnh nên công cụ tìm kiếm đọc được mà không cần chạy JavaScript.

**Kiểm thử**
- Kiểm tra kiểu và lint khi build.
- Kiểm thử trình duyệt tự động (Playwright): trang tải không lỗi console ở 390, 768, 1440 px; chuyển VI/EN và sáng/tối; kéo ngưỡng hero thì số liệu đổi đúng; mỗi lab có ít nhất một thao tác được kiểm tra (ví dụ độ chồng lấn 0,20 ra 15 tile).
- Kiểm tra bàn phím và `prefers-reduced-motion`.

### 8.4. Bộ thư viện giao diện

"Đẹp nhất" không có nghĩa là cài mọi thư viện: mỗi thư viện thêm dung lượng tải và thêm một cách làm khác nhau, còn vẻ đẹp của trang này đến từ thiết kế (mục 7) và các mô hình tương tác. Danh sách dưới đây là bộ chọn lọc.

| Thư viện | Dùng để làm gì trên trang | Quyết định |
|---|---|---|
| Next.js, React, TypeScript | Nền tảng, xuất tĩnh, kiểm tra kiểu cho nội dung hai ngôn ngữ | **Có** |
| Tailwind CSS v4 | Khung bố cục và token màu, chữ, khoảng cách | **Có** |
| shadcn/ui (Radix UI) | `Slider` (ngưỡng hero, độ chồng lấn, góc nhìn, tốc độ xe), `Tabs`/`ToggleGroup` (3 chế độ OCR, cảnh đủ/thiếu bảo hộ), `Toggle` (bật tắt tầng pipeline), `Tooltip`, `Sheet` (menu mobile), `Button` | **Có**, nhưng phải đổi toàn bộ kiểu mặc định (xem bên dưới) |
| Lucide | Vài icon (đổi theme, ngoại link, tải CV) | **Có** |
| next-themes | Chế độ sáng/tối, không nháy khi tải trang, nhớ lựa chọn | **Có** |
| Motion (trước đây là Framer Motion) | Chuyển động phản hồi thao tác: đổi chế độ lab, hiện/ẩn khối khi đổi ngôn ngữ, chuyển số liệu | **Có**, dùng tiết chế |
| GSAP + ScrollTrigger | Kể chuyện theo cuộn (ví dụ đường pipeline tự vẽ khi cuộn tới) | **Tùy chọn, giai đoạn 2.** Chọn Motion hoặc GSAP cho một việc, không dùng cả hai chồng nhau. Kiểm tra lại giấy phép hiện hành trước khi dùng |
| d3-scale, d3-shape, d3-interpolate | Chỉ khi cần biểu đồ hay đường cong cho ghi chú kỹ thuật | Tùy chọn |
| MDX (`@next/mdx`) | Ghi chú kỹ thuật có thể nhúng lại các lab | Giai đoạn 2 |
| Playwright | Kiểm thử trình duyệt, chụp ảnh đối chiếu | **Có** |
| ESLint + Prettier (hoặc Biome) | Giữ code nhất quán | **Có** |
| Three.js / React Three Fiber | Cảnh 3D | **Không** ở bản đầu. Canvas 2D và SVG đã đủ cho mọi lab và nhẹ hơn nhiều; chỉ thêm nếu bạn muốn một cảnh 3D riêng (ví dụ hình học camera) |
| Lenis (cuộn mượt) | Cuộn có quán tính | **Không** mặc định: dễ làm hỏng neo liên kết, `sticky`, trợ năng và gây cảm giác trễ trên điện thoại |

**Cách để shadcn/ui không trông như mẫu có sẵn.** Giao diện mặc định của shadcn rất dễ nhận ra, nên khi dùng cần:
- Thay token: màu theo bảng ở mục 7, bán kính bo góc nhỏ (khoảng 4 đến 6 px), bỏ đổ bóng mềm mặc định.
- Dùng font Bricolage Grotesque và IBM Plex Sans thay Inter.
- Làm lại hình dạng `Slider` thành **thước đo** (vạch chia, núm dạng đầu quét) để khớp ý tưởng hero.
- Chỉ copy các component cần dùng, không đưa cả bộ vào repo.

**Ngân sách hiệu năng.** JavaScript tải lần đầu nên giữ dưới khoảng 200 KB nén gzip. Motion và Radix có thể tách theo từng lab (`next/dynamic`) để màn hình đầu chỉ tải phần hero.

---

## 9. Triển khai trên VPS

**Quy trình:** build trên máy bạn → tải thư mục `out/` lên VPS. VPS **chỉ cần Nginx**, không cần Node.js.

```bash
npm run build        # tạo thư mục out/
# tải lên (từ máy bạn): scp -r out/. user@IP:/var/www/hungdv.io.vn/
```

**Nginx (ý chính)**

```nginx
map $http_accept_language $home_lang {
    default      en;
    ~*^vi        vi;          # trình duyệt ưu tiên tiếng Việt
}

server {
    listen 80;
    server_name hungdv.io.vn www.hungdv.io.vn;
    root /var/www/hungdv.io.vn;
    index index.html;

    location = / { return 302 /$home_lang/; }

    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    gzip on;
    gzip_types text/css application/javascript image/svg+xml;

    location /_next/static/ { expires 1y; }   # file có mã băm trong tên, cache dài an toàn
    location /fonts/        { expires 1y; }

    location / { try_files $uri $uri/ =404; }
}
```

Việc cần làm sau khi có server:
1. Trỏ DNS: bản ghi `A` cho `@` và `www` về IP VPS.
2. Bật HTTPS miễn phí: `certbot --nginx -d hungdv.io.vn -d www.hungdv.io.vn` (tự gia hạn).
3. Tường lửa chỉ mở 22, 80, 443.
4. Giai đoạn sau: GitHub Actions tự build và tải lên mỗi khi đẩy code lên nhánh `main`, dùng một khóa SSH riêng chỉ có quyền ghi vào thư mục site.

**Chi phí tài nguyên:** phục vụ file tĩnh nên VPS nhỏ nhất cũng đủ; phần còn lại của VPS vẫn dùng được cho việc khác. Nếu sau này thêm demo chạy model thật (phương án B), cần ít nhất 2 GB RAM và tách khỏi site tĩnh bằng một dịch vụ riêng.

---

## 10. Quyền công bố và bảo mật

Ba trong bốn dự án là repo **private**. Đây là rủi ro lớn nhất của cả kế hoạch, và nó là việc của bạn, không phải của mã nguồn.

**Trước khi công bố, hãy xác nhận với công ty hoặc khách hàng:**
- Được phép mô tả công khai dự án nào, ở mức chi tiết nào.
- Có được đăng **số liệu** hay không (recall, FPR, độ trễ ở mục 5.1). Nếu không chắc, bỏ số liệu và chỉ giữ kiến trúc, hoặc diễn đạt định tính.
- Có được dùng **ảnh chụp giao diện** hay không (2 ảnh của IntelliDoc OCR là dữ liệu thử, nhưng vẫn là giao diện của sản phẩm).

**Không đưa lên site, dù ở dạng nào:**
- Logo, tên công ty hay khách hàng, tên sản phẩm hoặc bộ dữ liệu nội bộ.
- Địa chỉ IP, cấu hình mạng, thông số PLC, đường dẫn máy chủ.
- Mã nguồn, trọng số model, hay ảnh thật từ dây chuyền.
- Mật khẩu, khóa API, bất cứ file `.env` nào (kiểm tra trước khi build).

**Cách làm cho an toàn hơn:** mọi mô hình tương tác dùng **dữ liệu tổng hợp** do trình duyệt tự sinh, nên không có ảnh thật nào bị lộ. Mỗi dự án private có nhãn "Mã nguồn riêng tư", và chân trang ghi rõ chi tiết các dự án riêng tư đã được rút gọn.

**Bảo mật site tĩnh:** không có backend, không có form, không lưu dữ liệu người dùng, nên bề mặt tấn công rất nhỏ. Chỉ cần HTTPS, cập nhật hệ điều hành VPS, và đăng nhập SSH bằng khóa.

---

## 11. Lộ trình

Ước lượng theo ngày làm việc tập trung; nếu làm song song với công việc chính thì nhân lên tương ứng.

| Giai đoạn | Việc | Ước lượng |
|---|---|---|
| 0. Chuẩn bị | Xác nhận quyền công bố; chốt tên hiển thị, email, LinkedIn; thu CV; chọn ảnh giao diện | 1 đến 2 |
| 1. Khung | Khởi tạo Next.js, token màu/chữ, tải font, route `[lang]`, từ điển VI/EN, thanh đầu, thước, theme | 1 đến 2 |
| 2. Hero | Mô phỏng quét lỗi, thanh ngưỡng, chế độ giảm chuyển động, mobile | 1 đến 2 |
| 3. Dự án | Khung ProjectSection + 4 lab, nội dung hai ngôn ngữ | 3 đến 4 |
| 4. Hoàn thiện | Lĩnh vực, học vấn, liên hệ; SEO, OG, a11y, hiệu năng, kiểm thử Playwright | 1 đến 2 |
| 5. Triển khai | Nginx, DNS, HTTPS, tải `out/`, kiểm tra thực tế trên điện thoại | 1 |
| Sau này | Ghi chú kỹ thuật (MDX) 2 đến 3 bài; CI/CD; (tùy chọn) phương án B với dataset công khai | tùy |

Gợi ý các ghi chú kỹ thuật cho hồ sơ du học (chọn theo thứ tự ưu tiên): (1) so sánh các cấu hình few-shot trong ngân sách 10/15 ảnh, kể cả hướng không thành công; (2) vì sao 1 pixel không ứng với một lượng mét cố định (mở rộng từ lab BevLab); (3) bài học triển khai camera line-scan.

---

## 12. Tiêu chí hoàn thành

- [ ] Trang tải không có lỗi console ở 390 px, 768 px và 1440 px.
- [ ] Hero: quét xong, kéo ngưỡng thì số liệu đổi đúng; giảm chuyển động thì hiện ngay kết quả.
- [ ] Mỗi lab có thao tác được kiểm thử tự động và dùng được bằng bàn phím.
- [ ] Mọi chuỗi có đủ ở VI và EN (TypeScript báo lỗi nếu thiếu); chuyển ngôn ngữ không mất vị trí cuộn.
- [ ] Sáng/tối đều đạt độ tương phản WCAG AA.
- [ ] Lighthouse mobile: Performance ≥ 95, Accessibility ≥ 95, SEO ≥ 95.
- [ ] Không còn thông tin khách hàng, IP, logo hay khóa bí mật trong thư mục `out/` (kiểm tra bằng tìm kiếm văn bản).
- [ ] Bạn đã xác nhận bằng văn bản hoặc tin nhắn về quyền công bố ba dự án private.
- [ ] HTTPS hoạt động, `/` chuyển đúng sang `/vi/` hoặc `/en/`.

---

## 13. Câu hỏi mở cần bạn trả lời

1. **Tên hiển thị:** "Đoàn Việt Hưng" (suy ra từ tên GitHub) có đúng không? Tên tiếng Anh có đảo họ tên không (Hung Viet Doan)?
2. **Quyền công bố:** bạn đã hỏi chưa, và số liệu của Anomaly_LineScan có được đăng không?
3. **Email, LinkedIn:** công khai cái nào? Có CV tiếng Anh sẵn chưa?
4. **Mối quan tâm nghiên cứu:** bạn muốn tự viết hay cần mình soạn khung để bạn sửa?
5. **Ảnh cá nhân:** có muốn hiện không? Mặc định mình để trống để trang tập trung vào dự án.
6. **Blog:** có muốn có ngay từ bản đầu, hay để giai đoạn sau?

---

## Phụ lục A. Nội dung các khối cho bản tiếng Anh

| Khối | Tiếng Anh |
|---|---|
| Dự án 1, tên | Surface defect inspection with a line-scan camera |
| Dự án 1, câu dẫn | The anomaly detector learns only from good samples and needs no defect images. Each image returns OK or NOK, an anomaly map, a mask and boxes around suspect regions. |
| Dự án 2, tên | IntelliDoc OCR: digitizing Vietnamese administrative documents |
| Dự án 2, câu dẫn | The system takes PDFs, extracts content with OCR, lets a reviewer correct and approve each field, and keeps evidence so results can be audited later. |
| Dự án 3, tên | Vision Measurement Toolkit: distance and speed from a camera |
| Dự án 3, câu dẫn | A toolkit combining camera calibration, planar distance, 3D measurement from single-camera depth estimation, and lane-based vehicle speed. |
| Dự án 4, tên | Workplace safety monitoring with a multi-stage pipeline |
| Dự án 4, câu dẫn | A six-stage pipeline detects and tracks people, then checks helmets, vests, face masks, gloves and behaviors such as phone use on a realtime video stream. |
| Hero, gợi ý thanh ngưỡng | Drag the threshold: low catches every defect but raises false alarms, high does the opposite. Every inspection project has to balance this. |

## Phụ lục B. Nguồn dữ kiện

Mọi chi tiết kỹ thuật và số liệu trong tài liệu này lấy từ README và thư mục `docs/` của chính các repo: `Anomaly_LineScan` (README, `docs/EXPERIENCED.md`, `docs/DEPLOYMENT_BENCHMARKS.md`), `ocr_new` (README, `docs/ui-parity/`), `Vision_Measurement_Toolkit` (README, `docs/`, `phan_tich_gop_repo_distance_velocity.md`), `demo_mvp` (README). Các số liệu hiệu năng của Anomaly_LineScan được README ghi là kết quả lịch sử, không phải phép đo lại sau lần chuyển thư mục gần nhất, nên cần đo lại hoặc ghi rõ nếu công bố.
