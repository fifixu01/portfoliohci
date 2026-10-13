import { useLayoutEffect, useRef, useState } from "react";
import { f, rng, roughLine, roughRect } from "./rough.js";

function useSize() {
  const ref = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: el.offsetWidth || width, h: el.offsetHeight || height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size];
}

// ---------- shared SVG defs (filters + hatch patterns) ----------

export function SketchDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <filter id="pencil" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="pencil-2" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="11" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="G" yChannelSelector="R" />
        </filter>
        <pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="var(--ink)" strokeWidth="0.7" />
        </pattern>
        <pattern id="hatch-dense" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="3" stroke="var(--ink)" strokeWidth="0.7" />
        </pattern>
        <pattern id="crosshatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="var(--ink)" strokeWidth="0.6" />
          <line x1="0" y1="0" x2="4" y2="0" stroke="var(--ink)" strokeWidth="0.6" />
        </pattern>
      </defs>
    </svg>
  );
}

// Draws its children twice: a firm line plus a faint offset second pass.
export function Pencil({ children, width = 1.4 }) {
  return (
    <g fill="none" stroke="var(--ink)" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
      <g filter="url(#pencil)">{children}</g>
      <g filter="url(#pencil-2)" opacity="0.35" transform="translate(0.8 0.6)">{children}</g>
    </g>
  );
}

// ---------- boxes + frames ----------

// A hand-drawn rectangle border around any content.
export function SketchBox({ as: Tag = "div", seed = 1, className = "", children, faint = false, ...props }) {
  const [ref, { w, h }] = useSize();
  const r1 = rng(seed);
  const r2 = rng(seed + 97);
  return (
    <Tag ref={ref} className={`relative ${className}`} {...props}>
      {w > 0 && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <g fill="none" stroke="var(--ink)" strokeLinecap="round">
            <path d={roughRect(0, 0, w, h, r1)} strokeWidth={faint ? 0.8 : 1.2} opacity={faint ? 0.55 : 1} />
            <path d={roughRect(0, 0, w, h, r2, { over: 6, wobble: 1.8 })} strokeWidth="0.7" opacity="0.35" />
          </g>
        </svg>
      )}
      {children}
    </Tag>
  );
}

const FRAME_STYLES = {
  classic: { t: 22, mat: 0 },
  matted: { t: 18, mat: 16 },
  ornate: { t: 26, mat: 0 },
  thin: { t: 12, mat: 10 },
};

// A sketched picture frame: outer + inner rect, mitred corners, hatched shading.
export function SketchFrame({ variant = "classic", seed = 1, className = "", innerClassName = "", children }) {
  const [ref, { w, h }] = useSize();
  const { t, mat } = FRAME_STYLES[variant];
  const r = rng(seed);
  const r2 = rng(seed + 31);
  const m = t + mat;

  return (
    <div ref={ref} className={`relative ${className}`} style={{ padding: m }}>
      <div className={`relative h-full w-full overflow-hidden bg-canvas ${innerClassName}`}>{children}</div>
      {w > 0 && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          {/* frame moulding is a shade darker than the wall */}
          <path
            d={`M0,0 H${w} V${h} H0 Z M${t},${t} V${h - t} H${w - t} V${t} Z`}
            fill="var(--paper)"
            fillRule="evenodd"
          />
          {mat > 0 && (
            <path
              d={`M${t},${t} H${w - t} V${h - t} H${t} Z M${m},${m} V${h - m} H${w - m} V${m} Z`}
              fill="var(--canvas)"
              fillRule="evenodd"
            />
          )}
          {/* shading on the right + bottom of the moulding */}
          <polygon points={`${w},0 ${w},${h} ${w - t},${h - t} ${w - t},${t}`} fill="url(#hatch)" opacity="0.55" />
          <polygon points={`0,${h} ${w},${h} ${w - t},${h - t} ${t},${h - t}`} fill="url(#hatch-dense)" opacity="0.5" />

          <g fill="none" stroke="var(--ink)" strokeLinecap="round" filter="url(#pencil)">
            <path d={roughRect(0, 0, w, h, r, { over: 6 })} strokeWidth="1.5" />
            <path d={roughRect(t, t, w - 2 * t, h - 2 * t, r)} strokeWidth="1.2" />
            <path
              d={[
                roughLine(0, 0, t, t, r, { over: 1 }),
                roughLine(w, 0, w - t, t, r, { over: 1 }),
                roughLine(w, h, w - t, h - t, r, { over: 1 }),
                roughLine(0, h, t, h - t, r, { over: 1 }),
              ].join(" ")}
              strokeWidth="0.9"
            />
            {variant === "classic" && (
              <path d={roughRect(t * 0.45, t * 0.45, w - t * 0.9, h - t * 0.9, r2)} strokeWidth="0.7" opacity="0.6" />
            )}
            {variant === "ornate" && (
              <>
                <path d={roughRect(-6, -6, w + 12, h + 12, r2, { over: 8 })} strokeWidth="0.8" opacity="0.5" />
                <path d={roughRect(t * 0.35, t * 0.35, w - t * 0.7, h - t * 0.7, r2)} strokeWidth="0.7" opacity="0.6" />
                {[
                  [t / 2, t / 2],
                  [w - t / 2, t / 2],
                  [w - t / 2, h - t / 2],
                  [t / 2, h - t / 2],
                ].map(([cx, cy]) => (
                  <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={t * 0.26} strokeWidth="0.9" fill="var(--canvas)" />
                ))}
              </>
            )}
            {mat > 0 && <path d={roughRect(m, m, w - 2 * m, h - 2 * m, r2, { over: 2 })} strokeWidth="0.8" />}
          </g>
          <path
            d={roughRect(0, 0, w, h, r2, { over: 9, wobble: 2 })}
            fill="none"
            stroke="var(--ink)"
            strokeWidth="0.6"
            opacity="0.3"
          />
        </svg>
      )}
    </div>
  );
}

