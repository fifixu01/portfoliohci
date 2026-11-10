import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Cover } from "../sketch.jsx";
import { CoffeeSurface } from "./coffee.jsx";
import { u } from "./units.js";

const forever = (duration, opts = {}) => ({ duration, repeat: Infinity, ease: "easeInOut", ...opts });

// Run `fn` at random intervals between min and max ms (for the occasional, unscheduled-feeling events).
function useEvery(min, max, fn, off) {
  const fnRef = useRef(fn);
  useLayoutEffect(() => {
    fnRef.current = fn;
  });
  useEffect(() => {
    if (off) return;
    let t;
    const go = () => {
      t = setTimeout(() => {
        fnRef.current();
        go();
      }, min + Math.random() * (max - min));
    };
    go();
    return () => clearTimeout(t);
  }, [min, max, off]);
}

// Masking-tape label stuck on a project.
export function Tape({ title, meta, className = "", rotate = -3, style }) {
  return (
    <div className={`tape absolute z-10 text-center ${className}`} style={{ rotate: `${rotate}deg`, fontSize: u(1.3), ...style }}>
      <p className="whitespace-nowrap font-hand leading-none text-ink">{title}</p>
      {meta && (
        <p className="mt-[0.45em] whitespace-nowrap font-serif uppercase leading-none tracking-[0.16em] text-graphite" style={{ fontSize: "0.48em" }}>
          {meta}
        </p>
      )}
    </div>
  );
}

// A page corner that lifts in the draft from the window and settles again.
function CornerLift({ size, period, delay = 0, calm, flap = "#ddd5c4" }) {
  if (calm) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 right-0"
      style={{
        background: `linear-gradient(to top left, var(--desk) 0 50%, ${flap} 50%, #f6f2ea 100%)`,
        filter: "drop-shadow(-1px -1px 1.5px rgba(30,26,20,0.25))",
      }}
      animate={{ width: [0, 0, size, size * 0.7, size, 0, 0], height: [0, 0, size, size * 0.7, size, 0, 0] }}
      transition={forever(period, { delay, times: [0, 0.6, 0.68, 0.74, 0.8, 0.9, 1] })}
    />
  );
}

// ---------- intro + contact ----------

export function Notebook({ calm }) {
  return (
    <div className="notebook relative h-full w-full" style={{ paddingLeft: u(4.6), paddingRight: u(2.6), paddingTop: u(2.4) }}>
      <div className="absolute inset-y-0 flex flex-col justify-around" style={{ left: u(-0.9), paddingBlock: u(1.2) }} aria-hidden="true">
        {Array.from({ length: 13 }, (_, i) => (
          <span key={i} className="block rounded-full border-[1.5px] border-ink/70" style={{ width: u(2.6), height: u(0.9) }} />
        ))}
      </div>
      <div className="absolute inset-y-0 w-px bg-accent/40" style={{ left: u(3.6) }} aria-hidden="true" />
      <p className="font-serif uppercase tracking-[0.2em] text-pencil" style={{ fontSize: u(0.85) }}>
        Portfolio
      </p>
      <h1 className="font-display font-light leading-[0.9]" style={{ fontSize: u(4.6), marginTop: u(0.7) }}>
        Fiora <span className="italic">Xu</span>
      </h1>
      <p className="font-serif uppercase tracking-[0.16em] text-pencil" style={{ fontSize: u(0.74), marginTop: u(1.2), lineHeight: 1.7 }}>
        Computer Science
        <br />
        Human-Centered Computing
        <br />
        Northeastern University
      </p>
      <p className="font-serif text-graphite" style={{ fontSize: u(1.02), marginTop: u(1.2), lineHeight: 1.5 }}>
        I’m Fiora Xu, a Computer Science major with a concentration in Human-Centered Computing at Northeastern University. I’m passionate about product management, UI/UX, product design, and quality assurance, with experience in QA and building web-based projects. I enjoy working at the intersection of design and functionality—thinking about how products not only work, but feel to use.
      </p>
      <p className="font-serif uppercase tracking-[0.16em] text-pencil" style={{ fontSize: u(0.7), marginTop: u(1.2) }}>
        {["Product / PM", "UI/UX", "HCI", "Frontend", "Data Visualization"].join("  ·  ")}
      </p>
      <CornerLift size={u(3.4)} period={15} delay={3} calm={calm} />
    </div>
  );
}

