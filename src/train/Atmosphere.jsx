import { memo } from "react";
import { rng } from "../rough.js";
import { THEMES } from "./themes.js";

// What drifts past the glass in each mood: snowflakes, sparkles and shooting stars, butterflies
// by day and fireflies by night. All of it is CSS animation, so it costs nothing while riding.

const r = rng(77);
const FLAKES = Array.from({ length: 46 }, () => ({ x: r() * 100, s: 3 + r() * 5, d: -r() * 12, t: 7 + r() * 8, sway: 10 + r() * 26 }));
const SPARKLES = Array.from({ length: 22 }, () => ({ x: r() * 100, y: r() * 27, s: 8 + r() * 14, d: -r() * 5, t: 2.4 + r() * 2.6, c: r() }));
// hearts rise along the edges of the window, clear of the billboard in the middle
const HEARTS = Array.from({ length: 4 }, (_, i) => ({ x: [3, 12, 84, 93][i] + r() * 4, d: -r() * 14, t: 13 + r() * 6, s: 12 + r() * 8 }));
const FLIES = Array.from({ length: 14 }, () => ({ x: r() * 100, y: 48 + r() * 44, d: -r() * 6, t: 4 + r() * 4 }));
const BUTTERFLIES = [
  { y: 58, d: 0, t: 26, c: "#ff8fb1", s: 1 },
  { y: 70, d: -9, t: 32, c: "#ffd23f", s: 0.8 },
  { y: 46, d: -17, t: 38, c: "#ffffff", s: 0.7 },
];

const SPARK = "M10,0 C10.8,6.5 13.5,9.2 20,10 C13.5,10.8 10.8,13.5 10,20 C9.2,13.5 6.5,10.8 0,10 C6.5,9.2 9.2,6.5 10,0 Z";
const HEART = "M10,17 C2,11 1,5 5,3 C7.5,1.8 9.5,3.4 10,5 C10.5,3.4 12.5,1.8 15,3 C19,5 18,11 10,17 Z";

function Butterfly({ b }) {
  return (
    <span className="butterfly" style={{ top: `${b.y}%`, animationDuration: `${b.t}s`, animationDelay: `${b.d}s` }}>
      <span className="butterfly-bob">
        <svg viewBox="0 0 30 22" style={{ width: 30 * b.s, height: 22 * b.s }}>
          <g className="wing wing-l">
            <path d="M15,11 C9,-1 0,1 2,9 C3,13 9,13 15,11 Z M15,11 C8,12 4,17 7,20 C10,22 14,17 15,11 Z" fill={b.c} stroke="var(--scene-ink)" strokeWidth="0.9" strokeLinejoin="round" />
          </g>
          <g className="wing wing-r">
            <path d="M15,11 C21,-1 30,1 28,9 C27,13 21,13 15,11 Z M15,11 C22,12 26,17 23,20 C20,22 16,17 15,11 Z" fill={b.c} stroke="var(--scene-ink)" strokeWidth="0.9" strokeLinejoin="round" />
          </g>
          <path d="M15,6 V17" stroke="var(--scene-ink)" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
    </span>
  );
}

export const Atmosphere = memo(function Atmosphere({ theme }) {
  if (theme === "snow") {
    return (
      <div className="atmo atmo-snow" aria-hidden="true">
        {FLAKES.map((f, i) => (
          <span key={i} className="flake" style={{ left: `${f.x}%`, width: f.s, height: f.s, animationDuration: `${f.t}s`, animationDelay: `${f.d}s`, "--sway": `${f.sway}px` }} />
        ))}
        <div className="frost" />
      </div>
    );
  }
  if (theme === "fantasy") {
    return (
      <div className="atmo atmo-fantasy" aria-hidden="true">
        {SPARKLES.map((s, i) => (
          <svg key={i} className="sparkle" viewBox="0 0 20 20" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDuration: `${s.t}s`, animationDelay: `${s.d}s` }}>
            <path d={SPARK} fill={s.c > 0.6 ? "var(--spark-a)" : "var(--spark-b)"} />
          </svg>
        ))}
        {HEARTS.map((h, i) => (
          <svg key={i} className="floaty" viewBox="0 0 20 20" style={{ left: `${h.x}%`, width: h.s, height: h.s, animationDuration: `${h.t}s`, animationDelay: `${h.d}s` }}>
            <path d={HEART} fill="var(--spark-c)" stroke="var(--scene-ink)" strokeWidth="1" strokeLinejoin="round" />
          </svg>
        ))}
        <span className="shooting shooting-a" />
        <span className="shooting shooting-b" />
      </div>
    );
  }
  if (theme === "sunny") {
    return (
      <div className="atmo atmo-sunny" aria-hidden="true">
        <div className="sunbeams" />
        <div className="by-day">
          {BUTTERFLIES.map((b, i) => (
            <Butterfly key={i} b={b} />
          ))}
        </div>
        <div className="by-night">
          {FLIES.map((f, i) => (
            <span key={i} className="firefly" style={{ left: `${f.x}%`, top: `${f.y}%`, animationDuration: `${f.t}s, ${f.t * 2.3}s`, animationDelay: `${f.d}s` }} />
          ))}
        </div>
      </div>
    );
  }
  return null;
});

// A sun shower leaves a rainbow behind it. Sits inside the rain, so it fades in and out with it.
export function Rainbow() {
  return (
    <svg className="rainbow" viewBox="0 0 400 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      {["#f2695c", "#f7a14a", "#f6d64e", "#7fcf7a", "#6fb7ea", "#b08fe6"].map((c, i) => (
        <path key={c} d={`M${30 + i * 9},200 A${170 - i * 9},${170 - i * 9} 0 0 1 ${370 - i * 9},200`} fill="none" stroke={c} strokeWidth="9.5" />
      ))}
    </svg>
  );
}

// The mood picker: four paint dabs on the cabin wall.
export function MoodPicker({ theme, onPick }) {
  const current = THEMES.find((t) => t.id === theme) || THEMES[0];
  return (
    <div className="moods" role="group" aria-label="Mood">
      <span className="moods-label font-hand" aria-hidden="true">
        mood:
      </span>
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`mood ${t.id === theme ? "is-on" : ""}`}
          style={{ "--dab-a": t.dab[0], "--dab-b": t.dab[1] }}
          aria-pressed={t.id === theme}
          aria-label={t.label}
          title={t.label}
          onClick={() => onPick(t.id)}
        />
      ))}
      <span key={current.id} className="moods-name font-hand" aria-hidden="true">
        {current.label}
      </span>
    </div>
  );
}
