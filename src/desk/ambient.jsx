import { motion } from "framer-motion";
import { rng } from "../rough.js";

const forever = (duration, opts = {}) => ({ duration, repeat: Infinity, ease: "easeInOut", ...opts });

// Dust specks drifting in the sunbeam. Positions are seeded so they're stable between renders.
const r = rng(42);
const MOTES = Array.from({ length: 22 }, () => ({
  left: 8 + r() * 84,
  top: 6 + r() * 88,
  size: 1.5 + r() * 2.5,
  dx: (r() - 0.5) * 60,
  dy: -20 - r() * 50,
  dur: 14 + r() * 18,
  delay: r() * -20,
}));

function Dust({ calm }) {
  return MOTES.map((m, i) => (
    <motion.span
      key={i}
      className="absolute rounded-full bg-[#fffaf0]"
      style={{ left: `${m.left}%`, top: `${m.top}%`, width: m.size, height: m.size }}
      animate={calm ? { opacity: 0.6 } : { x: [0, m.dx, 0], y: [0, m.dy, 0], opacity: [0, 0.9, 0.5, 0.9, 0] }}
      transition={forever(m.dur, { delay: m.delay })}
    />
  ));
}

// Sunlight from a window off-screen to the left: six soft panes that slide slowly across
// the desk, and dim now and then as a cloud passes.
export function WindowLight({ calm }) {
  return (
    <>
      <div className="desk-shade pointer-events-none absolute inset-0 z-[39]" aria-hidden="true" />
      <motion.div
        aria-hidden="true"
        className="desk-light pointer-events-none absolute inset-0 z-[40] overflow-hidden mix-blend-screen"
        animate={calm ? undefined : { opacity: [1, 1, 0.3, 0.3, 1, 1] }}
        transition={forever(48, { times: [0, 0.5, 0.6, 0.74, 0.86, 1] })}
      >
        <motion.div
          className="absolute"
          style={{ left: "14%", top: "-30%", width: "64vw", height: "150vh", rotate: -26, skewX: -14, willChange: "transform" }}
          animate={calm ? undefined : { x: ["-8vw", "8vw"] }}
          transition={forever(75, { repeatType: "mirror" })}
        >
          <div className="grid h-full w-full grid-cols-2 grid-rows-3 gap-[5%]">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="window-pane" />
            ))}
          </div>
          <div className="absolute inset-0">
            <Dust calm={calm} />
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

// The shadow of a houseplant on the windowsill, swaying in a draft.
export function PlantShadow({ calm }) {
  const leaves = [
    [0, 0, 150, -32],
    [0, 0, 120, -58],
    [0, 0, 170, -12],
    [0, 0, 110, 14],
    [0, 0, 135, -78],
  ];
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 400 400"
      className="plant-shadow pointer-events-none absolute -right-[3vw] -top-[4vh] z-[41] h-[48vh] w-[48vh]"
      style={{ originX: 1, originY: 0 }}
      animate={calm ? undefined : { rotate: [-2.5, 2, -1, 2.5, -2.5] }}
      transition={forever(13)}
    >
      <g transform="translate(400 0) rotate(100)">
        {leaves.map(([, , len, ang], i) => (
          <motion.g
            key={i}
            style={{ originX: 0, originY: 0 }}
            animate={calm ? undefined : { rotate: [ang - 3, ang + 4, ang - 3] }}
            transition={forever(4.5 + i * 1.3, { delay: i * 0.7 })}
          >
            <path d={`M0,0 L${len * 0.55},0`} stroke="currentColor" strokeWidth="4" />
            <path
              d={`M${len * 0.45},0 C${len * 0.6},-${len * 0.2} ${len * 0.95},-${len * 0.16} ${len * 1.25},0 C${len * 0.95},${len * 0.16} ${len * 0.6},${len * 0.2} ${len * 0.45},0 Z`}
              fill="currentColor"
            />
          </motion.g>
        ))}
      </g>
    </motion.svg>
  );
}