export function StickyNote({ calm }) {
  return (
    <motion.div
      className="sticky-note relative flex h-full w-full items-center"
      style={{ padding: u(1.6), originY: 0 }}
      animate={calm ? undefined : { rotateX: [0, 0, 9, 3, 0, 0] }}
      transition={forever(11, { delay: 1.5, times: [0, 0.55, 0.65, 0.72, 0.8, 1] })}
    >
      <p className="font-hand leading-[1.25] text-ink" style={{ fontSize: u(1.3) }}>
        currently looking for PM, UI/UX, product design &amp; QA / automation roles :)
      </p>
      <span
        aria-hidden="true"
        className="tape absolute left-1/2 z-10"
        style={{ top: u(-0.9), width: u(6), height: u(1.8), translate: "-50% 0", rotate: "-4deg", padding: 0 }}
      />
      <CornerLift size={u(2.6)} period={9} delay={5} calm={calm} flap="#d9c983" />
    </motion.div>
  );
}

export function BusinessCard() {
  const stop = (e) => e.stopPropagation();
  return (
    <div className="business-card flex h-full w-full flex-col justify-between" style={{ padding: u(1.6) }}>
      <div>
        <p className="font-display leading-none" style={{ fontSize: u(2.1) }}>
          Fiora Xu
        </p>
        <p className="font-serif uppercase tracking-[0.18em] text-pencil" style={{ fontSize: u(0.7), marginTop: u(0.7) }}>
          Product · UI/UX · HCI
        </p>
      </div>
      <div className="flex flex-col font-serif text-graphite" style={{ fontSize: u(1.05), gap: u(0.3) }}>
        <a href="mailto:msfiora@gmail.com" onPointerDown={stop} onClick={stop} className="ink-link-draw w-fit hover:text-accent">
          msfiora@gmail.com
        </a>
        <a
          href="https://www.linkedin.com/in/fiora-xu-17b00223a"
          target="_blank"
          rel="noreferrer"
          onPointerDown={stop}
          onClick={stop}
          className="ink-link-draw inline-flex w-fit items-center gap-1 hover:text-accent"
        >
          LinkedIn <ArrowUpRight size="1em" strokeWidth={1.4} />
        </a>
      </div>
    </div>
  );
}

// ---------- projects ----------

