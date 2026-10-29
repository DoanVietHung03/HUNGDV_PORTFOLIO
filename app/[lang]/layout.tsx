import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import '../globals.css';
import { bricolage, plex, plexMono } from '../fonts';
import { themeScript } from '../theme-script';
import { getContent, isLang, langs } from '@/lib/i18n';
import { site } from '@/content/site';

export const dynamicParams = false;
export const generateStaticParams = () => langs.map((lang) => ({ lang }));

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ECEFF2' },
    { media: '(prefers-color-scheme: dark)', color: '#0C141C' },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const c = getContent(lang);
  return {
    metadataBase: new URL(site.url),
    title: c.meta.title,
    description: c.meta.description,
    alternates: {
      canonical: `/${lang}/`,
      languages: { vi: '/vi/', en: '/en/', 'x-default': '/en/' },
    },
    openGraph: {
      type: 'profile',
      title: c.meta.title,
      description: c.meta.description,
      url: `/${lang}/`,
      siteName: 'hungdv.io.vn',
      locale: lang === 'vi' ? 'vi_VN' : 'en_US',
      images: [{ url: '/og.png', width: 1200, height: 630, alt: c.meta.title }],
    },
    twitter: { card: 'summary_large_image', images: ['/og.png'] },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: '/apple-icon.png',
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html
      lang={lang}
      className={`${bricolage.variable} ${plex.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
