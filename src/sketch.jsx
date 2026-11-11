import { useLayoutEffect, useRef, useState } from "react";
import { rng, roughLine, roughRect } from "./rough.js";

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

// ---------- shared SVG defs: pencil wobble + hatch plates ----------

function HatchPattern({ id, gap, width, angle, double = false }) {
  return (
    <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
      <line x1="0" y1="0" x2="0" y2={gap} stroke="var(--ink)" strokeWidth={width} />
      {double && <line x1="0" y1="0" x2={gap} y2="0" stroke="var(--ink)" strokeWidth={width} />}
    </pattern>
  );
}

export function SketchDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <filter id="pencil" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="pencil-2" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="11" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="G" yChannelSelector="R" />
        </filter>
        {/* engraving plates: sparse → dense, several angles */}
        <HatchPattern id="h-sparse" gap={6} width={0.55} angle={45} />
        <HatchPattern id="h-mid" gap={4} width={0.6} angle={45} />
        <HatchPattern id="h-dense" gap={2.4} width={0.65} angle={45} />
        <HatchPattern id="h-cross" gap={3.2} width={0.55} angle={45} double />
        <HatchPattern id="h-steep" gap={3.6} width={0.55} angle={75} />
        <HatchPattern id="h-flat" gap={4} width={0.55} angle={-20} />
        <HatchPattern id="h-horiz" gap={3} width={0.5} angle={0} />
        <HatchPattern id="h-wave" gap={5} width={0.5} angle={-8} />
      </defs>
    </svg>
  );
}

// Children drawn with a firm line plus a faint offset second pass, like a pencil going over twice.
export function Pencil({ children, width = 1.3, second = true }) {
  return (
    <g fill="none" stroke="var(--ink)" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
      <g filter="url(#pencil)">{children}</g>
      {second && (
        <g filter="url(#pencil-2)" opacity="0.28" transform="translate(0.7 0.5)">
          {children}
        </g>
      )}
    </g>
  );
}

// ---------- frames ----------

const FRAME_STYLES = {
  classic: { t: 20, mat: 0 },
  matted: { t: 16, mat: 18 },
  ornate: { t: 24, mat: 0 },
  thin: { t: 10, mat: 12 },
  deep: { t: 14, mat: 26 },
};