// Face Analyzer: a polaroid that keeps developing, then gets scanned.
export function Polaroid({ project, calm }) {
  return (
    <div className="polaroid flex h-full w-full flex-col" style={{ padding: `${u(1.1)} ${u(1.1)} 0` }}>
      <div className="relative w-full overflow-hidden bg-canvas" style={{ aspectRatio: "1 / 1.06" }}>
        <div className="absolute inset-0 p-[5%]">
          <Cover project={project} />
        </div>
        {!calm && (
          <>
            <motion.div
              className="absolute inset-0"
              style={{ background: "radial-gradient(circle at 45% 40%, #4a4f48, #2a2b26)" }}
              animate={{ opacity: [0.95, 0, 0, 0.95] }}
              transition={forever(22, { times: [0, 0.3, 0.93, 1], ease: "easeOut" })}
            />
            <motion.div
              className="absolute inset-x-0 h-[2px] bg-accent"
              style={{ boxShadow: "0 0 10px 2px rgba(168,53,44,0.45)" }}
              animate={{ top: ["0%", "0%", "0%", "100%", "100%", "100%"], opacity: [0, 0, 1, 1, 0, 0] }}
              transition={forever(22, { times: [0, 0.4, 0.41, 0.58, 0.59, 1], ease: "linear" })}
            />
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="font-hand leading-none text-ink" style={{ fontSize: u(1.7) }}>
          {project.title.toLowerCase()}
        </p>
        <p className="font-serif uppercase tracking-[0.16em] text-pencil" style={{ fontSize: u(0.62), marginTop: u(0.6) }}>
          {project.meta}
        </p>
      </div>
    </div>
  );
}

const LINE_A = "M20,200 C80,200 100,60 170,60 C220,60 240,110 290,100";

// MBTA viz: a folded transit map with a train running the line.
export function SubwayMap({ project, calm }) {
  const pathRef = useRef(null);
  const [stops, setStops] = useState([]);
  useLayoutEffect(() => {
    const p = pathRef.current;
    const len = p.getTotalLength();
    setStops([0, 0.34, 0.68, 1].map((t) => p.getPointAtLength(t * len)));
  }, []);
  return (
    <div className="subway-map relative h-full w-full">
      <div className="absolute" style={{ inset: u(1.3) }}>
        <div className="absolute inset-0">
          <Cover project={project} />
        </div>
        <svg viewBox="0 0 300 240" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path ref={pathRef} d={LINE_A} fill="none" stroke="none" />
          {stops.map((pt, i) => (
            <circle key={i} cx={pt.x} cy={pt.y} r="4.6" fill="var(--canvas)" stroke="var(--ink)" strokeWidth="1.4" />
          ))}
          <g>
            <rect x="-9" y="-4.5" width="18" height="9" rx="4" fill="var(--accent)" stroke="var(--ink)" strokeWidth="1" />
            <rect x="-5" y="-2" width="10" height="4" rx="1.5" fill="var(--canvas)" opacity="0.8" />
            {!calm && (
              <animateMotion
                dur="18s"
                repeatCount="indefinite"
                rotate="auto"
                calcMode="spline"
                keyPoints="0;0.34;0.34;0.68;0.68;1;1;0.68;0.68;0.34;0.34;0"
                keyTimes="0;0.12;0.18;0.31;0.37;0.5;0.56;0.69;0.75;0.88;0.94;1"
                keySplines={Array(11).fill("0.45 0 0.55 1").join(";")}
                path={LINE_A}
              />
            )}
          </g>
        </svg>
      </div>
      <div className="map-folds pointer-events-none absolute inset-0" aria-hidden="true" />
      <Tape title={project.title} meta={project.meta} rotate={-4} style={{ left: u(-1.4), top: u(-1.1) }} />
    </div>
  );
}

// GameNite: a little stack of cards; the top one turns over every so often.
export function GameCards({ project, calm }) {
  return (
    <div className="relative h-full w-full" style={{ perspective: 900 }}>
      <div className="card card-back absolute inset-0" style={{ rotate: "-9deg", translate: `${u(-0.8)} ${u(0.4)}` }} />
      <div className="card card-back absolute inset-0" style={{ rotate: "5deg", translate: `${u(0.5)} ${u(-0.2)}` }} />
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
        animate={calm ? undefined : { rotateY: [0, 0, 180, 180, 360], y: [0, 0, -10, 0, 0, -10, 0] }}
        transition={{
          rotateY: forever(16, { times: [0, 0.42, 0.5, 0.92, 1] }),
          y: forever(16, { times: [0, 0.42, 0.46, 0.5, 0.92, 0.96, 1] }),
        }}
      >
        <div className="card card-face absolute inset-0" style={{ backfaceVisibility: "hidden", padding: u(1.2) }}>
          <Cover project={project} />
          <span className="absolute font-display leading-none" style={{ left: u(0.7), top: u(0.6), fontSize: u(1.4) }}>
            ♞
          </span>
          <span className="absolute rotate-180 font-display leading-none" style={{ right: u(0.7), bottom: u(0.6), fontSize: u(1.4) }}>
            ♞
          </span>
        </div>
        <div className="card card-back absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }} />
      </motion.div>
      <Tape title={project.title} meta={project.meta} rotate={3} style={{ left: "50%", bottom: u(-2.2), translate: "-50% 0" }} />
    </div>
  );
}

function formatTime(d) {
  return `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// Notability on your wrist: an Apple Watch that keeps recording, keeps time, and buzzes now and then.
export function Watch({ project, calm }) {
  const [now, setNow] = useState(() => new Date());
  const [buzz, setBuzz] = useState(0);
  const [note, setNote] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(t);
  }, []);
  useEvery(
    12000,
    20000,
    () => {
      setBuzz((b) => b + 1);
      setNote(true);
      setTimeout(() => setNote(false), 3200);
    },
    calm,
  );

  return (
    <div className="relative h-full w-full">
      {/* bands */}
      <div className="watch-band absolute left-[16%] right-[16%] top-0 h-[34%] rounded-t-[30%]" />
      <div className="watch-band absolute bottom-0 left-[16%] right-[16%] h-[34%] rounded-b-[30%]">
        <div className="absolute left-1/2 flex -translate-x-1/2 flex-col" style={{ top: "30%", gap: u(0.9) }}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="block rounded-full bg-ink/35" style={{ width: u(0.7), height: u(0.7) }} />
          ))}
        </div>
      </div>
      {/* case */}
      <motion.div
        key={buzz}
        className="absolute inset-x-0 top-[25%] h-[50%]"
        animate={buzz ? { x: [0, -3, 3, -3, 3, -2, 2, 0], rotate: [0, -1, 1, -1, 1, 0] } : undefined}
        transition={{ duration: 0.55 }}
      >
        <div className="watch-case relative h-full w-full" style={{ borderRadius: u(2.6), padding: u(0.75) }}>
          <span className="absolute rounded-[3px] bg-[#3b3832]" style={{ right: u(-0.6), top: "26%", width: u(0.75), height: u(2.2) }} />
          <span className="absolute rounded-[3px] bg-[#3b3832]" style={{ right: u(-0.45), top: "55%", width: u(0.55), height: u(3) }} />
          <div className="watch-screen relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#0d0c0a] text-[#f4f1ea]" style={{ borderRadius: u(1.9), padding: u(1) }}>
            <div className="flex items-center justify-between">
              <motion.span
                className="block rounded-full bg-[#e2493c]"
                style={{ width: u(0.75), height: u(0.75) }}
                animate={calm ? undefined : { opacity: [1, 0.25, 1] }}
                transition={forever(1.6)}
              />
              <span className="font-display tabular-nums" style={{ fontSize: u(1.3) }}>
                {formatTime(now)}
              </span>
            </div>
            <div className="flex items-center justify-center" style={{ height: u(3.2), gap: u(0.35) }}>
              {[0.5, 0.9, 0.6, 1, 0.45, 0.8, 0.55].map((h, i) => (
                <motion.span
                  key={i}
                  className="block rounded-full bg-[#f4f1ea]"
                  style={{ width: u(0.42), height: "100%", originY: 0.5 }}
                  initial={{ scaleY: h }}
                  animate={calm ? undefined : { scaleY: [h, 0.2 + ((i * 37) % 10) / 14, h * 0.4, h] }}
                  transition={forever(1.1 + (i % 3) * 0.35, { delay: i * 0.12 })}
                />
              ))}
            </div>
            <p className="text-center font-serif uppercase tracking-[0.14em] text-[#a9a398]" style={{ fontSize: u(0.62) }}>
              recording
            </p>
            <AnimatePresence>
              {note && (
                <motion.div
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "110%" }}
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
                  className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center bg-[#1f1d19]"
                  style={{ height: "62%", borderRadius: `${u(1.2)} ${u(1.2)} ${u(1.9)} ${u(1.9)}` }}
                >
                  <span className="font-hand leading-none" style={{ fontSize: u(1.5) }}>
                    ✎ note saved
                  </span>
                  <span className="font-serif uppercase tracking-[0.14em] text-[#a9a398]" style={{ fontSize: u(0.55), marginTop: u(0.6) }}>
                    synced to iPhone
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
      <Tape title="notability, on your wrist" meta={project.meta} rotate={-6} style={{ left: "50%", bottom: u(3.4), translate: "-14% 0" }} />
    </div>
  );
}

// ---------- props ----------

export function Mug({ calm }) {
  return (
    <div className="relative h-full w-full">
      <div className="mug-handle absolute" style={{ right: 0, top: "36%", width: "34%", height: "28%" }} />
      <div className="mug absolute left-0 top-0 aspect-square h-full rounded-full">
        <div className="absolute inset-[10%] overflow-hidden rounded-full shadow-[inset_0_3px_8px_rgba(0,0,0,0.5)]">
          <CoffeeSurface calm={calm} />
        </div>
        {!calm && (
          <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <motion.path
                key={i}
                d={["M42,58 C30,44 52,36 44,22 C38,12 50,4 46,-6", "M54,60 C66,46 46,38 58,24 C66,14 54,4 60,-8", "M48,52 C40,40 58,32 50,18"][i]}
                fill="none"
                stroke="#fffaf0"
                strokeWidth="5"
                strokeLinecap="round"
                style={{ filter: "blur(3px)" }}
                animate={{ opacity: [0, 0.55, 0], y: [8, -14], scaleX: [1, 1.25, 0.9] }}
                transition={forever(5.5 + i * 1.4, { delay: i * 1.8, ease: "easeOut" })}
              />
            ))}
          </svg>
        )}
      </div>
    </div>
  );
}

export function Pencil({ calm }) {
  const roll = calm ? undefined : { y: [0, 0, 10, 10, 0], backgroundPositionY: ["0px", "0px", "10px", "10px", "0px"] };
  const t = forever(17, { times: [0, 0.4, 0.5, 0.9, 1] });
  return (
    <motion.div className="flex h-full w-full items-stretch" animate={calm ? undefined : { y: roll.y }} transition={t}>
      <div className="rounded-l-[35%] bg-[#c99189]" style={{ width: u(1.8) }} />
      <div className="pencil-ferrule" style={{ width: u(1.6) }} />
      <motion.div className="pencil-body relative flex-1" animate={calm ? undefined : { backgroundPositionY: roll.backgroundPositionY }} transition={t}>
        <span className="absolute top-1/2 -translate-y-1/2 font-serif uppercase tracking-[0.2em] text-[#c9b37a]" style={{ left: u(2), fontSize: u(0.6) }}>
          No. 2 · HB
        </span>
      </motion.div>
      <svg viewBox="0 0 40 20" preserveAspectRatio="none" className="h-full" style={{ width: u(3.4) }} aria-hidden="true">
        <path d="M0,0 L40,10 L0,20 Z" fill="#dcc29a" />
        <path d="M0,0 L40,10 L0,6 Z" fill="#c8ab7d" />
        <path d="M27,6.75 L40,10 L27,13.25 Z" fill="#2a2722" />
      </svg>
    </motion.div>
  );
}

const PIPS = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[26, 26], [50, 50], [74, 74]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]],
  6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]],
};

export function Die({ calm }) {
  const [face, setFace] = useState(5);
  const [turns, setTurns] = useState(0);
  useEvery(
    9000,
    16000,
    () => {
      setFace(1 + Math.floor(Math.random() * 6));
      setTurns((n) => n + 1);
    },
    calm,
  );
  return (
    <motion.div
      className="die relative h-full w-full"
      animate={{ rotate: turns * 90, scale: turns ? [1, 1.22, 0.96, 1] : 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {PIPS[face].map(([x, y]) => (
        <span key={`${x}-${y}`} className="absolute h-[17%] w-[17%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" style={{ left: `${x}%`, top: `${y}%` }} />
      ))}
    </motion.div>
  );
}
