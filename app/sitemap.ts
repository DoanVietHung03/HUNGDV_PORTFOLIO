import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { notes } from '@/content/notes';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { vi: `${site.url}/vi/`, en: `${site.url}/en/` };
  const pages = (['vi', 'en'] as const).map((l) => ({
    url: `${site.url}/${l}/`,
    changeFrequency: 'monthly' as const,
    priority: 1,
    alternates: { languages },
  }));
  const notePages = notes.en.flatMap((n) => {
    const alt = { vi: `${site.url}/vi/notes/${n.slug}/`, en: `${site.url}/en/notes/${n.slug}/` };
    return (['vi', 'en'] as const).map((l) => ({ url: alt[l], priority: 0.7, alternates: { languages: alt } }));
  });
  return [...pages, ...notePages];
}
