import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SketchDefs } from "./sketch.jsx";
import { Desk } from "./desk/Desk.jsx";
import { FaceStudy, NbStudy, VizStudy, WebStudy } from "./studies.jsx";

// Add `cover: "my-drawing.png"` (a file in public/) to any project to replace its engraved drawing.
// Where each project sits on the desk is set in src/desk/Desk.jsx.
const projects = [
  { id: "face", title: "Face Analyzer", meta: "Computer vision · Web app", frame: "ornate", depth: 1 },
  { id: "viz", title: "MBTA Data Visualization", meta: "Interactive storytelling", frame: "matted", depth: 0.45 },
  { id: "web", title: "GameNite", meta: "Full-stack project", frame: "classic", depth: 0.7 },
  { id: "nb", title: "Notability on Your Wrist", meta: "Hackathon · 4th place", frame: "thin", depth: 0.3 },
];

const STUDIES = { face: FaceStudy, viz: VizStudy, web: WebStudy, nb: NbStudy };

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

      <Desk projects={projects} onOpen={(project, rect) => setOpen({ project, rect })} />

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
