import { useEffect, useRef } from "react";

// A tiny height-field water simulation on the surface of the coffee.
// The cursor stirs it; every few seconds a drip lands on its own.
const N = 84;

export function CoffeeSurface({ calm }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    canvas.width = N;
    canvas.height = N;
    const ctx = canvas.getContext("2d");
    const img = ctx.createImageData(N, N);

    let cur = new Float32Array(N * N);
    let prev = new Float32Array(N * N);

    // Static shading: dark centre, lighter crema ring at the rim, a window highlight top-left.
    const base = new Float32Array(N * N);
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const dx = (x - N / 2) / (N / 2);
        const dy = (y - N / 2) / (N / 2);
        const d = Math.hypot(dx, dy);
        const crema = Math.max(0, (d - 0.72) / 0.28) ** 2 * 0.55;
        const glint = Math.exp(-(((dx + 0.35) ** 2) / 0.05 + ((dy + 0.38) ** 2) / 0.02)) * 0.35;
        base[y * N + x] = 0.22 + crema + glint - d * 0.06;
      }
    }

    const draw = () => {
      const px = img.data;
      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          const i = y * N + x;
          const sx = x > 0 && x < N - 1 ? cur[i - 1] - cur[i + 1] : 0;
          const sy = y > 0 && y < N - 1 ? cur[i - N] - cur[i + N] : 0;
          const l = Math.min(1, Math.max(0, base[i] + (sx + sy) * 0.045));
          const o = i * 4;
          px[o] = 40 + l * 170;
          px[o + 1] = 26 + l * 120;
          px[o + 2] = 16 + l * 78;
          px[o + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    let raf = 0;
    let running = false;
    const step = () => {
      let energy = 0;
      for (let y = 1; y < N - 1; y++) {
        for (let x = 1; x < N - 1; x++) {
          const i = y * N + x;
          const v = ((cur[i - 1] + cur[i + 1] + cur[i - N] + cur[i + N]) / 2 - prev[i]) * 0.962;
          prev[i] = v;
          energy += v < 0 ? -v : v;
        }
      }
      [cur, prev] = [prev, cur];
      draw();
      if (energy > 2) raf = requestAnimationFrame(step);
      else running = false;
    };
    const kick = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(step);
      }
    };
    const drop = (cx, cy, amt, r = 2) => {
      for (let y = -r; y <= r; y++) {
        for (let x = -r; x <= r; x++) {
          const px = Math.round(cx + x);
          const py = Math.round(cy + y);
          if (px < 1 || py < 1 || px >= N - 1 || py >= N - 1) continue;
          const fall = 1 - Math.hypot(x, y) / (r + 1);
          if (fall > 0) cur[py * N + px] += amt * fall;
        }
      }
      kick();
    };

    let last = 0;
    const onMove = (e) => {
      const now = performance.now();
      if (now - last < 24) return;
      last = now;
      const rect = canvas.getBoundingClientRect();
      drop(((e.clientX - rect.left) / rect.width) * N, ((e.clientY - rect.top) / rect.height) * N, 9);
    };
    canvas.addEventListener("pointermove", onMove);

    let timer = 0;
    const drip = () => {
      timer = setTimeout(() => {
        const a = Math.random() * Math.PI * 2;
        const d = Math.random() * N * 0.28;
        drop(N / 2 + Math.cos(a) * d, N / 2 + Math.sin(a) * d, 26, 1);
        drip();
      }, 3500 + Math.random() * 4000);
    };
    if (!calm) drip();
    draw();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      canvas.removeEventListener("pointermove", onMove);
    };
  }, [calm]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full rounded-full" aria-hidden="true" />;
}
