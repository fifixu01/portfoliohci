// Moods for the ride. Each one is a palette in themes.css plus a little weather of its own
// (Atmosphere.jsx). `dab` is the two-colour swatch on the picker: sky over ground.

export const THEMES = [
  { id: "classic", label: "sketchbook", dab: ["#bcd3d6", "#b3ad79"] },
  { id: "sunny", label: "sunny day", dab: ["#7cc4ea", "#b3d95f"] },
  { id: "fantasy", label: "pink fantasy", dab: ["#f7b7d8", "#b9a3ee"] },
  { id: "snow", label: "snow day", dab: ["#b9c9d6", "#ffffff"] },
];

const KEY = "fiora-line-mood";
const ids = THEMES.map((t) => t.id);

export function initialTheme() {
  const q = new URLSearchParams(window.location.search).get("theme");
  if (ids.includes(q)) return q;
  try {
    const saved = window.localStorage.getItem(KEY);
    if (ids.includes(saved)) return saved;
  } catch {
    /* private mode: no saved mood */
  }
  return "classic";
}

export function saveTheme(id) {
  try {
    window.localStorage.setItem(KEY, id);
  } catch {
    /* private mode */
  }
}
