import { memo } from "react";
import { ArrowUpRight } from "lucide-react";
import { Cover } from "../sketch.jsx";
import { rng, roughLine, roughRect } from "../rough.js";
import { GAP, GROUND } from "./world.js";

const wuCalc = (n) => `calc(${n} * var(--wu))`;
const ink = { fill: "none", stroke: "var(--ink)", strokeLinecap: "round", strokeLinejoin: "round" };

// Cover for the last stop: a letter with a heart seal, and a waving hand.
function CoverHello() {
  return (
    <svg viewBox="0 0 240 300" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <g {...ink} strokeWidth="1.3" filter="url(#pencil)">
        <rect x="30" y="120" width="180" height="120" rx="4" fill="var(--canvas)" />
        <path d="M30,124 L120,196 L210,124" />
        <path d="M30,238 L98,178 M210,238 L142,178" strokeWidth="0.9" />
        <path d="M120,214 C104,200 100,186 110,182 C116,180 120,186 120,190 C120,186 124,180 130,182 C140,186 136,200 120,214 Z" fill="var(--accent)" strokeWidth="1" />
        <path d="M150,132 h44 v30 h-44 Z" fill="url(#h-sparse)" strokeWidth="0.8" />
        <path d="M52,140 h50 M52,150 h36" strokeWidth="0.8" />
        {/* waving hand */}
        <g className="wave" style={{ transformOrigin: "120px 100px" }}>
          <path d="M96,96 C92,70 96,52 102,52 C108,52 108,64 108,74 C108,56 110,38 117,38 C124,38 123,58 122,72 C124,54 128,42 134,43 C141,45 137,64 135,76 C138,64 143,56 148,58 C154,61 148,78 144,92 C140,106 130,112 118,112 C106,112 98,106 96,96 Z" fill="var(--canvas)" />
          <path d="M96,96 C88,88 82,80 86,76 C90,72 98,80 104,88" fill="var(--canvas)" />
        </g>
        <path d="M160,36 q8,6 6,16 M172,30 q12,10 9,26 M74,42 q-7,6 -5,15" strokeWidth="1" />
      </g>
    </svg>
  );
}

// The printed sheet pasted on a billboard. Rendered once on the board and once more as the
// sheet that peels off and flies to the screen.
export function PosterFace({ project }) {
  return (
    <div className={`poster-face poster-${project.id}`}>
      <div className="poster-art">{project.id === "about" ? <CoverHello /> : <Cover project={project} />}</div>
      <div className="poster-copy">
        <p className="poster-no">{project.stopLine}</p>
        <p className="poster-title font-display">{project.title}</p>
        <p className="poster-rule" />
        <p className="poster-meta">{project.meta}</p>
      </div>
    </div>
  );
}

const BOARD = (() => {
  const r = rng(52);
  return {
    outer: roughRect(14, 62, 352, 220, r, { over: 5 }),
    inner: roughRect(24, 71, 332, 202, r, { over: 2 }),
    planks: [118, 174, 230].map((y) => roughLine(16, y, 364, y, r, { over: 0 })).join(" "),
    legs: [roughRect(92, 282, 13, 142, r), roughRect(275, 282, 13, 142, r)].join(" "),
    brace: [roughLine(105, 300, 275, 392, r), roughLine(275, 300, 105, 392, r), roughLine(84, 292, 296, 292, r)].join(" "),
  };
})();

const LAMPS = [95, 190, 285];

