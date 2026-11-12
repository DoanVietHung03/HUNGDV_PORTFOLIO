'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import type { ScopeText } from '@/content/types';
import { fmt, num, type Lang } from '@/lib/i18n';
import { range, rng } from '@/lib/rng';

const SCAN_MS = 6500;
const ROWS = 1792; // matches the 1024 × 1792 line-scan frames in the project
// The surface is always dark steel, so the canvas uses the dark-theme palette in both themes.
const C = { accent: '#7c93ff', defect: '#ff5c85', amber: '#f0a92e' };

type Kind = 'spot' | 'scratch' | 'hole' | 'smudge' | 'dust';
export type Cand = { x: number; y: number; r: number; a: number; kind: Kind; real: boolean; score: number };

// Real defects score higher than harmless marks, but the two ranges overlap, so no threshold is perfect.
const SCORES = { wide: { real: [0.92, 0.81, 0.7, 0.58, 0.44], fake: [0.62, 0.46, 0.33, 0.2] }, narrow: { real: [0.88, 0.66, 0.44], fake: [0.58, 0.3] } };

/** Candidates in normalized coordinates (x, y in 0..1); `aspect` is height / width. */
export function makeScene(seed: number, narrow: boolean, aspect: number): Cand[] {
  const r = rng(seed);
  const s = narrow ? SCORES.narrow : SCORES.wide;
  const specs = [...s.real.map((v) => ({ real: true, v })), ...s.fake.map((v) => ({ real: false, v }))];
  const minD = narrow ? 0.3 : 0.17;
  const out: Cand[] = [];
  for (const sp of specs) {
    let x = 0.5;
    let y = 0.5;
    for (let i = 0; i < 300; i++) {
      x = range(r, 0.07, 0.93);
      y = range(r, 0.22, 0.86);
      if (out.every((c) => Math.hypot(c.x - x, (c.y - y) * aspect) > minD)) break;
    }
    const kinds: Kind[] = sp.real ? ['spot', 'scratch', 'hole'] : ['smudge', 'dust'];
    out.push({ x, y, r: range(r, 9, 15), a: r() * Math.PI, kind: kinds[Math.floor(r() * kinds.length)], real: sp.real, score: sp.v + range(r, -0.02, 0.02) });
  }
  return out;
}

export function tally(cands: Cand[], thr: number) {
  const hit = cands.filter((c) => c.score >= thr);
  return {
    flagged: hit.length,
    caught: hit.filter((c) => c.real).length,
    real: cands.filter((c) => c.real).length,
    fa: hit.filter((c) => !c.real).length,
  };
}

const INFERNO: [number, number, number, number][] = [
  [0, 27, 12, 65],
  [0.35, 120, 28, 109],
  [0.6, 237, 105, 37],
  [0.85, 251, 182, 26],
  [1, 252, 255, 164],
];
function inferno(t: number, alpha: number) {
  const i = Math.max(1, INFERNO.findIndex((s) => s[0] >= t));
  const [t0, ...a] = INFERNO[i - 1];
  const [t1, ...b] = INFERNO[Math.min(i, INFERNO.length - 1)];
  const k = t1 === t0 ? 0 : (t - t0) / (t1 - t0);
  const [R, G, B] = a.map((v, j) => Math.round(v + (b[j] - v) * k));
  return `rgba(${R},${G},${B},${alpha})`;
}

