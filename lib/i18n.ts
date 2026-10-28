import { vi } from '@/content/vi';
import { en } from '@/content/en';
import type { Content } from '@/content/types';

export const langs = ['vi', 'en'] as const;
export type Lang = (typeof langs)[number];

export const isLang = (x: string): x is Lang => (langs as readonly string[]).includes(x);
export const getContent = (lang: Lang): Content => (lang === 'vi' ? vi : en);

/** Replace {key} placeholders. */
export function fmt(s: string, vars: Record<string, string | number>) {
  return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

export function num(lang: Lang, n: number, digits = 2) {
  return new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : 'en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
}
