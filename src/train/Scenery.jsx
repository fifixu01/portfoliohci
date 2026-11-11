import { memo, useState } from "react";
import { motion, useTransform } from "framer-motion";
import { rng } from "../rough.js";
import { useTrain } from "./context.js";
import { blob, ridge, ridgePts, smooth } from "./draw.js";
import { at, BIRDS, GAP } from "./world.js";

// Everything outside the window, back to front. Each layer slides at its own speed.

const wuCalc = (n) => `calc(${n} * var(--wu))`;

// A layer of one-off things. Its origin sits at the middle of the window.
export function Layer({ depth, className = "", children }) {
  const { engine, wu } = useTrain();
  const x = useTransform(() => -engine.pos.get() * depth * wu.get());
  return (
    <motion.div className={`layer ${className}`} style={{ x }}>
      {children}
    </motion.div>
  );
}

// A layer that repeats forever: one tile drawn several times, shifted modulo its width.
// `anchor` is the tile x that sits mid-window when the train is at the first stop.
function Loop({ depth, tile, anchor = 0, className = "", children }) {
  const { engine, wu, viewU, viewUnits } = useTrain();
  const x = useTransform(() => {
    const o = engine.pos.get() * depth + anchor - viewU.get() / 2;
    return -((((o % tile) + tile) % tile) * wu.get());
  });
  const n = Math.ceil(viewUnits / tile) + 1;
  return (
    <motion.div className={`layer-loop ${className}`} style={{ x }}>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="tile" style={{ left: wuCalc(i * tile), width: wuCalc(tile) }}>
          <svg viewBox={`0 0 ${tile} 600`} preserveAspectRatio="none" aria-hidden="true">
            {children}
          </svg>
        </div>
      ))}
    </motion.div>
  );
}

// A one-off drawing placed in a Layer: x is its centre, y its top, in world units.
function Prop({ x, y, w, h, className = "", children, style }) {
  return (
    <svg
      className={`prop ${className}`}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
      style={{ left: wuCalc(x - w / 2), top: wuCalc(y), width: wuCalc(w), height: wuCalc(h), ...style }}
    >
      {children}
    </svg>
  );
}

const ink = { fill: "none", stroke: "var(--ink)", strokeLinecap: "round", strokeLinejoin: "round" };

// Hatch patterns in the scenery's own ink, so they turn to chalk at night.
export function SceneDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <pattern id="s-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="var(--ink)" strokeWidth="0.6" />
        </pattern>
        <pattern id="s-hatch-wide" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)">
          <line x1="0" y1="0" x2="0" y2="9" stroke="var(--ink)" strokeWidth="0.6" />
        </pattern>
        <pattern id="s-cross" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="var(--ink)" strokeWidth="0.55" />
          <line x1="0" y1="0" x2="4" y2="0" stroke="var(--ink)" strokeWidth="0.55" />
        </pattern>
        <pattern id="s-wave" width="16" height="7" patternUnits="userSpaceOnUse">
          <path d="M0,4 Q4,1 8,4 T16,4" fill="none" stroke="var(--ink)" strokeWidth="0.6" />
        </pattern>
      </defs>
    </svg>
  );
}

// ---------- small things ----------

