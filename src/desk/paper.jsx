import { useEffect, useRef } from "react";
import { rng } from "../rough.js";

// A sheet of paper drawn as a mesh of triangles. Flat, it covers the screen; crumpled, every
// vertex is squeezed into a small disc and each facet gets its own light, so it reads as a ball.
// "unfold": a ball pops out of the clicked object and opens into a full-screen sheet.
// "crumple": the full-screen sheet scrunches back into a ball that drops into the object.

const COLS = 18;
const ROWS = 12;
const PAPER = [230, 225, 214]; // --paper

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const easeOut = (x) => 1 - (1 - x) ** 3;
const easeIn = (x) => x * x;
const easeOutBack = (x) => 1 + 2.2 * (x - 1) ** 3 + 1.2 * (x - 1) ** 2;

function buildMesh(seed) {
  const r = rng(seed);
  const verts = [];
  for (let j = 0; j <= ROWS; j++) {
    for (let i = 0; i <= COLS; i++) {
      const uu = (i / COLS) * 2 - 1;
      const vv = (j / ROWS) * 2 - 1;
      // square → disc, then scatter inward so the ball is filled, not just a ring
      const dx = uu * Math.sqrt(1 - (vv * vv) / 2);
      const dy = vv * Math.sqrt(1 - (uu * uu) / 2);
      const k = 0.3 + 0.7 * r();
      const dist = Math.min(1, Math.hypot(uu, vv) / Math.SQRT2);
      verts.push({
        fx: i / COLS,
        fy: j / ROWS,
        bx: dx * k + (r() - 0.5) * 0.45,
        by: dy * k + (r() - 0.5) * 0.45,
        // corners crumple first and unfold last
        delay: dist * 0.16 + r() * 0.04,
      });
    }
  }
  const tris = [];
  const idx = (i, j) => j * (COLS + 1) + i;
  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      const a = idx(i, j);
      const b = idx(i + 1, j);
      const c = idx(i, j + 1);
      const d = idx(i + 1, j + 1);
      const flip = r() > 0.5;
      tris.push({ v: flip ? [a, b, d] : [a, b, c], s: r() - 0.5, depth: r() });
      tris.push({ v: flip ? [a, d, c] : [b, d, c], s: r() - 0.5, depth: r() });
    }
  }
  tris.sort((p, q) => p.depth - q.depth);
  return { verts, tris, spin: (r() > 0.5 ? 1 : -1) * (0.9 + r() * 0.6) };
}

export function PaperTransition({ mode, rect, onDone, seed = 7 }) {
  const ref = useRef(null);
  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  });

  useEffect(() => {
    const canvas = ref.current;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const mesh = buildMesh(seed);
    const n = mesh.verts.length;
    const px = new Float32Array(n);
    const py = new Float32Array(n);
    const pv = new Float32Array(n);

    const cx = rect ? rect.left + rect.width / 2 : W / 2;
    const cy = rect ? rect.top + rect.height / 2 : H / 2;
    const baseR = rect ? Math.max(38, Math.min(rect.width, rect.height) * 0.42) : 60;

    // T: 0 = ball, 1 = flat sheet. scale/alpha/drop only affect the ball.
    const draw = (T, scale = 1, alpha = 1, drop = 0) => {
      ctx.clearRect(0, 0, W, H);
      const R = baseR * scale;
      const bcy = cy + drop;
      let ballness = 0;
      for (let k = 0; k < n; k++) {
        const v = mesh.verts[k];
        const p = easeOut(clamp01((T - v.delay) / 0.8));
        const a = mesh.spin * (1 - p);
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        const bx = cx + (v.bx * cos - v.by * sin) * R;
        const by = bcy + (v.bx * sin + v.by * cos) * R;
        px[k] = bx + (v.fx * W - bx) * p;
        py[k] = by + (v.fy * H - by) * p;
        pv[k] = p;
        ballness += 1 - p;
      }
      ballness /= n;

      ctx.globalAlpha = alpha;
      if (ballness > 0.02) {
        // contact shadow under the ball
        const g = ctx.createRadialGradient(cx, bcy + R * 0.9, 0, cx, bcy + R * 0.9, R * 1.3);
        g.addColorStop(0, `rgba(30,26,20,${0.35 * ballness})`);
        g.addColorStop(1, "rgba(30,26,20,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(cx, bcy + R * 0.9, R * 1.3, R * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.lineJoin = "round";
      ctx.lineWidth = 1;
      for (const t of mesh.tris) {
        const [i0, i1, i2] = t.v;
        const crumple = 1 - (pv[i0] + pv[i1] + pv[i2]) / 3;
        const gx = (px[i0] + px[i1] + px[i2]) / 3;
        const gy = (py[i0] + py[i1] + py[i2]) / 3;
        // facet light + a soft round falloff away from the top-left when balled up
        const off = Math.hypot(gx - (cx - R * 0.35), gy - (bcy - R * 0.35)) / (2.2 * R);
        const light = 1 + t.s * 0.55 * crumple ** 0.7 - 0.05 * crumple - 0.22 * crumple * Math.min(1, off) + t.s * 0.025;
        const rC = Math.min(255, PAPER[0] * light) | 0;
        const gC = Math.min(255, PAPER[1] * light) | 0;
        const bC = Math.min(255, PAPER[2] * light) | 0;
        const col = `rgb(${rC},${gC},${bC})`;
        ctx.fillStyle = col;
        ctx.strokeStyle = col;
        ctx.beginPath();
        ctx.moveTo(px[i0], py[i0]);
        ctx.lineTo(px[i1], py[i1]);
        ctx.lineTo(px[i2], py[i2]);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // faint fold lines that linger as it flattens
        if (crumple > 0.01 && crumple < 0.6 && t.depth > 0.7) {
          ctx.strokeStyle = `rgba(30,26,20,${0.12 * crumple})`;
          ctx.beginPath();
          ctx.moveTo(px[i0], py[i0]);
          ctx.lineTo(px[i1], py[i1]);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const ms = now - start;
      let finished;
      if (mode === "unfold") {
        // the ball pops out and starts opening in the same motion
        const x = clamp01(ms / 850);
        const pop = easeOutBack(clamp01(x / 0.22));
        draw(x, 0.3 + 0.7 * pop, clamp01(x / 0.05));
        finished = x >= 1;
      } else {
        // brief beat for the page to fade, then scrunch; the toss starts before the ball is fully closed
        const HOLD = 120;
        const x = clamp01((ms - HOLD) / 850);
        const toss = easeIn(clamp01((x - 0.72) / 0.28));
        draw(1 - clamp01(x / 0.85), 1 - 0.75 * toss, 1 - clamp01((x - 0.82) / 0.18), 16 * toss);
        finished = x >= 1;
      }
      if (finished) doneRef.current?.();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode, rect, seed]);

  return <canvas ref={ref} className="pointer-events-auto fixed inset-0 z-[99] h-full w-full" aria-hidden="true" />;
}
