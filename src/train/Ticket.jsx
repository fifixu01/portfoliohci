import { motion, useTransform } from "framer-motion";
import { useTrain } from "./context.js";
import { MAX, STOPS } from "./world.js";

// a little sun: sixteen points, alternating long and short
const SUN = `M${Array.from({ length: 16 }, (_, i) => {
  const a = (i * Math.PI) / 8 - Math.PI / 2;
  const r = i % 2 ? 4.9 : 8.2;
  return `${(12 + Math.cos(a) * r).toFixed(2)},${(12 + Math.sin(a) * r).toFixed(2)}`;
}).join(" L")} Z`;

const SHAPES = {
  sun: SUN,
  circle: "M12,5 a7,7 0 1 0 .01,0 Z",
  heart: "M12,19 C4,13 3,8 6.5,6 C9,4.8 11.4,6.4 12,8.4 C12.6,6.4 15,4.8 17.5,6 C21,8 20,13 12,19 Z",
  star: "M12,4 L14.2,9.4 L20,9.8 L15.6,13.6 L17,19.2 L12,16.2 L7,19.2 L8.4,13.6 L4,9.8 L9.8,9.4 Z",
  diamond: "M12,4 L19,12 L12,20 L5,12 Z",
  clover: "M12,12 C8,4 16,4 12,12 C20,8 20,16 12,12 C16,20 8,20 12,12 C4,16 4,8 12,12 Z",
};

// The conductor's punch: swoops in, squeezes, leaves.
function Puncher() {
  return (
    <motion.svg
      className="puncher"
      viewBox="0 0 90 90"
      initial={{ x: 46, y: 60, rotate: 24, opacity: 0 }}
      animate={{ x: [46, 0, 0, 0, 50], y: [60, 0, 0, 0, 64], rotate: [24, 0, 0, 0, 20], opacity: [0, 1, 1, 1, 0] }}
      transition={{ duration: 1.05, times: [0, 0.3, 0.42, 0.62, 1], ease: "easeInOut" }}
      aria-hidden="true"
    >
      <g filter="url(#pencil)">
        <motion.g style={{ transformOrigin: "36px 36px" }} animate={{ rotate: [0, 0, 13, 0, 0] }} transition={{ duration: 1.05, times: [0, 0.3, 0.42, 0.56, 1] }}>
          <path d="M8,6 C18,2 30,12 38,30 L84,62 C88,66 84,74 78,70 L30,42 C16,36 6,20 8,6 Z" fill="var(--steel)" stroke="var(--ink)" strokeWidth="1.4" strokeLinejoin="round" />
        </motion.g>
        <motion.g style={{ transformOrigin: "36px 36px" }} animate={{ rotate: [0, 0, -13, 0, 0] }} transition={{ duration: 1.05, times: [0, 0.3, 0.42, 0.56, 1] }}>
          <path d="M6,8 C2,18 12,30 30,38 L62,84 C66,88 74,84 70,78 L42,30 C36,16 20,6 6,8 Z" fill="var(--steel)" stroke="var(--ink)" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M50,60 L64,80" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
        </motion.g>
        <circle cx="36" cy="36" r="3.4" fill="var(--canvas)" stroke="var(--ink)" strokeWidth="1.1" />
      </g>
    </motion.svg>
  );
}

export function Ticket({ punched, fresh, here, onRide, calm }) {
  const { engine } = useTrain();
  const x = useTransform(engine.pos, (p) => `${(p / MAX) * 100}%`);
  const done = punched.includes("about");

  return (
    <nav className="ticket" aria-label="Route">
      <div className="ticket-paper">
        <div className="ticket-head">
          <span className="font-display">Fiora Line</span>
          <span className="ticket-small">one way · window seat</span>
        </div>
        <div className="ticket-route">
          <svg className="ticket-rail" viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,2 H100" stroke="var(--ink)" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="1 3" strokeLinecap="round" />
          </svg>
          <motion.div className="ticket-train" style={{ x }} aria-hidden="true">
            <svg viewBox="0 0 34 22">
              <g filter="url(#pencil)">
                <path d="M2,16 V4.5 H11.5 V8 H25 Q29,8 29,12 V16 Z" fill="var(--accent)" stroke="var(--ink)" strokeWidth="1.1" strokeLinejoin="round" />
                <path d="M29,13 l4,3.4 h-4 Z M20,8 V3.4 h-1.4 h4.8 h-1.4 V8" fill="var(--ink)" stroke="var(--ink)" strokeWidth="0.8" strokeLinejoin="round" />
                <rect x="4.4" y="6.8" width="4.6" height="4" fill="var(--canvas)" stroke="var(--ink)" strokeWidth="0.7" />
                <circle cx="7" cy="17" r="3.2" fill="var(--canvas)" stroke="var(--ink)" strokeWidth="1.1" />
                <circle cx="16" cy="17.6" r="2.6" fill="var(--canvas)" stroke="var(--ink)" strokeWidth="1.1" />
                <circle cx="24" cy="17.6" r="2.6" fill="var(--canvas)" stroke="var(--ink)" strokeWidth="1.1" />
                <path d="M7,17 H24" stroke="var(--ink)" strokeWidth="0.9" />
              </g>
            </svg>
          </motion.div>
          <ol>
            {STOPS.map((s, i) => {
              const hole = punched.includes(s.id);
              const isFresh = fresh === s.id && !calm;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    className={`ticket-stop ${here === i ? "is-here" : ""}`}
                    onClick={() => onRide(i)}
                    aria-label={`Ride to ${s.name}${hole && i ? " (visited)" : ""}`}
                    aria-current={here === i ? "location" : undefined}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="8.5" fill="var(--ticket)" stroke="var(--ink)" strokeWidth="1.1" strokeDasharray={hole ? undefined : "2 2.4"} />
                      {hole && (
                        <motion.path
                          d={SHAPES[s.punch]}
                          className="ticket-hole"
                          style={{ transformOrigin: "12px 12px" }}
                          initial={isFresh ? { scale: 0 } : false}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.44, type: "spring", stiffness: 600, damping: 14 }}
                        />
                      )}
                    </svg>
                    <span className="ticket-label">{s.label}</span>
                    {isFresh && (
                      <>
                        <Puncher />
                        <motion.span
                          className="ticket-click font-hand"
                          initial={{ opacity: 0, y: 4, scale: 0.6 }}
                          animate={{ opacity: [0, 1, 1, 0], y: -20, scale: 1 }}
                          transition={{ delay: 0.44, duration: 0.8 }}
                          aria-hidden="true"
                        >
                          click!
                        </motion.span>
                        <motion.svg
                          className="ticket-chad"
                          viewBox="0 0 24 24"
                          initial={{ opacity: 0, y: 0, rotate: 0 }}
                          animate={{ opacity: [0, 1, 1, 0], y: 46, x: -10, rotate: 200 }}
                          transition={{ delay: 0.46, duration: 0.9, ease: "easeIn" }}
                          aria-hidden="true"
                        >
                          <path d={SHAPES[s.punch]} fill="var(--ticket)" stroke="var(--ink)" strokeWidth="1" />
                        </motion.svg>
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
        {done && (
          <motion.span
            className="ticket-stamp font-display"
            initial={calm ? false : { scale: 2.4, opacity: 0, rotate: -24 }}
            animate={{ scale: 1, opacity: 1, rotate: -9 }}
            transition={{ delay: 1, type: "spring", stiffness: 500, damping: 18 }}
            aria-hidden="true"
          >
            end of the line ♥
          </motion.span>
        )}
      </div>
    </nav>
  );
}
