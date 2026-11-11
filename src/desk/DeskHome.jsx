import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SketchDefs } from "../sketch.jsx";
import { Desk } from "./Desk.jsx";
import { PaperTransition } from "./paper.jsx";

// The previous homepage (an interactive desk), kept for comparison. Not used unless the URL has ?desk.
export default function DeskHome({ projects, studies: STUDIES }) {
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
