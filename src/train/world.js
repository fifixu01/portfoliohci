// The route. Everything outside the window is laid out in "world units": the window opening is
// always 600 units tall, and one stop sits every GAP units along the line.

export const VIEW_H = 600;
export const GAP = 1200;
export const GROUND = 532; // where billboards and signs stand

// `punch` is the shape the conductor's punch leaves in the ticket for that stop.
export const STOPS = [
  { id: "home", kind: "station", label: "Home", name: "Fiora Xu Station", punch: "circle" },
  { id: "face", kind: "project", label: "Face", name: "Face Analyzer", punch: "heart" },
  { id: "viz", kind: "project", label: "MBTA", name: "MBTA Data Visualization", punch: "star" },
  { id: "web", kind: "project", label: "Games", name: "GameNite", punch: "diamond" },
  { id: "nb", kind: "project", label: "Watch", name: "Notability on Your Wrist", punch: "clover" },
  { id: "about", kind: "terminus", label: "Hello", name: "About and contact", punch: "circle" },
];

export const stopX = (i) => i * GAP;
export const MAX = stopX(STOPS.length - 1);
export const stopIndex = (id) => STOPS.findIndex((s) => s.id === id);

export const nearestStop = (x) => Math.max(0, Math.min(STOPS.length - 1, Math.round(x / GAP)));

// Where to put something in a parallax layer so it sits `dx` units from the middle of the
// window when the train is stopped at `stop`.
export const at = (stop, depth, dx = 0) => stop * GAP * depth + dx;

export const TIMES = ["dawn", "day", "dusk", "night"];

export function timeFromHour(h) {
  if (h >= 5 && h < 8) return "dawn";
  if (h >= 8 && h < 16) return "day";
  if (h >= 16 && h < 19) return "dusk";
  return "night";
}

export const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

// Birds sit on the top wire and take off as the train comes up on them. Their x is in the pole
// layer (depth 1.5), where poles stand at 450 + 900k and the wire sags 34 units between them.
const perch = (k, t) => ({ x: 450 + 900 * k + 900 * t, y: 58 + 4 * 34 * t * (1 - t) });
export const BIRDS = [
  { ...perch(1, 0.36), n: 3 },
  { ...perch(3, 0.62), n: 2 },
  { ...perch(4, 0.3), n: 4 },
  { ...perch(6, 0.55), n: 3 },
  { ...perch(8, 0.42), n: 2 },
  { ...perch(9, 0.7), n: 3 },
];