function Tree({ x, y, s = 1, seed = 1, fill = "var(--leaf)" }) {
  const R = 20 * s;
  const d = blob(seed, R, R * 1.08);
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M0,2 V${-R * 1.2} M0,${-R * 0.7} l${R * 0.4},${-R * 0.5}`} {...ink} strokeWidth={1.4 * s} />
      <g transform={`translate(0 ${-R * 1.9})`}>
        <path d={d} fill={fill} stroke="var(--ink)" strokeWidth="1" />
        <path d={d} fill="url(#s-hatch)" opacity="0.3" transform="scale(0.8) translate(4 3)" />
      </g>
    </g>
  );
}

function Pine({ x, y, s = 1 }) {
  const w = 15 * s;
  const h = 22 * s;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M0,2 V${-h * 0.5}`} {...ink} strokeWidth={1.3 * s} />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${-w * (1 - i * 0.22)},${-h * (0.35 + i * 0.6)} L0,${-h * (1.25 + i * 0.6)} L${w * (1 - i * 0.22)},${-h * (0.35 + i * 0.6)} Z`}
          fill="var(--pine)"
          stroke="var(--ink)"
          strokeWidth="0.9"
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}

function House({ x, y, w = 40, h = 26, roof = "var(--roof)", chimney = true }) {
  return (
    <g transform={`translate(${x} ${y})`} strokeLinejoin="round">
      {chimney && <rect x={w * 0.62} y={-h - w * 0.36} width={w * 0.12} height={w * 0.24} fill="var(--wallwash)" stroke="var(--ink)" strokeWidth="0.8" />}
      <rect x="0" y={-h} width={w} height={h} fill="var(--wallwash)" stroke="var(--ink)" strokeWidth="0.9" />
      <path d={`M${-w * 0.08},${-h} L${w / 2},${-h - w * 0.42} L${w * 1.08},${-h} Z`} fill={roof} stroke="var(--ink)" strokeWidth="0.9" />
      <path d={`M${w / 2},${-h - w * 0.42} L${w * 1.08},${-h} L${w * 0.7},${-h} Z`} fill="url(#s-hatch)" opacity="0.35" />
      <rect className="pane" x={w * 0.14} y={-h * 0.72} width={w * 0.2} height={h * 0.32} stroke="var(--ink)" strokeWidth="0.6" />
      <rect className="pane" x={w * 0.66} y={-h * 0.72} width={w * 0.2} height={h * 0.32} stroke="var(--ink)" strokeWidth="0.6" />
      <rect x={w * 0.42} y={-h * 0.56} width={w * 0.17} height={h * 0.56} fill="var(--roof)" stroke="var(--ink)" strokeWidth="0.6" />
    </g>
  );
}

function Tuft({ x, y, s = 1 }) {
  return <path d={`M${x - 4 * s},${y} l${-2 * s},${-8 * s} M${x},${y} l${0.5 * s},${-11 * s} M${x + 4 * s},${y} l${3 * s},${-8 * s}`} {...ink} strokeWidth="0.9" />;
}

function Poppy({ x, y }) {
  return (
    <g>
      <path d={`M${x},${y} q1,-6 0,-11`} {...ink} strokeWidth="0.7" />
      <circle cx={x} cy={y - 12} r="3.1" fill="var(--poppy)" stroke="var(--ink)" strokeWidth="0.5" />
    </g>
  );
}

// ---------- repeating tiles ----------

const FAR_W = 2400;
const farA = ridge(11, FAR_W, 352, 52);
const farB = ridge(23, FAR_W, 404, 34);
const FAR_A = smooth(ridgePts(farA, FAR_W));
const FAR_B = smooth(ridgePts(farB, FAR_W));
const FAR_TREES = (() => {
  const r = rng(5);
  return Array.from({ length: 34 }, () => {
    const x = r() * FAR_W;
    return { x, y: farB(x) + 1, s: 0.45 + r() * 0.3, pine: r() > 0.55, seed: 1 + ((r() * 99) | 0) };
  });
})();

const FarHills = memo(function FarHills() {
  return (
    <Loop depth={0.1} tile={FAR_W}>
      <path d={`${FAR_A} L${FAR_W + 1},600 L-1,600 Z`} fill="var(--hill-1)" />
      <path d={FAR_A} {...ink} strokeWidth="0.9" opacity="0.6" />
      <path d={`${FAR_B} L${FAR_W + 1},600 L-1,600 Z`} fill="var(--hill-2)" />
      <path d={`${FAR_B} L${FAR_W + 1},600 L-1,600 Z`} fill="url(#s-hatch-wide)" opacity="0.14" />
      <path d={FAR_B} {...ink} strokeWidth="1" opacity="0.75" />
      {FAR_TREES.map((t, i) => (t.pine ? <Pine key={i} {...t} /> : <Tree key={i} {...t} fill="var(--hill-3)" />))}
    </Loop>
  );
});

const MID_W = 1800;
const midY = ridge(41, MID_W, 446, 20);
const MID = smooth(ridgePts(midY, MID_W));
const MID_STUFF = (() => {
  const r = rng(77);
  const out = [];
  for (let x = 40; x < MID_W - 40; x += 46 + r() * 90) {
    const k = r();
    out.push({ x, y: midY(x) + 2, kind: k < 0.2 ? "house" : k < 0.55 ? "pine" : "tree", s: 0.75 + r() * 0.45, seed: 1 + ((r() * 99) | 0), w: 30 + r() * 16 });
  }
  return out;
})();
// furrows in the fields below the ridge
const FURROWS = Array.from({ length: 9 }, (_, i) => {
  const x = 60 + i * 200;
  return `M${x},${midY(x) + 12} q${28},${22} ${70},${50}`;
}).join(" ");

const MidFields = memo(function MidFields() {
  return (
    <Loop depth={0.28} tile={MID_W}>
      <path d={`${MID} L${MID_W + 1},600 L-1,600 Z`} fill="var(--hill-3)" />
      <path d={FURROWS} {...ink} strokeWidth="0.7" opacity="0.35" />
      <path d={MID} {...ink} strokeWidth="1.1" />
      {MID_STUFF.map((t, i) =>
        t.kind === "house" ? (
          <House key={i} x={t.x} y={t.y} w={t.w} h={t.w * 0.62} />
        ) : t.kind === "pine" ? (
          <Pine key={i} x={t.x} y={t.y} s={t.s} />
        ) : (
          <Tree key={i} x={t.x} y={t.y} s={t.s} seed={t.seed} />
        ),
      )}
    </Loop>
  );
});

const FIELD_W = 1500;
const fieldY = ridge(63, FIELD_W, 492, 9);
const FIELD = smooth(ridgePts(fieldY, FIELD_W));
const FIELD_TREES = (() => {
  const r = rng(19);
  const out = [];
  for (let x = 90; x < FIELD_W - 60; x += 150 + r() * 210) out.push({ x, y: fieldY(x) + 3, s: 1.5 + r() * 0.7, seed: 3 + ((r() * 99) | 0), pine: r() > 0.7 });
  return out;
})();
const FENCE = (() => {
  let d = "";
  for (let x = 20; x < FIELD_W; x += 48) d += `M${x},${fieldY(x) + 4} v-17 `;
  return d;
})();
const FENCE_RAIL = smooth(ridgePts((x) => fieldY(x) - 8, FIELD_W, 50)) + " " + smooth(ridgePts((x) => fieldY(x) - 2, FIELD_W, 50));

const Field = memo(function Field() {
  return (
    <Loop depth={0.55} tile={FIELD_W}>
      <path d={`${FIELD} L${FIELD_W + 1},600 L-1,600 Z`} fill="var(--field)" />
      <path d={FIELD} {...ink} strokeWidth="1.1" />
      <path d={FENCE} {...ink} strokeWidth="1.3" opacity="0.8" />
      <path d={FENCE_RAIL} {...ink} strokeWidth="0.8" opacity="0.7" />
      {FIELD_TREES.map((t, i) => (t.pine ? <Pine key={i} x={t.x} y={t.y} s={t.s * 1.2} /> : <Tree key={i} {...t} />))}
    </Loop>
  );
});

const GROUND_Y = 530;
const GROUND_BITS = (() => {
  const r = rng(101);
  return Array.from({ length: 46 }, () => ({ x: r() * GAP, y: GROUND_Y + 6 + r() * 60, s: 0.8 + r() * 0.9, poppy: r() > 0.72 }));
})();
const GROUND_LINE = smooth(ridgePts((x) => GROUND_Y + Math.sin((x / GAP) * Math.PI * 4) * 2.5, GAP, 60));

const Ground = memo(function Ground() {
  return (
    <Loop depth={1} tile={GAP}>
      <path d={`${GROUND_LINE} L${GAP + 1},600 L-1,600 Z`} fill="var(--ground)" />
      <path d={`${GROUND_LINE} L${GAP + 1},600 L-1,600 Z`} fill="url(#s-hatch-wide)" opacity="0.12" />
      <path d={GROUND_LINE} {...ink} strokeWidth="1.3" />
      {GROUND_BITS.map((b, i) => (b.poppy ? <Poppy key={i} x={b.x} y={b.y} /> : <Tuft key={i} x={b.x} y={b.y} s={b.s} />))}
    </Loop>
  );
});

// Poles sit 450 units either side of centre at every stop, framing whatever is there.
const POLE_W = 900;
const WIRE_DROP = [34, 38, 30];
const wirePath = (y0, drop) => `M450,${y0} Q900,${y0 + drop * 2} 1350,${y0}`;
const BUSHES = (() => {
  const r = rng(33);
  return Array.from({ length: 5 }, (_, i) => ({ x: 60 + i * 180 + r() * 80, rx: 40 + r() * 34, seed: 7 + i }));
})();

const Poles = memo(function Poles() {
  const { engine } = useTrain();
  // the wires bounce a little as the train clatters past
  const scaleY = useTransform(() => 1 + Math.sin(engine.pos.get() / 70) * 0.05 * Math.min(1, Math.abs(engine.vel.get()) / 700));
  return (
    <Loop depth={1.5} tile={POLE_W}>
      <motion.g style={{ scaleY, transformOrigin: "0px 60px" }}>
        {WIRE_DROP.map((d, i) => (
          <path key={i} d={wirePath(58 + i * 13, d)} {...ink} strokeWidth="1" opacity="0.85" />
        ))}
      </motion.g>
      <g filter="url(#pencil)">
        <path d="M444,600 L446,34 H454 L457,600 Z" fill="var(--wood)" stroke="var(--ink)" strokeWidth="1.2" />
        <path d="M451,40 L454,600" stroke="var(--ink)" strokeWidth="0.5" opacity="0.5" />
        <rect x="412" y="52" width="76" height="7" fill="var(--wood)" stroke="var(--ink)" strokeWidth="1" />
        <rect x="424" y="78" width="52" height="6" fill="var(--wood)" stroke="var(--ink)" strokeWidth="1" />
        <path d="M430,78 L448,59 M470,78 L452,59" {...ink} strokeWidth="0.8" />
        {[418, 450, 482].map((x) => (
          <rect key={x} x={x - 2.5} y="45" width="5" height="8" rx="2" fill="var(--wallwash)" stroke="var(--ink)" strokeWidth="0.7" />
        ))}
      </g>
      {BUSHES.map((b) => (
        <g key={b.seed} transform={`translate(${b.x} 598)`}>
          <path d={blob(b.seed, b.rx, 24, 10, 0.3)} fill="var(--bush)" stroke="var(--ink)" strokeWidth="1.1" />
          <path d={blob(b.seed, b.rx * 0.7, 15, 10, 0.3)} fill="url(#s-hatch)" opacity="0.3" transform="translate(6 3)" />
        </g>
      ))}
    </Loop>
  );
});

const BLADES = (() => {
  const r = rng(909);
  const out = [];
  for (let x = 0; x < 1300; x += 13 + r() * 30) {
    const h = 26 + r() * 54;
    const lean = (r() - 0.5) * 34;
    out.push(`M${x},604 Q${x + lean * 0.2},${600 - h * 0.6} ${x + lean},${600 - h} Q${x + lean * 0.5 + 5},${600 - h * 0.5} ${x + 8},604 Z`);
  }
  return out.join(" ");
})();

const Foreground = memo(function Foreground() {
  return (
    <Loop depth={2.5} tile={1300} className="foreground">
      <path d={BLADES} fill="var(--blade)" />
      <g>
        <rect x="640" y="548" width="13" height="56" fill="var(--wallwash)" stroke="var(--ink)" strokeWidth="1.2" />
        <rect x="640" y="548" width="13" height="12" fill="var(--poppy)" stroke="var(--ink)" strokeWidth="1.2" />
      </g>
    </Loop>
  );
});

// ---------- sky ----------

const CLOUD = "M14,44 C2,44 0,30 12,27 C10,14 28,8 36,18 C42,4 66,4 70,20 C82,14 96,24 90,34 C100,36 98,46 88,45 Z";
const CLOUDS = [
  { x: -520, y: 60, s: 1.5, d: 0 },
  { x: -120, y: 128, s: 0.9, d: -22 },
  { x: 260, y: 46, s: 1.2, d: -40 },
  { x: 640, y: 150, s: 0.75, d: -9 },
  { x: 980, y: 80, s: 1.35, d: -31 },
  { x: 1380, y: 120, s: 1, d: -15 },
];

const STARS = (() => {
  const r = rng(404);
  return Array.from({ length: 46 }, () => ({ x: r() * 100, y: r() * 52, s: 1 + r() * 2, d: r() * -6 }));
})();

const TIME_LABEL = { dawn: "early morning", day: "daytime", dusk: "golden hour", night: "night" };

export const Sky = memo(function Sky({ time, onCycle }) {
  return (
    <>
      <div className="sky" aria-hidden="true" />
      <div className="stars" aria-hidden="true">
        {STARS.map((s, i) => (
          <span key={i} style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s` }} />
        ))}
      </div>
      <button
        type="button"
        className="sun"
        onClick={onCycle}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label={`Change the time of day (now ${TIME_LABEL[time]})`}
        title="change the time of day"
      >
        <svg viewBox="0 0 120 120" aria-hidden="true">
          {time === "night" ? (
            <g filter="url(#pencil)">
              <path d="M78,22 A40,40 0 1 0 100,84 A32,32 0 0 1 78,22 Z" fill="var(--sun)" stroke="var(--ink)" strokeWidth="1.4" />
              <path d="M52,58 q4,3 8,0 M46,46 h.1 M64,44 h.1" {...ink} strokeWidth="2" />
            </g>
          ) : (
            <>
              <g className="sun-rays" {...ink} strokeWidth="1.6">
                {Array.from({ length: 12 }, (_, i) => (
                  <path key={i} d={`M60,${i % 2 ? 12 : 6} V${i % 2 ? 20 : 19}`} transform={`rotate(${i * 30} 60 60)`} />
                ))}
              </g>
              <g filter="url(#pencil)">
                <circle cx="60" cy="60" r="30" fill="var(--sun)" stroke="var(--ink)" strokeWidth="1.4" />
                <path d="M48,66 q12,10 24,0 M50,54 h.1 M70,54 h.1" {...ink} strokeWidth="2.2" />
                <path d="M42,62 h5 M73,62 h5" stroke="var(--poppy)" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
              </g>
            </>
          )}
        </svg>
      </button>
      <Layer depth={0.035} className="clouds">
        {CLOUDS.map((c, i) => (
          <Prop key={i} x={c.x} y={c.y} w={100 * c.s} h={50 * c.s} className="cloud" style={{ animationDelay: `${c.d}s` }}>
            <svg viewBox="0 0 100 50" overflow="visible">
              <path d={CLOUD} fill="var(--cloud)" stroke="var(--ink)" strokeWidth={1.1 / c.s} strokeLinejoin="round" filter="url(#pencil)" />
              <path d="M24,38 h30 M60,32 h18" {...ink} strokeWidth={0.8 / c.s} opacity="0.5" />
            </svg>
          </Prop>
        ))}
      </Layer>
    </>
  );
});

