'use client';

import { useState } from 'react';
import type { SafetyLabText } from '@/content/types';
import { num, type Lang } from '@/lib/i18n';

type Stage = 'person' | 'ppe' | 'mask' | 'gloves' | 'behavior';
const ORDER: Stage[] = ['person', 'ppe', 'mask', 'gloves', 'behavior'];
const NEEDS_PERSON: Stage[] = ['mask', 'gloves'];

// Made-up confidences, for illustration only (the caption says so).
const CONF = { person: 0.97, helmet: 0.93, noHelmet: 0.88, vest: 0.91, noVest: 0.86, mask: 0.95, glove: 0.89, phone: 0.84 };

// side/ly place the label in a callout column left or right of the figure
type Box = { x: number; y: number; w: number; h: number; label: string; tone: 'ok' | 'bad' | 'neutral'; crop?: boolean; side?: 'L' | 'R'; ly?: number };

export default function SafetyLab({ t, lang }: { t: SafetyLabText; lang: Lang }) {
  const [scene, setScene] = useState<0 | 1>(0);
  const [on, setOn] = useState<Record<Stage, boolean>>({ person: true, ppe: true, mask: true, gloves: true, behavior: true });
  const bad = scene === 1;
  const active = (s: Stage) => on[s] && (!NEEDS_PERSON.includes(s) || on.person);
  const L = t.labels;
  const c = (x: number) => num(lang, x);

  // geometry of the figure
  const rightHand = bad ? { x: 236, y: 96 } : { x: 272, y: 246 };
  const leftHand = { x: 128, y: 246 };

  const boxes: Box[] = [];
  if (active('person')) boxes.push({ x: 104, y: 44, w: 192, h: 386, label: `${L.person} #7 ${c(CONF.person)}`, tone: 'neutral', side: 'R', ly: 404 });
  if (active('ppe')) {
    boxes.push(
      bad
        ? { x: 168, y: 60, w: 64, h: 40, label: `${L.noHelmet} ${c(CONF.noHelmet)}`, tone: 'bad', side: 'L', ly: 70 }
        : { x: 164, y: 52, w: 72, h: 46, label: `${L.helmet} ${c(CONF.helmet)}`, tone: 'ok', side: 'L', ly: 70 },
      bad
        ? { x: 156, y: 130, w: 88, h: 122, label: `${L.noVest} ${c(CONF.noVest)}`, tone: 'bad', side: 'L', ly: 170 }
        : { x: 156, y: 130, w: 88, h: 122, label: `${L.vest} ${c(CONF.vest)}`, tone: 'ok', side: 'L', ly: 170 },
    );
  }
  if (active('mask')) {
    boxes.push({ x: 160, y: 50, w: 80, h: 84, label: L.crop, tone: 'neutral', crop: true });
    boxes.push({ x: 180, y: 100, w: 40, h: 24, label: `${L.mask} ${c(CONF.mask)}`, tone: 'ok', side: 'R', ly: 140 });
  }
  if (active('gloves')) {
    for (const h of [leftHand, rightHand]) {
      boxes.push({ x: h.x - 24, y: h.y - 24, w: 48, h: 48, label: '', tone: 'neutral', crop: true });
      boxes.push({ x: h.x - 13, y: h.y - 13, w: 26, h: 26, label: h === leftHand ? `${L.gloves} ${c(CONF.glove)}` : '', tone: 'ok', side: 'L', ly: 280 });
    }
  }
  if (active('behavior') && bad) {
    boxes.push({ x: 232, y: 66, w: 40, h: 54, label: `${L.phone} ${c(CONF.phone)}`, tone: 'bad', side: 'R', ly: 60 });
  }

  const color = (b: Box) => (b.tone === 'ok' ? 'var(--ok)' : b.tone === 'bad' ? 'var(--defect)' : 'var(--accent)');

  const status = (s: Stage): { text: string; tone?: 'ok' | 'bad' } => {
    if (!on[s]) return { text: t.off };
    if (!active(s)) return { text: t.disabled };
    switch (s) {
      case 'person':
        return { text: `track #7 · ${c(CONF.person)}` };
      case 'ppe':
        return bad
          ? { text: `${L.noHelmet} ${c(CONF.noHelmet)} · ${L.noVest} ${c(CONF.noVest)}`, tone: 'bad' }
          : { text: `${L.helmet} ${c(CONF.helmet)} · ${L.vest} ${c(CONF.vest)}`, tone: 'ok' };
      case 'mask':
        return { text: `${L.mask} ${c(CONF.mask)}`, tone: 'ok' };
      case 'gloves':
        return { text: `${L.gloves} 2/2 · ${c(CONF.glove)}`, tone: 'ok' };
      case 'behavior':
        return bad ? { text: `${L.phone} ${c(CONF.phone)}`, tone: 'bad' } : { text: '—', tone: 'ok' };
    }
  };

  return (
    <div className="panel p-4 sm:p-5">
      <h3 className="text-lg">{t.title}</h3>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-sm text-ink-2" id="scene-label">
          {t.sceneLabel}
        </span>
        <div className="seg" role="radiogroup" aria-labelledby="scene-label">
          {t.scenes.map((s, i) => (
            <button key={s} type="button" role="radio" aria-checked={scene === i} onClick={() => setScene(i as 0 | 1)}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={t.stagesLabel}>
        {ORDER.map((s) => {
          const blocked = NEEDS_PERSON.includes(s) && !on.person;
          return (
            <button
              key={s}
              type="button"
              className="chip"
              aria-pressed={on[s]}
              disabled={blocked}
              title={blocked ? t.needsPerson : undefined}
              onClick={() => setOn((o) => ({ ...o, [s]: !o[s] }))}
            >
              <span
                aria-hidden
                className="size-2 rounded-full"
                style={{ background: on[s] && !blocked ? 'var(--accent)' : 'var(--line)' }}
              />
              {t.stages[s]}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-ink-2 min-h-[1.25rem]">
        {!on.person ? `${t.stages.mask}, ${t.stages.gloves}: ${t.needsPerson}. ${t.stages.ppe}, ${t.stages.behavior}: ${t.independent}.` : ' '}
      </p>

      <div className="mt-3 grid gap-4">
        <svg viewBox="-62 30 524 410" className="w-full max-h-[440px] rounded-[4px] bg-bg border border-line" role="img" aria-label={t.figureLabel}>
          <Figure bad={bad} rightHand={rightHand} leftHand={leftHand} />
          {boxes.map((b, i) => (
            <g key={i}>
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                fill="none"
                stroke={color(b)}
                strokeWidth={b.crop ? 1.2 : 2}
                strokeDasharray={b.crop ? '4 3' : undefined}
                opacity={b.crop ? 0.75 : 1}
              />
              {b.label && !b.crop && b.side && <Callout b={b} color={color(b)} />}
            </g>
          ))}
        </svg>
        <div className="min-w-0">
          <p className="text-sm font-medium">
            {t.resultTitle} · <span className="mono">track #7</span>
          </p>
          <dl className="mt-2 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2" aria-live="polite">
            {ORDER.map((s) => {
              const st = status(s);
              return (
                <div key={s} className="border-b border-line pb-1.5">
                  <dt className="text-ink-2 text-xs">{t.stages[s]}</dt>
                  <dd
                    data-testid={`result-${s}`}
                    className={`mono text-[13px] ${st.tone === 'bad' ? 'text-[var(--defect-ink)]' : st.tone === 'ok' ? 'text-[var(--ok-ink)]' : 'text-ink-2'}`}
                  >
                    {st.text}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
      <p className="mt-3 text-xs text-ink-2">{t.caption}</p>
    </div>
  );
}

function Callout({ b, color }: { b: Box; color: string }) {
  const w = b.label.length * 6.6 + 10;
  const ly = b.ly ?? b.y;
  const left = b.side === 'L';
  const lx = left ? 98 - w : 302;
  const ax = left ? 98 : 302;
  const bx = left ? b.x : b.x + b.w;
  const by = Math.min(b.y + b.h, Math.max(b.y, ly));
  return (
    <g>
      <path d={`M${ax} ${ly} L${bx} ${by}`} stroke={color} strokeWidth={1} fill="none" />
      <rect x={lx} y={ly - 9} width={w} height={18} rx={2} fill={color} />
      <text x={lx + 5} y={ly + 4} fontSize={11} className="mono" fill={b.tone === 'neutral' ? 'var(--surface)' : '#ffffff'}>
        {b.label}
      </text>
    </g>
  );
}

function Figure({ bad, rightHand, leftHand }: { bad: boolean; rightHand: { x: number; y: number }; leftHand: { x: number; y: number } }) {
  const skin = '#d9b49a';
  const cloth = '#5b6b7b';
  return (
    <g>
      {/* legs */}
      <path d="M178 250 L170 420 M222 250 L230 420" stroke="#3d4a57" strokeWidth={22} strokeLinecap="round" />
      {/* torso */}
      <rect x={160} y={132} width={80} height={120} rx={14} fill={cloth} />
      {!bad && (
        <g>
          <path d="M160 146 Q160 132 174 132 L226 132 Q240 132 240 146 L240 252 L160 252 Z" fill="#f2a33a" />
          <rect x={160} y={190} width={80} height={8} fill="#e8eef3" />
          <rect x={160} y={220} width={80} height={8} fill="#e8eef3" />
          <rect x={196} y={132} width={8} height={120} fill="#5b6b7b" opacity={0.35} />
        </g>
      )}
      {/* arms */}
      <path d={`M166 142 L${leftHand.x} ${leftHand.y}`} stroke={bad ? cloth : '#e6913a'} strokeWidth={18} strokeLinecap="round" />
      <path
        d={bad ? `M234 142 L262 188 L${rightHand.x} ${rightHand.y}` : `M234 142 L${rightHand.x} ${rightHand.y}`}
        stroke={bad ? cloth : '#e6913a'}
        strokeWidth={18}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* gloves */}
      <circle cx={leftHand.x} cy={leftHand.y} r={10} fill="#3c8f6e" />
      <circle cx={rightHand.x} cy={rightHand.y} r={10} fill="#3c8f6e" />
      {bad && <rect x={240} y={74} width={13} height={26} rx={2.5} fill="#1d2833" stroke="#8c9caa" strokeWidth={1} transform="rotate(14 246 87)" />}
      {/* neck + head */}
      <rect x={192} y={118} width={16} height={18} fill={skin} />
      <circle cx={200} cy={96} r={26} fill={skin} />
      <rect x={182} y={102} width={36} height={18} rx={6} fill="#cfe3ef" />
      {bad ? (
        <path d="M174 92 Q176 68 200 68 Q224 68 226 92 Q214 80 200 80 Q186 80 174 92 Z" fill="#3a2f2a" />
      ) : (
        <g>
          <path d="M170 92 Q170 58 200 58 Q230 58 230 92 Z" fill="#f4c430" />
          <rect x={164} y={88} width={72} height={7} rx={3} fill="#e0ad18" />
        </g>
      )}
    </g>
  );
}