// A sketched picture frame with a real cast shadow behind it.
export function SketchFrame({ variant = "classic", seed = 1, className = "", innerClassName = "", shadow = true, children }) {
  const [ref, { w, h }] = useSize();
  const { t, mat } = FRAME_STYLES[variant];
  const r = rng(seed);
  const r2 = rng(seed + 31);
  const m = t + mat;

  return (
    <div ref={ref} className={`relative bg-paper ${shadow ? "shadow-frame" : ""} ${className}`} style={{ padding: m }}>
      <div className={`relative h-full w-full overflow-hidden bg-canvas ${innerClassName}`}>{children}</div>
      {w > 0 && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          {/* moulding slightly darker than the wall */}
          <path
            d={`M0,0 H${w} V${h} H0 Z M${t},${t} V${h - t} H${w - t} V${t} Z`}
            fill="rgba(40,34,26,0.06)"
            fillRule="evenodd"
          />
          {mat > 0 && (
            <path
              d={`M${t},${t} H${w - t} V${h - t} H${t} Z M${m},${m} V${h - m} H${w - m} V${m} Z`}
              fill="var(--canvas)"
              fillRule="evenodd"
            />
          )}
          {/* light from top-left: shade the right and bottom of the moulding */}
          <polygon points={`${w},0 ${w},${h} ${w - t},${h - t} ${w - t},${t}`} fill="url(#h-mid)" opacity="0.5" />
          <polygon points={`0,${h} ${w},${h} ${w - t},${h - t} ${t},${h - t}`} fill="url(#h-dense)" opacity="0.45" />
          <polygon points={`0,0 ${w},0 ${w - t},${t} ${t},${t}`} fill="url(#h-sparse)" opacity="0.18" />
          {/* mat bevel shadow on the top/left inner edge */}
          {mat > 0 && (
            <path d={`M${m},${h - m} V${m} H${w - m}`} fill="none" stroke="rgba(40,34,26,0.18)" strokeWidth="2" />
          )}

          <g fill="none" stroke="var(--ink)" strokeLinecap="round" filter="url(#pencil)">
            <path d={roughRect(0, 0, w, h, r, { over: 5 })} strokeWidth="1.5" />
            <path d={roughRect(t, t, w - 2 * t, h - 2 * t, r)} strokeWidth="1.05" />
            <path
              d={[
                roughLine(0, 0, t, t, r, { over: 1 }),
                roughLine(w, 0, w - t, t, r, { over: 1 }),
                roughLine(w, h, w - t, h - t, r, { over: 1 }),
                roughLine(0, h, t, h - t, r, { over: 1 }),
              ].join(" ")}
              strokeWidth="0.8"
            />
            {variant === "classic" && (
              <path d={roughRect(t * 0.45, t * 0.45, w - t * 0.9, h - t * 0.9, r2)} strokeWidth="0.6" opacity="0.55" />
            )}
            {variant === "ornate" && (
              <>
                <path d={roughRect(-5, -5, w + 10, h + 10, r2, { over: 7 })} strokeWidth="0.75" opacity="0.5" />
                <path d={roughRect(t * 0.35, t * 0.35, w - t * 0.7, h - t * 0.7, r2)} strokeWidth="0.6" opacity="0.55" />
                {[
                  [t / 2, t / 2],
                  [w - t / 2, t / 2],
                  [w - t / 2, h - t / 2],
                  [t / 2, h - t / 2],
                ].map(([cx, cy]) => (
                  <g key={`${cx}-${cy}`}>
                    <circle cx={cx} cy={cy} r={t * 0.28} strokeWidth="0.9" fill="var(--canvas)" />
                    <circle cx={cx} cy={cy} r={t * 0.12} strokeWidth="0.7" fill="url(#h-dense)" />
                  </g>
                ))}
              </>
            )}
            {mat > 0 && <path d={roughRect(m, m, w - 2 * m, h - 2 * m, r2, { over: 2 })} strokeWidth="0.75" />}
          </g>
          <path
            d={roughRect(0, 0, w, h, r2, { over: 8, wobble: 2 })}
            fill="none"
            stroke="var(--ink)"
            strokeWidth="0.55"
            opacity="0.28"
          />
        </svg>
      )}
    </div>
  );
}

// Picture wire from the frame to a nail.
export function HangingWire({ drop = 56 }) {
  return (
    <svg
      className="pointer-events-none absolute left-0 w-full overflow-visible"
      style={{ top: -drop, height: drop }}
      viewBox="0 0 100 56"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M26,58 Q38,30 50,6 Q62,30 74,58"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.75"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx="50" cy="5" r="1.4" fill="var(--ink)" />
      <ellipse cx="50" cy="7.5" rx="2.2" ry="0.6" fill="rgba(40,34,26,0.3)" />
    </svg>
  );
}

// A plain museum label: small white card, no border, soft shadow.
export function Plaque({ title, meta, className = "" }) {
  return (
    <div className={`bg-canvas px-4 py-2.5 text-center shadow-label ${className}`}>
      <p className="font-display text-[15px] leading-tight text-ink">{title}</p>
      <p className="mt-1 font-serif text-[11px] uppercase tracking-[0.18em] text-pencil">{meta}</p>
    </div>
  );
}

// ---------- engraved covers ----------
// To replace any of these with your own drawing, drop a PNG/SVG in public/ and set
// `cover: "your-file.png"` on the project in App.jsx; <Cover /> below will use it.

