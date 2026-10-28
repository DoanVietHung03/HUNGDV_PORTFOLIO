import fs from 'node:fs';
import path from 'node:path';
import { ArrowUpRight, Download, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/BrandIcons';
import { getContent, isLang, type Lang } from '@/lib/i18n';
import { site } from '@/content/site';
import { projects } from '@/content/projects';
import { ScopeCanvas } from '@/components/hero/ScopeCanvas';
import { HeaderControls } from '@/components/HeaderControls';
import { Ruler } from '@/components/Ruler';
import { ProjectSection } from '@/components/ProjectSection';
import { BevLab, FlowLab, SafetyLab, TileLab } from '@/components/labs';

const cvExists = (file: string) => fs.existsSync(path.join(process.cwd(), 'public', 'cv', file));

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang: Lang = isLang(raw) ? raw : 'en';
  const c = getContent(lang);

  const labs = {
    linescan: <TileLab t={c.labs.tile} lang={lang} />,
    ocr: <FlowLab t={c.labs.flow} />,
    measure: <BevLab t={c.labs.bev} lang={lang} />,
    safety: <SafetyLab t={c.labs.safety} lang={lang} />,
  };

  const cvMain = lang === 'vi' && cvExists(site.cvFiles.vi) ? site.cvFiles.vi : cvExists(site.cvFiles.en) ? site.cvFiles.en : null;
  const cvAlt = lang === 'en' && cvExists(site.cvFiles.vi) && cvMain ? site.cvFiles.vi : lang === 'vi' && cvMain === site.cvFiles.vi && cvExists(site.cvFiles.en) ? site.cvFiles.en : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: c.name,
    jobTitle: c.role,
    url: `${site.url}/${lang}/`,
    sameAs: [site.github, site.linkedin].filter(Boolean),
    alumniOf: { '@type': 'CollegeOrUniversity', name: c.education.school },
    knowsAbout: ['Computer vision', 'Anomaly detection', 'OCR', 'Face recognition', 'License plate recognition'],
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:bg-surface focus:px-3 focus:py-2 focus:rounded-[4px]"
      >
        {c.nav.skip}
      </a>
      <Ruler />

      <header className="sticky top-0 z-40 border-b border-line bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1180px] items-center justify-between gap-4 px-4 sm:px-6">
          <a href={`/${lang}/`} className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
            <span aria-hidden className="relative inline-block size-4 border-2 border-accent">
              <span className="absolute -top-[4px] left-[7px] h-[calc(100%+8px)] w-[2.5px] bg-defect" />
            </span>
            hungdv
          </a>
          <nav aria-label="Main" className="hidden sm:flex items-center gap-6 text-sm">
            <a href="#projects" className="text-ink-2 hover:text-ink">{c.nav.projects}</a>
            <a href="#areas" className="text-ink-2 hover:text-ink">{c.nav.areas}</a>
            <a href="#contact" className="text-ink-2 hover:text-ink">{c.nav.contact}</a>
          </nav>
          <HeaderControls lang={lang} labels={{ toLight: c.nav.toLight, toDark: c.nav.toDark, otherLang: c.nav.otherLang }} />
        </div>
      </header>

      <main id="main" className="mx-auto max-w-[1180px] px-4 sm:px-6">
        {/* ---- hero ---- */}
        <section id="top" data-anchor aria-labelledby="hero-title" className="pt-10 sm:pt-14 pb-10">
          <p className="text-sm text-ink-2">
            {c.name} · {c.role}
          </p>
          <h1 id="hero-title" className="mt-3 max-w-[22ch] text-[2.5rem] sm:text-6xl lg:text-[4.1rem]">
            {c.hero.title}
          </h1>
          <p className="mt-5 max-w-[62ch] text-lg text-ink-2">{c.hero.sub}</p>
          <ScopeCanvas t={c.hero} lang={lang} />
        </section>

        {/* ---- projects ---- */}
        <section id="projects" aria-labelledby="projects-title" className="pt-10">
          <h2 id="projects-title" className="text-4xl sm:text-5xl">
            {c.projectsTitle}
          </h2>
          {projects.map((p) => (
            <ProjectSection
              key={p.id}
              meta={p}
              text={c.projects[p.id]}
              labels={c.labels}
              showMetrics={p.id !== 'linescan' || site.showLineScanMetrics}
              lab={labs[p.id]}
            />
          ))}
        </section>

        {/* ---- areas + research ---- */}
        <section id="areas" data-anchor aria-labelledby="areas-title" className="mt-20 border-t-[3px] border-ink pt-8">
          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 id="areas-title" className="text-4xl">
                {c.areas.title}
              </h2>
              <p className="mt-3 text-ink-2">{c.areas.intro}</p>
              <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {c.areas.items.map((a) => (
                  <div key={a.title} className="border-t border-line pt-3">
                    <dt className="font-display text-lg font-semibold tracking-tight">{a.title}</dt>
                    <dd className="mt-1 text-[15px] text-ink-2">{a.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="lg:col-span-5">
              <h3 className="text-xl">{c.areas.reposTitle}</h3>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {c.areas.repos.map((r) => (
                  <li key={r.name}>
                    <a href={`${site.github}/${r.name}`} className="group block py-3">
                      <span className="mono text-sm text-accent inline-flex items-center gap-1">
                        {r.name}
                        <ArrowUpRight size={14} aria-hidden className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                      <span className="block text-[15px] text-ink-2 mt-0.5">{r.body}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div id="research" data-anchor className="mt-16 grid gap-x-12 gap-y-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="text-3xl">{c.research.title}</h2>
              <p className="mt-3 text-ink-2">{c.research.intro}</p>
            </div>
            <ol className="lg:col-span-8 space-y-4">
              {c.research.questions.map((q, i) => (
                <li key={q} className="flex gap-4 border-t border-line pt-4">
                  <span className="mono text-sm text-ink-2 pt-0.5">Q{i + 1}</span>
                  <span className="text-lg leading-snug">{q}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---- education ---- */}
        <section id="education" data-anchor aria-labelledby="edu-title" className="mt-20 border-t-[3px] border-ink pt-8 grid gap-6 lg:grid-cols-12">
          <h2 id="edu-title" className="text-3xl lg:col-span-4">
            {c.education.title}
          </h2>
          <div className="lg:col-span-8">
            <p className="text-xl font-display font-semibold tracking-tight">{c.education.school}</p>
            <p className="text-ink-2">{c.education.degree}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {cvMain ? (
                <>
                  <a
                    href={`/cv/${cvMain}`}
                    download
                    className="inline-flex items-center gap-2 rounded-[4px] bg-accent px-4 py-2 text-sm font-medium text-white dark:text-[#0c141c]"
                  >
                    <Download size={16} aria-hidden />
                    {c.education.cv}
                  </a>
                  {cvAlt && (
                    <a href={`/cv/${cvAlt}`} download className="text-sm text-accent underline underline-offset-4">
                      {c.education.cvOther}
                    </a>
                  )}
                </>
              ) : (
                <p className="text-sm text-ink-2">{c.education.cvMissing}</p>
              )}
            </div>
          </div>
        </section>

        {/* ---- contact ---- */}
        <section id="contact" data-anchor aria-labelledby="contact-title" className="mt-20 border-t-[3px] border-ink pt-8 pb-20 grid gap-6 lg:grid-cols-12">
          <h2 id="contact-title" className="text-3xl lg:col-span-4">
            {c.contact.title}
          </h2>
          <div className="lg:col-span-8">
            <p className="text-lg prose-w">{c.contact.body}</p>
            <ul className="mt-6 flex flex-wrap gap-3">
              <li>
                <ContactLink href={site.github} icon={<GithubIcon />} label={`${c.contact.github} · ${site.githubHandle}`} />
              </li>
              {site.email && (
                <li>
                  <ContactLink href={`mailto:${site.email}`} icon={<Mail size={16} aria-hidden />} label={site.email} />
                </li>
              )}
              {site.linkedin && (
                <li>
                  <ContactLink href={site.linkedin} icon={<LinkedinIcon />} label={c.contact.linkedin} />
                </li>
              )}
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 py-8 grid gap-2 text-xs text-ink-2 sm:grid-cols-[1fr_auto]">
          <div className="space-y-1 max-w-[80ch]">
            <p>{c.footer.privacy}</p>
            <p>{c.footer.synthetic}</p>
          </div>
          <p className="sm:text-right">
            © {new Date().getFullYear()} {c.name}
            <br />
            {c.footer.source}
          </p>
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}

function ContactLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-[4px] border border-line bg-surface px-4 py-2.5 text-sm hover:border-accent hover:text-accent"
    >
      {icon}
      {label}
    </a>
  );
}
