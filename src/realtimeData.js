import { TODAY_DATE } from "./liveResults.js?v=20260613-results6";

export const ESPN_SCOREBOARD_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

const ESPN_NAME_MAP = {
  "Bosnia-Herzegovina": "Bosnia and Herzegovina",
  USA: "United States"
};

export async function fetchRealtimeFixtures({ date = TODAY_DATE, fetcher = fetch } = {}) {
  const compactDate = date.replaceAll("-", "");
  const response = await fetcher(`${ESPN_SCOREBOARD_URL}?dates=${compactDate}`);
  if (!response.ok) {
    throw new Error(`scoreboard ${response.status}`);
  }
  const payload = await response.json();
  return {
    fetchedAt: new Date().toISOString(),
    provider: "ESPN Scoreboard",
    updates: (payload.events ?? []).map(parseEvent).filter(Boolean)
  };
}

function parseEvent(event) {
  const competition = event.competitions?.[0];
  const competitors = competition?.competitors ?? [];
  const home = competitors.find((competitor) => competitor.homeAway === "home");
  const away = competitors.find((competitor) => competitor.homeAway === "away");
  if (!home || !away) return null;

  const status = competition.status?.type ?? event.status?.type ?? {};
  const homeScore = Number(home.score ?? 0);
  const awayScore = Number(away.score ?? 0);

  return {
    externalId: event.id,
    dateTime: competition.date ?? event.date,
    status: normalizeStatus(status),
    statusText: status.shortDetail ?? status.detail ?? status.description ?? "Scheduled",
    minute: parseMatchMinute(competition.status ?? event.status),
    completed: Boolean(status.completed),
    homeTeam: normalizeTeamName(home.team?.displayName ?? home.team?.name),
    awayTeam: normalizeTeamName(away.team?.displayName ?? away.team?.name),
    homeScore,
    awayScore,
    venue: competition.venue?.fullName ?? event.venue?.displayName ?? "",
    city: competition.venue?.address?.city ?? "",
    country: competition.venue?.address?.country ?? "",
    broadcasts: competition.broadcasts?.[0]?.names ?? [],
    marketOdds: parseMarketOdds(competition.odds?.[0])
  };
}

// Elapsed match minute from ESPN's competition status. Prefers displayClock
// ("67'"), falls back to clock seconds; null when not live.
function parseMatchMinute(statusObj) {
  if (!statusObj) return null;
  const display = statusObj.displayClock;
  if (typeof display === "string") {
    const m = display.match(/(\d+)/);
    if (m) return Math.min(96, Number(m[1]));
  }
  if (Number.isFinite(statusObj.clock) && statusObj.clock > 0) {
    return Math.min(96, Math.round(statusObj.clock / 60));
  }
  return null;
}

function normalizeStatus(status) {
  if (status.completed) return "final";
  if (status.state === "in") return "live";
  return "scheduled";
}

function normalizeTeamName(name = "") {
  return ESPN_NAME_MAP[name] ?? name;
}

function parseMarketOdds(odds) {
  if (!odds) return null;
  const moneyline = odds.moneyline ?? {};
  const homeOdds = moneyline.home?.close?.odds ?? moneyline.home?.open?.odds ?? null;
  const awayOdds = moneyline.away?.close?.odds ?? moneyline.away?.open?.odds ?? null;
  const drawOdds = moneyline.draw?.close?.odds ?? moneyline.draw?.open?.odds ?? odds.drawOdds?.moneyLine ?? null;

  return {
    provider: odds.provider?.displayName ?? odds.provider?.name ?? "公开市场源",
    detail: odds.details ?? "",
    overUnder: odds.overUnder ?? null,
    moneyline: {
      home: homeOdds,
      draw: drawOdds,
      away: awayOdds
    },
    implied: normalizeImpliedProbabilities({
      home: americanToImpliedProbability(homeOdds),
      draw: americanToImpliedProbability(drawOdds),
      away: americanToImpliedProbability(awayOdds)
    })
  };
}

function americanToImpliedProbability(odds) {
  const value = typeof odds === "string" ? Number(odds.replace("+", "")) : Number(odds);
  if (!Number.isFinite(value) || value === 0) return null;
  return value > 0 ? 100 / (value + 100) : Math.abs(value) / (Math.abs(value) + 100);
}

function normalizeImpliedProbabilities(probabilities) {
  const entries = Object.entries(probabilities).filter(([, value]) => Number.isFinite(value));
  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  if (!total) return null;
  return Object.fromEntries(entries.map(([key, value]) => [key, value / total]));
}