// A face plate with its outline sampled into points and measured at four heights.
function CoverFace() {
  // a slim oval with a soft chin; the right half as cubic segments so the mesh points can sit exactly on it
  const half = [
    [[120, 52], [152, 52], [170, 84], [170, 124]],
    [[170, 124], [170, 160], [156, 196], [138, 216]],
    [[138, 216], [131, 224], [125, 228], [120, 228]],
  ];
  const head =
    "M120,52 C152,52 170,84 170,124 C170,160 156,196 138,216 C131,224 125,228 120,228 C115,228 109,224 102,216 C84,196 70,160 70,124 C70,84 88,52 120,52 Z";
  const at = ([a, b, c, d], t) => {
    const u = 1 - t;
    return [0, 1].map((k) => u * u * u * a[k] + 3 * u * u * t * b[k] + 3 * u * t * t * c[k] + t * t * t * d[k]);
  };
  // points along the outline, like the face mesh contour
  const right = [
    ...[0.2, 0.4, 0.6, 0.8, 1].map((t) => at(half[0], t)),
    ...[0.2, 0.4, 0.6, 0.8, 1].map((t) => at(half[1], t)),
    at(half[2], 0.55),
  ];
  const outline = [[120, 52], ...right, [120, 228], ...right.map(([x, y]) => [240 - x, y])];
  // widths measured clear of the eyes: forehead, cheekbones, jaw
  const widths = [
    [98, 46.5],
    [160, 48],
    [205, 26.5],
  ];
  const eye = (cx, flip) => (
    <g transform={`translate(${cx} 130) scale(${flip ? -1 : 1} 1)`}>
      <path d="M-12,2 C-6,6 5,5 12,-2" strokeWidth="0.6" />
      <circle cx="0.5" cy="-0.5" r="3.6" fill="url(#h-dense)" strokeWidth="0.7" />
      <path d="M-13,1 C-7,-6 5,-7 13,-3 L17,-6" strokeWidth="1.7" />
      <path d="M-15,-13 C-7,-18 5,-18 16,-12" strokeWidth="1.1" />
    </g>
  );
  return (
    <svg viewBox="0 0 240 262" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <Pencil width={1.1}>
        {/* the whole face sits a little larger, wider and lower than it was drawn */}
        <g transform="translate(120 147) scale(1.15 1.07) translate(-120 -140)">
        {/* hair falling just past the jaw on both sides */}
        <path d="M67,108 C58,152 62,200 54,240 C70,243 88,236 102,217 C86,197 73,165 67,108 Z" fill="url(#h-cross)" strokeWidth="1" />
        <path d="M173,108 C182,152 178,200 186,240 C170,243 152,236 138,217 C154,197 167,165 173,108 Z" fill="url(#h-cross)" strokeWidth="1" />
        {/* head, lightly shaded on the right */}
        <path d={head} fill="var(--canvas)" strokeWidth="1.3" />
        <path d="M158,86 C166,98 170,112 170,124 C170,160 156,196 138,216 C150,194 160,166 160,130 C160,112 160,98 158,86 Z" fill="url(#h-sparse)" stroke="none" />
        {/* hair parted to one side, swept across the forehead */}
        <path d="M68,128 C62,84 84,45 122,43 C160,45 180,84 172,128 C169,104 160,82 142,68 C128,84 100,96 77,98 C72,108 69,118 68,128 Z" fill="url(#h-cross)" strokeWidth="1" />
        {/* centre line */}
        <path d="M120,44 V238" strokeWidth="0.5" strokeDasharray="2 3" />
        {/* features */}
        {eye(99, true)}
        {eye(141, false)}
        <path d="M122,136 C121,148 118,157 115,163 C118,167 122,167 125,165" strokeWidth="0.8" />
        <path d="M105,184.5 C111,184 117,183.5 120,185.5 C123,183.5 129,184 135,184.5 C129,191 111,191 105,184.5 Z" fill="url(#h-mid)" strokeWidth="0.8" />
        <path d="M108,187.5 C114,198 126,198 132,187.5 C126,192 114,192 108,187.5 Z" fill="url(#h-sparse)" strokeWidth="0.7" />
        <path d="M102.5,183 q1.2,2 3,2 M137.5,183 q-1.2,2 -3,2" strokeWidth="0.7" />
        {/* width measurements with end ticks */}
        {widths.map(([y, w]) => (
          <g key={y} strokeWidth="0.6">
            <path d={`M${120 - w},${y} H${120 + w}`} strokeDasharray="5 2.5" />
            <path d={`M${120 - w},${y - 3.5} V${y + 3.5} M${120 + w},${y - 3.5} V${y + 3.5}`} />
          </g>
        ))}
        {/* sampled outline points */}
        {outline.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.6" fill="var(--ink)" stroke="none" />
        ))}
        </g>
        {/* plate caption */}
        <text x="16" y="24" fontSize="7.5" letterSpacing="1.6" fill="var(--ink)" stroke="none" fontFamily="Newsreader, serif">
          FIG. 1 — 478 POINTS
        </text>
        <path d="M16,30 H96" strokeWidth="0.5" />
      </Pencil>
    </svg>
  );
}

