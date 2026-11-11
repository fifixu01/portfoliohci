// Moods for the ride. Each one is a palette in themes.css plus a little weather of its own
// (Atmosphere.jsx). The ride always starts in the original sketchbook look; the snowflake button
// in the cabin switches to snow. The others are only reachable with ?theme= in the address.

export const THEMES = ["classic", "sunny", "fantasy", "snow"];

export function initialTheme() {
  const q = new URLSearchParams(window.location.search).get("theme");
  return THEMES.includes(q) ? q : "classic";
}
