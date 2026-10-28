'use client';

import { useEffect, useRef, useState } from 'react';
import type { BevLabText } from '@/content/types';
import { fmt, num, type Lang } from '@/lib/i18n';

// Virtual camera: 1280 × 720, focal 900 px, 3 m high, 4 m behind the 0 m mark, pitched 21° down.
const IMG_W = 1280;
const IMG_H = 720;
const F = 900;
const CAM = { y: -4, z: 3 };
const PITCH = (21 * Math.PI) / 180;
const ROAD_HALF = 5.25; // three 3.5 m lanes, the middle one is measured
const LANE = 1.75;
const LEN = 30;
const CAR = { w: 1.8, l: 4.5, h: 1.4 };

type V3 = [number, number, number];

/** Ground (or raised) point → camera image pixel. */
function project([x, y, z]: V3) {
  const ry = y - CAM.y;
  const rz = z - CAM.z;
  const yc = ry * Math.sin(PITCH) + rz * Math.cos(PITCH);
  const zc = ry * Math.cos(PITCH) - rz * Math.sin(PITCH);
  return [IMG_W / 2 + (F * x) / zc, IMG_H / 2 - (F * yc) / zc] as const;
}

/** metres covered by one camera pixel along the road at distance y */
function metresPerPixel(y: number) {
  const dv = Math.abs(project([0, y + 0.01, 0])[1] - project([0, y, 0])[1]) / 0.01;
  return 1 / dv;
}

