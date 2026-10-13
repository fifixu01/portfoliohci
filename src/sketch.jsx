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

function CoverButterfly() {
  const fore =
    "M126,146 C150,118 190,84 212,80 C224,80 226,96 218,112 C210,128 186,146 160,154 C148,158 134,156 126,146 Z";
  const hind =
    "M128,160 C150,158 184,166 200,186 C210,200 204,220 190,222 C170,224 146,206 132,180 C129,174 128,166 128,160 Z";
  const foreInner = "M126,146 C140,130 162,116 180,110 C172,128 156,144 142,152 Z";
  const hindInner = "M128,160 C146,160 168,172 180,190 C166,196 148,188 136,176 Z";
  const wing = (
    <>
      <path d={fore} fill="url(#h-sparse)" />
      <path d={foreInner} fill="url(#h-dense)" />
      <path d={hind} fill="url(#h-sparse)" />
      <path d={hindInner} fill="url(#h-dense)" />
      {/* outer margin band */}
      <path d="M212,80 C224,80 226,96 218,112 C210,128 186,146 160,154 C170,146 196,126 206,108 C212,96 212,86 212,80 Z" fill="url(#h-cross)" />
      <path d="M200,186 C210,200 204,220 190,222 C180,222 170,218 160,212 C176,214 192,210 196,198 C198,192 198,188 200,186 Z" fill="url(#h-cross)" />
      {/* veins */}
      <g strokeWidth="0.75">
        <path d="M128,148 Q168,110 212,86" />
        <path d="M128,148 Q170,122 216,104" />
        <path d="M128,148 Q166,136 206,124" />
        <path d="M128,148 Q156,146 184,142" />
        <path d="M130,162 Q164,172 198,190" />
        <path d="M130,162 Q162,184 198,210" />
        <path d="M130,162 Q154,196 184,220" />
        <path d="M130,162 Q146,190 160,210" />
      </g>
      {/* pale spots near the tip */}
      {[
        [205, 95, 3.5, 2.2, -40],
        [198, 108, 3, 2, -40],
        [188, 120, 2.6, 1.8, -40],
      ].map(([cx, cy, rx, ry, rot]) => (
        <ellipse key={cx} cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(${rot} ${cx} ${cy})`} fill="var(--canvas)" strokeWidth="0.7" />
      ))}
    </>
  );
  return (
    <svg viewBox="0 0 240 300" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <Pencil width={1.1}>
        <ellipse cx="120" cy="252" rx="68" ry="7" fill="url(#h-horiz)" stroke="none" opacity="0.5" />
        {wing}
        <g transform="translate(240 0) scale(-1 1)">{wing}</g>
        {/* body */}
        <path d="M114,158 C112,185 118,206 120,208 C122,206 128,185 126,158 Z" fill="url(#h-dense)" />
        <ellipse cx="120" cy="150" rx="6.5" ry="13" fill="url(#h-mid)" />
        <circle cx="120" cy="138" r="5.2" fill="url(#h-mid)" />
        <path d="M117,134 C110,120 102,112 92,106 M123,134 C130,120 138,112 148,106" strokeWidth="0.9" />
        <circle cx="91" cy="105" r="1.4" fill="var(--ink)" />
        <circle cx="149" cy="105" r="1.4" fill="var(--ink)" />
        <path d="M115,170 H125 M115,178 H125 M116,186 H124 M117,194 H123" strokeWidth="0.6" />
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
  hci: CoverButterfly,
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
