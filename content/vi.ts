import type { Content } from './types';

export const vi: Content = {
  meta: {
    title: 'Đoàn Việt Hưng · Kỹ sư thị giác máy tính',
    description:
      'Portfolio của Đoàn Việt Hưng, kỹ sư thị giác máy tính: nhận diện khuôn mặt, nhận dạng biển số, kiểm tra lỗi bề mặt bằng camera line-scan, OCR văn bản hành chính tiếng Việt, đo đạc bằng camera và giám sát an toàn lao động.',
  },
  name: 'Đoàn Việt Hưng',
  role: 'Kỹ sư AI / Thị giác máy tính',
  nav: {
    experience: 'Kinh nghiệm',
    projects: 'Dự án',
    areas: 'Lĩnh vực',
    contact: 'Liên hệ',
    skip: 'Bỏ qua, đến nội dung chính',
    toLight: 'Chuyển sang nền sáng',
    toDark: 'Chuyển sang nền tối',
    langName: 'Tiếng Việt',
    otherLang: 'Read in English',
  },
  hero: {
    title: 'Mình xây hệ thống thị giác máy tính chạy được ngoài đời thật.',
    sub: 'Kỹ sư thị giác máy tính tại Việt Nam. Phát hiện lỗi công nghiệp, nhận dạng khuôn mặt và biển số, đọc tài liệu, đo đạc bằng camera.',
  },
  glanceTitle: 'Dự án tiêu biểu',
  projectsTitle: 'Chi tiết dự án',
  labels: {
    problem: 'Bài toán',
    approach: 'Cách làm',
    moreApproach: 'Chi tiết triển khai',
    results: 'Kết quả',
    lessons: 'Bài học triển khai',
    stack: 'Công nghệ',
    private: 'Mã nguồn riêng tư',
    public: 'Mã nguồn mở',
    viewCode: 'Xem mã nguồn trên GitHub',
    status: 'Trạng thái',
    metric: 'Số liệu',
    value: 'Giá trị',
    note: 'Ghi chú',
  },
  projects: {
    linescan: {
      title: 'Kiểm tra lỗi bề mặt bằng camera line-scan',
      glance: { name: 'Kiểm tra lỗi bề mặt', stat: 'Recall 92,3%', line: 'Học từ 10 ảnh đạt chuẩn; báo nhầm 2,8%, 43 ms mỗi ảnh.' },
      lede: 'Hệ thống phát hiện bất thường chỉ cần học từ ảnh đạt chuẩn, không cần ảnh lỗi. Mỗi ảnh trả về OK hoặc NOK, bản đồ bất thường, mask và khung quanh vùng nghi lỗi.',
      problem:
        'Lỗi quá hiếm và đa dạng để gom ảnh huấn luyện, trong khi dây chuyền cần quyết định cho mỗi ảnh trong khoảng 50 ms.',
      approach: [
        'PatchCore với MobileNetV3-Large (FP16), memory bank xây từ chỉ 10 ảnh đạt chuẩn.',
        'Mỗi ảnh 1024 × 1792 được cắt tile, chấm điểm, ghép thành một bản đồ bất thường và so ngưỡng hiệu chuẩn trên 50 ảnh đạt chuẩn khác.',
        'Đặc trưng lấy ở blocks.4 và blocks.6. Tile 448 px, chồng lấn 0,20; memory bank dùng coreset 0,10.',
        'Điểm các tile được ghép bằng cửa sổ Hann, làm mượt Gaussian, chuẩn hóa theo thống kê của ảnh đạt chuẩn và giới hạn trong ROI.',
        'Dashboard vận hành bằng aiohttp và React 19 (TypeScript, Vite, shadcn/ui), lịch sử lưu SQLite, nhận ảnh từ camera Basler qua pypylon. Tab Train & Setup cho phép tạo sản phẩm mới, tải ảnh đạt chuẩn, huấn luyện và kích hoạt ngay trên trình duyệt.',
      ],
      results: [
        'Số liệu độ chính xác đo trên bộ dữ liệu công khai RAW-FABRID (cuộn Rollo7A, CC BY 4.0): 133 ảnh kiểm thử, 26 lỗi và 107 tốt. Phần bài học triển khai bên dưới lấy từ lần lắp đặt tại nhà máy. README ghi các số độ trễ là kết quả lịch sử.',
      ],
      metrics: [
        { label: 'Recall', value: '24/26 (92,3%)', note: 'Rollo7A, RAW-FABRID: 133 ảnh kiểm thử, 26 lỗi, 107 tốt' },
        { label: 'Báo nhầm', value: '3/107 (2,8%)', note: 'cùng tập kiểm thử' },
        { label: 'Độ trễ P50', value: '43 ms', note: 'RTX A4000, FP16, batch 15, 3.990 frame liên tục; P95 là 44 ms' },
        { label: 'Trên CPU', value: '≈ 683 ms', note: 'OpenVINO FP32, 2 × Xeon Gold 6138' },
      ],
      lessons: [
        'Camera line-scan kích hoạt theo encoder chỉ xuất ảnh khi bàn quay. Không có frame lúc motor đứng yên là hành vi đúng, không phải lỗi mạng.',
        'Cáp camera cắm qua cổng PLC chỉ chạy 100 Mbps. Ở khoảng 64 Mbit/s thì ổn; tăng tốc độ bàn lên gần 98 Mbit/s là bắt đầu mất frame.',
      ],
      method: {
        summary: 'Phương pháp đánh giá',
        body: [
          'Các thí nghiệm few-shot trong ngân sách 10 hoặc 15 ảnh đạt chuẩn được chạy qua 8 seed, kiểm chứng lồng nhau (nested leave-one-out), cho ra 160 điểm vận hành.',
          'Kết luận được ghi lại cả khi cấu hình mới không tốt hơn, ví dụ: chưa có cấu hình nào cải thiện đồng thời recall và tỉ lệ báo nhầm. Ghi cả kết quả âm giúp lần thử sau không lặp lại hướng đã thất bại.',
        ],
      },
    },
    ocr: {
      title: 'IntelliDoc OCR: số hóa văn bản hành chính tiếng Việt',
      glance: { name: 'IntelliDoc OCR', stat: '91% trường đúng · 5,2 s/trang', line: 'Pipeline chạy hoàn toàn tại chỗ, từ PDF scan đến từng trường đã rà soát.' },
      lede: 'Pipeline chạy hoàn toàn trên một GPU tại chỗ, đọc văn bản hành chính tiếng Việt từ bản scan, trích số, ngày, cơ quan ban hành, loại văn bản, trích yếu và người ký của từng văn bản, rồi gửi những giá trị chưa chắc chắn cho người rà soát trên web app.',
      problem:
        'Bản scan có dấu đỏ đè lên chữ, số viết tay, nhiều bố cục khác nhau, và một PDF thường chứa nhiều văn bản. Khi một giá trị sai, người sửa phải để lại dấu vết truy được.',
      approach: [
        'Không dùng LLM, không gọi cloud: PP-DocLayout tìm các vùng, PP-OCR phát hiện dòng chữ, VietOCR đọc từng dòng. Paddle chỉ đọc lại những dòng cần (số, mã, header, độ tin cậy thấp). Paddle và PyTorch nằm ở hai môi trường riêng để bản CUDA không xung đột.',
        'Chỉ làm sạch ảnh khi trang cần: nắn phối cảnh, đánh giá chất lượng, khử nhiễu, chỉnh nghiêng, tăng tương phản, tách mực dấu đỏ khỏi chữ đen.',
        'Các trường lấy bằng luật chấm điểm (vị trí, tỉ lệ chữ hoa, từ khóa) theo thể thức của Nghị định 30/2020. Giá trị được đối chiếu với danh mục đơn vị hành chính (gồm cả đợt sáp nhập 2025), danh mục cơ quan và loại văn bản, và một mô hình âm tiết để sửa dấu thanh bị đọc sai. Mọi giá trị do luật sửa đều được gửi duyệt.',
        'Web app là server Python thư viện chuẩn với JavaScript thuần. Nhiều người rà soát cùng làm qua mạng LAN, mật khẩu băm scrypt, cookie phiên có ký, CSP chặt. Mỗi chỉnh sửa lưu kèm tên người sửa và trở thành một ca kiểm thử hồi quy.',
      ],
      results: [
        'Độ chính xác theo trường trên bộ scan tăng từ 61,4% lên 92,0% qua khoảng 30 thử nghiệm có ghi chép, chấm trên nhãn nháp; so với nhãn đã được người kiểm sau đó, pipeline cuối đạt 91,2%. Mỗi thử nghiệm đều ghi lý do giữ hay bỏ. Ví dụ: đọc lại các vùng bằng VLM làm tăng độ chính xác trung bình theo trường nhưng thêm khoảng 65 s mỗi trang, nên không đưa vào.',
        'Tốc độ từ 142 s/trang ở mốc CPU đầu tiên xuống 50 s trên CPU và 4,6 s trên GPU GTX 1650 Ti, kết quả không đổi; lần chạy đó tính trung bình cả bản scan lẫn 86 trang PDF số. Riêng 74 trang scan, pipeline hiện tại mất 5,2 s/trang trên RTX A4000. Phần lớn đến từ việc giải mã mọi dòng VietOCR của một trang trong một batch có mask, render PDF ở tiến trình riêng để không chặn mô hình layout, và bỏ qua các trang giữa không có dấu hiệu văn bản mới.',
        'Một PDF được tự tách thành các văn bản logic, loại văn bản đúng 33/33 trên bộ scan. Khi chạy thử trên web app, 5 job gồm 55 PDF (188 trang) đều xong, không lỗi. Bìa hồ sơ có luật riêng: giá trị viết tay chỉ được sửa theo những gì mẫu bìa in sẵn bảo đảm.',
        '228 unit test. Chạy lại bước trích xuất trên OCR đã lưu mất khoảng một phút, nên mọi thay đổi luật đều được chấm với ground truth trước khi giữ.',
      ],
      metrics: [
        { label: 'Trường đúng, bản scan', value: '91,2%', note: '331/363 trường, tỉ lệ lỗi ký tự 5,5%; 33 văn bản, 74 trang scan; nhãn đã được người kiểm' },
        { label: 'Trường đúng, PDF số', value: '95,5%', note: '168/176 trường, tỉ lệ lỗi ký tự 3,0%; 16 PDF công khai có dấu và chữ ký, 86 trang; nhãn nháp' },
        { label: 'Văn bản Trung ương', value: '80,0%', note: '132/165 trường; 15 văn bản, 51 trang; nhãn đã kiểm; nhiều luật mới hợp văn bản cấp xã' },
        { label: 'Tốc độ', value: '5,2 s/trang', note: '74 trang scan, RTX A4000, thêm ~11 s nạp mô hình; 4,6 s/trang trên GTX 1650 Ti 4 GB ở lần chạy trước, gồm cả 86 trang PDF số; mốc CPU đầu tiên 142 s/trang' },
      ],
      method: {
        summary: 'Cách đánh giá',
        body: [
          'Từng trường được chấm với ground truth gán tay trên ba bộ: văn bản scan cấp xã, PDF số công khai và văn bản Trung ương. Chỉ so các lần chạy được chấm trên cùng một bộ nhãn.',
          'Phần lớn lỗi còn lại do OCR chứ không phải luật: chữ dưới con dấu, dấu thanh in sai, số viết tay và ranh giới của trích yếu.',
        ],
      },
      status:
        'Đang thử nghiệm nội bộ, chưa phải bản phê duyệt cho khách hàng. Nhãn của bộ PDF số vẫn là bản nháp, và mới có hai bìa hồ sơ được gán nhãn.',
    },
    measure: {
      title: 'Vision Measurement Toolkit: đo khoảng cách và tốc độ từ camera',
      glance: { name: 'Vision Measurement Toolkit', stat: '49 FPS · mã nguồn mở', line: 'Đo khoảng cách và tốc độ xe từ một camera, theo thời gian thực.' },
      lede: 'Bộ công cụ gộp hiệu chuẩn camera, đo khoảng cách trên mặt phẳng, đo 3D bằng ước lượng độ sâu từ một camera và đo tốc độ xe theo làn.',
      problem:
        'Muốn ra mét từ ảnh 2D thì phải biết một pixel ứng với bao nhiêu mét, và con số đó thay đổi theo khoảng cách tới camera.',
      approach: [
        'Homography từ mặt phẳng đường sang ảnh; hiệu chuẩn camera bằng bàn cờ; giữ ổn định hiệu chuẩn bằng optical flow.',
        'Phát hiện bằng YOLO, ước lượng độ sâu bằng Depth Anything; hai bên chạy ở worker độc lập để không chặn nhau. Chọn mục tiêu bằng cú nhấp chuột và theo dõi bằng KCF.',
        'Phần tốc độ có script đối chiếu với dữ liệu ground truth.',
      ],
      results: [
        'Ba ứng dụng dòng lệnh: đo khoảng cách và chiều cao, đo độ sâu realtime, đo tốc độ theo làn.',
        'Hai repo thử nghiệm riêng (Distance_calculation, Velocity_detection) được tái cấu trúc thành một package có test.',
      ],
      metrics: [
        { label: 'Hình học', value: '49 FPS', note: 'đo cả vòng xử lý; MAPE 13,34% trên 4 khoảng cách đo thật, 1,4–2,8 m; homography + YOLO; Intel Core i7, GTX 1650 Ti' },
        { label: 'Deep learning', value: 'MAPE 15,07%', note: 'cùng 4 khoảng cách; Depth Anything V2 chạy ở worker riêng, cứ 2 frame một lần, chưa đo riêng tốc độ; cùng máy' },
      ],
    },
    safety: {
      title: 'Giám sát an toàn lao động bằng pipeline nhiều tầng',
      glance: { name: 'Giám sát an toàn lao động', stat: 'Pipeline 6 tầng', line: 'Người, mũ, áo, khẩu trang, găng tay, dùng điện thoại và vùng cấm trên video trực tiếp.' },
      lede: 'Pipeline sáu tầng phát hiện và theo dõi người, kiểm tra mũ, áo phản quang, khẩu trang, găng tay và các hành vi như dùng điện thoại trên luồng video realtime. Luật vùng cấm cảnh báo khi có người đi vào khu vực hạn chế.',
      problem:
        'Mũ và áo thấy được trên toàn khung hình, nhưng khẩu trang và găng tay cần ảnh cắt vùng mặt, vùng tay; chạy mọi model trên cả khung hình thì vừa chậm vừa nhiễu.',
      approach: [
        'Sáu tầng: phát hiện và theo dõi người → PPE (mũ, áo) → tách vùng (đầu-mặt, tay, thân) → khẩu trang → găng tay → hành vi.',
        'Mỗi người được cắt thành các vùng rồi mới đưa vào model phân loại tương ứng. Kết quả khẩu trang và găng tay lưu theo track_id và làm mới theo chu kỳ để giảm tải.',
        'Nhánh PPE và nhánh hành vi chạy song song trên khung hình gốc, không phụ thuộc bước tách vùng.',
        'Vùng cấm là đa giác vẽ trên khung hình camera; người đang được theo dõi bị đánh dấu khi đứng trong vùng đó.',
      ],
      results: [
        'Cùng một mã nguồn chạy ở web realtime, RTSP và CLI batch.',
        'Các model PyTorch được xuất sang ONNX để chạy bằng ONNX Runtime; riêng găng tay chạy TFLite trên CPU.',
      ],
      status: 'Chưa đánh giá định lượng: chưa đo FPS hay độ chính xác từng tầng trên phần cứng cố định.',
      demos: [
        { title: 'Mũ và áo phản quang trong nhà xưởng', video: '/demo/ppe.mp4', poster: '/demo/ppe.jpg', caption: 'Kết quả pipeline trên một clip công khai từ YouTube, không phải hiện trường khách hàng.' },
        { title: 'Vùng cấm', video: '/demo/zone.mp4', poster: '/demo/zone.jpg', caption: 'Camera đường phố từ một clip công khai trên YouTube. Người chuyển sang khung đỏ khi đứng trong vùng màu cam.' },
        {
          title: 'Cùng khung hình, ba điều kiện ánh sáng',
          stills: [
            { src: '/demo/zone-day.webp', label: 'Gốc' },
            { src: '/demo/zone-dark.webp', label: 'Làm tối (ban đêm)' },
            { src: '/demo/zone-ir.webp', label: 'Đen trắng (hồng ngoại)' },
          ],
          caption: 'Bản làm tối và bản đen trắng được tạo từ cùng clip để thử độ bền. Cảnh báo vùng cấm vẫn bật ở cả ba, nhưng ID theo dõi khác nhau (30, 43, 29), nên tracking chưa đồng nhất giữa các điều kiện.',
        },
      ],
    },
  },
  labs: {
    loading: 'Đang tải mô hình tương tác…',
    tile: {
      title: 'Chia tile và chồng lấn',
      overlap: 'Độ chồng lấn',
      tiles: 'Số tile',
      stride: 'Bước nhảy',
      grid: 'Lưới (cột × hàng)',
      coverage: 'Tô màu vùng được nhiều tile phủ',
      coverageLegend: 'Số tile phủ lên một điểm',
      note: 'Ảnh 1024 × 1792 px, tile 448 px. Tile cuối mỗi hàng và cột được kéo sát mép ảnh.',
      matchNote: 'Ở 0,20 ra lưới 3 × 5 = 15 tile, đúng batch 15 dùng khi đo độ trễ.',
      imageLabel: 'Ảnh 1024 × 1792 px với các tile 448 px phủ lên, độ chồng lấn {overlap}, tổng {tiles} tile.',
      hover: 'Tile {i}: x {x}, y {y}',
    },
    flow: {
      title: 'Một job OCR đi qua những bước nào',
      modeLabel: 'Loại PDF',
      modes: [
        { name: 'Một văn bản', desc: 'Mỗi PDF là một văn bản. Đọc trang đầu và trang cuối; trang giữa chỉ đọc khi mở đầu một văn bản mới.' },
        { name: 'Bìa hồ sơ', desc: 'Nhãn in sẵn đọc tốt, giá trị viết tay đọc kém, nên chỉ sửa theo những gì mẫu bìa in sẵn bảo đảm.' },
        { name: 'Nhiều văn bản', desc: 'Trang có tiêu đề văn bản ở phần trên mở đầu một văn bản mới, nên PDF được tự tách.' },
      ],
      steps: [
        'Tải PDF',
        'Tách thành các văn bản',
        'Layout và OCR trên GPU tại chỗ',
        'Trích xuất và kiểm tra trường',
        'Rà soát và sửa',
        'Phê duyệt',
        'Lưu JSON; bản sửa thành ca kiểm thử hồi quy',
      ],
      human: 'người quyết định',
      skipped: 'PDF này không cần',
      note: 'Hệ thống đề xuất, con người quyết định. Mọi giá trị do luật sửa đều được đánh dấu cần duyệt, và mọi chỉnh sửa đều ghi kèm tên người sửa.',
    },
    bev: {
      title: 'Vì sao đo mét từ ảnh cần hiệu chuẩn',
      view: 'Góc nhìn',
      camera: 'Từ camera',
      topDown: 'Từ trên xuống',
      speed: 'Tốc độ xe',
      perPixel: '1 pixel ứng với',
      speedError: 'Lệch 1 pixel qua 0,5 s làm sai',
      travel: 'Trong 0,5 s xe đi {m} m, tức khoảng {px} pixel',
      distance: 'Xe cách camera',
      calibZone: 'vùng hiệu chuẩn 3,5 × 10 m',
      slowNote: 'Hoạt ảnh chạy chậm 4 lần. Số pixel tính theo một camera giả định 1280 × 720, cao 3 m.',
      takeaway:
        'Xe càng xa, 1 pixel càng ứng với nhiều mét, nên cùng một sai số pixel cho sai số tốc độ lớn hơn nhiều. Vì vậy cần hiệu chuẩn mặt phẳng và kiểm chứng số đo bằng dữ liệu thật.',
      canvasLabel:
        'Mặt đường 3,5 × 30 m có vạch mốc mỗi 5 m và một xe đang chạy, nhìn từ camera hoặc từ trên xuống tùy thanh góc nhìn.',
    },
    safety: {
      title: 'Mỗi model nhìn đúng vùng của nó',
      sceneLabel: 'Cảnh',
      scenes: ['Đủ đồ bảo hộ', 'Thiếu đồ bảo hộ'],
      stagesLabel: 'Các tầng',
      stages: { person: 'Người', ppe: 'Mũ & áo', mask: 'Khẩu trang', gloves: 'Găng tay', behavior: 'Hành vi' },
      needsPerson: 'cần vùng cắt từ tầng Người',
      independent: 'chạy trên khung hình gốc',
      labels: {
        person: 'người',
        helmet: 'mũ',
        noHelmet: 'thiếu mũ',
        vest: 'áo phản quang',
        noVest: 'thiếu áo',
        mask: 'khẩu trang',
        gloves: 'găng tay',
        phone: 'dùng điện thoại',
        crop: 'vùng cắt',
      },
      resultTitle: 'Kết quả',
      off: 'tắt',
      disabled: 'không chạy (thiếu vùng cắt)',
      caption: 'Minh họa luồng kết quả; độ tin cậy trong hình là số giả định, không phải đầu ra thật.',
      figureLabel: 'Hình người cách điệu với các khung phát hiện của từng tầng đang bật.',
    },
  },
  areas: {
    title: 'Lĩnh vực làm việc',
    intro: 'Ngoài bốn dự án trên, mình làm việc với các bài toán sau.',
    items: [
      { title: 'Nhận dạng khuôn mặt', body: 'Chọn và benchmark detector, landmark và embedding cho điều kiện triển khai thực tế.' },
      { title: 'Chống giả mạo khuôn mặt', body: 'Phân biệt khuôn mặt thật với ảnh in hoặc màn hình phát lại trước khi nhận dạng.' },
      { title: 'Nhận dạng biển số (ALPR)', body: 'Benchmark trên biển số Việt Nam và pipeline nhiều camera.' },
      { title: 'Phát hiện bất thường công nghiệp', body: 'Học từ ảnh đạt chuẩn và chạy trong khuôn khổ thời gian của dây chuyền.' },
    ],
    reposTitle: 'Một vài repo công khai',
    repos: [
      { name: 'Motion-Search-Demo', body: 'Tìm sự kiện chuyển động trong video theo ROI bằng OpenCV, có chỉ mục và test tự động.' },
      { name: 'Fraud-Prevention-in-Cashier', body: 'Phát hiện gian lận tại quầy thu ngân (POS) theo thời gian thực, kết hợp deep learning với máy trạng thái hữu hạn (FSM).' },
      { name: 'Semantic_Search_Test', body: 'Tìm kiếm ảnh theo ngữ nghĩa, đánh giá Recall@20 cho truy vấn tiếng Việt và tiếng Anh.' },
      { name: 'LPR_only_trad_ML', body: 'Nhận dạng biển số bằng xử lý ảnh và đặc trưng HOG, không dùng deep learning.' },
    ],
  },
  experience: {
    title: 'Kinh nghiệm',
    items: [
      {
        company: 'HPT Vietnam Corporation',
        roles: [
          { title: 'Thực tập sinh', period: '07/2025 – 11/2025' },
          { title: 'AI – Computer Vision Solution Engineer', period: '12/2025 – nay' },
        ],
        points: [
          'Đóng góp vào nền tảng thị giác AI cho an ninh và vận hành của công ty: nhận diện khuôn mặt, chống giả mạo khuôn mặt, nhận dạng biển số (ALPR) và nhận diện đồ bảo hộ lao động (PPE). Đồng tác giả trong chứng nhận sở hữu trí tuệ của nền tảng này.',
          'Thiết kế và triển khai các hệ thống giám sát AI dạng POC trên nhiều luồng camera RTSP (H.264), chạy trên thiết bị biên có GPU NVIDIA.',
          'Tối ưu pipeline suy luận realtime bằng ONNX Runtime và CUDA để giảm độ trễ và giữ ổn định khi xử lý nhiều luồng trên phần cứng giới hạn.',
          'Đóng gói model và dịch vụ backend bằng Docker để triển khai on-premise lặp lại được cho khách hàng doanh nghiệp, trong đó có các thương hiệu lớn ngành thực phẩm và đồ uống.',
          'Làm việc trực tiếp với các bên liên quan để chuyển yêu cầu nghiệp vụ thành kiến trúc hệ thống AI, cân bằng độ chính xác và độ trễ cho từng bài toán thực tế.',
        ],
      },
    ],
  },
  research: {
    title: 'Mối quan tâm nghiên cứu',
    intro: 'Những câu hỏi mình gặp khi triển khai và muốn đào sâu hơn:',
    questions: [
      'Phát hiện bất thường còn đáng tin đến đâu khi chỉ có vài ảnh đạt chuẩn, và làm sao đánh giá trung thực trong ngân sách dữ liệu nhỏ như vậy?',
      'Làm sao chọn và giữ điểm vận hành cân bằng giữa recall và tỉ lệ báo nhầm khi dữ liệu trên dây chuyền trôi dần theo thời gian?',
      'Mô hình chống giả mạo khuôn mặt cần gì để tổng quát qua nhiều loại camera và thiết bị tấn công chưa thấy khi huấn luyện?',
      'Đo lường từ một camera duy nhất có thể chính xác đến đâu, và sai số nên được ước lượng, báo cáo ra sao?',
    ],
  },
  education: {
    title: 'Học vấn',
    degree: 'Cử nhân Khoa học Máy tính, chuyên ngành Thị giác máy tính · 10/2021 – 10/2025',
    school: 'Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM',
    cv: 'Tải CV (PDF)',
    cvOther: 'Bản tiếng Anh',
    cvMissing: 'CV gửi theo yêu cầu.',
    languages: 'Ngôn ngữ: tiếng Việt (bản ngữ), tiếng Anh (làm việc chuyên nghiệp).',
    achievementsTitle: 'Thành tích và chứng chỉ',
    achievements: [
      { text: 'Đồng tác giả, chứng nhận sở hữu trí tuệ cho một nền tảng thị giác AI phục vụ an ninh và vận hành.' },
      { text: 'Getting Started with Deep Learning, NVIDIA Deep Learning Institute, tháng 10/2025 (xác minh chứng chỉ)', href: 'https://learn.nvidia.com/certificates?id=fkgrVSFiRuueDqI5eZMuDA' },
    ],
  },
  notes: {
    title: 'Ghi chú kỹ thuật',
    read: 'Bài viết đầy đủ về thí nghiệm few-shot',
    back: 'Về dự án',
  },
  contact: {
    title: 'Liên hệ',
    body: 'Nếu bạn đang tìm người làm thị giác máy tính từ thí nghiệm đến triển khai, hoặc muốn trao đổi về các hướng nghiên cứu ở trên, hãy liên hệ với mình.',
  },
  footer: {
    privacy:
      'Hai trong bốn dự án là mã nguồn riêng tư; chi tiết đã được rút gọn và không có tên khách hàng, video tại hiện trường khách hàng hay cấu hình nội bộ nào trên trang. Video demo là clip công khai trên YouTube.',
    synthetic: 'Mọi lab tương tác dùng dữ liệu tổng hợp do trình duyệt tự sinh.',
    source: 'Site tĩnh, không theo dõi người xem.',
  },
};
