'use client';

import { useMemo, useState } from 'react';
import type { TileLabText } from '@/content/types';
import { fmt, num, type Lang } from '@/lib/i18n';

const W = 1024;
const H = 1792;
const T = 448;

/** Tile start positions along one axis; the last tile is snapped to the edge. */
export function tileStarts(size: number, overlap: number) {
  const stride = T * (1 - overlap);
  const n = Math.ceil((size - T) / stride - 1e-9) + 1;
  return { stride, starts: Array.from({ length: n }, (_, i) => Math.min(i * stride, size - T)) };
}

function coverage(xs: number[], ys: number[]) {
  const cuts = (starts: number[], size: number) =>
    Array.from(new Set([0, size, ...starts, ...starts.map((s) => s + T)])).sort((a, b) => a - b);
  const cx = cuts(xs, W);
  const cy = cuts(ys, H);
  const cells: { x: number; y: number; w: number; h: number; n: number }[] = [];
  for (let i = 0; i < cx.length - 1; i++) {
    const mx = (cx[i] + cx[i + 1]) / 2;
    const nx = xs.filter((s) => s <= mx && mx < s + T).length;
    for (let j = 0; j < cy.length - 1; j++) {
      const my = (cy[j] + cy[j + 1]) / 2;
      const ny = ys.filter((s) => s <= my && my < s + T).length;
      cells.push({ x: cx[i], y: cy[j], w: cx[i + 1] - cx[i], h: cy[j + 1] - cy[j], n: nx * ny });
    }
  }
  return cells;
}

export default function TileLab({ t, lang }: { t: TileLabText; lang: Lang }) {
  const [ov, setOv] = useState(0.2);
  const [shade, setShade] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  const { xs, ys, stride, cells, maxN } = useMemo(() => {
    const x = tileStarts(W, ov);
    const y = tileStarts(H, ov);
    const cells = coverage(x.starts, y.starts);
    return { xs: x.starts, ys: y.starts, stride: x.stride, cells, maxN: Math.max(...cells.map((c) => c.n)) };
  }, [ov]);

  const tiles = ys.flatMap((y) => xs.map((x) => ({ x, y })));
  const ht = hover !== null ? tiles[hover] : null;

  return (
    <div className="panel p-4 sm:p-5">
      <h3 className="text-lg">{t.title}</h3>
      <div className="mt-4 grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 sm:gap-6 items-start">
        <svg
          viewBox={`-8 -8 ${W + 16} ${H + 16}`}
          className="w-full max-h-[460px]"
          role="img"
          aria-label={fmt(t.imageLabel, { overlap: num(lang, ov), tiles: tiles.length })}
          onPointerLeave={() => setHover(null)}
        >
          <defs>
            <pattern id="brushed" width="1024" height="12" patternUnits="userSpaceOnUse">
              <rect width="1024" height="12" fill="#3a4653" />
              <rect y="3" width="1024" height="2" fill="#44515f" />
              <rect y="8" width="1024" height="1" fill="#33404c" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#brushed)" />
          {shade &&
            cells.map((c, i) => (
              <rect
                key={i}
                x={c.x}
                y={c.y}
                width={c.w}
                height={c.h}
                fill="var(--accent)"
                opacity={c.n <= 1 ? 0 : 0.12 + (0.62 * (c.n - 1)) / Math.max(1, maxN - 1)}
              />
            ))}
          {tiles.map((tl, i) => (
            <rect
              key={i}
              x={tl.x + 3}
              y={tl.y + 3}
              width={T - 6}
              height={T - 6}
              fill={hover === i ? 'var(--accent)' : 'transparent'}
              fillOpacity={hover === i ? 0.35 : 0}
              stroke={hover === i ? '#ffffff' : '#9fb0ff'}
              strokeOpacity={hover === i ? 1 : 0.75}
              strokeWidth={hover === i ? 10 : 5}
              onPointerEnter={() => setHover(i)}
              style={{ transition: 'fill-opacity .12s' }}
            />
          ))}
          <rect width={W} height={H} fill="none" stroke="var(--line)" strokeWidth="6" />
        </svg>

        <div className="min-w-0 space-y-4">
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <label htmlFor="ov" className="text-sm font-medium">
                {t.overlap}
              </label>
              <output htmlFor="ov" className="mono text-sm">
                {num(lang, ov)}
              </output>
            </div>
            <input
              id="ov"
              type="range"
              min={0}
              max={0.5}
              step={0.05}
              value={ov}
              onChange={(e) => setOv(Math.round(Number(e.target.value) * 100) / 100)}
              aria-valuetext={num(lang, ov)}
              className="rule-range"
              style={{ ['--pct' as string]: `${(ov / 0.5) * 100}%` }}
            />
          </div>
          <dl className="grid grid-cols-1 gap-2 text-sm">
            <Row k={t.tiles} v={<span data-testid="tile-count">{tiles.length}</span>} big />
            <Row k={t.grid} v={`${xs.length} × ${ys.length}`} />
            <Row k={t.stride} v={`${num(lang, stride, 1)} px`} />
          </dl>
          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={shade}
              onChange={(e) => setShade(e.target.checked)}
              className="mt-1 accent-[var(--accent)] size-4"
            />
            <span>{t.coverage}</span>
          </label>
          {shade && (
            <p className="text-xs text-ink-2">
              {t.coverageLegend}: 1–{maxN}
            </p>
          )}
          <p className="mono text-xs text-ink-2 min-h-[1.25rem]" aria-hidden>
            {ht ? fmt(t.hover, { i: (hover ?? 0) + 1, x: Math.round(ht.x), y: Math.round(ht.y) }) : ' '}
          </p>
        </div>
      </div>
      <p className="mt-4 text-xs text-ink-2">
        {t.note} {t.matchNote}
      </p>
    </div>
  );
}

function Row({ k, v, big }: { k: string; v: React.ReactNode; big?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line pb-1.5">
      <dt className="text-ink-2">{k}</dt>
      <dd className={`mono ${big ? 'text-2xl font-medium' : ''}`}>{v}</dd>
    </div>
  );
}
