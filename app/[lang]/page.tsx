import fs from 'node:fs';
import path from 'node:path';
import { ArrowDown, ArrowUpRight, Download, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/BrandIcons';
import { getContent, isLang, type Lang } from '@/lib/i18n';
import { site } from '@/content/site';
import { projects } from '@/content/projects';
import { HeaderControls } from '@/components/HeaderControls';
import { ScrollProgress } from '@/components/ScrollProgress';
import { ProjectSection } from '@/components/ProjectSection';
import { BevLab, FlowLab, SafetyLab, TileLab } from '@/components/labs';

const wrap = 'mx-auto max-w-[1180px] px-4 sm:px-6';

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
    worksFor: { '@type': 'Organization', name: c.experience.items[0].company },
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

      <header className="sticky top-0 z-40 border-b border-line bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1180px] items-center justify-between gap-4 px-4 sm:px-6">
          <a href={`/${lang}/`} className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, tiny SVG */}
            <img src="/logo-mark.svg" alt="" width={28} height={28} className="size-7 rounded-md dark:ring-1 dark:ring-line" />
            hungdv
          </a>
          <nav aria-label="Main" className="hidden sm:flex items-center gap-6 text-sm">
            <a href="#projects" className="text-ink-2 hover:text-ink">{c.nav.projects}</a>
            <a href="#experience" className="text-ink-2 hover:text-ink">{c.nav.experience}</a>
            <a href="#areas" className="text-ink-2 hover:text-ink">{c.nav.areas}</a>
            <a href="#contact" className="text-ink-2 hover:text-ink">{c.nav.contact}</a>
          </nav>
          <HeaderControls lang={lang} labels={{ toLight: c.nav.toLight, toDark: c.nav.toDark, otherLang: c.nav.otherLang }} />
        </div>
        <ScrollProgress />
      </header>

      <main id="main">
        {/* ---- hero ---- */}
        <section id="top" data-anchor aria-labelledby="hero-title" className={`${wrap} pt-10 sm:pt-14 pb-14`}>
          <p className="text-sm text-ink-2">
            {c.name} · {c.role}
          </p>
          <h1 id="hero-title" className="mt-3 max-w-[22ch] text-[2.5rem] sm:text-6xl lg:text-[4.1rem]">
            {c.hero.title}
          </h1>
          <p className="mt-5 max-w-[62ch] text-lg text-ink-2">{c.hero.sub}</p>
          <ul aria-label={c.contact.title} className="mt-6 flex flex-wrap gap-3">
            {cvMain && (
              <li>
                <a
                  href={`/cv/${cvMain}`}
                  download
                  className="inline-flex items-center gap-2 rounded-[4px] border border-accent bg-surface px-4 py-2.5 text-sm font-medium text-accent hover:bg-accent/10"
                >
                  <Download size={16} aria-hidden />
                  {c.education.cv}
                </a>
              </li>
            )}
            <li>
              <ContactLink href={site.github} icon={<GithubIcon />} label="GitHub" />
            </li>
            {site.linkedin && (
              <li>
                <ContactLink href={site.linkedin} icon={<LinkedinIcon />} label="LinkedIn" />
              </li>
            )}
            {site.email && (
              <li>
                <ContactLink href={`mailto:${site.email}`} icon={<Mail size={16} aria-hidden />} label="Email" />
              </li>
            )}
          </ul>
        </section>

        {/* ---- project overview (dark band) ---- */}
        <section id="projects" data-anchor aria-labelledby="glance-title" className="band py-12 sm:py-16">
          <div className={wrap}>
            <h2 id="glance-title" className="text-3xl sm:text-4xl">
              {c.glanceTitle}
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {projects.map((p) => {
                const g = c.projects[p.id].glance;
                return (
                  <li key={p.id}>
                    <a href={`#${p.anchor}`} className="group flex h-full flex-col rounded-[4px] border border-line bg-surface p-5 hover:border-accent">
                      <span className="flex items-start justify-between gap-2 font-display text-lg font-semibold tracking-tight">
                        {g.name}
                        <ArrowDown size={16} aria-hidden className="mt-1 shrink-0 text-ink-2 transition-transform group-hover:translate-y-0.5 group-hover:text-accent" />
                      </span>
                      {(p.id !== 'linescan' || site.showLineScanMetrics) && <span className="mono mt-4 text-xl xl:text-lg text-accent">{g.stat}</span>}
                      <span className="mt-2 text-[15px] text-ink-2">{g.line}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <div className={wrap}>
        {/* ---- experience ---- */}
        <section id="experience" data-anchor aria-labelledby="exp-title" className="pt-16 grid gap-6 lg:grid-cols-12">
          <h2 id="exp-title" className="text-3xl lg:col-span-4">
            {c.experience.title}
          </h2>
          <div className="lg:col-span-8 space-y-8">
            {c.experience.items.map((e) => (
              <div key={e.company}>
                <p className="text-xl font-display font-semibold tracking-tight">{e.company}</p>
                <ul className="mt-1 space-y-0.5">
                  {e.roles.map((r) => (
                    <li key={r.title} className="text-ink-2">
                      {r.title}
                      {r.period && <span className="mono text-sm"> · {r.period}</span>}
                    </li>
                  ))}
                </ul>
                <ul className="mt-3 space-y-2 prose-w">
                  {e.points.map((pt) => (
                    <li key={pt} className="pl-4 relative before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2 before:bg-ink-2">
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ---- projects ---- */}
        <section id="project-details" aria-labelledby="projects-title" className="pt-20">
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
            <p className="mt-2 text-sm text-ink-2">{c.education.languages}</p>
            {c.education.achievements.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg">{c.education.achievementsTitle}</h3>
                <ul className="mt-2 space-y-1.5">
                  {c.education.achievements.map((a) => (
                    <li key={a} className="pl-4 relative before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2 before:bg-ink-2">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {cvMain ? (
                <>
                  <a
                    href={`/cv/${cvMain}`}
                    download
                    className="inline-flex items-center gap-2 rounded-[4px] border border-accent bg-surface px-4 py-2.5 text-sm font-medium text-accent hover:bg-accent/10"
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
        </div>
      </main>

      <footer className="border-t border-line">
        <div className={`${wrap} py-8 grid gap-2 text-xs text-ink-2 sm:grid-cols-[1fr_auto]`}>
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
