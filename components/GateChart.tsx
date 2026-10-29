// Range boxes: each covers 8 seeds of one variant × budget. Rows: [label, tp10, fp10, tp15, fp15] as "a–b".
const W = 640, H = 380, L = 48, R = 16, T = 36, B = 44;
const FP_MAX = 45, TP_MAX = 26;
const x = (fp: number) => L + (fp / FP_MAX) * (W - L - R);
const y = (tp: number) => T + (1 - tp / TP_MAX) * (H - T - B);
const range = (s: string) => s.split('–').map(Number) as [number, number];

export function GateChart({ rows, labels }: { rows: string[][]; labels: { x: string; y: string; gate: string; budget: string } }) {
  const boxes = rows.flatMap(([label, tp10, fp10, tp15, fp15]) => [
    { label, n: 10, tp: range(tp10), fp: range(fp10) },
    { label, n: 15, tp: range(tp15), fp: range(fp15) },
  ]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`${labels.y} / ${labels.x}. ${labels.gate}`}>
      {[0, 3, 10, 20, 30, 40].map((v) => (
        <g key={`x${v}`}>
          <line x1={x(v)} x2={x(v)} y1={T} y2={H - B} stroke="var(--line)" strokeWidth={1} />
          <text x={x(v)} y={H - B + 18} textAnchor="middle" fontSize={12} fill="var(--ink-2)" className="mono">{v}</text>
        </g>
      ))}
      {[0, 10, 20, 25].map((v) => (
        <g key={`y${v}`}>
          <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeWidth={1} />
          <text x={L - 8} y={y(v) + 4} textAnchor="end" fontSize={12} fill="var(--ink-2)" className="mono">{v}</text>
        </g>
      ))}
      <text x={(L + W - R) / 2} y={H - 6} textAnchor="middle" fontSize={13} fill="var(--ink-2)">{labels.x}</text>
      <text transform={`translate(14 ${(T + H - B) / 2}) rotate(-90)`} textAnchor="middle" fontSize={13} fill="var(--ink-2)">{labels.y}</text>

      {/* gate: TP ≥ 25, FP ≤ 3 */}
      <rect x={x(0)} y={y(26)} width={x(3) - x(0)} height={y(25) - y(26)} fill="var(--ok)" fillOpacity={0.3} stroke="var(--ok)" strokeWidth={1.5} strokeDasharray="4 3" />
      <text x={x(0) + 4} y={y(26) - 8} fontSize={12} fill="var(--ok-ink)" fontWeight={600}>{labels.gate}</text>

      {boxes.map((b) => {
        const h = y(b.tp[0]) - y(b.tp[1]);
        const w = x(b.fp[1]) - x(b.fp[0]);
        return (
          <rect key={`${b.label}${b.n}`} x={x(b.fp[0])} y={y(b.tp[1]) - (h < 4 ? 2 : 0)} width={Math.max(w, 4)} height={Math.max(h, 4)} rx={2}
            fill="var(--accent)" fillOpacity={0.1} stroke="var(--accent)" strokeWidth={1.5}>
            <title>{`${b.label} · ${labels.budget.replace('{n}', String(b.n))}: TP ${b.tp.join('–')}/26, FP ${b.fp.join('–')}/107`}</title>
          </rect>
        );
      })}
    </svg>
  );
}
