import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BusinessCard, Die, GameCards, Mug, Notebook, Pencil, Polaroid, StickyNote, SubwayMap, Watch } from "./objects.jsx";
import { u } from "./units.js";
import { PlantShadow, WindowLight } from "./ambient.jsx";

// Where everything sits on a desktop screen: x/y in % of the viewport, w/h in desk units, r in degrees.
// On phones the same objects stack into a column (see `m` for the sideways nudge).
const ITEMS = [
  { id: "notebook", Comp: Notebook, x: 4, y: 5, w: 33, h: 34, r: -3, m: -4 },
  { id: "sticky", Comp: StickyNote, x: 30, y: 53, w: 15, h: 15, r: 5, m: 14 },
  { id: "face", project: "face", Comp: Polaroid, x: 41, y: 7, w: 19, h: 23.5, r: -5, m: -8 },
  { id: "viz", project: "viz", Comp: SubwayMap, x: 62, y: 7, w: 30, h: 22, r: 3, m: 4 },
  { id: "nb", project: "nb", Comp: Watch, x: 46.5, y: 49, w: 10, h: 27, r: -13, m: -10 },
  { id: "web", project: "web", Comp: GameCards, x: 66.5, y: 50, w: 13, h: 18.5, r: 8, m: 10 },
  { id: "die", Comp: Die, x: 78.5, y: 79, w: 4.2, h: 4.2, r: 14, m: 30 },
  { id: "mug", Comp: Mug, x: 82, y: 42, w: 15.5, h: 12, r: -8, m: -16 },
  { id: "card", Comp: BusinessCard, x: 6, y: 64, w: 22, h: 13, r: -4, m: 6 },
  { id: "pencil", Comp: Pencil, x: 19, y: 84, w: 28, h: 1.7, r: -7, m: 0 },
];

const REST = "drop-shadow(0 1px 1px rgba(30,26,20,0.22)) drop-shadow(0 8px 10px rgba(30,26,20,0.16))";
const LIFT = "drop-shadow(0 4px 4px rgba(30,26,20,0.16)) drop-shadow(0 28px 26px rgba(30,26,20,0.22))";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => (typeof window !== "undefined" ? window.matchMedia(query).matches : true));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

function DeskItem({ item, project, index, z, desktop, deskRef, calm, onFront, onOpen, onMoved }) {
  const ref = useRef(null);
  const dragged = useRef(false);
  const { Comp } = item;
  const open = () => {
    if (project && !dragged.current) onOpen(project, ref.current.getBoundingClientRect());
  };

  const place = desktop
    ? { position: "absolute", left: `${item.x}%`, top: `${item.y}%`, zIndex: z }
    : { position: "relative", translate: `${item.m}% 0`, zIndex: z };

  return (
    <motion.div
      ref={ref}
      role={project ? "button" : undefined}
      tabIndex={project ? 0 : undefined}
      aria-label={project ? `Open ${project.title}` : undefined}
      data-project={project ? "" : undefined}
      className="desk-item shrink-0"
      style={{ ...place, width: u(item.w), height: u(item.h), rotate: item.r }}
      drag={desktop}
      dragConstraints={deskRef}
      dragElastic={0.06}
      dragTransition={{ power: 0.14, timeConstant: 240 }}
      onPointerDown={() => {
        dragged.current = false;
        onFront(item.id);
      }}
      onDragStart={() => {
        dragged.current = true;
        onMoved();
      }}
      onClick={open}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), open())}
      initial={{ opacity: 0, scale: 1.08, filter: LIFT }}
      animate={{ opacity: 1, scale: 1, filter: REST }}
      whileHover={{ scale: 1.015 }}
      whileDrag={{ scale: 1.05, filter: LIFT }}
      transition={{ duration: 0.7, delay: 0.15 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Comp project={project} calm={calm} />
    </motion.div>
  );
}

export function Desk({ projects, onOpen }) {
  const deskRef = useRef(null);
  const calm = useReducedMotion();
  const desktop = useMediaQuery("(min-width: 900px)");
  const [order, setOrder] = useState(() => ITEMS.map((i) => i.id));
  const [moved, setMoved] = useState(false);
  const byId = Object.fromEntries(projects.map((p) => [p.id, p]));

  const toFront = (id) => setOrder((o) => (o[o.length - 1] === id ? o : [...o.filter((x) => x !== id), id]));

  return (
    <section
      ref={deskRef}
      className={`desk relative w-full overflow-hidden ${desktop ? "h-[100svh]" : "flex min-h-[100svh] flex-col items-center gap-[calc(var(--u)*7)] py-[calc(var(--u)*8)]"}`}
    >
      <WindowLight calm={calm} />
      <PlantShadow calm={calm} />

      {ITEMS.map((item, i) => (
        <DeskItem
          key={item.id}
          item={item}
          project={item.project ? byId[item.project] : null}
          index={i}
          z={order.indexOf(item.id) + 1}
          desktop={desktop}
          deskRef={deskRef}
          calm={calm}
          onFront={toFront}
          onOpen={onOpen}
          onMoved={() => setMoved(true)}
        />
      ))}

      <AnimatePresence>
        {desktop && !moved && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.4 } }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="pointer-events-none absolute bottom-[3.5vh] right-[4vw] z-[45] font-hand text-graphite"
            style={{ fontSize: u(1.5) }}
          >
            pick things up and move them around · click a project to look closer
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
