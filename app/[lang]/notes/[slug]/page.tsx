import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getContent, isLang, langs, type Lang } from '@/lib/i18n';
import { notes } from '@/content/notes';
import { site } from '@/content/site';
import { HeaderControls } from '@/components/HeaderControls';

export const dynamicParams = false;
export const generateStaticParams = () => langs.flatMap((lang) => notes[lang].map((n) => ({ lang, slug: n.slug })));

type Params = { params: Promise<{ lang: string; slug: string }> };

const find = (lang: string, slug: string) => (isLang(lang) ? notes[lang].find((n) => n.slug === slug) : undefined);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang, slug } = await params;
  const note = find(lang, slug);
  if (!note) return {};
  const path = `notes/${slug}/`;
  return {
    title: note.title,
    description: note.lede,
    alternates: { canonical: `/${lang}/${path}`, languages: { vi: `/vi/${path}`, en: `/en/${path}` } },
    openGraph: { type: 'article', title: note.title, description: note.lede, url: `/${lang}/${path}`, siteName: 'hungdv.io.vn' },
  };
}

export default async function NotePage({ params }: Params) {
  const { lang: raw, slug } = await params;
  const note = find(raw, slug);
  if (!note) notFound();
  const lang = raw as Lang;
  const c = getContent(lang);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1180px] items-center justify-between gap-4 px-4 sm:px-6">
          <a href={`/${lang}/#linescan`} className="inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink">
            <ArrowLeft size={16} aria-hidden />
            {c.notes.back}
          </a>
          <HeaderControls lang={lang} path={`notes/${slug}/`} labels={{ toLight: c.nav.toLight, toDark: c.nav.toDark, otherLang: c.nav.otherLang }} />
        </div>
      </header>

      <main id="main" className="mx-auto max-w-[760px] px-4 sm:px-6 pt-10 sm:pt-14 pb-20">
        <article>
          <p className="mono text-sm text-ink-2">
            {c.notes.title} · {note.date}
          </p>
          <h1 className="mt-3 text-[2.2rem] sm:text-5xl">{note.title}</h1>
          <p className="mt-5 text-lg text-ink-2">{note.lede}</p>

          {note.sections.map((s) => (
            <section key={s.h} className="mt-12">
              <h2 className="text-2xl sm:text-3xl">{s.h}</h2>
              {s.table && (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[560px] text-sm">
                    <caption className="caption-bottom pt-2 text-left text-ink-2">{s.table.caption}</caption>
                    <thead>
                      <tr className="border-b border-ink text-left">
                        {s.table.head.map((h, i) => (
                          <th key={h} scope="col" className={`py-2 pr-3 font-medium ${i ? 'text-right' : ''}`}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {s.table.rows.map(([label, ...cells], r) => (
                        <tr key={label} className={`border-b border-line ${r === 0 ? 'font-semibold' : ''}`}>
                          <th scope="row" className={`py-2 pr-3 text-left ${r === 0 ? 'font-semibold' : 'font-normal'}`}>
                            {label}
                          </th>
                          {cells.map((v, i) => (
                            <td key={i} className="mono py-2 pl-3 text-right whitespace-nowrap">
                              {v}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {s.p?.map((t) => (
                <p key={t} className="mt-4 leading-relaxed">
                  {t}
                </p>
              ))}
              {s.list && (
                <ul className="mt-4 space-y-2">
                  {s.list.map((t) => (
                    <li key={t} className="pl-4 relative leading-relaxed before:absolute before:left-0 before:top-[0.75em] before:h-px before:w-2 before:bg-ink-2">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </main>

      <footer className="border-t border-line">
        <p className="mx-auto max-w-[760px] px-4 sm:px-6 py-8 text-xs text-ink-2">
          © {new Date().getFullYear()} {c.name} · <a href={`mailto:${site.email}`} className="hover:text-ink">{site.email}</a>
        </p>
      </footer>
    </>
  );
}
