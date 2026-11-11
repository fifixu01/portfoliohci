import { memo, useState } from "react";
import { AnimatePresence, motion, useTransform } from "framer-motion";
import { useLean, useTrain } from "./context.js";

const ink = { fill: "none", stroke: "var(--ink)", strokeLinecap: "round", strokeLinejoin: "round" };

// ---------- the window frame ----------

export const WindowFrame = memo(function WindowFrame() {
  return (
    <>
      <div className="window-frame" aria-hidden="true">
        <span className="frame-line frame-line-outer" />
        <span className="frame-line frame-line-inner" />
        {["tl", "tr", "bl", "br"].map((c) => (
          <span key={c} className={`rivet rivet-${c}`} />
        ))}
      </div>
      <div className="sill" aria-hidden="true" />
    </>
  );
});

// Reflections that slip across the glass a little as the scenery moves.
export function Glass() {
  const { engine, wu } = useTrain();
  const x = useTransform(() => ((engine.pos.get() * 0.05) % 160) * -wu.get());
  return (
    <div className="glass" aria-hidden="true">
      <motion.div className="glass-streaks" style={{ x }} />
      <div className="glass-edge" />
    </div>
  );
}

// ---------- things that hang ----------

function Strap({ left, k, lean }) {
  const rotate = useTransform(lean, (v) => v * (9 + k * 2.5));
  return (
    <motion.div className="strap" style={{ left, rotate }}>
      <svg viewBox="0 0 40 110" style={{ animationDelay: `${k * -1.3}s` }}>
        <g filter="url(#pencil)">
          <path d="M17,0 V62 H23 V0 Z" fill="var(--leather)" stroke="var(--ink)" strokeWidth="1.1" />
          <path d="M17,22 h6 M17,26 h6" {...ink} strokeWidth="0.7" />
          <path d="M20,60 L4,96 Q20,108 36,96 Z" fill="none" stroke="var(--ink)" strokeWidth="6.5" strokeLinejoin="round" />
          <path d="M20,60 L4,96 Q20,108 36,96 Z" fill="none" stroke="var(--strapring)" strokeWidth="4" strokeLinejoin="round" />
        </g>
      </svg>
    </motion.div>
  );
}

export const Straps = memo(function Straps() {
  const lean = useLean(46, 3.2);
  return (
    <div className="straps" aria-hidden="true">
      <div className="strap-rail" />
      {["9%", "24%", "76%", "91%"].map((l, k) => (
        <Strap key={l} left={l} k={k} lean={lean} />
      ))}
    </div>
  );
});

export const Curtain = memo(function Curtain() {
  const lean = useLean(38, 4);
  const skewX = useTransform(lean, (v) => v * 5);
  return (
    <motion.div className="curtain" style={{ skewX }} aria-hidden="true">
      <svg viewBox="0 0 90 400" preserveAspectRatio="none">
        <g filter="url(#pencil)">
          <path d="M0,0 H86 C84,70 60,150 34,196 C58,250 70,330 66,400 H0 Z" fill="var(--curtain)" stroke="var(--ink)" strokeWidth="1.4" />
          <path d="M18,4 C20,80 22,150 22,196 C22,250 18,330 16,396 M44,4 C46,70 40,150 28,196 C40,250 42,330 40,396 M66,4 C64,70 52,150 32,196" {...ink} strokeWidth="0.8" opacity="0.6" />
          <path d="M0,0 H86 C84,70 60,150 34,196 C58,250 70,330 66,400 H0 Z" fill="url(#h-sparse)" opacity="0.12" />
          {/* the tie: a band right across the gathered curtain, finished with a bow */}
          <path d="M-1,189 H38 V203 H-1 Z" fill="var(--accent)" stroke="var(--ink)" strokeWidth="1.1" />
          <g fill="var(--accent)" stroke="var(--ink)" strokeWidth="1" strokeLinejoin="round">
            <path d="M19,200 C17.5,216 15,234 9,252 L16,249 L19.5,256 C21.5,238 22,218 22,202 Z M24,200 C26,214 30,230 36,246 L29,244 L26,251 C23.5,234 22,216 21.5,202 Z" />
            {/* soft loops that hang below the knot rather than standing out sideways */}
            <path
              fillRule="evenodd"
              d="M20,193.5 C11,190 -5,195 -10,210 C-13,227 3,232 12,219 C16,213 19,205 21,200 Z M10.5,205 C6.5,203.5 0.5,206 -0.5,212 C-0.5,217.5 5,218 8.5,213 C10,210.5 10.5,208 10.5,205 Z M23,193.5 C32,190.5 47,195 53,211 C56,229 40,234 31,220 C27,214 24,205.5 22,200 Z M32.5,205.5 C36.5,204 42.5,206.5 43.5,213 C43.5,218.5 38,219 34.5,214 C33,211.5 32.5,208.5 32.5,205.5 Z"
            />
            <rect x="17.3" y="190" width="8.4" height="12" rx="2.3" />
          </g>
        </g>
      </svg>
    </motion.div>
  );
});

