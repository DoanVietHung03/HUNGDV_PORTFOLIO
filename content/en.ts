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
    contact: 'Contact',
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
        'Accuracy figures come from the public RAW-FABRID dataset (roll Rollo7A, CC BY 4.0): 133 test images, 26 defective and 107 good. The deployment lessons below come from the factory installation. The README marks the latency figures as historical results.',
      ],
      metrics: [
        { label: 'Recall', value: '24/26 (92.3%)', note: 'Rollo7A, RAW-FABRID: 133 test images, 26 defective, 107 good' },
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
      glance: { name: 'IntelliDoc OCR', stat: '91% of fields · 5.2 s/page', line: 'A fully local pipeline from scanned PDF to reviewed fields for Vietnamese administrative records.' },
      lede: 'A pipeline that runs entirely on one local GPU reads scanned Vietnamese administrative documents, extracts the number, date, issuing agency, document type, summary and signer of each one, and sends uncertain values to reviewers in a web app.',
      problem:
        'Scans carry red stamps over text, handwritten numbers and many layouts, and one PDF often holds several documents. When a value is wrong, a person must fix it in a way that stays traceable.',
      approach: [
        'No LLM and no cloud call: PP-DocLayout finds the regions, PP-OCR detects the text lines, and VietOCR reads them. Paddle re-reads only the lines that need it (numbers, codes, headers, low confidence). Paddle and PyTorch live in two separate environments so their CUDA builds do not clash.',
        'Image clean-up runs only when a page needs it: perspective correction, a quality check, denoising, deskew, contrast boost, and separating red stamp ink from black text.',
        'Fields come from scored rules (position, share of capitals, keywords) that follow the layout set by Decree 30/2020. Values are checked against a list of administrative units (including the 2025 mergers), an agency and document-type lexicon, and a syllable model that fixes misread tone marks. Every value a rule changes goes to review.',
        'The web app is a standard-library Python server with plain JavaScript. Several reviewers work over the LAN with scrypt-hashed passwords, signed session cookies and a strict CSP. Each correction is saved with the reviewer\'s name and becomes a regression case.',
      ],
      results: [
        'Field accuracy on the scanned set rose from 61.4% to 92.0% across about 30 logged experiments scored on draft labels; against labels later checked by a person, the final pipeline gets 91.2%. Each experiment was kept or dropped for a stated reason. For example, re-reading regions with a VLM lifted per-field accuracy but added about 65 s per page, so it was left out.',
        'Speed went from 142 s per page at the first CPU baseline to 50 s on CPU and 4.6 s on a GTX 1650 Ti GPU, with the same results; that run averaged the scans together with 86 pages of digital PDFs. On the 74 scanned pages alone, the current pipeline takes 5.2 s per page on an RTX A4000. The largest gains came from decoding all VietOCR lines of a page in one masked batch, rendering PDFs in a separate process so they stop blocking the layout model, and skipping middle pages that show no new document.',
        'One PDF is split into its logical documents automatically, and the document type is right for 33 of 33 on the scanned set. In a web-app test, 5 jobs with 55 PDFs (188 pages) all finished without errors. File covers have their own rules: handwritten values are repaired only where the printed form allows it.',
        '228 unit tests. Re-running extraction on saved OCR output takes about a minute, so every rule change is scored against ground truth before it is kept.',
      ],
      metrics: [
        { label: 'Fields correct, scans', value: '91.2%', note: '331/363 fields, character error rate 5.5%; 33 documents, 74 scanned pages; labels checked by a person' },
        { label: 'Fields correct, digital PDFs', value: '95.5%', note: '168/176 fields, character error rate 3.0%; 16 public PDFs with stamps and signatures, 86 pages; draft labels' },
        { label: 'Central-government documents', value: '80.0%', note: '132/165 fields; 15 documents, 51 pages; labels checked; many rules still fit commune-level documents only' },
        { label: 'Speed', value: '5.2 s/page', note: '74 scanned pages, RTX A4000, plus ~11 s to load models; 4.6 s/page on a 4 GB GTX 1650 Ti in an earlier run over scans plus 86 digital PDF pages; 142 s/page at the first CPU baseline' },
      ],
      method: {
        summary: 'How it was evaluated',
        body: [
          'Each field is scored against hand-labelled ground truth for three sets: scanned commune documents, public digital PDFs and central-government documents. Results are only compared between runs scored on the same labels.',
          'Most remaining errors come from OCR, not the rules: text under stamps, misprinted tone marks, handwritten numbers and where the summary ends.',
        ],
      },
      status:
        'Internal testing, not a customer-approved release. The digital-PDF labels are still a draft, and only two file covers are labelled so far.',
      demos: [
        {
          title: 'Layout regions found on a page',
          stills: [{ src: '/demo/ocr-layout.webp', label: 'PP-DocLayout regions, each tagged with its class and confidence' }],
          caption: 'Pipeline output on the first page of a publicly posted digital PDF from the test set, not a scanned client record. Text inside the boxes is then read line by line with VietOCR before the field rules run.',
        },
      ],
    },
    measure: {
      title: 'Vision Measurement Toolkit: distance and speed from a camera',
      glance: { name: 'Vision Measurement Toolkit', stat: '49 FPS · open source', line: 'Distance and vehicle speed from a single camera, in real time.' },
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
        { label: 'Geometric', value: '49 FPS', note: 'end-to-end loop; 13.34% MAPE on 4 measured distances of 1.4–2.8 m; homography + YOLO; Intel Core i7, GTX 1650 Ti' },
        { label: 'Deep learning', value: '15.07% MAPE', note: 'same 4 distances; Depth Anything V2 runs in its own worker on every 2nd frame, its rate not measured separately; same machine' },
      ],
    },
    safety: {
      title: 'Workplace safety monitoring with a multi-stage pipeline',
      glance: { name: 'Workplace safety monitoring', stat: '6-stage pipeline', line: 'People, helmets, vests, masks, gloves, phone use and restricted zones on live video.' },
      lede: 'A six-stage pipeline detects and tracks people, then checks helmets, vests, face masks, gloves and behaviours such as phone use on a realtime video stream. A zone rule flags anyone who walks into a restricted area.',
      problem:
        'Helmets and vests show in the full frame, but masks and gloves need face and hand crops; running every model on the full frame is slow and noisy.',
      approach: [
        'Six stages: person detection and tracking → PPE (helmet, vest) → region split (head-face, hands, torso) → mask → gloves → behaviour.',
        'Each person is cropped into regions before the matching classifier sees it. Mask and glove results are cached per track_id and refreshed periodically to save compute.',
        'The PPE and behaviour branches run in parallel on the original frame and do not depend on the region split.',
        'Restricted zones are polygons drawn on the camera view; a tracked person is flagged while standing inside one.',
      ],
      results: [
        'The same code runs as a realtime web app, on RTSP streams and as a batch CLI.',
        'PyTorch models are exported to ONNX and run with ONNX Runtime; the glove model runs as TFLite on CPU.',
      ],
      status: 'Not yet evaluated quantitatively: no FPS or per-stage accuracy has been measured on fixed hardware.',
      demos: [
        { title: 'Helmets and vests on a factory floor', video: '/demo/ppe.mp4', poster: '/demo/ppe.jpg', caption: 'Pipeline output on a public YouTube clip, not a client site.' },
        { title: 'Restricted zone', video: '/demo/zone.mp4', poster: '/demo/zone.jpg', caption: 'Street CCTV from a public YouTube clip. A person turns red while inside the orange zone.' },
        {
          title: 'Same frame, three lighting conditions',
          stills: [
            { src: '/demo/zone-day.webp', label: 'Original' },
            { src: '/demo/zone-dark.webp', label: 'Darkened (night)' },
            { src: '/demo/zone-ir.webp', label: 'Greyscale (IR)' },
          ],
          caption: 'The darkened and greyscale versions were made from the same clip to test robustness. The zone alert still fires in all three, but the track ID differs (30, 43, 29), so tracking is not identical across conditions.',
        },
      ],
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
      modeLabel: 'Kind of PDF',
      modes: [
        { name: 'Single document', desc: 'One PDF is one document. The first and last pages are read; middle pages are read only if they start a new document.' },
        { name: 'File cover', desc: 'Printed labels read well, handwritten values do not, so values are repaired only where the printed form allows it.' },
        { name: 'Several documents', desc: 'A page with a document title near the top starts a new document, so the PDF is split automatically.' },
      ],
      steps: [
        'Upload PDF',
        'Split into documents',
        'Layout and OCR on a local GPU',
        'Extract and check fields',
        'Review and correct',
        'Approve',
        'Save JSON; corrections feed the regression tests',
      ],
      human: 'human decision',
      skipped: 'not needed for this PDF',
      note: 'The system proposes and a person decides. Every value a rule changed is flagged for review, and every edit is logged with the reviewer\'s name.',
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
      { text: 'Co-author, intellectual property certificate for a vision AI platform for security and operations.' },
      { text: 'Getting Started with Deep Learning, NVIDIA Deep Learning Institute, October 2025 (verify certificate)', href: 'https://learn.nvidia.com/certificates?id=fkgrVSFiRuueDqI5eZMuDA' },
    ],
  },
  notes: {
    title: 'Technical notes',
    read: 'Full write-up of the few-shot study',
    back: 'Back to the project',
  },
  contact: {
    title: 'Contact',
    body: 'If you need someone who takes computer vision from experiment to deployment, or want to talk about the research questions above, get in touch.',
  },
  footer: {
    privacy:
      'Two of the four projects are private; details are condensed, and no client names, client footage or internal configuration appear on this site. Demo videos are public YouTube clips.',
    synthetic: 'Every interactive lab runs on synthetic data generated in your browser.',
    source: 'Static site, no visitor tracking.',
  },
};
