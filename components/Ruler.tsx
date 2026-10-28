'use client';

import { useEffect, useRef } from 'react';

/** Fixed rule on the left edge (≥1280px); the pink pin tracks scroll progress. */
export function Ruler() {
  const pin = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (pin.current) pin.current.style.transform = `translateY(calc(${p} * (100vh - 7rem)))`;
      if (label.current) label.current.textContent = String(Math.round(p * 100)).padStart(3, '0');
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="hidden xl:block fixed left-0 top-0 bottom-0 w-10 z-30 pointer-events-none">
      <div
        className="absolute left-3 top-20 bottom-8 w-3"
        style={{
          background:
            'repeating-linear-gradient(to bottom, var(--ink-2) 0 1px, transparent 1px 10vh) 0 0 / 12px 100% no-repeat, repeating-linear-gradient(to bottom, var(--line) 0 1px, transparent 1px 2vh) 0 0 / 6px 100% no-repeat',
          borderLeft: '1px solid var(--line)',
        }}
      />
      <div ref={pin} className="absolute left-1 top-20 flex items-center gap-1" style={{ willChange: 'transform' }}>
        <div className="h-[2px] w-6 bg-defect" />
        <span ref={label} className="mono text-[10px] text-ink-2 -ml-0.5 bg-bg px-0.5" />
      </div>
    </div>
  );
}
