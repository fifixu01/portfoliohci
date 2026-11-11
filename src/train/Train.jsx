import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { animate, AnimatePresence, motion, motionValue, useMotionValueEvent, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { SketchDefs } from "../sketch.jsx";
import { Billboard, PosterFace, Station, Terminus } from "./Billboard.jsx";
import { Blind, Cat, Curtain, Glass, Seats, Straps, WindowFrame } from "./Cabin.jsx";
import { TrainContext, useTrain } from "./context.js";
import { Engine } from "./engine.js";
import { Landscape, Layer, SceneDefs, Sky } from "./Scenery.jsx";
import { Ticket } from "./Ticket.jsx";
import { Atmosphere, Rainbow, SnowToggle } from "./Atmosphere.jsx";
import { initialTheme } from "./themes.js";
import { BIRDS, clamp, GAP, MAX, nearestStop, stopIndex, stopX, STOPS, timeFromHour, TIMES, VIEW_H } from "./world.js";
import "./train.css";
import "./themes.css";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const TUBE = 40; // thickness of the rolled-up poster, px

const CALLOUT = { face: "hop off here!", viz: "next stop: the T", web: "hop off, it’s game night", nb: "hop off, check your wrist" };
// The last board only carries contact details. It is not a project and does not open.
const CONTACT = { id: "about", kind: "contact", title: "Say hello", stopLine: "End of the line" };

const posterEl = (id) => document.querySelector(`.train [data-stop="${id}"] .poster`);
const measurePoster = (id) => {
  const r = posterEl(id).getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
};

function initialTime() {
  const q = new URLSearchParams(window.location.search).get("time");
  return TIMES.includes(q) ? q : timeFromHour(new Date().getHours());
}

// ---------- little set pieces ----------

const PUFF = "M14,44 C2,44 0,30 12,27 C10,14 28,8 36,18 C42,4 66,4 70,20 C82,14 96,24 90,34 C100,36 98,46 88,45 Z";
const DROPS = Array.from({ length: 54 }, (_, i) => ({ left: (i * 37.3) % 100, top: (i * 53.7) % 92, d: -((i * 0.37) % 2.4), len: 16 + ((i * 7) % 22) }));

function Rain() {
  const { engine } = useTrain();
  const opacity = useTransform(engine.pos, (p) => clamp(1.25 - Math.abs(p - GAP * 2.5) / 380, 0, 1));
  const skewX = useTransform(engine.vel, (v) => clamp(v / 60, -38, 38));
  return (
    <motion.div className="rain" style={{ opacity }} aria-hidden="true">
      <svg className="rain-clouds" viewBox="0 0 1000 150" preserveAspectRatio="xMidYMin slice">
        {[-60, 190, 430, 700].map((x, i) => (
          <path key={x} d={PUFF} transform={`translate(${x} ${-34 + (i % 2) * 22}) scale(3.4 2.6)`} className="storm" strokeWidth="0.45" />
        ))}
      </svg>
      <Rainbow />
      <motion.div className="rain-drops" style={{ skewX }}>
        {DROPS.map((d, i) => (
          <span key={i} style={{ left: `${d.left}%`, top: `${d.top}%`, height: d.len, animationDelay: `${d.d}s` }} />
        ))}
      </motion.div>
    </motion.div>
  );
}

function StepArrow() {
  return (
    <svg viewBox="0 0 64 30" className="step-arrow" aria-hidden="true">
      <path d="M4,10.5 C14,9 26,10.5 37,9.5 L35.5,2.5 L60,15 L36,27.5 L37,20 C26,21 14,19.5 4,20.5 Z" fill="currentColor" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" filter="url(#pencil)" />
    </svg>
  );
}

function Steam() {
  return (
    <div className="steam" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <svg key={i} viewBox="0 0 100 50" style={{ animationDelay: `${i * -2.6}s`, top: `${2 + (i % 2) * 5}%` }}>
          <path d={PUFF} fill="var(--cloud)" stroke="var(--scene-ink)" strokeWidth="0.9" />
        </svg>
      ))}
    </div>
  );
}