export const Billboard = memo(function Billboard({ project, index, here, hidden, onOpen, onFocusStop, children }) {
  return (
    <div
      className={`bb ${here ? "is-here" : ""}`}
      data-stop={project.id}
      style={{ left: wuCalc(index * GAP - 190), top: wuCalc(GROUND - 420), width: wuCalc(380), height: wuCalc(420) }}
    >
      <svg viewBox="0 0 380 420" className="bb-art" aria-hidden="true">
        {/* legs + bracing */}
        <g filter="url(#pencil)">
          <path d="M92,282 h13 v142 h-13 Z M275,282 h13 v142 h-13 Z" fill="var(--wood)" />
          <path d="M99,282 h6 v142 h-6 Z M282,282 h6 v142 h-6 Z" fill="url(#s-hatch)" opacity="0.5" />
          <path d={BOARD.legs} {...ink} strokeWidth="1.3" />
          <path d={BOARD.brace} {...ink} strokeWidth="1.1" />
        </g>
        {/* the board */}
        <g filter="url(#pencil)">
          <rect x="14" y="62" width="352" height="220" fill="var(--wood)" />
          <path d={BOARD.planks} {...ink} strokeWidth="0.6" opacity="0.5" />
          <path d="M14,270 H366 V282 H14 Z M354,62 H366 V282 H354 Z" fill="url(#s-hatch)" opacity="0.5" />
          <path d={BOARD.outer} {...ink} strokeWidth="1.6" />
          <path d={BOARD.inner} {...ink} strokeWidth="0.8" opacity="0.7" />
        </g>
        {/* what's left when the poster is off: paste marks */}
        <path d="M60,110 q60,-14 120,6 t130,-4 M56,160 q80,16 150,-4 t110,10 M70,214 q70,-12 130,2 t120,-6" {...ink} strokeWidth="6" opacity="0.07" />
        {/* gooseneck lamps */}
        {LAMPS.map((x, i) => (
          <g key={x}>
            <path className="lamp-cone" style={{ "--d": `${i * 70}ms` }} d={`M${x - 9},36 L${x - 62},250 H${x + 62} L${x + 9},36 Z`} />
            <g filter="url(#pencil)">
              <path d={`M${x},62 V30 Q${x},14 ${x + 1},20`} {...ink} strokeWidth="1.3" />
              <path d={`M${x - 11},36 Q${x},14 ${x + 11},36 Z`} fill="var(--lampshade)" stroke="var(--ink)" strokeWidth="1.1" strokeLinejoin="round" />
            </g>
            <ellipse className="lamp-bulb" style={{ "--d": `${i * 70}ms` }} cx={x} cy="37" rx="6" ry="2.6" />
          </g>
        ))}
      </svg>

      <button
        type="button"
        className="poster"
        aria-label={project.kind === "about" ? "Open About and contact" : `Open ${project.title}: ${project.meta}`}
        style={hidden ? { visibility: "hidden" } : undefined}
        onClick={() => onOpen(project.id)}
        onFocus={(e) => e.currentTarget.matches(":focus-visible") && onFocusStop(index)}
      >
        <PosterFace project={project} />
        <span className="poster-curl" aria-hidden="true" />
      </button>
      {/* tape that stays on the board */}
      {["tl", "tr", "bl", "br"].map((c) => (
        <span key={c} className={`bb-tape bb-tape-${c}`} aria-hidden="true" />
      ))}

      <div className="bb-callout font-hand" aria-hidden="true">
        <svg viewBox="0 0 40 46">
          <path d="M30,44 C34,30 26,18 12,10 M12,10 l11,0 M12,10 l3,10" {...ink} strokeWidth="2" pathLength="1" />
        </svg>
        <span>{project.callout}</span>
      </div>
      {children}
    </div>
  );
});

// ---------- first stop: the station nameboard ----------

const SIGN = (() => {
  const r = rng(8);
  return { outer: roughRect(10, 46, 420, 196, r, { over: 5 }), inner: roughRect(20, 56, 400, 176, r, { over: 2 }) };
})();

