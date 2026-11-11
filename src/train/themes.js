// Moods for the ride. Each one is a palette in themes.css plus a little weather of its own
// (Atmosphere.jsx). The ride starts in snow while it is winter; the snowflake button in the cabin
// switches back to the original sketchbook look. The others are only reachable with ?theme= in the address.

export const THEMES = ["classic", "sunny", "fantasy", "snow"];

export function initialTheme() {
  const q = new URLSearchParams(window.location.search).get("theme");
  return THEMES.includes(q) ? q : "snow";
}