function CoverTransit() {
  const A = "M20,200 C80,200 100,60 170,60 C220,60 240,110 290,100";
  const B = "M40,20 C60,110 150,130 150,200 C150,230 200,230 280,220";
  const C = "M10,120 C70,130 120,110 170,150 C210,185 250,160 290,40";
  return (
    <svg viewBox="0 0 300 240" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <Pencil width={1}>
        {/* river */}
        <path
          d="M0,166 C60,148 90,190 150,174 C200,160 240,200 300,182 L300,204 C240,222 200,182 150,196 C90,212 60,172 0,190 Z"
          fill="url(#h-wave)"
          strokeWidth="0.6"
          opacity="0.7"
        />
        {/* lines: solid, railroad, dashed */}
        <path d={A} strokeWidth="3.4" />
        <path d={B} strokeWidth="3.4" />
        <path d={B} strokeWidth="1.2" stroke="var(--canvas)" />
        <path d={C} strokeWidth="2.2" strokeDasharray="7 3.5" />
        {/* stations */}
        {[
          [91, 130],
          [230, 84],
          [66, 76],
          [185, 225],
          [230, 153],
          [266, 101],
          [45, 200],
          [120, 68],
        ].map(([cx, cy]) => (
          <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="3.4" fill="var(--canvas)" strokeWidth="1.2" />
        ))}
        {/* interchange hubs */}
        <circle cx="98" cy="122" r="8" fill="var(--canvas)" strokeWidth="1.4" />
        <circle cx="98" cy="122" r="3.2" fill="url(#h-dense)" strokeWidth="0.8" />
        <circle cx="165" cy="148" r="6" fill="var(--canvas)" strokeWidth="1.3" />
        <circle cx="165" cy="148" r="2.4" fill="url(#h-dense)" strokeWidth="0.7" />
        {/* compass */}
        <circle cx="262" cy="30" r="14" strokeWidth="0.8" />
        <path d="M262,18 L266,30 L262,27 L258,30 Z" fill="url(#h-dense)" strokeWidth="0.7" />
        <path d="M262,42 L266,30 L262,33 L258,30 Z" fill="var(--canvas)" strokeWidth="0.7" />
        {/* plate caption */}
        <text x="14" y="228" fontSize="7.5" letterSpacing="1.6" fill="var(--ink)" stroke="none" fontFamily="Newsreader, serif">
          FIG. 2 — RIDERSHIP BY LINE
        </text>
        <path d="M14,218 H118" strokeWidth="0.5" />
      </Pencil>
    </svg>
  );
}

function CoverKnight() {
  const body =
    "M70,268 L170,268 L170,252 Q140,248 140,220 Q140,190 160,160 Q175,135 165,105 Q150,70 115,62 L108,45 L95,58 L80,55 L70,75 Q50,90 42,120 L48,132 L68,118 Q80,112 86,120 L82,150 Q110,165 108,200 Q106,240 70,252 Z";
  const shade =
    "M118,250 C120,230 128,210 138,182 C148,152 152,120 160,100 C166,112 170,130 162,150 C150,180 128,215 130,252 Z";
  const mane = "M108,45 L115,62 Q150,70 165,105 Q158,96 148,84 Q136,70 118,66 Z";
  return (
    <svg viewBox="0 0 240 300" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <Pencil width={1.15}>
        {/* board squares */}
        <rect x="18" y="274" width="51" height="18" fill="url(#h-cross)" strokeWidth="0.7" />
        <rect x="69" y="274" width="51" height="18" fill="none" strokeWidth="0.7" />
        <rect x="120" y="274" width="51" height="18" fill="url(#h-cross)" strokeWidth="0.7" />
        <rect x="171" y="274" width="51" height="18" fill="none" strokeWidth="0.7" />
        {/* piece */}
        <path d={body} fill="var(--canvas)" strokeWidth="1.3" />
        <path d={shade} fill="url(#h-mid)" stroke="none" />
        <path d="M140,252 C136,226 146,196 156,170 C150,200 142,226 146,252 Z" fill="url(#h-dense)" stroke="none" />
        <path d={mane} fill="url(#h-dense)" strokeWidth="0.8" />
        <path d="M118,66 L124,74 L116,82 L124,90 L116,98 L124,106 L118,114" strokeWidth="0.8" />
        <path d="M86,120 Q96,112 104,114" strokeWidth="0.8" />
        <path d="M68,118 Q72,128 80,132" strokeWidth="0.8" />
        {/* eye, nostril, mouth */}
        <circle cx="88" cy="90" r="3" fill="var(--ink)" />
        <path d="M84,84 Q88,80 94,82" strokeWidth="0.8" />
        <path d="M52,118 Q56,116 58,120" strokeWidth="0.9" />
        <path d="M46,128 L60,124" strokeWidth="0.9" />
        {/* base */}
        <path d="M62,268 H178" strokeWidth="1.4" />
        <path d="M66,260 H174" strokeWidth="0.7" />
        <path d="M60,268 Q120,276 180,268" strokeWidth="0.8" />
        <path d="M140,252 H170 L170,268 H140 Z" fill="url(#h-dense)" stroke="none" opacity="0.7" />
      </Pencil>
    </svg>
  );
}

