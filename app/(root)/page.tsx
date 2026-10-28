import type { Metadata } from 'next';

// Nginx normally redirects "/" by Accept-Language. This page is the fallback
// for any host that serves out/index.html directly.
export const metadata: Metadata = {
  title: 'Doan Viet Hung',
  robots: { index: false },
};

const redirect = `(function(){var l=(navigator.languages&&navigator.languages[0])||navigator.language||'';location.replace(/^vi/i.test(l)?'/vi/':'/en/')})();`;

export default function RootPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: redirect }} />
      <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <p>
          <a href="/en/">English</a> · <a href="/vi/">Tiếng Việt</a>
        </p>
      </main>
    </>
  );
}