// ---------- one-off landmarks ----------

function Windmill({ x, y }) {
  return (
    <Prop x={x} y={y} w={120} h={150}>
      <g filter="url(#pencil)">
        <path d="M46,148 L52,62 H68 L74,148 Z" fill="var(--wallwash)" stroke="var(--ink)" strokeWidth="1.1" />
        <path d="M62,62 H68 L74,148 H66 Z" fill="url(#s-hatch)" opacity="0.4" />
        <path d="M50,62 L60,46 L70,62 Z" fill="var(--roof)" stroke="var(--ink)" strokeWidth="1.1" />
        <rect x="56" y="124" width="8" height="24" fill="var(--roof)" stroke="var(--ink)" strokeWidth="0.8" />
        <rect className="pane" x="57" y="84" width="6" height="9" stroke="var(--ink)" strokeWidth="0.6" />
      </g>
      <g className="spin" style={{ transformOrigin: "60px 56px" }}>
        {[0, 90, 180, 270].map((a) => (
          <g key={a} transform={`rotate(${a} 60 56)`}>
            <path d="M60,56 V8" {...ink} strokeWidth="1.3" />
            <path d="M60,12 h13 v34 h-13" fill="var(--cloud)" stroke="var(--ink)" strokeWidth="0.9" />
            <path d="M60,23 h13 M60,34 h13 M66.5,12 v34" {...ink} strokeWidth="0.5" />
          </g>
        ))}
        <circle cx="60" cy="56" r="3" fill="var(--ink)" />
      </g>
    </Prop>
  );
}

