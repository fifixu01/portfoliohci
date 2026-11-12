import { lazy, Suspense } from "react";
import Train from "./train/Train.jsx";
import { DayStudy, FaceStudy, NbStudy, VizStudy, WebStudy } from "./studies.jsx";

// The homepage is a train ride (src/train). The old desk homepage is kept, unused, in
// src/desk; add ?desk to the URL to see it for comparison.
const DeskHome = lazy(() => import("./desk/DeskHome.jsx"));

// Add `cover: "my-drawing.png"` (a file in public/) to any project to replace its engraved drawing.
// The order here is the order of the stops along the line.
const projects = [
  { id: "day", title: "Scroll Through a Day", meta: "Full-stack · Journal app", frame: "matted", depth: 0.6 },
  { id: "face", title: "Face Analyzer", meta: "Computer vision · Web app", frame: "ornate", depth: 1 },
  { id: "nb", title: "Notability on Your Wrist", meta: "Hackathon · 4th place", frame: "thin", depth: 0.3 },
  { id: "web", title: "GameNite", meta: "Full-stack project", frame: "classic", depth: 0.7 },
  { id: "viz", title: "MBTA Data Visualization", meta: "Interactive storytelling", frame: "matted", depth: 0.45 },
];

const STUDIES = { day: DayStudy, face: FaceStudy, viz: VizStudy, web: WebStudy, nb: NbStudy };

const showDesk = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("desk");

export default function App() {
  if (showDesk) {
    return (
      <Suspense fallback={null}>
        <DeskHome projects={projects} studies={STUDIES} />
      </Suspense>
    );
  }
  return <Train projects={projects} studies={STUDIES} />;
}
