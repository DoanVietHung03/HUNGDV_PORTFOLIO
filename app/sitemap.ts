import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { vi: `${site.url}/vi/`, en: `${site.url}/en/` };
  return (['vi', 'en'] as const).map((l) => ({
    url: `${site.url}/${l}/`,
    changeFrequency: 'monthly',
    priority: 1,
    alternates: { languages },
  }));
}