function CoverWatch() {
  return (
    <svg viewBox="0 0 240 300" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <Pencil width={1.15}>
        {/* straps */}
        <path d="M84,84 L80,20 Q80,12 88,12 L152,12 Q160,12 160,20 L156,84 Z" fill="url(#h-sparse)" />
        <path d="M84,220 L80,284 Q80,292 88,292 L152,292 Q160,292 160,284 L156,220 Z" fill="url(#h-sparse)" />
        <path d="M86,30 Q120,26 154,30 M85,44 Q120,40 155,44 M85,58 Q120,54 155,58" strokeWidth="0.55" opacity="0.6" />
        {[232, 246, 260].map((cy) => (
          <circle key={cy} cx="120" cy={cy} r="2.6" fill="var(--canvas)" strokeWidth="0.8" />
        ))}
        <path d="M94,276 H146" strokeWidth="0.7" />
        {/* case + bezel */}
        <rect x="62" y="84" width="116" height="136" rx="34" fill="var(--canvas)" strokeWidth="1.4" />
        <path
          d="M62,118 Q62,84 96,84 H144 Q178,84 178,118 V186 Q178,220 144,220 H96 Q62,220 62,186 Z M74,120 Q74,96 98,96 H142 Q166,96 166,120 V184 Q166,208 142,208 H98 Q74,208 74,184 Z"
          fill="url(#h-dense)"
          fillRule="evenodd"
          stroke="none"
        />
        <path d="M62,186 Q62,220 96,220 H144 Q166,220 170,210 Q150,214 100,214 Q72,212 62,186 Z" fill="url(#h-cross)" stroke="none" opacity="0.8" />
        <rect x="74" y="96" width="92" height="112" rx="24" fill="var(--canvas)" strokeWidth="1" />
        <path d="M70,120 Q72,92 98,90" stroke="var(--canvas)" strokeWidth="1.6" opacity="0.9" />
        {/* crown + button */}
        <rect x="178" y="118" width="10" height="26" rx="3" fill="url(#h-dense)" strokeWidth="0.9" />
        <path d="M181,122 V140 M184,122 V140" strokeWidth="0.5" opacity="0.6" />
        <rect x="179" y="156" width="7" height="34" rx="2" fill="url(#h-mid)" strokeWidth="0.9" />
        {/* screen: recording */}
        <circle cx="150" cy="114" r="4" fill="var(--ink)" />
        <text x="86" y="118" fontSize="9" fill="var(--ink)" stroke="none" fontFamily="Newsreader, serif" letterSpacing="0.8">
          0:19
        </text>
        <path d="M84,152 L92,152 L98,140 L104,166 L110,130 L116,172 L122,144 L128,160 L134,150 L156,150" strokeWidth="1.6" />
        <rect x="88" y="182" width="64" height="14" rx="7" fill="url(#h-mid)" strokeWidth="0.9" />
        <path d="M110,189 H130" stroke="var(--canvas)" strokeWidth="1.4" />
      </Pencil>
    </svg>
  );
}

const DRAWINGS = {
  face: CoverFace,
  viz: CoverTransit,
  web: CoverKnight,
  nb: CoverWatch,
};

// Renders a project's cover: your own image if the project sets `cover`, else the engraved drawing.
export function Cover({ project }) {
  if (project.cover) {
    return (
      <img
        src={`${import.meta.env.BASE_URL}${project.cover.replace(/^\//, "")}`}
        alt=""
        className="h-full w-full object-contain"
      />
    );
  }
  const Drawing = DRAWINGS[project.id];
  return Drawing ? <Drawing /> : null;
}
