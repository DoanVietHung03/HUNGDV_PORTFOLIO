'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import type { HeroText } from '@/content/types';
import { fmt, num, type Lang } from '@/lib/i18n';
import { halfExtents, inferno, makeSurface, surfaceSize, type Surface } from './surface';

const SCAN_MS = 6500;
const LINES = 1792;

function cssVars() {
  const s = getComputedStyle(document.documentElement);
  const v = (k: string) => s.getPropertyValue(k).trim();
  return {
    defect: v('--defect'),
    amber: v('--amber'),
    accent: v('--accent'),
    mono: v('--font-plex-mono') || 'monospace',
  };
}

export function ScopeCanvas({ t, lang }: { t: HeroText; lang: Lang }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  const [seed, setSeed] = useState<number | null>(null);
  const [narrow, setNarrow] = useState(false);
  const [thr, setThr] = useState(0.5);
  const [liveText, setLiveText] = useState('');

  const surfaceRef = useRef<Surface | null>(null);
  const progress = useRef(0);
  const thrRef = useRef(thr);
  thrRef.current = thr;
  const drawRef = useRef<() => void>(() => {});

  // Data is generated after mount only, so static HTML and client never disagree.
  useEffect(() => {
    const mq = matchMedia('(max-width: 559px)');
    setNarrow(mq.matches);
    setSeed((Math.random() * 2 ** 31) | 0);
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const [surface, setSurface] = useState<Surface | null>(null);
  // The steel texture takes a few hundred ms on slow phones, so it is computed in a
  // worker; the page stays responsive. Falls back to an idle callback without workers.
  const workerRef = useRef<Worker | null>(null);
  useEffect(() => {
    if (seed === null) return;
    const { w, h } = surfaceSize(narrow);
    let cancelled = false;
    const done = (px?: Uint8ClampedArray) => !cancelled && setSurface(makeSurface(seed, narrow, px));
    try {
      workerRef.current ??= new Worker(new URL('./steel.worker.ts', import.meta.url));
      const worker = workerRef.current;
      worker.onmessage = (e: MessageEvent<{ seed: number; w: number; px: Uint8ClampedArray }>) => {
        if (e.data.seed === seed && e.data.w === w) done(e.data.px);
      };
      worker.postMessage({ seed, w, h });
    } catch {
      const id = setTimeout(() => done(), 300);
      return () => {
        cancelled = true;
        clearTimeout(id);
      };
    }
    return () => {
      cancelled = true;
    };
  }, [seed, narrow]);
  useEffect(() => () => workerRef.current?.terminate(), []);

  const stats = useMemo(() => {
    if (!surface) return null;
    const c = surface.candidates;
    const flagged = c.filter((x) => x.score >= thr);
    return {
      flagged: flagged.length,
      caught: flagged.filter((x) => x.real).length,
      total: c.filter((x) => x.real).length,
      fa: flagged.filter((x) => !x.real).length,
    };
  }, [surface, thr]);

  // Announce results for screen readers, debounced so dragging is not noisy.
  useEffect(() => {
    if (!stats) return;
    const id = setTimeout(
      () => setLiveText(fmt(t.live, { thr: num(lang, thr), ...stats })),
      450,
    );
    return () => clearTimeout(id);
  }, [stats, thr, t.live, lang]);

  // ---- drawing ----
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || !surface) return;
    surfaceRef.current = surface;
    const ctx = canvas.getContext('2d')!;

    const draw = () => {
      const s = surfaceRef.current!;
      const cw = canvas.width;
      const ch = canvas.height;
      const k = cw / s.w; // texture → canvas pixels
      const dpr = cw / Math.max(1, wrap.clientWidth);
      const p = progress.current;
      const sx = p * cw;
      const done = p >= 1;
      const col = cssVars();
      const th = thrRef.current;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(s.texture, 0, 0, cw, ch);

      // heat maps, revealed only behind the scan head
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, sx, ch);
      ctx.clip();
      for (const c of s.candidates) {
        const { hx, hy } = halfExtents(c);
        const rad = Math.max(hx, hy, 12) * 1.9 * k;
        ctx.save();
        ctx.translate(c.x * k, c.y * k);
        ctx.rotate(c.angle);
        ctx.scale(1, Math.max(0.45, c.ry / c.rx));
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rad);
        g.addColorStop(0, inferno(c.score, 0.78));
        g.addColorStop(0.45, inferno(c.score * 0.65, 0.42));
        g.addColorStop(1, inferno(0, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      // the part not yet scanned stays dark
      if (!done) {
        ctx.fillStyle = 'rgba(6,10,16,0.66)';
        ctx.fillRect(sx, 0, cw - sx, ch);
      }

      // boxes and labels
      const fs = Math.round(11.5 * dpr);
      ctx.font = `500 ${fs}px ${col.mono}`;
      ctx.textBaseline = 'middle';
      for (const c of s.candidates) {
        if (c.x * k > sx) continue;
        const flagged = c.score >= th;
        const missed = done && c.real && !flagged;
        if (!flagged && !missed) continue;
        const { hx, hy } = halfExtents(c);
        const pad = 9 * k;
        const x0 = (c.x - hx) * k - pad;
        const y0 = (c.y - hy) * k - pad;
        const bw = 2 * hx * k + 2 * pad;
        const bh = 2 * hy * k + 2 * pad;
        const color = !done ? '#ffffff' : c.real ? col.defect : col.amber;
        ctx.strokeStyle = color;
        ctx.lineWidth = (missed ? 1.25 : 1.75) * dpr;
        ctx.setLineDash(missed ? [4 * dpr, 3 * dpr] : []);
        ctx.strokeRect(x0, y0, bw, bh);
        ctx.setLineDash([]);

        const score = num(lang, c.score);
        const tag = done ? (missed ? t.missedTag : c.real ? t.realTag : t.falseTag) : '';
        const text = tag ? `${score} · ${tag}` : score;
        const tw = ctx.measureText(text).width + 10 * dpr;
        const lh = fs + 7 * dpr;
        let ly = y0 - lh;
        if (ly < 34 * dpr) ly = y0 + bh;
        let lx = Math.min(x0, cw - tw - 2);
        lx = Math.max(2, lx);
        ctx.fillStyle = missed ? 'rgba(6,10,16,0.78)' : color;
        ctx.fillRect(lx, ly, tw, lh);
        ctx.fillStyle = missed ? col.defect : !done ? '#0c141c' : c.real ? '#ffffff' : '#1a1200';
        ctx.fillText(text, lx + 5 * dpr, ly + lh / 2 + 0.5);
      }

      // scan head
      if (!done) {
        const band = 46 * dpr;
        const g = ctx.createLinearGradient(sx - band, 0, sx, 0);
        g.addColorStop(0, 'rgba(124,147,255,0)');
        g.addColorStop(1, 'rgba(124,147,255,0.35)');
        ctx.fillStyle = g;
        ctx.fillRect(sx - band, 0, band, ch);
        ctx.fillStyle = '#e8eeff';
        ctx.fillRect(sx - dpr, 0, 2 * dpr, ch);
      }

      if (lineRef.current) {
        lineRef.current.textContent = String(Math.round(p * LINES)).padStart(4, '0');
      }
    };
    drawRef.current = draw;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(wrap.clientWidth * dpr);
      canvas.height = Math.round(wrap.clientHeight * dpr);
      draw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    // ---- scan animation: only while on screen ----
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    progress.current = reduced ? 1 : 0;
    let raf = 0;
    let last = 0;
    let visible = false;
    const tick = (now: number) => {
      if (last) progress.current = Math.min(1, progress.current + (now - last) / SCAN_MS);
      last = now;
      draw();
      raf = progress.current < 1 && visible ? requestAnimationFrame(tick) : 0;
      if (!raf) last = 0;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf && progress.current < 1) raf = requestAnimationFrame(tick);
    });
    io.observe(wrap);
    draw();

    const onTheme = () => draw();
    window.addEventListener('themechange', onTheme);
    document.fonts?.ready.then(() => draw());

    return () => {
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('themechange', onTheme);
    };
  }, [surface, lang, t]);

  // redraw on threshold change (the animation loop also reads thrRef)
  useEffect(() => {
    drawRef.current();
  }, [thr]);

  const pct = ((thr - 0.05) / 0.9) * 100;

  return (
    <div className="mt-8">
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden rounded-[6px] border border-line bg-[#1b2530] aspect-[4/3] min-[560px]:aspect-[3/1]"
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={t.canvasLabel}
          className="absolute inset-0 h-full w-full"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 flex justify-between px-3 py-2 mono text-[11px] tracking-wider text-white/85 bg-gradient-to-b from-black/45 to-transparent"
        >
          <span>
            {t.line} <span ref={lineRef}>0000</span> / {LINES}
          </span>
          <span>
            {t.thr} {num(lang, thr)}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="flex items-center gap-4">
          <label htmlFor="thr" className="text-sm font-medium shrink-0">
            {t.threshold}
          </label>
          <input
            id="thr"
            type="range"
            min={0.05}
            max={0.95}
            step={0.01}
            value={thr}
            onChange={(e) => setThr(Number(e.target.value))}
            aria-valuetext={num(lang, thr)}
            className="rule-range"
            style={{ ['--pct' as string]: `${pct}%` }}
          />
          <output htmlFor="thr" className="mono text-sm w-10 shrink-0">
            {num(lang, thr)}
          </output>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <Stat label={t.flagged} value={stats ? String(stats.flagged) : '–'} />
          <Stat
            label={t.caught}
            value={stats ? `${stats.caught}/${stats.total}` : '–'}
            tone={stats && stats.caught < stats.total ? 'defect' : 'ok'}
          />
          <Stat label={t.falseAlarms} value={stats ? String(stats.fa) : '–'} tone={stats && stats.fa > 0 ? 'amber' : undefined} />
          <button
            type="button"
            onClick={() => setSeed((Math.random() * 2 ** 31) | 0)}
            className="inline-flex items-center gap-1.5 rounded-[4px] border border-line px-3 py-1.5 text-sm hover:border-accent hover:text-accent"
          >
            <RotateCcw size={14} aria-hidden />
            {t.rescan}
          </button>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {liveText}
      </p>
      <p className="mt-3 text-sm text-ink-2 prose-w">{t.hint}</p>
      <p className="mt-1 text-xs text-ink-2">{t.caption}</p>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'ok' | 'defect' | 'amber' | null }) {
  const color = tone === 'defect' ? 'text-[var(--defect-ink)]' : tone === 'amber' ? 'text-[var(--amber-ink)]' : tone === 'ok' ? 'text-[var(--ok-ink)]' : '';
  return (
    <span className="whitespace-nowrap">
      <span className="text-ink-2">{label}</span> <span className={`mono font-medium ${color}`}>{value}</span>
    </span>
  );
}
