// ---------- geometry helpers ----------

export function rng(seed) {
  let s = (Math.abs(seed) % 2147483646) + 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const jit = (r, amt) => (r() - 0.5) * 2 * amt;
export const f = (n) => n.toFixed(1);

// A slightly bowed line that overshoots its endpoints, like a quick pencil stroke.
export function roughLine(x1, y1, x2, y2, r, { over = 4, wobble = 1.2 } = {}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const o1 = over * r();
  const o2 = over * r();
  const ax = x1 - ux * o1 + jit(r, wobble);
  const ay = y1 - uy * o1 + jit(r, wobble);
  const bx = x2 + ux * o2 + jit(r, wobble);
  const by = y2 + uy * o2 + jit(r, wobble);
  const bow = jit(r, Math.min(len * 0.01, 3));
  const cx = (ax + bx) / 2 - uy * bow;
  const cy = (ay + by) / 2 + ux * bow;
  return `M${f(ax)},${f(ay)} Q${f(cx)},${f(cy)} ${f(bx)},${f(by)}`;
}

export function roughRect(x, y, w, h, r, opts) {
  return [
    roughLine(x, y, x + w, y, r, opts),
    roughLine(x + w, y, x + w, y + h, r, opts),
    roughLine(x + w, y + h, x, y + h, r, opts),
    roughLine(x, y + h, x, y, r, opts),
  ].join(" ");
}
