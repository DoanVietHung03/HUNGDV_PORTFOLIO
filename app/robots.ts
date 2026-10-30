import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    // Explicit Google-Extended rule: Gemini reports OPT_OUT when only `*` is present.
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