// ---------- destination blind ----------

export function Blind({ text }) {
  return (
    <div className="blind" role="status" aria-live="polite">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "-110%" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// ---------- seats ----------

export const Seats = memo(function Seats() {
  return (
    <div className="seats" aria-hidden="true">
      {["seat-l", "seat-r"].map((c) => (
        <svg key={c} className={`seat ${c}`} viewBox="0 0 300 200" preserveAspectRatio="xMidYMin slice">
          <g filter="url(#pencil)">
            <path d="M14,210 V62 C14,24 44,8 80,8 H220 C256,8 286,24 286,62 V210 Z" fill="var(--seat)" stroke="var(--ink)" strokeWidth="1.8" />
            <path d="M14,210 V62 C14,24 44,8 80,8 H220 C256,8 286,24 286,62 V210 Z" fill="url(#h-sparse)" opacity="0.22" />
            <path d="M232,12 C262,22 282,36 284,66 V210 H258 V70 C258,40 250,24 232,12 Z" fill="url(#h-mid)" opacity="0.3" />
            {/* lace headrest cover */}
            <path d="M70,6 H230 V58 Q220,70 210,58 Q200,70 190,58 Q180,70 170,58 Q160,70 150,58 Q140,70 130,58 Q120,70 110,58 Q100,70 90,58 Q80,70 70,58 Z" fill="var(--canvas)" stroke="var(--ink)" strokeWidth="1.2" />
            <path d="M78,48 h144" {...ink} strokeWidth="0.7" strokeDasharray="1 5" />
            <path d="M150,62 V210 M60,120 h.1 M240,120 h.1" {...ink} strokeWidth="1" opacity="0.5" />
            <circle cx="150" cy="118" r="5" fill="var(--seat-deep)" stroke="var(--ink)" strokeWidth="1" />
          </g>
        </svg>
      ))}
    </div>
  );
});

// ---------- the cat ----------

export function Cat({ look, alert, happy }) {
  const lean = useLean(50, 6);
  const skewX = useTransform(lean, (v) => v * -4);
  const headRot = useTransform(look.x, (v) => v * 8);
  const headX = useTransform(look.x, (v) => v * 3);
  const pupilX = useTransform(look.x, (v) => v * 2.6);
  const pupilY = useTransform(look.y, (v) => v * 2);
  const [pets, setPets] = useState([]);

  const pet = () => {
    const id = Date.now();
    setPets((p) => [...p.slice(-3), id]);
    setTimeout(() => setPets((p) => p.filter((x) => x !== id)), 1400);
  };

  return (
    <motion.button
      type="button"
      className={`cat ${alert ? "is-alert" : ""} ${happy || pets.length ? "is-happy" : ""}`}
      style={{ skewX }}
      onClick={pet}
      aria-label="Pet the cat"
    >
      <svg viewBox="0 0 170 150" aria-hidden="true">
        <g className="cat-tail">
          <path d="M46,132 C18,138 4,122 12,102 C16,92 28,96 24,108" fill="none" stroke="var(--ink)" strokeWidth="12" strokeLinecap="round" />
          <path d="M46,132 C18,138 4,122 12,102 C16,92 28,96 24,108" fill="none" stroke="var(--fur)" strokeWidth="9" strokeLinecap="round" />
          <path d="M12,104 C16,94 27,97 24,108" fill="none" stroke="var(--fur-patch)" strokeWidth="9" strokeLinecap="round" />
        </g>
        <g className="cat-body" filter="url(#pencil)">
          <path d="M38,138 C28,98 48,64 86,64 C118,64 132,98 124,138 Z" fill="var(--fur)" stroke="var(--ink)" strokeWidth="1.5" />
          <path d="M42,120 C40,96 52,78 70,70 C62,90 62,112 70,136 L42,137 Z" fill="var(--fur-patch)" />
          <path d="M42,120 C40,96 52,78 70,70 C62,90 62,112 70,136" fill="url(#h-mid)" opacity="0.35" />
          <path d="M82,138 C78,128 92,126 92,138 M104,138 C100,128 114,126 114,138" fill="var(--fur)" stroke="var(--ink)" strokeWidth="1.3" />
          <path d="M86,133 v4 M109,133 v4" {...ink} strokeWidth="0.8" />
        </g>
        <motion.g className="cat-head" style={{ rotate: headRot, x: headX, transformOrigin: "98px 66px" }}>
          <g filter="url(#pencil)">
            <g className="cat-ear cat-ear-l">
              <path d="M72,42 L68,8 L94,26 Z" fill="var(--fur-patch)" stroke="var(--ink)" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M76,34 L74,18 L86,27 Z" fill="var(--ear)" />
            </g>
            <g className="cat-ear cat-ear-r">
              <path d="M104,26 L128,8 L126,42 Z" fill="var(--fur)" stroke="var(--ink)" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M112,27 L123,18 L122,34 Z" fill="var(--ear)" />
            </g>
            <ellipse cx="99" cy="50" rx="32" ry="26" fill="var(--fur)" stroke="var(--ink)" strokeWidth="1.5" />
            <path d="M68,46 C70,32 82,25 96,25 C92,34 90,42 92,50 C84,54 74,52 68,46 Z" fill="var(--fur-patch)" />
            <path d="M68,46 C70,32 82,25 96,25 C92,34 90,42 92,50 C84,54 74,52 68,46 Z" fill="url(#h-mid)" opacity="0.3" />
            <path d="M70,58 l-16,-3 M70,62 l-15,3 M128,58 l16,-3 M128,62 l15,3" {...ink} strokeWidth="0.8" />
            <path d="M96,60 h6 l-3,4 Z" fill="var(--ear)" stroke="var(--ink)" strokeWidth="0.8" strokeLinejoin="round" />
            <path d="M99,64 q-4,6 -9,2 M99,64 q4,6 9,2" {...ink} strokeWidth="1.1" />
            <ellipse className="cat-blush" cx="78" cy="61" rx="5" ry="3" />
            <ellipse className="cat-blush" cx="120" cy="61" rx="5" ry="3" />
          </g>
          <g className="cat-eyes">
            <g className="eyes-open">
              <ellipse cx="86" cy="50" rx="6.4" ry="7" fill="var(--canvas)" stroke="var(--ink)" strokeWidth="1.2" />
              <ellipse cx="112" cy="50" rx="6.4" ry="7" fill="var(--canvas)" stroke="var(--ink)" strokeWidth="1.2" />
              <motion.g style={{ x: pupilX, y: pupilY }}>
                <ellipse cx="86" cy="50" rx="3.4" ry="4.6" fill="var(--ink)" />
                <ellipse cx="112" cy="50" rx="3.4" ry="4.6" fill="var(--ink)" />
                <circle cx="87.4" cy="48" r="1.2" fill="var(--canvas)" />
                <circle cx="113.4" cy="48" r="1.2" fill="var(--canvas)" />
              </motion.g>
            </g>
            <path className="eyes-happy" d="M80,52 q6,-8 12,0 M106,52 q6,-8 12,0" {...ink} strokeWidth="1.8" />
          </g>
        </motion.g>
      </svg>
      <AnimatePresence>
        {pets.map((id, i) => (
          <motion.span
            key={id}
            className="cat-heart font-hand"
            initial={{ opacity: 0, y: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: [0, 1, 1, 0], y: -54, scale: 1, rotate: i % 2 ? 12 : -8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.3, ease: "easeOut" }}
          >
            {i % 2 ? "mrrp!" : "♥"}
          </motion.span>
        ))}
      </AnimatePresence>
    </motion.button>
  );
}
