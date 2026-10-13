import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Cover, HangingWire, Plaque, SketchDefs, SketchFrame } from "./sketch.jsx";
import { HciStudy, NbStudy, VizStudy, WebStudy } from "./studies.jsx";

// Add `cover: "my-drawing.png"` (a file in public/) to any project to replace its engraved drawing.
const projects = [
  { id: "hci", title: "Social Butterflies", meta: "HCI case study", frame: "ornate", depth: 1 },
  { id: "viz", title: "MBTA Data Visualization", meta: "Interactive storytelling", frame: "matted", depth: 0.45 },
  { id: "web", title: "GameNite", meta: "Full-stack project", frame: "classic", depth: 0.7 },
  { id: "nb", title: "Notability on Your Wrist", meta: "Hackathon · 4th place", frame: "thin", depth: 0.3 },
];

const STUDIES = { hci: HciStudy, viz: VizStudy, web: WebStudy, nb: NbStudy };

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

// ---------- small pieces ----------

function HandNote({ children, className = "" }) {
  return <p className={`font-hand text-[1.35rem] leading-none text-graphite ${className}`}>{children}</p>;
}

function Kicker({ children, className = "" }) {
  return <p className={`font-serif text-[13px] uppercase tracking-[0.2em] text-pencil ${className}`}>{children}</p>;
}

// Frames at different "distances" slide at slightly different speeds as you walk past.
function WallFrame({ project, index, progress, onOpen, sizeClass, className = "", parallax = true }) {
  const x = useTransform(progress, [0, 1], [0, parallax ? -160 * project.depth : 0]);
  return (
    <motion.div style={{ x }} className={`flex flex-col items-center ${className}`}>
      <motion.button
        type="button"
        onClick={(event) => onOpen(project, event.currentTarget.getBoundingClientRect())}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.985 }}
        className={`group relative outline-none ${sizeClass}`}
        aria-label={`Open ${project.title}`}
      >
        <HangingWire />
        <SketchFrame
          variant={project.frame}
          seed={index * 13 + 3}
          className="h-full w-full transition-shadow duration-500 ease-out group-hover:shadow-frame-lift"
        >
          <div className="h-full w-full p-3 transition-transform duration-700 ease-out group-hover:scale-[1.025]">
            <Cover project={project} />
          </div>
        </SketchFrame>
      </motion.button>
      <Plaque title={project.title} meta={project.meta} className="mt-7" />
    </motion.div>
  );
}

// ---------- the three rooms ----------

