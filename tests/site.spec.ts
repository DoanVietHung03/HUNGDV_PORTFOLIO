import { expect, test, type Page } from '@playwright/test';

const collectErrors = (page: Page) => {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  return errors;
};

for (const width of [390, 768, 1440]) {
  for (const lang of ['vi', 'en']) {
    test(`loads without errors or horizontal scroll: ${lang} @ ${width}px`, async ({ page }) => {
      const errors = collectErrors(page);
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${lang}/`);
      await expect(page.locator('h1')).toBeVisible();
      await page.mouse.wheel(0, 20000);
      await page.waitForTimeout(800);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(sw).toBeLessThanOrEqual(width);
      expect(errors).toEqual([]);
    });
  }
}

test('root redirects by Accept-Language', async ({ browser }) => {
  const ctx = await browser.newContext({ locale: 'vi-VN' });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page).toHaveURL(/\/vi\/$/);
  await ctx.close();
});

test('tile lab: 0.20 overlap gives 15 tiles, 0.50 gives 28', async ({ page }) => {
  await page.goto('/en/');
  await page.locator('#linescan').scrollIntoViewIfNeeded();
  const count = page.getByTestId('tile-count');
  await expect(count).toHaveText('15');
  await page.locator('#ov').fill('0.5');
  await expect(count).toHaveText('28');
  await page.locator('#ov').fill('0');
  await expect(count).toHaveText('12');
});

test('flow lab: split step only used for merged dossiers', async ({ page }) => {
  await page.goto('/en/');
  const lab = page.locator('#intellidoc-ocr');
  await lab.scrollIntoViewIfNeeded();
  const split = lab.locator('li', { hasText: 'Split dossier' });
  await expect(split).toHaveAttribute('data-skipped', 'true');
  await lab.getByRole('radio', { name: 'Merged dossier' }).click();
  await expect(lab.locator('li', { hasText: 'Split dossier' })).not.toHaveAttribute('data-skipped', 'true');
  // arrow keys move between modes
  await lab.getByRole('radio', { name: 'Merged dossier' }).press('ArrowRight');
  await expect(lab.getByRole('radio', { name: 'Administrative document' })).toHaveAttribute('aria-checked', 'true');
});

test('bev lab: per-pixel size grows with distance readout present', async ({ page }) => {
  await page.goto('/en/');
  await page.locator('#vision-measurement').scrollIntoViewIfNeeded();
  await expect(page.locator('#bev-view')).toBeVisible();
  await page.locator('#bev-speed').fill('100');
  await expect(page.locator('output[for="bev-speed"]')).toHaveText('100 km/h');
});

test('safety lab: turning off Person disables mask and gloves only', async ({ page }) => {
  await page.goto('/en/');
  const lab = page.locator('#safety-pipeline');
  await lab.scrollIntoViewIfNeeded();
  await lab.getByRole('button', { name: 'Person' }).click();
  await expect(lab.getByRole('button', { name: 'Mask' })).toBeDisabled();
  await expect(lab.getByRole('button', { name: 'Gloves' })).toBeDisabled();
  await expect(lab.getByRole('button', { name: 'Helmet & vest' })).toBeEnabled();
  await expect(lab.getByTestId('result-mask')).toHaveText('not run (no crop)');
  await lab.getByRole('radio', { name: 'Missing PPE' }).click();
  await expect(lab.getByTestId('result-behavior')).toContainText('phone use');
});

test('theme toggle and language switch', async ({ page }) => {
  await page.goto('/en/');
  const html = page.locator('html');
  const before = await html.getAttribute('data-theme');
  await page.getByRole('button', { name: /Switch to (dark|light) theme/ }).click();
  await expect(html).not.toHaveAttribute('data-theme', before ?? '');
  await page.locator('#education').scrollIntoViewIfNeeded();
  await page.getByRole('link', { name: 'VI', exact: true }).click();
  await expect(page).toHaveURL(/\/vi\/$/);
  await expect(html).toHaveAttribute('lang', 'vi');
  // scroll position kept: education section near the top of the viewport
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
});

test('hero links and folded approach details', async ({ page }) => {
  await page.goto('/en/');
  const hero = page.locator('#top');
  await expect(hero.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', /github\.com\/DoanVietHung03/);
  await expect(hero.getByRole('link', { name: 'Email' })).toHaveAttribute('href', /^mailto:/);
  const more = page.locator('#linescan details', { hasText: 'More implementation details' });
  await expect(more.getByText(/blocks\.4/)).toBeHidden();
  await more.locator('summary').click();
  await expect(more.getByText(/blocks\.4/)).toBeVisible();
});

test('overview cards jump to each project', async ({ page }) => {
  await page.goto('/en/');
  const cards = page.locator('#projects a');
  await expect(cards).toHaveCount(4);
  await cards.filter({ hasText: 'IntelliDoc OCR' }).click();
  await expect(page).toHaveURL(/#intellidoc-ocr$/);
  await expect(page.locator('#intellidoc-ocr-title')).toBeInViewport();
});

test('linescan project links to its note, which has no errors, no side scroll and keeps its path across languages', async ({ page }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/en/');
  await expect(page.locator('#notes a[href="/en/notes/few-shot/"]')).toBeVisible();
  await page.locator('#linescan a[href*="/notes/"]').click();
  await expect(page).toHaveURL(/\/en\/notes\/few-shot\/$/);
  await expect(page.locator('h1')).toContainText('threshold');
  await expect(page.locator('table tbody tr')).toHaveCount(10);
  await expect(page.locator('figure svg rect title')).toHaveCount(20);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\/few-shot-en\.png$/);
  expect((await page.request.get('/og/few-shot-en.png')).ok()).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('navigation', { name: 'Language' }).getByRole('link', { name: 'VI' }).click();
  await expect(page).toHaveURL(/\/vi\/notes\/few-shot\/$/);
  expect(errors).toEqual([]);
});

test('safety demos: videos and stills are served', async ({ page, request }) => {
  await page.goto('/en/');
  const section = page.locator('#safety-pipeline');
  await expect(section.locator('video')).toHaveCount(2);
  await expect(section.locator('figure img')).toHaveCount(3);
  for (const src of ['/demo/ppe.mp4', '/demo/zone.mp4', '/demo/zone-ir.webp']) expect((await request.get(src)).ok()).toBe(true);
});
