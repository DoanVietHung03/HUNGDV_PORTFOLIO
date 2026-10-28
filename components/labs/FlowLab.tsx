'use client';

import { useState } from 'react';
import { UserRound } from 'lucide-react';
import type { FlowLabText } from '@/content/types';

const SPLIT = 1; // "split dossier" is used only by merged dossiers
const HUMAN = new Set([1, 3, 4]);

export default function FlowLab({ t }: { t: FlowLabText }) {
  const [mode, setMode] = useState(0);
  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (mode + d + t.modes.length) % t.modes.length;
    setMode(next);
    (e.currentTarget.children[next] as HTMLElement | undefined)?.focus();
  };

  return (
    <div className="panel p-4 sm:p-5">
      <h3 className="text-lg">{t.title}</h3>
      <div role="radiogroup" aria-label={t.modeLabel} className="seg mt-4" onKeyDown={onKey}>
        {t.modes.map((m, i) => (
          <button
            key={m.name}
            type="button"
            role="radio"
            aria-checked={mode === i}
            tabIndex={mode === i ? 0 : -1}
            onClick={() => setMode(i)}
          >
            {m.name}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-ink-2 min-h-[3em]" aria-live="polite">
        {t.modes[mode].desc}
      </p>

      <ol key={mode} className="mt-3 relative">
        {t.steps.map((s, i) => {
          const skipped = i === SPLIT && mode !== 2;
          const human = HUMAN.has(i) && !skipped;
          return (
            <li
              key={s}
              data-skipped={skipped || undefined}
              className="lightup relative flex items-center gap-3 py-2"
              style={{ animationDelay: `${i * 110}ms` }}
            >
              {i < t.steps.length - 1 && (
                <span aria-hidden className="absolute left-[15px] top-[34px] h-[calc(100%-18px)] w-px bg-line" />
              )}
              <span
                className={`mono relative z-10 grid size-8 shrink-0 place-items-center rounded-full border text-xs ${
                  skipped
                    ? 'border-dashed border-line text-ink-2 bg-bg'
                    : human
                      ? 'border-accent bg-accent text-white dark:text-[#0c141c]'
                      : 'border-accent text-accent bg-surface'
                }`}
              >
                {i + 1}
              </span>
              <span className={`min-w-0 ${skipped ? 'text-ink-2' : ''}`}>
                <span className={`font-medium ${skipped ? 'line-through decoration-dashed' : ''}`}>{s}</span>
                {skipped && <span className="block text-xs">{t.skipped}</span>}
              </span>
              {human && (
                <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-[3px] border border-accent/50 px-1.5 py-0.5 text-xs text-accent">
                  <UserRound size={12} aria-hidden />
                  {t.human}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-xs text-ink-2">{t.note}</p>
    </div>
  );
}