export const Station = memo(function Station() {
  return (
    <>
      <div className="station" style={{ left: wuCalc(-220), top: wuCalc(GROUND - 400), width: wuCalc(440), height: wuCalc(400) }}>
        <svg viewBox="0 0 440 400" className="bb-art" aria-hidden="true">
          <g filter="url(#pencil)">
            <path d="M52,242 h14 v162 h-14 Z M374,242 h14 v162 h-14 Z" fill="var(--wood)" />
            <path d="M60,242 h6 v162 h-6 Z M382,242 h6 v162 h-6 Z" fill="url(#s-hatch)" opacity="0.5" />
            <path d="M52,242 v162 M66,242 v162 M374,242 v162 M388,242 v162" {...ink} strokeWidth="1.2" />
            {/* little roof */}
            <path d="M-6,46 L220,6 L446,46 L446,54 L220,16 L-6,54 Z" fill="var(--roofwash)" stroke="var(--ink)" strokeWidth="1.3" strokeLinejoin="round" />
            <path d="M220,6 V-12 M212,-12 h16" {...ink} strokeWidth="1.3" />
            <rect x="10" y="46" width="420" height="196" fill="var(--signpaper)" />
            <path d="M10,230 H430 V242 H10 Z" fill="url(#s-hatch)" opacity="0.4" />
            <path d={SIGN.outer} {...ink} strokeWidth="1.7" />
            <path d={SIGN.inner} {...ink} strokeWidth="0.8" opacity="0.7" />
            {/* hanging flower baskets */}
            {[30, 410].map((x) => (
              <g key={x} className="sway-slow" style={{ transformOrigin: `${x}px 242px` }}>
                <path d={`M${x},242 V268`} {...ink} strokeWidth="0.9" />
                <path d={`M${x - 14},268 h28 l-5,16 h-18 Z`} fill="var(--wood)" stroke="var(--ink)" strokeWidth="1" />
                <circle cx={x - 8} cy="264" r="5" fill="var(--poppy)" stroke="var(--ink)" strokeWidth="0.7" />
                <circle cx={x + 3} cy="261" r="5.5" fill="var(--sun)" stroke="var(--ink)" strokeWidth="0.7" />
                <circle cx={x + 11} cy="266" r="4" fill="var(--poppy)" stroke="var(--ink)" strokeWidth="0.7" />
              </g>
            ))}
          </g>
        </svg>
        <div className="station-copy">
          <p className="station-kicker">Now boarding · Portfolio</p>
          <h1 className="station-name font-display">
            Fiora <span className="italic">Xu</span>
          </h1>
          <p className="station-line">
            <span>Computer Science</span>
            <i />
            <span>Human-Centered Computing</span>
          </p>
          <p className="station-sub font-serif">Northeastern University. I care about how products work, and how they feel to use.</p>
        </div>
      </div>
      {/* chalk board on the platform */}
      <div className="aframe font-hand" style={{ left: wuCalc(300), top: wuCalc(GROUND - 150), width: wuCalc(130), height: wuCalc(156) }} aria-hidden="true">
        <svg viewBox="0 0 130 156" className="bb-art">
          <g filter="url(#pencil)">
            <path d="M18,8 H112 L122,150 H8 Z" fill="var(--chalkboard)" stroke="var(--ink)" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M8,150 l-4,6 M122,150 l4,6" {...ink} strokeWidth="1.5" />
          </g>
        </svg>
        <p>
          scroll
          <br />
          to ride
          <br />
          <span>⟶</span>
        </p>
      </div>
    </>
  );
});

// ---------- last stop: buffers, lantern, and a shingle with the contact links ----------

export const Terminus = memo(function Terminus({ index, onRideBack }) {
  const x = index * GAP;
  const stop = (e) => e.stopPropagation();
  return (
    <>
      <div className="shingle" style={{ left: wuCalc(x - 124), top: wuCalc(GROUND - 76), width: wuCalc(248) }}>
        <a href="mailto:msfiora@gmail.com" onPointerDown={stop}>
          msfiora@gmail.com
        </a>
        <a href="https://www.linkedin.com/in/fiora-xu-17b00223a" target="_blank" rel="noreferrer" onPointerDown={stop}>
          LinkedIn <ArrowUpRight size="0.9em" strokeWidth={1.6} />
        </a>
      </div>
      <svg className="prop buffer" viewBox="0 0 200 190" aria-hidden="true" style={{ left: wuCalc(x + 240), top: wuCalc(GROUND - 172), width: wuCalc(200), height: wuCalc(190) }}>
        <g filter="url(#pencil)" strokeLinejoin="round">
          <path d="M30,180 L64,96 H150 V180 M64,96 L150,180 M30,180 H170" {...ink} strokeWidth="3" />
          <rect x="40" y="82" width="124" height="22" rx="3" fill="var(--poppy)" stroke="var(--ink)" strokeWidth="1.4" />
          <path d="M62,82 l-10,22 M92,82 l-10,22 M122,82 l-10,22 M152,82 l-10,22" stroke="var(--signpaper)" strokeWidth="7" />
          <rect x="40" y="82" width="124" height="22" rx="3" {...ink} strokeWidth="1.4" />
          <circle cx="34" cy="93" r="9" fill="var(--wood)" stroke="var(--ink)" strokeWidth="1.3" />
          {/* lantern on a hook */}
          <path d="M150,96 V40 Q150,26 136,26 H128 V36" {...ink} strokeWidth="1.6" />
          <g className="sway-slow" style={{ transformOrigin: "128px 36px" }}>
            <path d="M120,44 h16 l3,24 h-22 Z" className="lantern-glass" stroke="var(--ink)" strokeWidth="1.1" />
            <path d="M118,44 h20 l-4,-8 h-12 Z M116,68 h24 v5 h-24 Z" fill="var(--ink)" />
          </g>
        </g>
        <circle className="lantern-glow" cx="128" cy="56" r="34" />
      </svg>
      <button
        type="button"
        className="rideback font-hand"
        style={{ left: wuCalc(x + 196), top: wuCalc(GROUND - 262), width: wuCalc(190) }}
        onPointerDown={stop}
        onClick={onRideBack}
      >
        <span>end of the line!</span>
        <span className="rideback-go">ride back to the start ↺</span>
      </button>
    </>
  );
});
