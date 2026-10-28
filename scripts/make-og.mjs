// Renders public/og.png (1200 × 630) with Playwright. Run: npm run og
import { chromium } from 'playwright';

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700&family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:wght@400&display=block" rel="stylesheet">
<style>
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#0C141C;color:#E6ECF1;font-family:'IBM Plex Sans';padding:64px 72px;position:relative;overflow:hidden}
.k{font:500 18px 'IBM Plex Mono';color:#8C9CAA;letter-spacing:.06em}
h1{font:700 72px/1.02 'Bricolage Grotesque';letter-spacing:-.03em;margin-top:22px;max-width:900px}
.s{font-size:26px;color:#8C9CAA;margin-top:22px}
.scan{position:absolute;left:72px;right:72px;bottom:64px;height:150px;border:1px solid #263442;border-radius:6px;
background:repeating-linear-gradient(0deg,#3a4653 0 3px,#44515f 3px 5px,#33404c 5px 8px)}
.dim{position:absolute;top:0;bottom:0;left:62%;right:0;background:rgba(6,10,16,.66)}
.line{position:absolute;top:0;bottom:0;left:62%;width:2px;background:#e8eeff;box-shadow:-30px 0 40px rgba(124,147,255,.45)}
.b{position:absolute;border:2px solid #FF5C85}
.b span{position:absolute;top:-22px;left:-2px;background:#FF5C85;color:#fff;font:500 13px 'IBM Plex Mono';padding:2px 6px;white-space:nowrap}
.heat{position:absolute;border-radius:50%;background:radial-gradient(#fca50a,#dd513a 40%,rgba(147,38,103,0) 70%)}
</style></head><body>
<div class="k">HUNGDV.IO.VN</div>
<h1>Doan Viet Hung</h1>
<div class="s">Computer vision systems that work outside the lab.</div>
<div class="scan">
  <div class="heat" style="left:120px;top:50px;width:70px;height:50px"></div>
  <div class="b" style="left:125px;top:55px;width:60px;height:42px"><span>0.91</span></div>
  <div class="heat" style="left:420px;top:62px;width:90px;height:44px"></div>
  <div class="b" style="left:428px;top:66px;width:74px;height:36px"><span>0.78</span></div>
  <div class="dim"></div><div class="line"></div>
</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.screenshot({ path: 'public/og.png' });
await browser.close();
console.log('wrote public/og.png');
