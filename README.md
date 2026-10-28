# hungdv.io.vn

Portfolio site (Next.js static export). Plan: `docs/portfolio-plan.md`.

```bash
npm install
npm run dev            # http://localhost:3000/vi/
npm run build          # static site in out/
npm test               # Playwright tests against out/ (build first)
npm run check:secrets  # scan out/ for IPs, keys, forbidden terms
npm run og             # regenerate public/og.png
./deploy/deploy.sh user@VPS_IP   # build, check, rsync out/ to /var/www/hungdv.io.vn
```

- Text: `content/vi.ts`, `content/en.ts` (same `Content` type, so a missing string fails the build).
- Email, LinkedIn, CV files, and whether to show the Anomaly_LineScan figures: `content/site.ts`.
- CV: put `Doan-Viet-Hung-CV-en.pdf` (and optionally `-vi.pdf`) into `public/cv/`; the download button appears automatically.
- Client or company names that must never appear: one per line in `scripts/forbidden.txt` (git-ignored).
- Nginx: `deploy/nginx.conf`, then `sudo certbot --nginx -d hungdv.io.vn -d www.hungdv.io.vn`.
