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
        'Kết quả trên tập kiểm thử 133 ảnh (26 lỗi, 107 tốt). README ghi các số độ trễ là kết quả lịch sử.',
      ],
      metrics: [
        { label: 'Recall', value: '24/26 (92,3%)', note: '133 ảnh kiểm thử: 26 lỗi, 107 tốt' },
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
      glance: { name: 'IntelliDoc OCR', stat: '237 trang · 0 lỗi', line: 'Từ PDF đến từng trường đã rà soát, có truy vết, cho văn bản hành chính.' },
      lede: 'Hệ thống nhận PDF, trích xuất nội dung bằng OCR, để người rà soát sửa và phê duyệt từng trường, rồi lưu bằng chứng để kiểm tra lại về sau.',
      problem:
        'Tài liệu có nhiều bố cục khác nhau, và khi OCR sai thì người sửa phải để lại dấu vết truy được.',
      approach: [
        'Giao diện Next.js; FastAPI nhận job; Celery và Redis chạy hàng đợi; Nginx đứng trước; tất cả chạy trong Docker Compose.',
        'Endpoint OCR tương thích OpenAI do máy chủ cấu hình; khóa và URL không bao giờ xuống trình duyệt. Có hộp xác nhận khi endpoint nằm ngoài hệ thống.',
        'Đăng nhập bằng mật khẩu băm, phiên ký bằng khóa bí mật. Kết quả lưu thành JSON, PDF và artifact theo từng job; Redis chỉ làm hàng đợi.',
      ],
      results: [
        'Ba chế độ xử lý; phân đoạn hồ sơ gộp có bước người xác nhận ranh giới; vẽ crop thủ công làm bằng chứng; nhật ký kiểm toán.',
        'Theo dõi job, chi phí OCR và System Monitor; giao diện VI/EN. Tối đa 15 PDF mỗi job, tổng 200 MiB.',
      ],
      metrics: [
        { label: 'Trang đã xử lý', value: '237', note: '66 PDF trong 6 job, lần chạy thử nội bộ 07/2026' },
        { label: 'Trang lỗi', value: '0', note: 'cùng lần chạy, sau khi tự thử lại' },
        { label: 'Lượt gọi OCR', value: '137/137', note: 'đều thành công, ghi đủ usage' },
        { label: 'Trường có bằng chứng', value: '544/660', note: 'trường trích xuất có bbox và ảnh crop làm bằng chứng (82%)' },
      ],
      status:
        'Hoàn tất hai milestone, đang thử nghiệm nội bộ, chưa phải bản phê duyệt cho khách hàng. Chưa đo độ chính xác từng trường so với ground truth.',
    },
    measure: {
      title: 'Vision Measurement Toolkit: đo khoảng cách và tốc độ từ camera',
      glance: { name: 'Vision Measurement Toolkit', stat: '49 FPS · MAPE 13,3%', line: 'Đo khoảng cách và tốc độ xe từ một camera. Mã nguồn mở.' },
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
        { label: 'Hình học', value: '49 FPS', note: 'MAPE khoảng cách 13,34%; homography + YOLO; Intel Core i7, GTX 1650 Ti' },
        { label: 'Deep learning', value: '> 230 FPS', note: 'tốc độ hiển thị, MAPE 15,07%; Depth Anything V2 chạy ở worker riêng; cùng máy' },
      ],
    },
    safety: {
      title: 'Giám sát an toàn lao động bằng pipeline nhiều tầng',
      glance: { name: 'Giám sát an toàn lao động', stat: 'Pipeline 6 tầng', line: 'Người, mũ, áo, khẩu trang, găng tay và dùng điện thoại trên video trực tiếp.' },
      lede: 'Pipeline sáu tầng phát hiện và theo dõi người, kiểm tra mũ, áo phản quang, khẩu trang, găng tay và các hành vi như dùng điện thoại trên luồng video realtime.',
      problem:
        'Mũ và áo thấy được trên toàn khung hình, nhưng khẩu trang và găng tay cần ảnh cắt vùng mặt, vùng tay; chạy mọi model trên cả khung hình thì vừa chậm vừa nhiễu.',
      approach: [
        'Sáu tầng: phát hiện và theo dõi người → PPE (mũ, áo) → tách vùng (đầu-mặt, tay, thân) → khẩu trang → găng tay → hành vi.',
        'Mỗi người được cắt thành các vùng rồi mới đưa vào model phân loại tương ứng. Kết quả khẩu trang và găng tay lưu theo track_id và làm mới theo chu kỳ để giảm tải.',
        'Nhánh PPE và nhánh hành vi chạy song song trên khung hình gốc, không phụ thuộc bước tách vùng.',
      ],
      results: [
        'Cùng một mã nguồn chạy ở web realtime, RTSP và CLI batch.',
        'Các model PyTorch được xuất sang ONNX để chạy bằng ONNX Runtime; riêng găng tay chạy TFLite trên CPU.',
      ],
      status: 'Chưa đánh giá định lượng: chưa đo FPS hay độ chính xác từng tầng trên phần cứng cố định.',
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
      modeLabel: 'Chế độ xử lý',
      modes: [
        { name: 'Văn bản hành chính', desc: 'Mỗi PDF là một văn bản; OCR từng trang rồi rà soát các trường.' },
        { name: 'Bìa hồ sơ', desc: 'Trích các trường trên bìa hồ sơ; bố cục khác văn bản thường.' },
        { name: 'Hồ sơ gộp', desc: 'Một PDF chứa nhiều hồ sơ; người dùng xác nhận ranh giới trước khi OCR.' },
      ],
      steps: [
        'Tải PDF',
        'Phân đoạn hồ sơ',
        'OCR từng trang',
        'Rà soát và sửa',
        'Phê duyệt',
        'Lưu JSON, PDF, nhật ký',
      ],
      human: 'người quyết định',
      skipped: 'không dùng ở chế độ này',
      note: 'Ba bước có người quyết định: hệ thống đề xuất, con người chốt, và mọi thay đổi đều được ghi vào nhật ký.',
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
          { title: 'AI – Computer Vision Solution Engineer', period: '12/2025 – nay' },
          { title: 'Thực tập sinh', period: '07/2025 – 11/2025' },
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
      'Đồng tác giả, chứng nhận sở hữu trí tuệ cho một nền tảng thị giác AI phục vụ an ninh và vận hành.',
      'Chứng chỉ Getting Started with Deep Learning.',
    ],
  },
  contact: {
    title: 'Liên hệ',
    body: 'Nếu bạn đang tìm người làm thị giác máy tính từ thí nghiệm đến triển khai, hoặc muốn trao đổi về các hướng nghiên cứu ở trên, hãy liên hệ với mình.',
    github: 'https://github.com/DoanVietHung03',
    email: 'hungdoan29102003@gmail.com',
    linkedin: 'https://www.linkedin.com/in/h%C6%B0ng-%C4%91o%C3%A0n-a636502ba/',
  },
  footer: {
    privacy:
      'Ba trong bốn dự án là mã nguồn riêng tư; chi tiết đã được rút gọn và không có tên khách hàng, ảnh thật hay cấu hình nội bộ nào trên trang.',
    synthetic: 'Mọi mô hình tương tác dùng dữ liệu tổng hợp do trình duyệt tự sinh.',
    source: 'Site tĩnh, không theo dõi người xem.',
  },
};
