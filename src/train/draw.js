import { rng, f } from "../rough.js";

// Small drawing helpers for the scenery. Everything is seeded so it is identical on every render.

// A smooth open path through points (quadratic through midpoints).
export function smooth(pts) {
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
    const my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += ` Q${f(pts[i][0])},${f(pts[i][1])} ${f(mx)},${f(my)}`;
  }
  const l = pts[pts.length - 1];
  return `${d} L${f(l[0])},${f(l[1])}`;
}

// A smooth closed blob through points.
export function closed(pts) {
  const n = pts.length;
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const s = mid(pts[n - 1], pts[0]);
  let d = `M${f(s[0])},${f(s[1])}`;
  for (let i = 0; i < n; i++) {
    const m = mid(pts[i], pts[(i + 1) % n]);
    d += ` Q${f(pts[i][0])},${f(pts[i][1])} ${f(m[0])},${f(m[1])}`;
  }
  return `${d} Z`;
}

// A lumpy round shape: tree canopies, bushes, sheep.
export function blob(seed, rx, ry = rx, n = 9, lump = 0.2) {
  const r = rng(seed);
  return closed(
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      const k = 1 - lump / 2 + r() * lump;
      return [Math.cos(a) * rx * k, Math.sin(a) * ry * k];
    }),
  );
}

// A rolling ridge that repeats seamlessly every `w` units. Returns y(x).
export function ridge(seed, w, base, amp) {
  const r = rng(seed);
  const ph = [r() * 6.28, r() * 6.28, r() * 6.28];
  return (x) => {
    const t = (x / w) * Math.PI * 2;
    return base - amp * (0.55 * Math.sin(t + ph[0]) + 0.3 * Math.sin(2 * t + ph[1]) + 0.15 * Math.sin(5 * t + ph[2]));
  };
}

export function ridgePts(y, w, step = 30) {
  const pts = [];
  for (let x = 0; x <= w; x += step) pts.push([x, y(x)]);
  return pts;
}
