/**
 * Shared shape for both languages. A missing string in vi.ts or en.ts is a
 * compile error, so nothing untranslated can reach the page.
 * Strings may contain {placeholders}, filled with fmt() from lib/i18n.
 */

export interface Metric {
  label: string;
  value: string;
  note: string;
}

export interface ProjectText {
  title: string;
  /** Overview card: short name, one headline figure, one line. */
  glance: { name: string; stat: string; line: string };
  lede: string;
  problem: string;
  approach: string[];
  results: string[];
  metrics?: Metric[];
  lessons?: string[];
  method?: { summary: string; body: string[] };
  status?: string;
}

export interface HeroText {
  title: string;
  sub: string;
}

export interface TileLabText {
  title: string;
  overlap: string;
  tiles: string;
  stride: string;
  grid: string;
  coverage: string;
  coverageLegend: string;
  note: string;
  matchNote: string;
  imageLabel: string;
  hover: string;
}

export interface FlowLabText {
  title: string;
  modeLabel: string;
  modes: { name: string; desc: string }[];
  steps: string[];
  human: string;
  skipped: string;
  note: string;
}

export interface BevLabText {
  title: string;
  view: string;
  camera: string;
  topDown: string;
  speed: string;
  perPixel: string;
  speedError: string;
  travel: string;
  distance: string;
  calibZone: string;
  slowNote: string;
  takeaway: string;
  canvasLabel: string;
}

export interface SafetyLabText {
  title: string;
  sceneLabel: string;
  scenes: [string, string];
  stagesLabel: string;
  stages: { person: string; ppe: string; mask: string; gloves: string; behavior: string };
  needsPerson: string;
  independent: string;
  labels: {
    person: string;
    helmet: string;
    noHelmet: string;
    vest: string;
    noVest: string;
    mask: string;
    gloves: string;
    phone: string;
    crop: string;
  };
  resultTitle: string;
  off: string;
  disabled: string;
  caption: string;
  figureLabel: string;
}

export interface Content {
  meta: { title: string; description: string };
  name: string;
  role: string;
  nav: {
    experience: string;
    projects: string;
    areas: string;
    contact: string;
    skip: string;
    toLight: string;
    toDark: string;
    langName: string;
    otherLang: string;
  };
  hero: HeroText;
  glanceTitle: string;
  projectsTitle: string;
  labels: {
    problem: string;
    approach: string;
    moreApproach: string;
    results: string;
    lessons: string;
    stack: string;
    private: string;
    public: string;
    viewCode: string;
    status: string;
    metric: string;
    value: string;
    note: string;
  };
  projects: {
    linescan: ProjectText;
    ocr: ProjectText;
    measure: ProjectText;
    safety: ProjectText;
  };
  labs: {
    tile: TileLabText;
    flow: FlowLabText;
    bev: BevLabText;
    safety: SafetyLabText;
    loading: string;
  };
  areas: {
    title: string;
    intro: string;
    items: { title: string; body: string }[];
    reposTitle: string;
    repos: { name: string; body: string }[];
  };
  experience: {
    title: string;
    items: { company: string; roles: { title: string; period: string }[]; points: string[] }[];
  };
  research: { title: string; intro: string; questions: string[] };
  education: {
    title: string;
    degree: string;
    school: string;
    cv: string;
    cvOther: string;
    cvMissing: string;
    languages: string;
    achievementsTitle: string;
    achievements: string[];
  };
  contact: { title: string; body: string; github: string; email: string; linkedin: string };
  footer: { privacy: string; synthetic: string; source: string };
}
