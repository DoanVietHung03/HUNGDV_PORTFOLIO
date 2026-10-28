import { site } from './site';

export type ProjectId = 'linescan' | 'ocr' | 'measure' | 'safety';

export interface ProjectMeta {
  id: ProjectId;
  anchor: string;
  stack: string[];
  repo?: string;
}

export const projects: ProjectMeta[] = [
  {
    id: 'linescan',
    anchor: 'linescan',
    stack: ['PyTorch', 'PatchCore', 'MobileNetV3', 'FP16', 'OpenVINO', 'aiohttp', 'React 19', 'TypeScript', 'SQLite', 'pypylon'],
  },
  {
    id: 'ocr',
    anchor: 'intellidoc-ocr',
    stack: ['Next.js', 'FastAPI', 'Celery', 'Redis', 'Nginx', 'Docker Compose'],
  },
  {
    id: 'measure',
    anchor: 'vision-measurement',
    stack: ['OpenCV', 'Homography', 'YOLO', 'Depth Anything', 'KCF', 'Python'],
    repo: `${site.github}/Vision_Measurement_Toolkit`,
  },
  {
    id: 'safety',
    anchor: 'safety-pipeline',
    stack: ['PyTorch', 'ONNX Runtime', 'TFLite', 'Tracking', 'RTSP'],
  },
];
