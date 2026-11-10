import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SketchDefs } from "./sketch.jsx";
import { Desk } from "./desk/Desk.jsx";
import { PaperTransition } from "./desk/paper.jsx";
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
export default function App() {
  const calm = useReducedMotion();
  const [open, setOpen] = useState(null); // { project, rect }
  const [paper, setPaper] = useState(null); // "unfold" | "crumple" | null
  const [showStudy, setShowStudy] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const openProject = (project, rect) => {
    if (open || paper) return;
    setOpen({ project, rect });
    if (calm) setShowStudy(true);
    else setPaper("unfold");
  };

  const closeProject = () => {
    if (paper) return;
    setShowStudy(false);
    if (calm) setOpen(null);
    else setPaper("crumple");
  };

  const onPaperDone = () => {
    if (paper === "unfold") {
      setShowStudy(true);
      // keep the flat sheet underneath until the page has faded in over it
      setTimeout(() => setPaper(null), 400);
    } else {
      setPaper(null);
      setOpen(null);
    }
  };

  const Study = open ? STUDIES[open.project.id] : null;

  return (
    <main className="min-h-screen bg-paper text-ink">
      <SketchDefs />
      <div className="paper-grain" aria-hidden="true" />

      <Desk projects={projects} onOpen={openProject} />

      {paper && open && (
        <PaperTransition
          key={paper}
          mode={paper}
          rect={open.rect}
          seed={projects.findIndex((p) => p.id === open.project.id) * 17 + 5}
          onDone={onPaperDone}
        />
      )}

      <AnimatePresence>
        {showStudy && Study && (
          <motion.div
            key={open.project.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[100] overflow-y-auto bg-paper"
          >
            <Study project={open.project} onClose={closeProject} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
