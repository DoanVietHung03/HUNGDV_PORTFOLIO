import { ExternalLink, Lock } from 'lucide-react';
import type { Content, ProjectText } from '@/content/types';
import type { ProjectMeta } from '@/content/projects';

export function ProjectSection({
  meta,
  text,
  labels,
  showMetrics,
  lab,
}: {
  meta: ProjectMeta;
  text: ProjectText;
  labels: Content['labels'];
  showMetrics: boolean;
  lab: React.ReactNode;
}) {
  return (
    <article id={meta.anchor} data-anchor aria-labelledby={`${meta.anchor}-title`} className="pt-14 pb-6">
      <div className="border-t-[3px] border-ink pt-6 grid gap-x-12 gap-y-3 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h3 id={`${meta.anchor}-title`} className="text-3xl sm:text-4xl">
            {text.title}
          </h3>
          <p className="mt-4 text-sm">
            {meta.repo ? (
              <a href={meta.repo} className="inline-flex items-center gap-1.5 text-accent underline-offset-4 hover:underline">
                <span className="size-2 rounded-full bg-[var(--ok)]" aria-hidden />
                {labels.public} · {labels.viewCode}
                <ExternalLink size={13} aria-hidden />
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-ink-2">
                <Lock size={13} aria-hidden />
                {labels.private}
              </span>
            )}
          </p>
        </div>
        <p className="lg:col-span-6 text-lg leading-relaxed text-ink-2 lg:pt-1">{text.lede}</p>
      </div>

      <div className="mt-10 grid gap-x-12 gap-y-10 min-[960px]:grid-cols-12">
        <div className="min-[960px]:col-span-5 space-y-8">
          <Block title={labels.results}>
            {text.results.map((r) => (
              <p key={r} className="mb-2">
                {r}
              </p>
            ))}
            {showMetrics && text.metrics && (
              <dl className="mt-4 grid grid-cols-2 gap-px bg-line border border-line rounded-[4px] overflow-hidden">
                {text.metrics.map((m) => (
                  <div key={m.label} className="bg-surface p-3">
                    <dt className="text-xs text-ink-2">{m.label}</dt>
                    <dd className="mono text-xl font-medium mt-0.5">{m.value}</dd>
                    <dd className="text-xs text-ink-2 mt-1 leading-snug">{m.note}</dd>
                  </div>
                ))}
              </dl>
            )}
            {text.status && (
              <p className="mt-3 text-sm border-l-2 border-[var(--amber)] pl-3">
                <span className="font-medium">{labels.status}: </span>
                {text.status}
              </p>
            )}
          </Block>
          <Block title={labels.problem}>
            <p>{text.problem}</p>
          </Block>
          <Block title={labels.approach}>
            <Bullets items={text.approach.slice(0, 2)} />
            {text.approach.length > 2 && (
              <details className="group mt-3">
                <summary className="cursor-pointer list-none inline-flex items-center gap-2 text-sm text-accent">
                  {labels.moreApproach}
                  <span aria-hidden className="mono group-open:rotate-45 transition-transform">+</span>
                </summary>
                <Bullets items={text.approach.slice(2)} className="mt-3" />
              </details>
            )}
          </Block>
          {text.lessons && (
            <Block title={labels.lessons}>
              <ol className="space-y-3">
                {text.lessons.map((l, i) => (
                  <li key={l} className="flex gap-3">
                    <span className="mono text-xs text-ink-2 pt-1">{i + 1}.</span>
                    <span>{l}</span>
                  </li>
                ))}
              </ol>
            </Block>
          )}
          {text.method && (
            <details className="group panel p-4">
              <summary className="cursor-pointer font-medium list-none flex items-center justify-between gap-2">
                {text.method.summary}
                <span aria-hidden className="mono text-ink-2 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="mt-3 space-y-2 text-[15px]">
                {text.method.body.map((b) => (
                  <p key={b}>{b}</p>
                ))}
              </div>
            </details>
          )}
          <div>
            <h4 className="sr-only">{labels.stack}</h4>
            <ul className="flex flex-wrap gap-1.5" aria-label={labels.stack}>
              {meta.stack.map((s) => (
                <li key={s} className="tag">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="min-[960px]:col-span-7">
          <div className="min-[960px]:sticky min-[960px]:top-20">{lab}</div>
        </div>
      </div>
    </article>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="font-display text-lg font-semibold tracking-tight mb-2">{title}</h4>
      <div className="prose-w">{children}</div>
    </section>
  );
}

function Bullets({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-2.5 ${className}`}>
      {items.map((a) => (
        <li key={a} className="pl-4 relative before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2 before:bg-ink-2">
          {a}
        </li>
      ))}
    </ul>
  );
}