// Picture wire from the top of a frame to a nail.
export function HangingWire() {
  return (
    <svg
      className="pointer-events-none absolute -top-14 left-0 h-14 w-full overflow-visible"
      viewBox="0 0 100 56"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g fill="none" stroke="var(--ink)" strokeLinecap="round" opacity="0.7">
        <path d="M24,58 Q37,28 50,6 Q63,28 76,58" strokeWidth="0.9" vectorEffect="non-scaling-stroke" />
      </g>
      <circle cx="50" cy="5" r="1.6" fill="var(--ink)" />
    </svg>
  );
}

// ---------- pencil covers ----------

function Butterfly({ x, y, s = 1, rot = 0 }) {
  const wing = (
    <>
      <path d="M0,0 C10,-22 34,-26 30,-6 C28,4 12,4 0,2 Z" fill="url(#hatch)" />
      <path d="M0,2 C14,6 24,18 14,26 C6,30 2,16 0,4 Z" />
      <path d="M4,-2 C12,-10 20,-14 24,-10" opacity="0.6" />
    </>
  );
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {wing}
      <g transform="scale(-1 1)">{wing}</g>
      <path d="M0,-6 L0,22" strokeWidth="2" />
      <path d="M0,-6 Q-4,-16 -9,-18 M0,-6 Q4,-16 9,-18" />
    </g>
  );
}

function star(cx, cy, r1, r2, n = 5) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? r1 : r2;
    const a = (Math.PI / n) * i - Math.PI / 2;
    pts.push(`${f(cx + r * Math.cos(a))},${f(cy + r * Math.sin(a))}`);
  }
  return `M${pts.join(" L")} Z`;
}

function CoverHci() {
  return (
    <svg viewBox="0 0 240 260" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <Pencil>
        {[0, 6, 12, 18, 24].map((o) => (
          <path key={o} d={`M14,${156 + o} C70,${136 + o} 150,${176 + o} 226,${150 + o}`} strokeWidth="0.8" opacity="0.7" />
        ))}
        <g transform="translate(104 168)">
          <ellipse cx="0" cy="0" rx="8" ry="5.5" transform="rotate(-20)" fill="url(#hatch-dense)" />
          <ellipse cx="28" cy="-7" rx="8" ry="5.5" transform="rotate(-20 28 -7)" fill="url(#hatch-dense)" />
          <path d="M7,-3 L7,-48 L35,-55 L35,-10" />
          <path d="M7,-48 L35,-55 M7,-43 L35,-50" strokeWidth="2.4" />
        </g>
        <Butterfly x={66} y={74} s={1.15} rot={-14} />
        <Butterfly x={182} y={100} s={0.8} rot={18} />
        <path d="M80,96 C98,140 140,58 168,104" strokeDasharray="2 6" strokeWidth="1" />
        <path d="M30,222 Q120,212 210,224" strokeWidth="0.8" opacity="0.5" />
      </Pencil>
    </svg>
  );
}