function Intro({ progress }) {
  const noteOpacity = useTransform(progress, [0, 0.08], [1, 0]);
  return (
    <section className="relative flex min-h-screen w-screen items-center justify-center px-8 py-28 md:px-16 md:py-0">
      <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-16 md:grid-cols-[minmax(0,19rem)_1fr] md:gap-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-[16rem] -rotate-[0.6deg] md:w-[19rem]"
        >
          <div className="relative aspect-[4/5]">
            <HangingWire drop={64} />
            <SketchFrame variant="deep" seed={4} className="h-full w-full">
              <img src={`${import.meta.env.BASE_URL}bday.jpg`} alt="Fiora Xu" className="h-full w-full object-cover" />
            </SketchFrame>
          </div>
          <HandNote className="absolute -bottom-9 -right-2 rotate-[-4deg] text-accent">that’s me ↑</HandNote>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <Kicker>Portfolio</Kicker>
          <h1 className="font-display mt-4 text-6xl font-light leading-[0.95] md:text-[6.5rem]">
            Fiora <span className="italic">Xu</span>
          </h1>
          <p className="mt-7 max-w-[56ch] font-serif text-[1.2rem] leading-[1.65] text-graphite md:text-[1.3rem]">
            I’m Fiora Xu, a 21-year-old Computer Science major with a concentration in Human-Centered Computing at Northeastern University. I’m passionate about product management, UI/UX, product design, and quality assurance, with experience in QA and building web-based projects. I enjoy working at the intersection of design and functionality—thinking about how products not only work, but feel to use.
          </p>
          <p className="mt-7 font-serif text-[13px] uppercase tracking-[0.18em] text-pencil">
            {["Product / PM", "UI/UX", "HCI", "Frontend", "Data Visualization"].join("  ·  ")}
          </p>
          <motion.div style={{ opacity: noteOpacity }} className="mt-12 hidden md:block">
            <HandNote className="flex items-center gap-2">
              keep scrolling to walk along the wall <ArrowRight size={18} strokeWidth={1.5} />
            </HandNote>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Wall({ progress, onOpen, stacked }) {
  const [hci, viz, web, nb] = projects;
  return (
    <section className="relative flex min-h-screen w-screen items-center justify-center px-8 py-24 md:px-16 md:py-0 md:pb-[9vh]">
      <div className="w-full max-w-6xl">
        <div className="mb-16 flex items-end justify-between md:mb-6">
          <div>
            <Kicker>Selected work</Kicker>
            <h2 className="font-display mt-3 text-4xl font-light md:text-5xl">Four projects</h2>
          </div>
          <HandNote className="hidden md:block">click a frame to step inside</HandNote>
        </div>

        {stacked ? (
          <div className="flex flex-col items-center gap-24">
            <WallFrame project={hci} index={0} progress={progress} onOpen={onOpen} sizeClass="h-[22rem] w-[17rem]" parallax={false} />
            <WallFrame project={viz} index={1} progress={progress} onOpen={onOpen} sizeClass="h-[13rem] w-[17rem]" parallax={false} />
            <WallFrame project={web} index={2} progress={progress} onOpen={onOpen} sizeClass="h-[16rem] w-[13rem]" parallax={false} />
            <WallFrame project={nb} index={3} progress={progress} onOpen={onOpen} sizeClass="h-[20rem] w-[15rem]" parallax={false} />
          </div>
        ) : (
          // salon hang: one hero, a landscape over a small portrait, a tall piece on the right
          <div className="grid grid-cols-[19rem_13rem_14.5rem] items-end justify-between gap-x-10">
            <WallFrame project={hci} index={0} progress={progress} onOpen={onOpen} sizeClass="h-[24rem] w-[19rem]" className="row-span-2" />
            <WallFrame project={viz} index={1} progress={progress} onOpen={onOpen} sizeClass="h-[10rem] w-[13rem]" className="self-end" />
            <WallFrame project={nb} index={3} progress={progress} onOpen={onOpen} sizeClass="h-[19rem] w-[14rem]" className="row-span-2 mb-6 self-center" />
            <WallFrame project={web} index={2} progress={progress} onOpen={onOpen} sizeClass="h-[13rem] w-[10.5rem]" className="ml-8 mt-16 self-start" />
          </div>
        )}
      </div>
    </section>
  );
}

function Exit() {
  return (
    <section className="relative flex min-h-screen w-screen items-center justify-center px-8 md:px-16">
      <div className="w-full max-w-3xl">
        <Kicker>Exit</Kicker>
        <h2 className="font-display mt-4 text-6xl font-light leading-[0.95] md:text-[6rem]">
          Thanks for <span className="italic">walking through.</span>
        </h2>
        <p className="mt-8 max-w-[58ch] font-serif text-[1.2rem] leading-[1.65] text-graphite">
          I’m especially interested in opportunities in product management, UI/UX, product design, and quality assurance, where I can continue building thoughtful, user-centered experiences. If anything here resonated with you, I’d love to connect.
        </p>
        <div className="mt-12 flex flex-col gap-5 font-display text-2xl font-light md:text-3xl">
          <a href="mailto:msfiora@gmail.com" className="ink-link w-fit">
            msfiora@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/fiora-xu-17b00223a"
            target="_blank"
            rel="noreferrer"
            className="ink-link inline-flex w-fit items-center gap-2"
          >
            LinkedIn <ArrowUpRight size={22} strokeWidth={1.25} />
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------- the walk ----------

function Baseboard() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0">
      <div className="baseboard h-[9vh] w-full" />
    </div>
  );
}

function GalleryWalk({ onOpen }) {
  const desktop = useMediaQuery("(min-width: 900px)");
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0.03, 0.97], ["0vw", "-200vw"]);
  const dot = useTransform(scrollYProgress, [0.03, 0.97], ["0%", "100%"]);

  if (!desktop) {
    return (
      <div className="wall-light relative">
        <Intro progress={scrollYProgress} />
        <Wall progress={scrollYProgress} onOpen={onOpen} stacked />
        <Exit />
      </div>
    );
  }

  return (
    <div className="relative h-[340vh]">
      <div className="wall-light sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ x, willChange: "transform" }} className="relative flex h-full w-[300vw]">
          <Baseboard />
          <Intro progress={scrollYProgress} />
          <Wall progress={scrollYProgress} onOpen={onOpen} />
          <Exit />
        </motion.div>

        {/* where you are along the wall */}
        <div className="pointer-events-none absolute bottom-7 left-1/2 w-56 -translate-x-1/2">
          <div className="relative h-px bg-ink/30">
            {[0, 50, 100].map((p) => (
              <span key={p} className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-ink/40" style={{ left: `${p}%` }} />
            ))}
            <motion.span style={{ left: dot }} className="absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Clip-path inset that matches a frame's on-screen rectangle, so the study opens out of its frame.
function insetFor(rect) {
  if (!rect) return "inset(40% 40% 40% 40% round 4px)";
  return `inset(${rect.top}px ${window.innerWidth - rect.right}px ${window.innerHeight - rect.bottom}px ${rect.left}px round 4px)`;
}

export default function App() {
  const [open, setOpen] = useState(null); // { project, rect }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const Study = open ? STUDIES[open.project.id] : null;

  return (
    <main className="min-h-screen bg-paper text-ink">
      <SketchDefs />
      <div className="paper-grain" aria-hidden="true" />

      <GalleryWalk onOpen={(project, rect) => setOpen({ project, rect })} />

      <AnimatePresence>
        {open && (
          <motion.div
            key={open.project.id}
            initial={{ clipPath: insetFor(open.rect) }}
            animate={{ clipPath: "inset(0px 0px 0px 0px round 0px)" }}
            exit={{ clipPath: insetFor(open.rect) }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] overflow-y-auto bg-paper"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <Study project={open.project} onClose={() => setOpen(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
