// Fails if the static export contains things that must never be published:
// private IPs, keys, .env files, or terms listed in scripts/forbidden.txt (one per line,
// e.g. client or company names; that file is git-ignored).
import fs from 'node:fs';
import path from 'node:path';

const root = 'out';
const patterns = [
  [/\b(10|127|192\.168|172\.(1[6-9]|2\d|3[01]))\.\d{1,3}\.\d{1,3}(\.\d{1,3})?\b/, 'private IP address'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key'],
  [/\b(sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{30,})\b/, 'API key'],
  [/(password|api_key|secret_key)\s*[:=]\s*["'][^"']{6,}/i, 'credential assignment'],
];
const extra = fs.existsSync('scripts/forbidden.txt')
  ? fs.readFileSync('scripts/forbidden.txt', 'utf8').split('\n').map((s) => s.trim()).filter(Boolean)
  : [];

const problems = [];
const walk = (dir) => {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/^\.env/.test(f)) problems.push(`${p}: .env file`);
    else if (/\.(html|js|css|txt|json|xml|svg)$/.test(f)) {
      const text = fs.readFileSync(p, 'utf8');
      for (const [re, what] of patterns) {
        const m = text.match(re);
        if (m && !(what === 'private IP address' && /^\d+\.\d+\.\d+$/.test(m[0]))) problems.push(`${p}: ${what} (${m[0].slice(0, 40)})`);
      }
      for (const word of extra) if (text.toLowerCase().includes(word.toLowerCase())) problems.push(`${p}: forbidden term "${word}"`);
    }
  }
};
walk(root);
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`check:secrets ok (${extra.length} custom terms)`);