function Balloon({ x, y }) {
  return (
    <Prop x={x} y={y} w={70} h={104} className="bob">
      <g filter="url(#pencil)">
        <path d="M35,4 C58,4 66,24 62,42 C59,56 46,66 42,74 H28 C24,66 11,56 8,42 C4,24 12,4 35,4 Z" fill="var(--cloud)" stroke="var(--ink)" strokeWidth="1.2" />
        <path d="M35,4 C46,14 48,54 42,74 H35 Z" fill="var(--poppy)" opacity="0.85" />
        <path d="M35,4 C24,14 22,54 28,74 H21 C10,50 8,20 35,4 Z" fill="var(--sun)" opacity="0.8" />
        <path d="M35,4 C58,4 66,24 62,42 C59,56 46,66 42,74 H28 C24,66 11,56 8,42 C4,24 12,4 35,4 Z M35,4 V74" {...ink} strokeWidth="1.1" />
        <path d="M29,74 L31,88 M41,74 L39,88" {...ink} strokeWidth="0.7" />
        <rect x="29" y="88" width="12" height="10" rx="1.5" fill="var(--wood)" stroke="var(--ink)" strokeWidth="1" />
      </g>
    </Prop>
  );
}

// A little Boston for the MBTA stop: the Pru, the Hancock, the Custom House clock, and the Zakim bridge.
function Boston({ x, y }) {
  const blocks = [
    [8, 96, 26, 54],
    [38, 84, 20, 66],
    [124, 100, 30, 50],
    [196, 90, 24, 60],
    [226, 106, 34, 44],
    [300, 98, 22, 52],
    [326, 110, 30, 40],
  ];
  return (
    <Prop x={x} y={y} w={520} h={150}>
      <g filter="url(#pencil)" strokeLinejoin="round">
        {blocks.map(([bx, by, bw, bh], i) => (
          <g key={i}>
            <rect x={bx} y={by} width={bw} height={bh} fill="var(--hill-2)" stroke="var(--ink)" strokeWidth="0.9" />
            <path d={`M${bx + 5},${by + 8} v${bh - 14} M${bx + bw / 2},${by + 8} v${bh - 14} M${bx + bw - 5},${by + 8} v${bh - 14}`} className="pane-line" strokeWidth="2" strokeDasharray="3 4" />
          </g>
        ))}
        {/* Prudential */}
        <rect x="64" y="34" width="34" height="116" fill="var(--wallwash)" stroke="var(--ink)" strokeWidth="1" />
        <rect x="64" y="34" width="34" height="116" fill="url(#s-hatch)" opacity="0.25" />
        <path d="M70,44 v100 M78,44 v100 M86,44 v100 M92,44 v100" className="pane-line" strokeWidth="2" strokeDasharray="3 4" />
        <path d="M81,34 V8" {...ink} strokeWidth="1.2" />
        {/* Hancock */}
        <path d="M160,150 V22 L188,30 V150 Z" fill="var(--hill-1)" stroke="var(--ink)" strokeWidth="1" />
        <path d="M160,22 L188,30 V150 H176 Z" fill="url(#s-hatch-wide)" opacity="0.4" />
        {/* Custom House tower */}
        <rect x="266" y="60" width="26" height="90" fill="var(--wallwash)" stroke="var(--ink)" strokeWidth="1" />
        <path d="M262,60 H296 L279,26 Z" fill="var(--roof)" stroke="var(--ink)" strokeWidth="1" />
        <circle cx="279" cy="74" r="7" fill="var(--cloud)" stroke="var(--ink)" strokeWidth="0.9" />
        <path d="M279,74 V69 M279,74 h4" {...ink} strokeWidth="0.9" />
        {/* Zakim bridge */}
        <path d="M372,150 L392,40 L412,150 M470,150 L486,62 L502,150" fill="none" stroke="var(--ink)" strokeWidth="2" />
        <path d="M360,126 H516" {...ink} strokeWidth="2" />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M392,${46 + i * 8} L${372 - i * 3 - 14},126 M392,${46 + i * 8} L${420 + i * 9},126`} {...ink} strokeWidth="0.55" />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M486,${68 + i * 8} L${466 - i * 6},126 M486,${68 + i * 8} L${504 + i * 3},126`} {...ink} strokeWidth="0.55" />
        ))}
      </g>
    </Prop>
  );
}