function CoverViz() {
  const bars = [
    [48, 110],
    [82, 70],
    [116, 128],
    [150, 52],
    [184, 92],
  ];
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <Pencil>
        <path d="M30,26 L30,200 L216,200" />
        {[60, 100, 140, 180].map((y) => (
          <path key={y} d={`M26,${y} L34,${y}`} strokeWidth="1" />
        ))}
        {bars.map(([x, top]) => (
          <rect key={x} x={x} y={top} width="22" height={200 - top} fill="url(#hatch)" strokeWidth="1.1" />
        ))}
        <path d="M59,96 L93,58 L127,112 L161,38 L195,78" strokeWidth="1.2" />
        {[
          [59, 96],
          [93, 58],
          [127, 112],
          [161, 38],
          [195, 78],
        ].map(([cx, cy]) => (
          <circle key={cx} cx={cx} cy={cy} r="4" fill="var(--canvas)" />
        ))}
        <path d="M40,222 L200,222" strokeDasharray="3 5" strokeWidth="0.8" opacity="0.6" />
      </Pencil>
    </svg>
  );
}

function CoverWeb() {
  return (
    <svg viewBox="0 0 260 200" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <Pencil>
        <path d="M130,64 C130,40 100,44 92,26 C84,8 60,16 40,12" strokeWidth="1" />
        <g transform="translate(130 108) scale(1.55)">
          <path d="M-40,-10 C-40,-22 -28,-24 -16,-20 L16,-20 C28,-24 40,-22 40,-10 L46,18 C48,30 36,34 28,24 L18,12 L-18,12 L-28,24 C-36,34 -48,30 -46,18 Z" />
          <path d="M-35,-4 C-35,-14 -26,-16 -16,-14" opacity="0.5" strokeWidth="0.8" />
          <path d="M-35,-3 H-29 V-9 H-23 V-3 H-17 V3 H-23 V9 H-29 V3 H-35 Z" fill="url(#hatch-dense)" strokeWidth="0.9" />
          {[
            [24, -8],
            [32, 0],
            [24, 8],
            [16, 0],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="3.2" strokeWidth="0.9" fill={i === 0 ? "url(#hatch-dense)" : "none"} />
          ))}
          <circle cx="-9" cy="10" r="5" strokeWidth="0.9" />
          <circle cx="9" cy="10" r="5" strokeWidth="0.9" />
        </g>
        <g transform="translate(212 46) rotate(14)">
          <rect x="-15" y="-15" width="30" height="30" rx="5" fill="var(--canvas)" />
          {[
            [-7, -7],
            [7, 7],
            [0, 0],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="2.2" fill="var(--ink)" stroke="none" />
          ))}
        </g>
        <path d={star(44, 168, 7, 3, 4)} strokeWidth="0.9" />
        <path d={star(222, 160, 5, 2, 4)} strokeWidth="0.9" />
      </Pencil>
    </svg>
  );
}

function CoverWatch() {
  return (
    <svg viewBox="0 0 220 290" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <Pencil>
        {/* straps */}
        <path d="M78,52 L84,8 H136 L142,52" fill="url(#hatch)" />
        <path d="M78,238 L84,282 H136 L142,238" fill="url(#hatch)" />
        <path d="M88,20 H132 M89,30 H131 M88,262 H132 M89,272 H131" strokeWidth="0.7" opacity="0.6" />
        {/* case + crown + button */}
        <rect x="56" y="50" width="108" height="190" rx="30" fill="var(--canvas)" />
        <rect x="66" y="60" width="88" height="170" rx="22" strokeWidth="1" />
        <rect x="164" y="104" width="9" height="24" rx="3" fill="url(#hatch-dense)" />
        <rect x="165" y="140" width="6" height="30" rx="2" />
        {/* screen: mic + recording waveform */}
        <rect x="88" y="80" width="18" height="30" rx="9" />
        <path d="M82,100 Q82,120 97,120 Q112,120 112,100 M97,120 L97,130 M89,130 H105" />
        <path d="M78,154 L84,154 L88,144 L94,166 L100,140 L106,170 L112,148 L117,160 L121,154 L142,154" strokeWidth="1.2" />
        <circle cx="132" cy="92" r="5" fill="url(#hatch-dense)" />
        <path d="M80,190 H140 M80,202 H128 M80,214 H134" strokeWidth="0.8" opacity="0.55" />
        {/* siri sparkle + note */}
        <path d={star(30, 70, 9, 3, 4)} strokeWidth="0.9" />
        <path d={star(196, 210, 6, 2.5, 4)} strokeWidth="0.9" />
        <path d="M14,214 Q30,200 46,214 Q30,228 14,214" strokeWidth="0.8" opacity="0.6" />
      </Pencil>
    </svg>
  );
}

const COVERS = {
  hci: CoverHci,
  viz: CoverViz,
  web: CoverWeb,
  nb: CoverWatch,
};

export function Cover({ id }) {
  const Drawing = COVERS[id];
  return Drawing ? <Drawing /> : null;
}
