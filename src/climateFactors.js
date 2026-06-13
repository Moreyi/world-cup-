// Climate / heat-stress factor: combines venue June–July climate, kickoff time,
// and stadium type (roofed/air-conditioned vs open) into a heat-stress score.
//
// Why it matters (see docs/forecast-accuracy-research.md): 2026 is a summer
// North-American World Cup with many midday kickoffs (scheduled for European
// prime-time TV). Extreme heat + humidity sap high-press, high-tempo teams and
// favor heat-adapted sides and low-block, ball-retention styles. Like the
// officiating factor, heat barely moves the expected WINNER between evenly
// adapted teams, so the Elo nudge is small and only applied as an *edge to the
// heat-adapted side*; its larger effect is lower total goals + higher variance.

// Venue June–July heat profile. heat: 0 (cool) … 3 (extreme). roofed/AC venues
// are clamped down because climate control removes most of the stress.
// Sourced from city climate norms + known 2026 stadium types.
const VENUE_CLIMATE = [
  { pattern: /BBVA|Monterrey|Guadalupe/i, heat: 3, humid: false, controlled: false }, // very hot, dry
  { pattern: /Hard Rock|Miami/i, heat: 3, humid: true, controlled: false }, // hot + very humid
  { pattern: /NRG|Houston/i, heat: 1, humid: true, controlled: true }, // hot/humid but roofed+AC
  { pattern: /AT&T|Arlington|Dallas/i, heat: 1, humid: false, controlled: true }, // roofed+AC
  { pattern: /Mercedes-Benz|Atlanta/i, heat: 1, humid: true, controlled: true }, // roofed+AC
  { pattern: /Arrowhead|Kansas/i, heat: 2, humid: true, controlled: false },
  { pattern: /Akron|Guadalajara/i, heat: 2, humid: false, controlled: false },
  { pattern: /Banorte|Azteca|Mexico City/i, heat: 1, humid: false, controlled: false }, // altitude keeps it mild
  { pattern: /Lincoln Financial|Philadelphia/i, heat: 2, humid: true, controlled: false },
  { pattern: /MetLife|Rutherford/i, heat: 2, humid: true, controlled: false },
  { pattern: /Gillette|Foxborough/i, heat: 1, humid: true, controlled: false },
  { pattern: /SoFi|Inglewood/i, heat: 1, humid: false, controlled: true }, // mild LA + roof
  { pattern: /Levi's|Santa Clara/i, heat: 2, humid: false, controlled: false },
  { pattern: /Lumen|Seattle/i, heat: 0, humid: false, controlled: false },
  { pattern: /BC Place|Vancouver/i, heat: 0, humid: false, controlled: true },
  { pattern: /BMO|Toronto/i, heat: 1, humid: true, controlled: false }
];

// Teams whose players largely come from hot/humid domestic or club climates and
// historically handle heat better than Northern-European sides.
export const HEAT_ADAPTED = new Set([
  "Mexico", "Morocco", "Saudi Arabia", "Qatar", "Tunisia", "Egypt", "Iran", "Iraq",
  "Senegal", "Ghana", "Ivory Coast", "DR Congo", "Cape Verde", "Curacao", "Haiti",
  "Brazil", "Colombia", "Ecuador", "Paraguay", "Uruguay", "Panama", "Jamaica",
  "United States", "Australia", "Algeria", "Jordan", "Uzbekistan", "South Africa"
]);

function venueClimate(venueName) {
  if (!venueName) return null;
  return VENUE_CLIMATE.find((entry) => entry.pattern.test(venueName)) ?? null;
}

// Heat-stress score 0..3 for a match, combining venue, kickoff hour (local ET
// from the calendar), humidity, and whether the stadium is climate-controlled.
export function heatStress(venueName, timeET) {
  const c = venueClimate(venueName);
  if (!c) return { score: 0, level: "unknown", controlled: false };
  let score = c.heat;
  if (c.humid) score += 0.5;
  // Midday/early-afternoon kickoffs (12:00–16:59 ET) are the punishing ones.
  const hour = timeET ? Number(String(timeET).slice(0, 2)) : null;
  if (hour !== null && hour >= 12 && hour < 17) score += 1;
  if (c.controlled) score = Math.min(score, 1); // roof + AC caps the stress
  score = Math.max(0, Math.min(3, score));
  const level = score >= 2.5 ? "extreme" : score >= 1.5 ? "high" : score >= 0.75 ? "moderate" : "low";
  return { score: Number(score.toFixed(2)), level, controlled: c.controlled, humid: c.humid };
}

const MAX_BOOST = 18; // Elo edge to the heat-adapted side under extreme stress

// Per-team Elo nudge from climate: positive only for the heat-adapted side when
// stress is real, scaled by stress score. Returns 0 otherwise.
export function climateEloBoost(teamName, venueName, timeET) {
  const { score } = heatStress(venueName, timeET);
  if (score < 1.5 || !HEAT_ADAPTED.has(teamName)) return 0;
  return Math.round(MAX_BOOST * (score / 3));
}