function TentAndBunting({ x, y }) {
  return (
    <Prop x={x} y={y} w={220} h={130}>
      <g filter="url(#pencil)" strokeLinejoin="round">
        <path d="M40,128 V78 L110,30 L180,78 V128 Z" fill="var(--cloud)" stroke="var(--ink)" strokeWidth="1.2" />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${54 + i * 47},128 V78 L110,30 L${77 + i * 47},78 V128 Z`} fill="var(--poppy)" opacity="0.8" />
        ))}
        <path d="M40,78 Q52,90 63,78 Q75,90 87,78 Q98,90 110,78 Q122,90 133,78 Q145,90 157,78 Q168,90 180,78" {...ink} strokeWidth="1.1" />
        <path d="M98,128 V100 Q110,88 122,100 V128" fill="var(--ink)" opacity="0.75" />
        <path d="M110,30 V8" {...ink} strokeWidth="1.2" />
        <path className="flag" d="M110,8 L130,13 L110,19 Z" fill="var(--sun)" stroke="var(--ink)" strokeWidth="0.9" />
        <path d="M0,60 Q22,74 40,78 M180,78 Q200,74 220,58" {...ink} strokeWidth="0.7" />
        {[6, 18, 30, 190, 202, 214].map((bx, i) => (
          <path key={bx} d={`M${bx - 4},${i < 3 ? 63 + i * 5 : 76 - (i - 3) * 6} l4,9 l4,-8 Z`} fill={i % 2 ? "var(--sun)" : "var(--poppy)"} stroke="var(--ink)" strokeWidth="0.6" />
        ))}
      </g>
    </Prop>
  );
}

// The clock really tells the visitor's time.
function ClockTower({ x, y }) {
  const [now] = useState(() => new Date());
  const m = now.getMinutes() * 6;
  const h = (now.getHours() % 12) * 30 + now.getMinutes() / 2;
  return (
    <Prop x={x} y={y} w={90} h={210}>
      <g filter="url(#pencil)" strokeLinejoin="round">
        <rect x="26" y="70" width="38" height="140" fill="var(--wallwash)" stroke="var(--ink)" strokeWidth="1.2" />
        <path d="M50,70 H64 V210 H54 Z" fill="url(#s-hatch)" opacity="0.35" />
        <path d="M20,70 H70 L45,14 Z" fill="var(--roof)" stroke="var(--ink)" strokeWidth="1.2" />
        <path d="M45,14 V2 M41,5 h8" {...ink} strokeWidth="1.1" />
        <circle cx="45" cy="96" r="14" fill="var(--cloud)" stroke="var(--ink)" strokeWidth="1.2" />
        {[0, 90, 180, 270].map((a) => (
          <path key={a} d="M45,84 v3" transform={`rotate(${a} 45 96)`} {...ink} strokeWidth="0.9" />
        ))}
        <rect className="pane" x="39" y="130" width="12" height="18" rx="6" stroke="var(--ink)" strokeWidth="0.8" />
        <rect x="38" y="180" width="14" height="30" rx="7" fill="var(--roof)" stroke="var(--ink)" strokeWidth="0.9" />
      </g>
      <path d="M45,96 V89" transform={`rotate(${h} 45 96)`} {...ink} strokeWidth="1.8" />
      <path d="M45,96 V85" transform={`rotate(${m} 45 96)`} {...ink} strokeWidth="1.1" />
    </Prop>
  );
}

function Lake({ x, y }) {
  return (
    <Prop x={x} y={y} w={420} h={70}>
      <ellipse cx="210" cy="46" rx="204" ry="20" fill="var(--water)" stroke="var(--ink)" strokeWidth="1" filter="url(#pencil)" />
      <ellipse cx="210" cy="46" rx="190" ry="15" fill="url(#s-wave)" opacity="0.4" />
      <g className="boat">
        <path d="M186,44 h44 l-7,9 h-30 Z" fill="var(--wood)" stroke="var(--ink)" strokeWidth="1" strokeLinejoin="round" />
        <path d="M208,44 V6 L232,38 H208" fill="var(--cloud)" stroke="var(--ink)" strokeWidth="1" strokeLinejoin="round" />
        <path d="M205,40 V12 L190,38 Z" fill="var(--poppy)" stroke="var(--ink)" strokeWidth="1" strokeLinejoin="round" opacity="0.9" />
      </g>
    </Prop>
  );
}

function Sheep({ x, y, flip }) {
  return (
    <Prop x={x} y={y} w={44} h={34} style={flip ? { scale: "-1 1" } : undefined}>
      <path d="M14,22 v10 M19,23 v9 M27,23 v9 M32,22 v10" {...ink} strokeWidth="1.4" />
      <path d={blob(8, 14, 10, 10, 0.34)} transform="translate(23 16)" fill="var(--cloud)" stroke="var(--ink)" strokeWidth="1.1" />
      <g className="graze" style={{ transformOrigin: "34px 14px" }}>
        <ellipse cx="38" cy="15" rx="5" ry="6" fill="var(--ink)" />
        <path d="M34,9 l-3,-2 M41,9 l3,-2" {...ink} strokeWidth="1.4" />
      </g>
    </Prop>
  );
}

function Crossing({ x, y }) {
  return (
    <Prop x={x} y={y} w={70} h={150}>
      <g filter="url(#pencil)">
        <rect x="32" y="20" width="6" height="130" fill="var(--wallwash)" stroke="var(--ink)" strokeWidth="1.1" />
        <path d="M32,98 h6 M32,116 h6 M32,134 h6" stroke="var(--poppy)" strokeWidth="7" />
        <g fill="var(--wallwash)" stroke="var(--ink)" strokeWidth="1">
          <rect x="6" y="14" width="58" height="9" rx="2" transform="rotate(28 35 18)" />
          <rect x="6" y="14" width="58" height="9" rx="2" transform="rotate(-28 35 18)" />
        </g>
        <path d="M18,56 H52" {...ink} strokeWidth="2" />
      </g>
      <circle className="blink-a" cx="18" cy="56" r="8" stroke="var(--ink)" strokeWidth="1.2" />
      <circle className="blink-b" cx="52" cy="56" r="8" stroke="var(--ink)" strokeWidth="1.2" />
    </Prop>
  );
}

function Scarecrow({ x, y }) {
  return (
    <Prop x={x} y={y} w={110} h={150}>
      <g filter="url(#pencil)" strokeLinejoin="round">
        <path d="M55,56 V150 M12,70 H98" {...ink} strokeWidth="2.4" />
        <path d="M22,62 H88 L92,78 H74 L78,116 H32 L36,78 H18 Z" fill="var(--poppy)" stroke="var(--ink)" strokeWidth="1.1" opacity="0.92" />
        <path d="M44,78 L46,116 M66,78 L64,116" {...ink} strokeWidth="0.6" />
        <circle cx="55" cy="44" r="16" fill="var(--sun)" stroke="var(--ink)" strokeWidth="1.2" />
        <path d="M32,32 H78 L70,26 L66,8 H44 L40,26 Z" fill="var(--wood)" stroke="var(--ink)" strokeWidth="1.1" />
        <path d="M48,42 l3,3 m0,-3 l-3,3 M59,42 l3,3 m0,-3 l-3,3 M47,51 q8,7 16,0" {...ink} strokeWidth="1.2" />
        <path d="M12,70 l-8,-5 M12,70 l-9,2 M12,70 l-7,7 M98,70 l8,-5 M98,70 l9,2 M98,70 l7,7 M36,116 l-3,9 M46,116 l0,10 M62,116 l1,10 M72,116 l4,9" {...ink} strokeWidth="0.9" />
      </g>
    </Prop>
  );
}

function TSign({ x, y }) {
  return (
    <Prop x={x} y={y} w={60} h={150}>
      <g filter="url(#pencil)">
        <rect x="27" y="50" width="6" height="100" fill="var(--wood)" stroke="var(--ink)" strokeWidth="1" />
        <circle cx="30" cy="30" r="24" fill="var(--cloud)" stroke="var(--ink)" strokeWidth="1.6" />
        <circle cx="30" cy="30" r="19.5" {...ink} strokeWidth="0.7" />
        <path d="M18,21 H42 M30,21 V43" stroke="var(--ink)" strokeWidth="5.4" />
      </g>
    </Prop>
  );
}

function Bird({ i }) {
  return (
    <g className="bird" style={{ "--i": i }} transform={`translate(${14 + i * 21} 0)`}>
      <g className="bird-fly">
        <g className="bird-sit">
          <path d="M-7,24 C-9,15 -3,9 3,10 C8,11 9,17 7,22 L12,28 L4,25 C0,27 -4,27 -7,24 Z" fill="var(--bird)" stroke="var(--ink)" strokeWidth="0.9" strokeLinejoin="round" />
          <path d="M7,14 l5,1.5 l-5,1.5" fill="var(--sun)" stroke="var(--ink)" strokeWidth="0.6" strokeLinejoin="round" />
          <circle cx="3.6" cy="14" r="0.9" fill="var(--ink)" />
          <path d="M-2,26 v4 M2,26 v4" {...ink} strokeWidth="0.7" />
        </g>
        <g className="bird-wings" {...ink} strokeWidth="1.5">
          <path className="wing-l" d="M0,18 Q-8,8 -17,13" />
          <path className="wing-r" d="M0,18 Q8,8 17,13" />
        </g>
      </g>
    </g>
  );
}

const Birds = memo(function Birds({ birdRefs }) {
  return (
    <Layer depth={1.5}>
      {BIRDS.map((b, k) => (
        <svg
          key={k}
          ref={(el) => {
            birdRefs.current[k] = el;
          }}
          className="prop flock"
          viewBox="0 0 110 40"
          aria-hidden="true"
          style={{ left: wuCalc(b.x - 14), top: wuCalc(b.y - 30), width: wuCalc(110), height: wuCalc(40) }}
        >
          {Array.from({ length: b.n }, (_, i) => (
            <Bird key={i} i={i} />
          ))}
        </svg>
      ))}
    </Layer>
  );
});

export function Landscape({ birdRefs, children }) {
  return (
    <>
      <Layer depth={0.06}>
        <Balloon x={at(2.5, 0.06, 120)} y={90} />
        <Balloon x={at(0.6, 0.06, -260)} y={150} />
      </Layer>
      <FarHills />
      <Layer depth={0.1}>
        <Windmill x={at(1, 0.1, 400)} y={farB(at(1, 0.1, 400) % FAR_W) - 140} />
      </Layer>
      <MidFields />
      <Layer depth={0.28}>
        <Lake x={at(4.5, 0.28, 0)} y={452} />
      </Layer>
      <Field />
      <Layer depth={0.55}>
        <Boston x={at(2, 0.55, 40)} y={346} />
        <TentAndBunting x={at(3, 0.55, 400)} y={372} />
        <ClockTower x={at(4, 0.55, -370)} y={292} />
        <Sheep x={at(3.5, 0.55, -60)} y={476} />
        <Sheep x={at(3.5, 0.55, 20)} y={484} flip />
        <Sheep x={at(3.5, 0.55, 150)} y={474} />
        <Sheep x={at(1.5, 0.55, 90)} y={480} flip />
      </Layer>
      <Ground />
      <Layer depth={1}>
        <Crossing x={GAP * 0.5} y={GROUND_Y - 142} />
        <Scarecrow x={GAP * 1 - 430} y={GROUND_Y - 138} />
        <TSign x={GAP * 2 + 330} y={GROUND_Y - 142} />
      </Layer>
      {children}
      <Poles />
      <Birds birdRefs={birdRefs} />
      <Foreground />
    </>
  );
}
