import { Bricolage_Grotesque, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';

// next/font downloads these at build time and serves them from our own domain.
export const bricolage = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-bricolage',
  display: 'swap',
});
export const plex = IBM_Plex_Sans({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['400', '500', '600'],
  variable: '--font-plex',
  display: 'swap',
});
export const plexMono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});
