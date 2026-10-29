'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import type { Lang } from '@/lib/i18n';

const KEY = 'scroll-anchor';

/** Remember which section is on screen (and how far into it) before switching language. */
function saveAnchor() {
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-anchor]'));
  let best: HTMLElement | null = null;
  for (const s of sections) if (s.getBoundingClientRect().top <= 80) best = s;
  if (!best) return;
  const r = best.getBoundingClientRect();
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ id: best.id, ratio: (80 - r.top) / r.height }));
  } catch {}
}

export function restoreAnchor() {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
  } catch {}
  if (!raw) return;
  const { id, ratio } = JSON.parse(raw) as { id: string; ratio: number };
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: top + ratio * el.offsetHeight - 80, behavior: 'instant' as ScrollBehavior });
}

export function HeaderControls({
  lang,
  labels,
  path = '',
}: {
  lang: Lang;
  /** Sub-path after /{lang}/ so the language switch stays on the same page. */
  path?: string;
  labels: { toLight: string; toDark: string; otherLang: string };
}) {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
    restoreAnchor();
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {}
    setTheme(next);
    window.dispatchEvent(new Event('themechange'));
  };

  return (
    <div className="flex items-center gap-3">
      <nav aria-label="Language" className="seg mono text-xs">
        {(['vi', 'en'] as const).map((l) =>
          l === lang ? (
            <span key={l} aria-current="page" className="px-2 py-0.5 rounded-[3px] bg-surface text-ink shadow-[0_0_0_1px_var(--line)]">
              {l.toUpperCase()}
            </span>
          ) : (
            <a
              key={l}
              href={`/${l}/${path}`}
              hrefLang={l}
              lang={l}
              onClick={saveAnchor}
              title={labels.otherLang}
              className="px-2 py-0.5 text-ink-2 hover:text-ink"
            >
              {l.toUpperCase()}
            </a>
          ),
        )}
      </nav>
      <button
        type="button"
        onClick={toggle}
        aria-label={theme === 'dark' ? labels.toLight : labels.toDark}
        title={theme === 'dark' ? labels.toLight : labels.toDark}
        className="grid place-items-center size-8 rounded-[4px] border border-line text-ink-2 hover:text-ink"
      >
        {theme === 'dark' ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
      </button>
    </div>
  );
}
