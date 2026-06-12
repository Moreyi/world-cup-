// Venue altitude factor. Mexico City (2,240m) and Guadalajara (1,566m) are
// the only high-altitude 2026 venues; every US/Canada venue sits below ~350m.
// Sports-science consensus: lower oxygen at altitude accelerates fatigue and
// cuts sprint/pressing capacity for unacclimatized sides, while teams that
// live and qualify at altitude keep a measurable edge (see
// docs/forecast-accuracy-research.md, off-field factor table).

// Patterns absorb naming variants ("Estadio Banorte" = "Estadio Azteca" =
// FIFA's "Mexico City Stadium") across ESPN and manually entered venues.
const VENUE_ALTITUDES = [
  { pattern: /banorte|azteca|mexico city/i, altitudeM: 2240 },
  { pattern: /akron|guadalajara/i, altitudeM: 1566 },
  { pattern: /bbva|monterrey|guadalupe/i, altitudeM: 540 }
];

// Teams whose player pools live/play at high altitude (capital ≥ 2,000m or
// home qualifiers at altitude). Conservative list from the current field.
export const ALTITUDE_ACCLIMATIZED = new Set(["Mexico", "Ecuador", "Colombia"]);

const MAX_BOOST = 40; // Elo points at 2,240m; scales linearly, 0 below 1,000m

export function venueAltitudeM(venueName) {
  if (!venueName) return 0;
  return VENUE_ALTITUDES.find((entry) => entry.pattern.test(venueName))?.altitudeM ?? 0;
}

// Elo boost for an acclimatized team at a high-altitude venue. Returns 0 for
// unacclimatized teams, unknown venues, and venues below 1,000m.
export function venueEloBoost(teamName, venueName) {
  const altitude = venueAltitudeM(venueName);
  if (altitude < 1000 || !ALTITUDE_ACCLIMATIZED.has(teamName)) return 0;
  return Math.round(MAX_BOOST * (altitude / 2240));
}
