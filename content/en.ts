import type { Content } from './types';

export const en: Content = {
  meta: {
    title: 'Doan Viet Hung · Computer vision engineer',
    description:
      'Portfolio of Doan Viet Hung, computer vision engineer: face recognition, license plate recognition, line-scan surface defect inspection, OCR for Vietnamese administrative documents, camera-based measurement and workplace safety monitoring.',
  },
  name: 'Doan Viet Hung',
  role: 'AI / Computer vision engineer',
  nav: {
    experience: 'Experience',
    projects: 'Projects',
    areas: 'Areas',
    skip: 'Skip to main content',
    toLight: 'Switch to light theme',
    toDark: 'Switch to dark theme',
    langName: 'English',
    otherLang: 'Đọc bằng tiếng Việt',
  },
  hero: {
    title: 'I build computer vision systems that work outside the lab.',
    sub: 'Computer vision engineer based in Vietnam. Industrial defect detection, face and license plate recognition, document OCR, and camera-based measurement.',
  },
  glanceTitle: 'Selected work',
  projectsTitle: 'Project details',
  labels: {
    problem: 'Problem',
    approach: 'Approach',
    moreApproach: 'More implementation details',
    results: 'Results',
    lessons: 'Deployment lessons',
    stack: 'Stack',
    private: 'Private source',
    public: 'Open source',
    viewCode: 'View the code on GitHub',
    status: 'Status',
    metric: 'Metric',
    value: 'Value',
    note: 'Note',
  },
  projects: {
    linescan: {
      title: 'Surface defect inspection with a line-scan camera',
      glance: { name: 'Surface defect inspection', stat: '92.3% recall', line: 'Learns from 10 good images; 2.8% false alarms at 43 ms per image.' },
      lede: 'The anomaly detector learns only from good samples and needs no defect images. Each image returns OK or NOK, an anomaly map, a mask and boxes around suspect regions.',
      problem:
        'Defects are too rare and varied to collect for training, and the line needs a decision for every image within about 50 ms.',
      approach: [
        'PatchCore on MobileNetV3-Large (FP16), with a memory bank built from only 10 good images.',
        'Each 1024 × 1792 image is tiled, scored, merged into one anomaly map and thresholded on 50 separate good images.',
        'Features come from blocks.4 and blocks.6. Tiles are 448 px with 0.20 overlap; the memory bank uses a 0.10 coreset.',
        'Tile scores are blended with a Hann window, Gaussian-smoothed, normalized against good-image statistics and restricted to the ROI.',
        'An operations dashboard built with aiohttp and React 19 (TypeScript, Vite, shadcn/ui) keeps history in SQLite and grabs frames from a Basler camera via pypylon. A Train & Setup tab lets operators create a product, upload good images, train and activate it from the browser.',
      ],
      results: [
        'Results on a 133-image test set (26 defective, 107 good). The README marks the latency figures as historical results.',
      ],
      metrics: [
        { label: 'Recall', value: '24/26 (92.3%)', note: '133 test images: 26 defective, 107 good' },
        { label: 'False alarms', value: '3/107 (2.8%)', note: 'same test set' },
        { label: 'P50 latency', value: '43 ms', note: 'RTX A4000, FP16, batch 15, 3,990 consecutive frames; P95 is 44 ms' },
        { label: 'On CPU', value: '≈ 683 ms', note: 'OpenVINO FP32, 2 × Xeon Gold 6138' },
      ],
      lessons: [
        'An encoder-triggered line-scan camera only produces frames while the table turns. No frames while the motor is stopped is correct behaviour, not a network fault.',
        'A camera cable routed through a PLC port runs at only 100 Mbps. Around 64 Mbit/s was fine; pushing the table speed toward 98 Mbit/s started dropping frames.',
      ],
      method: {
        summary: 'How it was evaluated',
        body: [
          'Few-shot experiments under a budget of 10 or 15 good images were run across 8 seeds with nested leave-one-out validation, giving 160 operating points.',
          'Conclusions are recorded even when a new configuration does not help, for example: no configuration yet improves recall and the false-alarm rate at the same time. Keeping negative results stops the next attempt from repeating a dead end.',
        ],
      },
    },
    ocr: {
      title: 'IntelliDoc OCR: digitizing Vietnamese administrative documents',
      glance: { name: 'IntelliDoc OCR', stat: '237 pages · 0 failed', line: 'From PDF to reviewed, auditable fields for Vietnamese administrative records.' },
      lede: 'The system takes PDFs, extracts content with OCR, lets a reviewer correct and approve each field, and keeps evidence so results can be audited later.',
      problem:
        'Documents come in many layouts, and when OCR is wrong a person must fix it in a way that stays traceable.',
      approach: [
        'Next.js front end; FastAPI accepts jobs; Celery and Redis run the queue; Nginx sits in front; everything runs in Docker Compose.',
        'The OCR endpoint is OpenAI-compatible and configured on the server; keys and URLs never reach the browser. External endpoints require an explicit confirmation.',
        'Login uses hashed passwords and sessions signed with a secret key. Results are stored per job as JSON, PDF and artifacts; Redis is only the queue.',
      ],
      results: [
        'Three processing modes; merged-dossier splitting with a human-confirmed boundary step; manual crops as evidence; an audit log.',
        'Job tracking, OCR cost tracking and a System Monitor; VI/EN interface. Up to 15 PDFs per job, 200 MiB in total.',
      ],
      metrics: [
        { label: 'Pages processed', value: '237', note: '66 PDFs in 6 jobs, internal test run, Jul 2026' },
        { label: 'Failed pages', value: '0', note: 'same run, after automatic retries' },
        { label: 'OCR calls', value: '137/137', note: 'all succeeded with complete usage records' },
        { label: 'Fields with evidence', value: '544/660', note: 'extracted fields with a bounding box and evidence crop (82%)' },
      ],
      status:
        'Two milestones complete; in internal testing, not a customer-approved release. Field accuracy against ground truth has not been measured yet.',
    },
    measure: {
      title: 'Vision Measurement Toolkit: distance and speed from a camera',
      glance: { name: 'Vision Measurement Toolkit', stat: '49 FPS · 13.3% MAPE', line: 'Distance and vehicle speed from a single camera. Open source.' },
      lede: 'A toolkit combining camera calibration, planar distance, 3D measurement from single-camera depth estimation, and lane-based vehicle speed.',
      problem:
        'Getting metres out of a 2D image means knowing how many metres one pixel covers, and that number changes with distance from the camera.',
      approach: [
        'Road-plane-to-image homography; chessboard camera calibration; optical flow to keep the calibration stable.',
        'YOLO for detection and Depth Anything for depth, each in its own worker so neither blocks the other. Targets are picked with a click and tracked with KCF.',
        'The speed module ships with a script that checks results against ground-truth data.',
      ],
      results: [
        'Three command-line apps: distance and height, realtime depth distance, and lane speed.',
        'Two earlier experiment repos (Distance_calculation, Velocity_detection) were refactored into one tested package.',
      ],
      metrics: [
        { label: 'Geometric', value: '49 FPS', note: '13.34% MAPE on distance; homography + YOLO; Intel Core i7, GTX 1650 Ti' },
        { label: 'Deep learning', value: '> 230 FPS', note: 'display rate, 15.07% MAPE; Depth Anything V2 in its own worker; same machine' },
      ],
    },
    safety: {
      title: 'Workplace safety monitoring with a multi-stage pipeline',
      glance: { name: 'Workplace safety monitoring', stat: '6-stage pipeline', line: 'People, helmets, vests, masks, gloves and phone use on live video.' },
      lede: 'A six-stage pipeline detects and tracks people, then checks helmets, vests, face masks, gloves and behaviours such as phone use on a realtime video stream.',
      problem:
        'Helmets and vests show in the full frame, but masks and gloves need face and hand crops; running every model on the full frame is slow and noisy.',
      approach: [
        'Six stages: person detection and tracking → PPE (helmet, vest) → region split (head-face, hands, torso) → mask → gloves → behaviour.',
        'Each person is cropped into regions before the matching classifier sees it. Mask and glove results are cached per track_id and refreshed periodically to save compute.',
        'The PPE and behaviour branches run in parallel on the original frame and do not depend on the region split.',
      ],
      results: [
        'The same code runs as a realtime web app, on RTSP streams and as a batch CLI.',
        'PyTorch models are exported to ONNX and run with ONNX Runtime; the glove model runs as TFLite on CPU.',
      ],
      status: 'Not yet evaluated quantitatively: no FPS or per-stage accuracy has been measured on fixed hardware.',
    },
  },
  labs: {
    loading: 'Loading interactive model…',
    tile: {
      title: 'Tiling and overlap',
      overlap: 'Overlap',
      tiles: 'Tiles',
      stride: 'Stride',
      grid: 'Grid (cols × rows)',
      coverage: 'Shade areas covered by several tiles',
      coverageLegend: 'Tiles covering a point',
      note: 'A 1024 × 1792 px image with 448 px tiles. The last tile in each row and column is snapped to the image edge.',
      matchNote: 'At 0.20 the grid is 3 × 5 = 15 tiles, the same batch of 15 used for the latency benchmark.',
      imageLabel: 'A 1024 × 1792 px image covered by 448 px tiles, overlap {overlap}, {tiles} tiles in total.',
      hover: 'Tile {i}: x {x}, y {y}',
    },
    flow: {
      title: 'What an OCR job goes through',
      modeLabel: 'Processing mode',
      modes: [
        { name: 'Administrative document', desc: 'Each PDF is one document; OCR every page, then review the fields.' },
        { name: 'File cover', desc: 'Extract the fields printed on a file cover, which has its own layout.' },
        { name: 'Merged dossier', desc: 'One PDF holds several dossiers; a person confirms the boundaries before OCR.' },
      ],
      steps: [
        'Upload PDF',
        'Split dossier',
        'OCR each page',
        'Review and correct',
        'Approve',
        'Save JSON, PDF, audit log',
      ],
      human: 'human decision',
      skipped: 'not used in this mode',
      note: 'Three steps are decided by a person: the system proposes, a human confirms, and every change is written to the audit log.',
    },
    bev: {
      title: 'Why measuring metres from an image needs calibration',
      view: 'View',
      camera: 'Camera',
      topDown: 'Top-down',
      speed: 'Vehicle speed',
      perPixel: '1 pixel covers',
      speedError: '1 pixel off over 0.5 s shifts speed by',
      travel: 'In 0.5 s the car moves {m} m, about {px} pixels',
      distance: 'Distance from camera',
      calibZone: 'calibration zone 3.5 × 10 m',
      slowNote: 'Animation runs 4× slower. Pixel figures assume a 1280 × 720 camera mounted 3 m high.',
      takeaway:
        'The farther the car, the more metres a single pixel covers, so the same pixel error becomes a much larger speed error. That is why the road plane has to be calibrated and measurements checked against real data.',
      canvasLabel:
        'A 3.5 × 30 m road with a marker every 5 m and a moving car, seen from the camera or from above depending on the view slider.',
    },
    safety: {
      title: 'Each model looks at its own region',
      sceneLabel: 'Scene',
      scenes: ['Fully equipped', 'Missing PPE'],
      stagesLabel: 'Stages',
      stages: { person: 'Person', ppe: 'Helmet & vest', mask: 'Mask', gloves: 'Gloves', behavior: 'Behaviour' },
      needsPerson: 'needs crops from the Person stage',
      independent: 'runs on the full frame',
      labels: {
        person: 'person',
        helmet: 'helmet',
        noHelmet: 'no helmet',
        vest: 'hi-vis vest',
        noVest: 'no vest',
        mask: 'mask',
        gloves: 'gloves',
        phone: 'phone use',
        crop: 'crop',
      },
      resultTitle: 'Result',
      off: 'off',
      disabled: 'not run (no crop)',
      caption: 'Illustrates the flow of results; confidence values in the figure are made up, not real model output.',
      figureLabel: 'A stylized worker with the detection boxes of every enabled stage.',
    },
  },
  areas: {
    title: 'Areas of work',
    intro: 'Beyond the four projects above, I work on the following problems.',
    items: [
      { title: 'Face recognition', body: 'Selecting and benchmarking detectors, landmark models and embeddings for real deployment conditions.' },
      { title: 'Face anti-spoofing', body: 'Telling a live face from a printed photo or a replayed screen before recognition.' },
      { title: 'License plate recognition (ALPR)', body: 'Benchmarks on Vietnamese plates and multi-camera pipelines.' },
      { title: 'Industrial anomaly detection', body: 'Learning from good samples and running within production-line time budgets.' },
    ],
    reposTitle: 'A few public repositories',
    repos: [
      { name: 'Motion-Search-Demo', body: 'ROI-based motion event search in video with OpenCV, with an index and automated tests.' },
      { name: 'Fraud-Prevention-in-Cashier', body: 'Realtime fraud detection at the point-of-sale counter, combining deep learning with a finite-state machine (FSM).' },
      { name: 'Semantic_Search_Test', body: 'Semantic image search, evaluated with Recall@20 for Vietnamese and English queries.' },
      { name: 'LPR_only_trad_ML', body: 'License plate recognition with classic image processing and HOG features, no deep learning.' },
    ],
  },
  experience: {
    title: 'Experience',
    items: [
      {
        company: 'HPT Vietnam Corporation',
        roles: [
          { title: 'Intern', period: 'Jul 2025 – Nov 2025' },
          { title: 'AI – Computer Vision Solution Engineer', period: 'Dec 2025 – present' },
        ],
        points: [
          "Contributed to the company's vision AI platform for security and operations: face recognition, face anti-spoofing, license plate recognition (ALPR) and PPE detection. Co-author on the platform's intellectual property certificate.",
          'Designed and deployed AI surveillance proof-of-concept systems on multi-stream RTSP (H.264) camera feeds, running on NVIDIA GPU edge devices.',
          'Optimized realtime inference pipelines with ONNX Runtime and CUDA, reducing latency and keeping multi-stream processing stable under hardware constraints.',
          'Containerized models and backend services with Docker for reproducible on-premise deployment at enterprise clients, including major food and beverage brands.',
          'Worked directly with stakeholders to turn business requirements into system-level AI architectures, balancing accuracy and latency for each real-world use case.',
        ],
      },
    ],
  },
  research: {
    title: 'Research interests',
    intro: 'Questions I ran into while deploying systems and want to study further:',
    questions: [
      'How reliable can anomaly detection be with only a handful of good images, and how do we evaluate it honestly under such a small data budget?',
      'How should an operating point between recall and false alarms be chosen and maintained as production data drifts over time?',
      'What does a face anti-spoofing model need to generalize across camera types and attack devices it never saw in training?',
      'How accurate can measurement from a single camera be, and how should its uncertainty be estimated and reported?',
    ],
  },
  education: {
    title: 'Education',
    degree: 'BS in Computer Science, major in Computer Vision · Oct 2021 – Oct 2025',
    school: 'University of Science, Vietnam National University Ho Chi Minh City',
    cv: 'Download CV (PDF)',
    cvOther: 'Vietnamese version',
    cvMissing: 'CV available on request.',
    languages: 'Languages: Vietnamese (native), English (professional working proficiency).',
    achievementsTitle: 'Achievements and certifications',
    achievements: [
      'Co-author, intellectual property certificate for a vision AI platform for security and operations.',
      'Certificate: Getting Started with Deep Learning.',
    ],
  },
  contact: {
    title: 'Contact',
  },
  footer: {
    privacy:
      'Three of the four projects are private; details are condensed, and no client names, real images or internal configuration appear on this site.',
    synthetic: 'Every interactive model runs on synthetic data generated in your browser.',
    source: 'Static site, no visitor tracking.',
  },
};
