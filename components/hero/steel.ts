import { rng } from '@/lib/rng';

/** Smooth value noise on a seeded lattice. */
export function makeNoise(r: () => number) {
  const N = 256;
  const perm = new Uint8Array(N * 2);
  const vals = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    perm[i] = i;
    vals[i] = r();
  }
  for (let i = N - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  for (let i = 0; i < N; i++) perm[N + i] = perm[i];
  const h = (x: number, y: number) => vals[perm[(perm[x & 255] + y) & 511]];
  const s = (t: number) => t * t * (3 - 2 * t);
  return (x: number, y: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = s(x - xi);
    const yf = s(y - yi);
    const a = h(xi, yi);
    const b = h(xi + 1, yi);
    const c = h(xi, yi + 1);
    const d = h(xi + 1, yi + 1);
    return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
  };
}

/** Procedural brushed steel as RGBA bytes. Pure, so it can run in a Web Worker. */
export function steelPixels(seed: number, w: number, h: number) {
  const r = rng(seed ^ 0x5bd1e995);
  const data = new Uint8ClampedArray(w * h * 4);
  const n1 = makeNoise(r);
  const n2 = makeNoise(r);
  const row = new Float32Array(h);
  for (let y = 0; y < h; y++) row[y] = n2(0.5, y / 2.2) - 0.5;
  let smooth = 0;
  for (let y = 0; y < h; y++) {
    const vig = 1 - 0.12 * Math.pow(Math.abs(y / h - 0.5) * 2, 2);
    for (let x = 0; x < w; x++) {
      // the noise terms barely change across 2 px, so compute them on even columns only
      if ((x & 1) === 0) smooth = 0.6 + 0.1 * (n1(x / 220, y / 90) - 0.5) + 0.05 * row[y] + 0.05 * (n2(x / 380, y / 1.6) - 0.5);
      const g = (smooth + 0.035 * (r() - 0.5)) * vig;
      const i = (y * w + x) * 4;
      data[i] = g * 196;
      data[i + 1] = g * 205;
      data[i + 2] = g * 214;
      data[i + 3] = 255;
    }
  }
  return data;
}
