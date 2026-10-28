import { range, rng } from '@/lib/rng';
import { steelPixels } from './steel';

export type Kind = 'stain' | 'scratch' | 'hole' | 'smudge' | 'dust';

export interface Candidate {
  /** centre in texture pixels */
  x: number;
  y: number;
  rx: number;
  ry: number;
  angle: number;
  kind: Kind;
  real: boolean;
  score: number;
}

export interface Surface {
  w: number;
  h: number;
  texture: HTMLCanvasElement;
  candidates: Candidate[];
}

const shuffle = <T,>(r: () => number, a: T[]) => {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

export const surfaceSize = (narrow: boolean) => ({ w: narrow ? 640 : 1440, h: 480 });

/** pixels: the brushed-steel image from steelPixels(), usually computed in a worker */
export function makeSurface(seed: number, narrow: boolean, pixels?: Uint8ClampedArray): Surface {
  const r = rng(seed);
  const { w, h } = surfaceSize(narrow);

  // Real defects score higher than benign marks, but the ranges overlap:
  // that overlap is what the threshold slider makes visible.
  const realScores = narrow ? [0.88, 0.64, 0.47] : [0.91, 0.79, 0.66, 0.55, 0.45];
  const fakeScores = narrow ? [0.57, 0.3] : [0.6, 0.43, 0.3, 0.17];
  const realKinds: Kind[] = shuffle(r, ['stain', 'scratch', 'hole', 'scratch', 'stain']);
  const fakeKinds: Kind[] = ['smudge', 'dust', 'smudge', 'dust'];

  const specs = [
    ...realScores.map((s, i) => ({ real: true, kind: realKinds[i], score: s })),
    ...fakeScores.map((s, i) => ({ real: false, kind: fakeKinds[i], score: s })),
  ].map((c) => ({ ...c, score: Math.min(0.97, Math.max(0.05, c.score + range(r, -0.035, 0.035))) }));

  // Spread candidates out so their labels never collide.
  const minDist = narrow ? 215 : 165;
  const pts: { x: number; y: number }[] = [];
  for (const _ of specs) {
    let best = { x: 0, y: 0 };
    let bestD = -1;
    for (let k = 0; k < 400; k++) {
      const p = { x: range(r, w * 0.07, w * 0.93), y: range(r, h * (narrow ? 0.3 : 0.24), h * 0.86) };
      const d = Math.min(Infinity, ...pts.map((q) => Math.hypot(q.x - p.x, q.y - p.y)));
      if (d >= minDist) {
        best = p;
        bestD = d;
        break;
      }
      if (d > bestD) {
        best = p;
        bestD = d;
      }
    }
    pts.push(best);
  }

  const candidates: Candidate[] = shuffle(r, specs).map((c, i) => {
    const p = pts[i];
    const big = c.kind === 'scratch' ? [range(r, 34, 58), range(r, 3, 5)] : c.kind === 'hole' ? [8, 8] : c.kind === 'dust' ? [16, 12] : [range(r, 16, 26), range(r, 11, 18)];
    return {
      x: p.x,
      y: p.y,
      rx: big[0],
      ry: big[1],
      angle: c.kind === 'scratch' ? range(r, -0.9, 0.9) : range(r, 0, Math.PI),
      kind: c.kind,
      real: c.real,
      score: c.score,
    };
  });

  // ---- procedural brushed steel ----
  const texture = document.createElement('canvas');
  texture.width = w;
  texture.height = h;
  const ctx = texture.getContext('2d')!;
  const data = pixels ?? steelPixels(seed, w, h);
  const img = new ImageData(new Uint8ClampedArray(data), w, h);
  ctx.putImageData(img, 0, 0);

  for (const c of candidates) paintMark(ctx, c, r);

  return { w, h, texture, candidates };
}

function paintMark(ctx: CanvasRenderingContext2D, c: Candidate, r: () => number) {
  ctx.save();
  ctx.translate(c.x, c.y);
  ctx.rotate(c.angle);
  switch (c.kind) {
    case 'stain': {
      ctx.scale(1, c.ry / c.rx);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, c.rx);
      g.addColorStop(0, 'rgba(58,40,28,0.62)');
      g.addColorStop(0.6, 'rgba(70,52,38,0.32)');
      g.addColorStop(1, 'rgba(70,52,38,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, c.rx, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'scratch': {
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(30,34,40,0.7)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-c.rx, 0);
      ctx.quadraticCurveTo(0, range(r, -4, 4), c.rx, range(r, -2, 2));
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 0.8;
      ctx.translate(0, 1.4);
      ctx.stroke();
      break;
    }
    case 'hole': {
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.beginPath();
      ctx.arc(0.8, 0.8, c.rx * 0.75, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(14,16,20,0.92)';
      ctx.beginPath();
      ctx.arc(0, 0, c.rx * 0.62, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'smudge': {
      ctx.scale(1, c.ry / c.rx);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, c.rx);
      g.addColorStop(0, 'rgba(255,255,255,0.16)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, c.rx, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'dust': {
      ctx.fillStyle = 'rgba(40,40,44,0.45)';
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.arc(range(r, -c.rx, c.rx) * 0.7, range(r, -c.ry, c.ry) * 0.7, range(r, 0.6, 1.5), 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
  }
  ctx.restore();
}

/** Axis-aligned half extents of a rotated ellipse. */
export function halfExtents(c: Candidate) {
  const cos = Math.cos(c.angle);
  const sin = Math.sin(c.angle);
  return {
    hx: Math.sqrt((c.rx * cos) ** 2 + (c.ry * sin) ** 2),
    hy: Math.sqrt((c.rx * sin) ** 2 + (c.ry * cos) ** 2),
  };
}

const INFERNO = [
  [0, 0, 4],
  [66, 10, 104],
  [147, 38, 103],
  [221, 81, 58],
  [252, 165, 10],
  [252, 255, 164],
];

export function inferno(t: number, a = 1) {
  const x = Math.min(0.999, Math.max(0, t)) * (INFERNO.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  const c = INFERNO[i].map((v, k) => Math.round(v + (INFERNO[i + 1][k] - v) * f));
  return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
}