export default function BevLab({ t, lang }: { t: BevLabText; lang: Lang }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [view, setView] = useState(0);
  const [speed, setSpeed] = useState(60);
  const [carY, setCarY] = useState(12);
  const viewRef = useRef(view);
  viewRef.current = view;
  const carRef = useRef(carY);
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const drawRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const draw = () => {
      const cw = canvas.width;
      const ch = canvas.height;
      const dpr = cw / Math.max(1, canvas.clientWidth);
      const s = getComputedStyle(document.documentElement);
      const accent = s.getPropertyValue('--accent').trim();
      const defect = s.getPropertyValue('--defect').trim();
      const mono = s.getPropertyValue('--font-plex-mono').trim() || 'monospace';
      const tv = viewRef.current;

      // camera image fitted (cover) into the canvas
      const ks = Math.max(cw / IMG_W, ch / IMG_H);
      const ox = (cw - IMG_W * ks) / 2;
      const oy = (ch - IMG_H * ks) / 2;
      // top-down fitted by height
      const kb = (ch * 0.86) / (LEN + 2);
      const bx = cw / 2;
      const by = ch * 0.93;

      const P = (p: V3): [number, number] => {
        const [u, v] = project(p);
        const a: [number, number] = [ox + u * ks, oy + v * ks];
        const b: [number, number] = [bx + p[0] * kb, by - p[1] * kb];
        return [a[0] + (b[0] - a[0]) * tv, a[1] + (b[1] - a[1]) * tv];
      };
      const poly = (pts: V3[], close = true) => {
        ctx.beginPath();
        pts.forEach((p, i) => {
          const [x, y] = P(p);
          if (i) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        });
        if (close) ctx.closePath();
      };
      // the blended mapping is not projective, so sample straight lines
      const line = (a: V3, b: V3, n = 24): V3[] =>
        Array.from({ length: n + 1 }, (_, i) => [
          a[0] + ((b[0] - a[0]) * i) / n,
          a[1] + ((b[1] - a[1]) * i) / n,
          a[2] + ((b[2] - a[2]) * i) / n,
        ]);

      ctx.fillStyle = '#1b2530';
      ctx.fillRect(0, 0, cw, ch);

      // asphalt (starts a little behind the 0 m mark so the camera view has no gap)
      const Y0 = -2.6;
      poly([...line([-ROAD_HALF, Y0, 0], [ROAD_HALF, Y0, 0]), ...line([ROAD_HALF, Y0, 0], [ROAD_HALF, LEN, 0]), ...line([ROAD_HALF, LEN, 0], [-ROAD_HALF, LEN, 0]), ...line([-ROAD_HALF, LEN, 0], [-ROAD_HALF, Y0, 0])]);
      ctx.fillStyle = '#2c3845';
      ctx.fill();
      ctx.fillStyle = 'rgba(124,147,255,0.10)';
      poly([...line([-LANE, Y0, 0], [LANE, Y0, 0]), ...line([LANE, Y0, 0], [LANE, LEN, 0]), ...line([LANE, LEN, 0], [-LANE, LEN, 0]), ...line([-LANE, LEN, 0], [-LANE, Y0, 0])]);
      ctx.fill();

      ctx.lineWidth = 2 * dpr;
      ctx.strokeStyle = 'rgba(230,236,241,0.85)';
      for (const x of [-ROAD_HALF, ROAD_HALF]) {
        poly(line([x, Y0, 0], [x, LEN, 0]), false);
        ctx.stroke();
      }
      ctx.setLineDash([10 * dpr, 10 * dpr]);
      ctx.strokeStyle = 'rgba(230,236,241,0.6)';
      for (const x of [-LANE, LANE]) {
        poly(line([x, Y0, 0], [x, LEN, 0]), false);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // 5 m markers
      ctx.font = `${Math.round(11 * dpr)}px ${mono}`;
      ctx.textBaseline = 'middle';
      let lastLabelY = Infinity;
      for (let y = 0; y <= LEN; y += 5) {
        ctx.strokeStyle = 'rgba(230,236,241,0.55)';
        ctx.lineWidth = 1.2 * dpr;
        poly(line([-ROAD_HALF, y, 0], [-ROAD_HALF + 0.9, y, 0], 2), false);
        ctx.stroke();
        const [lx, ly] = P([-ROAD_HALF - 0.25, y, 0]);
        if (lx > 4 * dpr && ly > 8 * dpr && ly < ch - 6 * dpr && lastLabelY - ly > 15 * dpr) {
          lastLabelY = ly;
          ctx.fillStyle = 'rgba(230,236,241,0.8)';
          ctx.textAlign = 'right';
          ctx.fillText(`${y} m`, lx, ly);
        }
      }
      ctx.textAlign = 'left';

      // calibration zone 3.5 × 10 m
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.8 * dpr;
      ctx.setLineDash([6 * dpr, 5 * dpr]);
      const zone: V3[] = [
        [-LANE, 5, 0],
        [LANE, 5, 0],
        [LANE, 15, 0],
        [-LANE, 15, 0],
      ];
      poly([...line(zone[0], zone[1]), ...line(zone[1], zone[2]), ...line(zone[2], zone[3]), ...line(zone[3], zone[0])]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = accent;
      for (const z of zone) {
        const [x, y] = P(z);
        ctx.beginPath();
        ctx.arc(x, y, 4 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      // car as a box, far faces first
      const y0 = carRef.current;
      const c = (x: number, y: number, z: number): V3 => [x, y, z];
      const hw = CAR.w / 2;
      const y1 = y0 + CAR.l;
      const faces: [V3[], string][] = [
        [[c(-hw, y1, 0), c(hw, y1, 0), c(hw, y1, CAR.h), c(-hw, y1, CAR.h)], '#9aa8b6'],
        [[c(-hw, y0, 0), c(-hw, y1, 0), c(-hw, y1, CAR.h), c(-hw, y0, CAR.h)], '#b5c1cc'],
        [[c(hw, y0, 0), c(hw, y1, 0), c(hw, y1, CAR.h), c(hw, y0, CAR.h)], '#b5c1cc'],
        [[c(-hw, y0, CAR.h), c(hw, y0, CAR.h), c(hw, y1, CAR.h), c(-hw, y1, CAR.h)], '#e6ecf1'],
        [[c(-hw, y0, 0), c(hw, y0, 0), c(hw, y0, CAR.h), c(-hw, y0, CAR.h)], '#cfd8e0'],
      ];
      // in top-down view only the roof matters
      for (const [f, col] of faces) {
        if (tv > 0.98 && col !== '#e6ecf1') continue;
        poly(f);
        ctx.fillStyle = col;
        ctx.fill();
        ctx.strokeStyle = '#0c141c';
        ctx.lineWidth = 1 * dpr;
        ctx.stroke();
      }
      // measurement point at the car's rear contact line
      const [mx, my] = P([0, y0, 0]);
      ctx.strokeStyle = defect;
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      ctx.moveTo(mx - 14 * dpr, my);
      ctx.lineTo(mx + 14 * dpr, my);
      ctx.stroke();
    };
    drawRef.current = draw;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      draw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let last = 0;
    let visible = false;
    let lastUi = 0;
    const tick = (now: number) => {
      const dt = last ? Math.min(64, now - last) : 0;
      last = now;
      // 4× slower than real time
      let y = carRef.current + ((speedRef.current / 3.6) * dt) / 1000 / 4;
      if (y > LEN - CAR.l + 1) y = 0;
      carRef.current = y;
      draw();
      if (now - lastUi > 120) {
        setCarY(y);
        lastUi = now;
      }
      raf = visible ? requestAnimationFrame(tick) : 0;
      if (!raf) last = 0;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf && !reduced) raf = requestAnimationFrame(tick);
    });
    io.observe(canvas);
    const onTheme = () => draw();
    window.addEventListener('themechange', onTheme);
    return () => {
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('themechange', onTheme);
    };
  }, []);

  useEffect(() => {
    drawRef.current();
  }, [view]);

  const mpp = metresPerPixel(carY);
  const perPixel = mpp >= 1 ? `${num(lang, mpp, 2)} m` : `${num(lang, mpp * 100, 1)} cm`;
  const errKmh = (mpp / 0.5) * 3.6;
  const travelM = (speed / 3.6) * 0.5;
  const travelPx = Math.abs(project([0, carY + travelM, 0])[1] - project([0, carY, 0])[1]);

  return (
    <div className="panel p-4 sm:p-5">
      <h3 className="text-lg">{t.title}</h3>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={t.canvasLabel}
        className="mt-4 block w-full aspect-[16/10] rounded-[4px] border border-line"
      />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="flex justify-between text-sm">
            <label htmlFor="bev-view" className="font-medium">
              {t.view}
            </label>
            <span className="text-ink-2 text-xs self-end">
              {t.camera} ↔ {t.topDown}
            </span>
          </div>
          <input
            id="bev-view"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={view}
            onChange={(e) => setView(Number(e.target.value))}
            aria-valuetext={`${Math.round(view * 100)}% ${t.topDown}`}
            className="rule-range"
            style={{ ['--pct' as string]: `${view * 100}%` }}
          />
        </div>
        <div>
          <div className="flex justify-between text-sm">
            <label htmlFor="bev-speed" className="font-medium">
              {t.speed}
            </label>
            <output htmlFor="bev-speed" className="mono">
              {speed} km/h
            </output>
          </div>
          <input
            id="bev-speed"
            type="range"
            min={20}
            max={100}
            step={5}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            aria-valuetext={`${speed} km/h`}
            className="rule-range"
            style={{ ['--pct' as string]: `${((speed - 20) / 80) * 100}%` }}
          />
        </div>
      </div>
      <dl className="mt-4 grid gap-2 text-sm">
        <div className="flex justify-between gap-3 border-b border-line pb-1.5">
          <dt className="text-ink-2">{t.distance}</dt>
          <dd className="mono">{num(lang, carY - CAM.y, 1)} m</dd>
        </div>
        <div className="flex justify-between gap-3 border-b border-line pb-1.5">
          <dt className="text-ink-2">{t.perPixel}</dt>
          <dd className="mono font-medium">{perPixel}</dd>
        </div>
        <div className="flex justify-between gap-3 border-b border-line pb-1.5">
          <dt className="text-ink-2">{t.speedError}</dt>
          <dd className="mono font-medium text-[var(--defect-ink)]">{num(lang, errKmh, 2)} km/h</dd>
        </div>
      </dl>
      <p className="mt-2 text-sm text-ink-2">
        {fmt(t.travel, { m: num(lang, travelM, 1), px: Math.round(travelPx) })}
      </p>
      <p className="mt-3 text-sm">{t.takeaway}</p>
      <p className="mt-2 text-xs text-ink-2">
        <span className="inline-block w-4 border-t-2 border-dashed border-accent align-middle mr-1" /> {t.calibZone}. {t.slowNote}
      </p>
    </div>
  );
}