function Toot() {
  return (
    <motion.div
      className="toot font-hand"
      initial={{ opacity: 0, scale: 0.6, rotate: -8, y: 10 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1.1, 1, 1], y: [10, 0, -4, -16] }}
      transition={{ duration: 1.6, times: [0, 0.15, 0.7, 1] }}
      aria-hidden="true"
    >
      toot toot!
    </motion.div>
  );
}

const CONFETTI = Array.from({ length: 18 }, (_, i) => ({ x: 8 + ((i * 41) % 84), r: (i * 67) % 360, d: (i % 6) * 0.07, c: ["var(--accent)", "var(--ticket)", "var(--sun)"][i % 3] }));

function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {CONFETTI.map((c, i) => (
        <motion.span
          key={i}
          style={{ left: `${c.x}%`, background: c.c }}
          initial={{ y: "-4vh", rotate: c.r, opacity: 1 }}
          animate={{ y: "62vh", x: (i % 2 ? 1 : -1) * (10 + (i % 4) * 9), rotate: c.r + 300, opacity: [1, 1, 0] }}
          transition={{ duration: 2 + (i % 5) * 0.2, delay: c.d, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

// The sheet in the air: it comes unstuck, rolls itself up from the bottom, flies to the top of the
// screen as a tube, then unrolls downward as the page.
function Flight({ project, rect, mv }) {
  const { peel, roll, fly, unroll } = mv;
  const scale = useTransform(peel, (p) => 1 + p * 0.05);
  const rotate = useTransform(peel, (p) => p * -2.2);
  const y = useTransform(peel, (p) => p * -7);
  const clipPath = useTransform(roll, (r) => `inset(-20% -20% ${r * 100}% -20%)`);
  const shadow = useTransform(peel, (p) => p);
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const tx = useTransform(fly, (f) => rect.left * (1 - f));
  const ty = useTransform(() => {
    const f = fly.get();
    const start = rect.top + rect.height * (1 - roll.get()) - TUBE / 2 - 7 * peel.get();
    return start * (1 - f) + (-TUBE / 2) * f - Math.sin(f * Math.PI) * vh * 0.05 + unroll.get() * (vh + TUBE);
  });
  const sx = useTransform(fly, (f) => (rect.width / vw) * (1 - f) + f);
  const sy = useTransform(fly, (f) => 0.45 + 0.55 * f);
  const rot = useTransform(fly, (f) => Math.sin(f * Math.PI) * -5);
  const tubeOpacity = useTransform(roll, (r) => Math.min(1, r * 10));
  return (
    <div className="flight" aria-hidden="true">
      <motion.div className="flight-poster" style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height, scale, rotate, y, clipPath }}>
        <motion.div className="flight-shadow" style={{ opacity: shadow }} />
        <PosterFace project={project} />
      </motion.div>
      <motion.div className="flight-tube" style={{ x: tx, y: ty, scaleX: sx, scaleY: sy, rotate: rot, opacity: tubeOpacity, height: TUBE }} />
    </div>
  );
}

// ---------- the homepage ----------

export default function Train({ projects, studies }) {
  const calm = useReducedMotion();
  const [engine] = useState(() => new Engine());
  const [wu] = useState(() => motionValue(1));
  const [viewU] = useState(() => motionValue(1400));
  const [dims, setDims] = useState({ wu: 1, viewUnits: 1400 });
  const [mv] = useState(() => ({ peel: motionValue(0), roll: motionValue(0), fly: motionValue(0), unroll: motionValue(0) }));

  const rootRef = useRef(null);
  const winRef = useRef(null);
  const catRef = useRef(null);
  const studyRef = useRef(null);
  const birdRefs = useRef([]);
  const drag = useRef({ on: false, moved: false, x: 0, vx: 0, t: 0, id: null });
  const live = useRef({ stage: "ride", here: 0, blind: "", pointerAt: 0, bonkAt: 0, snap: 0, opened: null, punched: ["home"] });

  const [time, setTime] = useState(initialTime);
  const [theme, setTheme] = useState(initialTheme);
  const toggleSnow = useCallback(() => setTheme((t) => (t === "snow" ? "classic" : "snow")), []);
  const [here, setHere] = useState(0);
  const [blind, setBlind] = useState("Now boarding · Fiora Xu Station");
  // every visit starts with a fresh ticket: only the home stop is punched
  const [punched, setPunched] = useState(["home"]);
  useEffect(() => {
    live.current.punched = punched;
  }, [punched]);
  const [fresh, setFresh] = useState(null);
  const [stage, setStageState] = useState("ride"); // ride | opening | open | closing
  const [flight, setFlight] = useState(null); // { id, rect, key }
  const [studyId, setStudyId] = useState(null);
  const [toots, setToots] = useState(0);
  const [party, setParty] = useState(0);
  const [moved, setMoved] = useState(false);
  const [alert, setAlert] = useState(false);

  const setStage = useCallback((s) => {
    live.current.stage = s;
    setStageState(s);
  }, []);

  const posters = useMemo(
    () => [
      ...projects.map((p, i) => ({ ...p, kind: "project", stopLine: `Stop ${String(i + 1).padStart(2, "0")} of ${String(projects.length).padStart(2, "0")}`, callout: CALLOUT[p.id] || "hop off here!" })),
      CONTACT,
    ],
    [projects],
  );
  const ctx = useMemo(() => ({ engine, wu, viewU, viewUnits: dims.viewUnits }), [engine, wu, viewU, dims.viewUnits]);

  // --- measure the window: one world unit is 1/600 of its height
  useLayoutEffect(() => {
    const el = winRef.current;
    const measure = () => {
      const px = el.clientHeight / VIEW_H || 1;
      const units = el.clientWidth / px;
      wu.set(px);
      viewU.set(units);
      setDims((d) => (Math.abs(d.wu - px) < 0.001 && Math.abs(d.viewUnits - units) < 1 ? d : { wu: px, viewUnits: units }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [wu, viewU]);

  // Punch a stop on the ticket. Returns true the first time.
  const punch = useCallback((id) => {
    const L = live.current;
    if (L.punched.includes(id)) return false;
    L.punched = [...L.punched, id];
    setPunched(L.punched);
    setFresh(id);
    return true;
  }, []);

  // --- what the destination blind says
  const blindFor = useCallback((p, target) => {
    const n = nearestStop(p);
    if (Math.abs(p - stopX(n)) < 70 && Math.abs(target - stopX(n)) < 70) {
      if (n === 0) return "Now boarding · Fiora Xu Station";
      if (n === STOPS.length - 1) return "End of the line · thank you!";
      return `Now arriving · ${STOPS[n].name}`;
    }
    const next = clamp(target >= p ? Math.ceil((p - 60) / GAP) : Math.floor((p + 60) / GAP), 0, STOPS.length - 1);
    return `Next stop · ${next === STOPS.length - 1 ? "End of the line" : STOPS[next].name}`;
  }, []);

  // --- engine wiring
  useEffect(() => {
    const L0 = live.current;
    engine.configure({
      max: MAX,
      calm,
      onDepart: () => {
        clearTimeout(live.current.snap);
        setMoved(true);
      },
      onSettle: (p) => {
        const L = live.current;
        const n = nearestStop(p);
        const off = Math.abs(p - stopX(n));
        if (off < 60) {
          L.here = n;
          setHere(n);
          if (n === STOPS.length - 1 && L.stage === "ride" && punch("about")) setParty((k) => k + 1);
        }
        // stations are a little magnetic: stop close to one and the train creeps in
        if (off > 0.5 && off < 230 && L.stage === "ride") L.snap = setTimeout(() => !drag.current.on && engine.rideTo(stopX(n)), 520);
      },
    });
    return () => {
      engine.stop();
      clearTimeout(L0.snap);
    };
  }, [engine, calm, punch]);

  // --- everything that follows the train's position without re-rendering
  const look = { x: useSpring(0, { stiffness: 90, damping: 14 }), y: useSpring(0, { stiffness: 90, damping: 14 }) };
  const lookX = look.x;
  useMotionValueEvent(engine.pos, "change", (p) => {
    const L = live.current;
    const near = nearestStop(p);
    if (L.here !== null && Math.abs(p - stopX(L.here)) > 150) {
      L.here = null;
      setHere(null);
    } else if (L.here === null && Math.abs(p - stopX(near)) < 40 && Math.abs(engine.target - stopX(near)) < 40 && Math.abs(engine.vel.get()) < 160) {
      L.here = near;
      setHere(near);
    }
    const text = blindFor(p, engine.target);
    if (text !== L.blind) {
      L.blind = text;
      setBlind(text);
    }
    // birds scatter as the train comes up on them, and are back on the wire once out of sight
    const v = engine.vel.get();
    const half = viewU.get() / 2;
    for (let k = 0; k < BIRDS.length; k++) {
      const el = birdRefs.current[k];
      if (!el) continue;
      const s = BIRDS[k].x - p * 1.5;
      const gone = el.classList.contains("flown");
      if (!gone && Math.abs(v) > 260 && s < half * 0.55 && s > -half * 0.5) el.classList.add("flown");
      else if (gone && Math.abs(s) > half + 420) el.classList.remove("flown");
    }
    // with no mouse about, the cat watches the nearest billboard go by
    if (performance.now() - L.pointerAt > 2500) {
      const n = nearestStop(p);
      lookX.set(clamp(((stopX(n) - p) / half) * 1.4 + 0.5, -1, 1));
    }
  });

  // --- travelling
  const rideToStop = useCallback(
    (i) => {
      if (live.current.stage !== "ride") return;
      engine.rideTo(stopX(clamp(i, 0, STOPS.length - 1)));
    },
    [engine],
  );

  const pushBy = useCallback(
    (d) => {
      const over = engine.push(d);
      const now = performance.now();
      if (Math.abs(over) > 30 && now - live.current.bonkAt > 900 && !calm) {
        live.current.bonkAt = now;
        engine.jolt(over > 0 ? -1 : 1); // bump the buffers
      }
    },
    [engine, calm],
  );

  useEffect(() => {
    const el = rootRef.current;
    const onWheel = (e) => {
      if (live.current.stage !== "ride") return;
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? 400 : 1;
      const d = (Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * unit;
      pushBy(clamp(d, -260, 260) * 2.1);
    };
    // focusing a billboard that is out of view must not scroll anything: the train rides there instead
    const onScroll = (e) => {
      const t = e.target;
      if (t === el || (t instanceof Element && t.closest(".cabin"))) {
        t.scrollLeft = 0;
        t.scrollTop = 0;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", onScroll, true);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", onScroll, true);
    };
  }, [pushBy]);

  const onPointerDown = (e) => {
    if (live.current.stage !== "ride" || (e.pointerType === "mouse" && e.button !== 0)) return;
    // fingers do not drag the view: on a phone that fights the browser's own scrolling, so
    // touch screens ride stop to stop with the buttons under the window instead
    if (e.pointerType === "touch") return;
    drag.current = { on: true, moved: false, x: e.clientX, vx: 0, t: e.timeStamp, id: e.pointerId };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.on || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) < 7) return;
    if (!d.moved) {
      d.moved = true;
      winRef.current.setPointerCapture?.(e.pointerId);
      winRef.current.classList.add("is-dragging");
    }
    const dt = Math.max(1, e.timeStamp - d.t);
    d.vx = d.vx * 0.6 + (dx / dt) * 0.4;
    d.x = e.clientX;
    d.t = e.timeStamp;
    pushBy((-dx / wu.get()) * 1.5);
  };
  const onPointerUp = (e) => {
    const d = drag.current;
    if (!d.on) return;
    d.on = false;
    winRef.current.classList.remove("is-dragging");
    if (d.moved) {
      if (e.timeStamp - d.t < 80) pushBy(((-d.vx * 320) / wu.get()) * 1.5); // fling
      // let the click that follows a drag pass harmlessly
      setTimeout(() => (drag.current.moved = false), 0);
    }
  };

  // --- stepping off: brake, punch, peel, roll, fly, unroll

  const open = useCallback(
    async (id) => {
      const L = live.current;
      if (L.stage !== "ride" || drag.current.moved) return;
      const i = stopIndex(id);
      if (STOPS[i].kind !== "project") return;
      setStage("opening");
      clearTimeout(L.snap);
      L.opened = id;
      if (calm) {
        engine.jump(stopX(i));
        punch(id);
        setStudyId(id);
        setStage("open");
        return;
      }
      await engine.rideTo(stopX(i));
      const first = punch(id);
      await wait(first ? 640 : 90);
      mv.peel.set(0);
      mv.roll.set(0);
      mv.fly.set(0);
      mv.unroll.set(0);
      setFlight({ id, rect: measurePoster(id), key: `open-${id}` });
      await animate(mv.peel, 1, { duration: 0.3, ease: "easeOut" });
      setStudyId(id);
      await animate(mv.roll, 1, { duration: 0.36, ease: [0.5, 0, 0.9, 0.6] });
      await animate(mv.fly, 1, { duration: 0.48, ease: [0.5, 0, 0.2, 1] });
      await animate(mv.unroll, 1, { duration: 0.75, ease: [0.5, 0, 0.15, 1] });
      setStage("open");
    },
    [calm, engine, mv, punch, setStage],
  );

  const close = useCallback(async () => {
    const L = live.current;
    if (L.stage !== "open") return;
    const id = L.opened;
    setStage("closing");
    if (calm) {
      setStudyId(null);
      setStage("ride");
      return;
    }
    setFlight({ id, rect: measurePoster(id), key: `close-${id}` });
    await animate(mv.unroll, 0, { duration: 0.55, ease: [0.5, 0, 0.2, 1] });
    setStudyId(null);
    await animate(mv.fly, 0, { duration: 0.44, ease: [0.5, 0, 0.2, 1] });
    await animate(mv.roll, 0, { duration: 0.36, ease: [0.2, 0.6, 0.3, 1] });
    await animate(mv.peel, 0, { duration: 0.22, ease: "easeIn" });
    setFlight(null);
    setStage("ride");
    setToots((k) => k + 1);
    engine.jolt(1);
  }, [calm, engine, mv, setStage]);

  // focus follows the page in and out
  useEffect(() => {
    const L = live.current;
    if (stage === "open") studyRef.current?.focus({ preventScroll: true });
    else if (stage === "ride" && L.opened) {
      posterEl(L.opened)?.focus({ preventScroll: true });
      L.opened = null;
    }
  }, [stage]);

  // --- keyboard
  useEffect(() => {
    const onKey = (e) => {
      const L = live.current;
      if (e.key === "Escape" && L.stage === "open") {
        // an enlarged figure inside a study closes first
        if (document.querySelector('[aria-label="Close expanded image"]')) return;
        close();
        return;
      }
      if (L.stage !== "ride" || e.metaKey || e.ctrlKey || e.altKey) return;
      const at = engine.target / GAP;
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        rideToStop(Math.floor(at + 0.02) + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        rideToStop(Math.ceil(at - 0.02) - 1);
      } else if (e.key === "Home") rideToStop(0);
      else if (e.key === "End") rideToStop(STOPS.length - 1);
      else if (e.key === "Enter" && (document.activeElement === document.body || document.activeElement === rootRef.current)) {
        const n = nearestStop(engine.p);
        if (n > 0 && Math.abs(engine.p - stopX(n)) < 200) open(STOPS[n].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, engine, open, rideToStop]);

  // --- the cat follows the pointer
  const onLook = (e) => {
    if (e.pointerType === "touch") return;
    const r = catRef.current?.getBoundingClientRect();
    if (!r) return;
    live.current.pointerAt = performance.now();
    look.x.set(clamp((e.clientX - (r.left + r.width * 0.58)) / (window.innerWidth * 0.3), -1, 1));
    look.y.set(clamp((e.clientY - (r.top + r.height * 0.35)) / (window.innerHeight * 0.3), -1, 1));
  };
  const onOver = (e) => setAlert(Boolean(e.target.closest?.(".poster")));

  // the scene rides the rail joints: a tiny clack that grows with speed
  const bob = useTransform(() => {
    if (calm) return 0;
    const p = engine.pos.get();
    const sp = Math.min(1, Math.abs(engine.vel.get()) / 900);
    return (Math.sin(p / 21) * 0.6 + Math.max(0, Math.sin(p / 72)) ** 10 * 2.4) * sp;
  });
  const studyClip = useTransform(mv.unroll, (u) => `inset(0 0 ${(1 - u) * 100}% 0)`);

  const Study = studyId ? studies[studyId] : null;
  const studyProject = studyId ? posters.find((p) => p.id === studyId) : null;
  const flightProject = flight ? posters.find((p) => p.id === flight.id) : null;
  const riding = stage === "ride";

  return (
    <TrainContext.Provider value={ctx}>
      <main ref={rootRef} className="train" data-time={time} data-theme={theme} style={{ "--wu": `${dims.wu}px` }} onPointerMove={onLook} onPointerOver={onOver}>
        <SketchDefs />
        <div className="cabin" inert={!riding}>
          <div className="wall" aria-hidden="true" />
          <Seats />
          <div
            ref={winRef}
            className="window"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <SceneDefs />
            <motion.div className="world" style={{ y: bob }}>
              <div className="world-rock">
                <Sky time={time} onCycle={() => setTime((t) => TIMES[(TIMES.indexOf(t) + 1) % TIMES.length])} />
                <Landscape birdRefs={birdRefs}>
                  <Layer depth={1} className="main">
                    <Station />
                    {posters.map((p, i) => (
                      <Billboard key={p.id} project={p} index={i + 1} here={here === i + 1} hidden={flight?.id === p.id} onOpen={open} onFocusStop={rideToStop} />
                    ))}
                    <Terminus index={STOPS.length - 1} onRideBack={() => rideToStop(0)} />
                  </Layer>
                </Landscape>
              </div>
            </motion.div>
            <Steam />
            <Rain />
            <Atmosphere theme={theme} />
            <Glass />
            {party > 0 && !calm && <Confetti key={`party-${party}`} />}
            {toots > 0 && <Toot key={`toot-${toots}`} />}
          </div>
          <WindowFrame />
          <Curtain />
          <Straps />
          <Blind text={blind} />
          <div ref={catRef} className="cat-spot">
            <Cat look={look} alert={alert} happy={party > 0 && here === STOPS.length - 1} />
          </div>
          <Ticket punched={punched} fresh={fresh} here={here} onRide={rideToStop} calm={calm} />
          <SnowToggle on={theme === "snow"} onToggle={toggleSnow} />
          <p className={`hint font-hand ${moved ? "is-gone" : ""}`} aria-hidden="true">
            scroll, drag, or press → to ride
          </p>
          {/* touch screens: ride one stop at a time */}
          <div className="stepper font-hand" role="group" aria-label="Ride">
            <button type="button" className="step step-prev" aria-label="Previous stop" disabled={here === 0} onClick={() => rideToStop(Math.ceil(engine.target / GAP - 0.02) - 1)}>
              <StepArrow />
            </button>
            {here === STOPS.length - 1 ? (
              <button type="button" className="step step-next" onClick={() => rideToStop(0)}>
                back to the start ↺
              </button>
            ) : (
              <button type="button" className="step step-next" onClick={() => rideToStop(Math.floor(engine.target / GAP + 0.02) + 1)}>
                next stop <StepArrow />
              </button>
            )}
          </div>
        </div>

        {flight && flightProject && <Flight key={flight.key} project={flightProject} rect={flight.rect} mv={mv} />}

        <AnimatePresence>
          {Study && (
            <motion.div
              key={studyId}
              ref={studyRef}
              tabIndex={-1}
              className="study"
              style={calm ? undefined : { clipPath: studyClip }}
              initial={calm ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              exit={calm ? { opacity: 0 } : { opacity: 1, transition: { duration: 0 } }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <Study project={studyProject} onClose={close} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="paper-grain" aria-hidden="true" />
      </main>
    </TrainContext.Provider>
  );
}