/** Brushed-steel texture with the candidates painted in, in CSS pixels. */
function paintSurface(w: number, h: number, cands: Cand[], seed: number) {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const g = cv.getContext('2d')!;
  const r = rng(seed ^ 0x9e3779b9);
  const img = g.createImageData(w, h);
  const col = Array.from({ length: w }, () => range(r, -7, 7));
  const row = Array.from({ length: h }, () => range(r, -3, 3));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const v = 66 + col[x] + row[y] + range(r, -6, 6);
      const p = (y * w + x) * 4;
      img.data[p] = v * 0.9;
      img.data[p + 1] = v * 1.02;
      img.data[p + 2] = v * 1.14;
      img.data[p + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  for (const c of cands) {
    const x = c.x * w;
    const y = c.y * h;
    g.save();
    g.translate(x, y);
    g.rotate(c.a);
    if (c.kind === 'spot') {
      const gr = g.createRadialGradient(0, 0, 0, 0, 0, c.r);
      gr.addColorStop(0, 'rgba(12,8,6,0.85)');
      gr.addColorStop(1, 'rgba(12,8,6,0)');
      g.fillStyle = gr;
      g.beginPath();
      g.ellipse(0, 0, c.r, c.r * 0.7, 0, 0, Math.PI * 2);
      g.fill();
    } else if (c.kind === 'scratch') {
      g.strokeStyle = 'rgba(205,215,225,0.8)';
      g.lineWidth = 1.4;
      g.beginPath();
      g.moveTo(-c.r * 1.6, -1);
      g.quadraticCurveTo(0, 2.5, c.r * 1.6, -0.5);
      g.stroke();
    } else if (c.kind === 'hole') {
      g.fillStyle = '#07090c';
      g.strokeStyle = 'rgba(190,200,210,0.7)';
      g.lineWidth = 1.2;
      g.beginPath();
      g.arc(0, 0, c.r * 0.35, 0, Math.PI * 2);
      g.fill();
      g.stroke();
    } else if (c.kind === 'smudge') {
      const gr = g.createRadialGradient(0, 0, 0, 0, 0, c.r * 1.4);
      gr.addColorStop(0, 'rgba(150,160,170,0.22)');
      gr.addColorStop(1, 'rgba(150,160,170,0)');
      g.fillStyle = gr;
      g.fillRect(-c.r * 1.5, -c.r * 1.5, c.r * 3, c.r * 3);
    } else {
      g.fillStyle = 'rgba(215,220,225,0.55)';
      for (let i = 0; i < 7; i++) g.fillRect(range(r, -c.r, c.r), range(r, -c.r * 0.6, c.r * 0.6), 1.5, 1.5);
    }
    g.restore();
  }
  return cv;
}

export function ScopeCanvas({ t, lang }: { t: ScopeText; lang: Lang }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(0);
  const [seed, setSeed] = useState(7);
  const [thr, setThr] = useState(0.5);
  const [done, setDone] = useState(false);
  const narrow = width > 0 && width < 560;
  const aspect = narrow ? 0.62 : 0.42;
  const height = Math.round(width * aspect);
  const cands = useMemo(() => makeScene(seed, narrow, aspect), [seed, narrow, aspect]);
  const stats = tally(cands, thr);

  const prog = useRef(0);
  const thrRef = useRef(thr);
  const doneRef = useRef(done);
  thrRef.current = thr;
  doneRef.current = done;
  const drawRef = useRef<() => void>(() => {});

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // New scene or size: repaint the surface and restart the sweep.
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv || !width) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = width * dpr;
    cv.height = height * dpr;
    const ctx = cv.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const surface = paintSurface(width, height, cands, seed);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    prog.current = reduce ? 1 : 0;
    doneRef.current = reduce;
    setDone(reduce);
    // Canvas fonts cannot read CSS variables, so resolve the self-hosted mono family once.
    const mono = getComputedStyle(cv).getPropertyValue('--font-plex-mono').trim() || 'ui-monospace, monospace';

    const draw = () => {
      const sx = prog.current * width;
      const fin = doneRef.current;
      ctx.drawImage(surface, 0, 0);
      ctx.fillStyle = 'rgba(4,8,12,0.62)';
      ctx.fillRect(sx, 0, width - sx, height);
      ctx.font = `500 11px ${mono}`;
      ctx.textBaseline = 'middle';
      for (const c of cands) {
        const x = c.x * width;
        const y = c.y * height;
        if (x > sx) continue;
        const hr = c.r * 2.4;
        const gr = ctx.createRadialGradient(x, y, 0, x, y, hr);
        gr.addColorStop(0, inferno(c.score, 0.75));
        gr.addColorStop(1, inferno(c.score, 0));
        ctx.fillStyle = gr;
        ctx.fillRect(x - hr, y - hr, hr * 2, hr * 2);
        const hit = c.score >= thrRef.current;
        // After the sweep, real defects under the threshold are outlined as misses.
        if (!hit && !(fin && c.real)) continue;
        const col = fin ? (c.real ? C.defect : C.amber) : '#ffffff';
        const b = c.r * 1.7;
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.5;
        ctx.setLineDash(hit ? [] : [4, 3]);
        ctx.strokeRect(x - b, y - b, b * 2, b * 2);
        ctx.setLineDash([]);
        const label = num(lang, c.score) + (fin ? ` · ${!hit ? t.missed : c.real ? t.real : t.fake}` : '');
        const lw = ctx.measureText(label).width + 8;
        // Keep labels clear of the HUD strip at the top.
        const ly = Math.min(y - b - 9 < 40 ? y + b + 9 : y - b - 9, height - 10);
        const lx = Math.min(Math.max(x - b, 2), width - lw - 2);
        ctx.fillStyle = 'rgba(4,8,12,0.78)';
        ctx.fillRect(lx, ly - 8, lw, 16);
        ctx.fillStyle = col;
        ctx.fillText(label, lx + 4, ly + 0.5);
      }
      if (!fin) {
        ctx.fillStyle = C.accent;
        ctx.shadowColor = C.accent;
        ctx.shadowBlur = 10;
        ctx.fillRect(sx - 1, 0, 2, height);
        ctx.shadowBlur = 0;
      }
      const hud = (s: string, right: boolean) => {
        const w = ctx.measureText(s).width + 12;
        const x = right ? width - w - 8 : 8;
        ctx.fillStyle = 'rgba(4,8,12,0.7)';
        ctx.fillRect(x, 8, w, 20);
        ctx.fillStyle = '#e6ecf1';
        ctx.fillText(s, x + 6, 18.5);
      };
      const rowNo = String(Math.round(prog.current * ROWS)).padStart(4, '0');
      hud(`${t.line} ${rowNo} / ${ROWS}`, false);
      hud(`THR ${num(lang, thrRef.current)}`, true);
    };
    drawRef.current = draw;

    let raf = 0;
    let last = 0;
    let visible = true;
    const tick = (now: number) => {
      if (last) prog.current = Math.min(1, prog.current + (now - last) / SCAN_MS);
      last = now;
      draw();
      if (prog.current >= 1) {
        doneRef.current = true;
        setDone(true);
        draw();
        return;
      }
      if (visible) raf = requestAnimationFrame(tick);
    };
    // Only sweep while the hero is on screen.
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      last = 0;
      if (visible && prog.current < 1) raf = requestAnimationFrame(tick);
    });
    io.observe(cv);
    draw();
    document.fonts?.ready.then(() => drawRef.current === draw && draw());
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [cands, width, height, seed, lang, t]);

  // Threshold or end of sweep changes only the overlay.
  useEffect(() => drawRef.current(), [thr, done]);

  return (
    <figure className="panel p-3 sm:p-4">
      <div ref={wrapRef} className="overflow-hidden rounded-[4px] bg-[#1d242c]" style={{ aspectRatio: width ? `${width} / ${height}` : '1 / 0.42' }}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={fmt(t.canvasLabel, { real: stats.real, fake: cands.length - stats.real })}
          className="block size-full"
        />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <label htmlFor="thr" className="text-sm font-medium">
              {t.threshold}
            </label>
            <output htmlFor="thr" className="mono text-sm">
              {num(lang, thr)}
            </output>
          </div>
          <input
            id="thr"
            type="range"
            min={0.05}
            max={0.95}
            step={0.05}
            value={thr}
            onChange={(e) => setThr(Math.round(Number(e.target.value) * 100) / 100)}
            aria-valuetext={num(lang, thr)}
            className="rule-range"
            style={{ ['--pct' as string]: `${((thr - 0.05) / 0.9) * 100}%` }}
          />
        </div>
        <button
          type="button"
          onClick={() => setSeed((s) => (s * 1103515245 + 12345) >>> 0)}
          className="inline-flex items-center justify-center gap-2 rounded-[4px] border border-line bg-bg px-3 py-2 text-sm hover:border-accent"
        >
          <RotateCcw size={14} aria-hidden />
          {t.rescan}
        </button>
      </div>
      <dl aria-live="polite" className="mt-3 grid grid-cols-3 gap-2 text-sm">
        <Stat k={t.flagged} v={stats.flagged} />
        <Stat k={t.caught} v={<span data-testid="scope-caught">{`${stats.caught}/${stats.real}`}</span>} tone={stats.caught === stats.real ? 'ok' : undefined} />
        <Stat k={t.falseAlarms} v={<span data-testid="scope-fa">{stats.fa}</span>} tone={stats.fa ? 'amber' : undefined} />
      </dl>
      <figcaption className="mt-3 text-xs text-ink-2">{t.note}</figcaption>
    </figure>
  );
}

function Stat({ k, v, tone }: { k: string; v: ReactNode; tone?: 'ok' | 'amber' }) {
  const color = tone === 'ok' ? 'text-[var(--ok-ink)]' : tone === 'amber' ? 'text-[var(--amber-ink)]' : '';
  return (
    <div className="rounded-[4px] border border-line bg-bg px-3 py-2">
      <dt className="text-xs text-ink-2">{k}</dt>
      <dd className={`mono mt-0.5 text-lg ${color}`}>{v}</dd>
    </div>
  );
}
