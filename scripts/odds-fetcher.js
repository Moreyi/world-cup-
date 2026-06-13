#!/usr/bin/env node
// Odds-history fetcher — run on the server via cron (e.g. every 3 hours).
// Pulls DraftKings moneylines from ESPN's match summary (pickcenter) for each
// upcoming tracked fixture and appends a timestamped snapshot to
// data/odds-history.json, which the static frontend reads for the odds-movement
// radar. No secrets; safe to commit. Keeps the last MAX_SNAPSHOTS per match.
//
// Usage: node scripts/odds-fetcher.js [/abs/path/to/odds-history.json]
// Default output: <repo>/data/odds-history.json (on the server: /var/www/worldcup/data/odds-history.json)

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { FULL_MATCH_CALENDAR } from "../src/fixtureCalendar.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = process.argv[2] || resolve(HERE, "../data/odds-history.json");
const MAX_SNAPSHOTS = 40;
const SUMMARY = (id) => `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary?event=${id}`;

async function fetchMoneylines(espnGameId) {
  const res = await fetch(SUMMARY(espnGameId));
  if (!res.ok) return null;
  const data = await res.json();
  const pick = (data.pickcenter || []).find((p) => p.homeTeamOdds?.moneyLine != null) || (data.pickcenter || [])[0];
  if (!pick) return null;
  // ESPN home/away → our teamA/teamB via the competition's competitor order.
  const comp = data.header?.competitions?.[0];
  const home = comp?.competitors?.find((c) => c.homeAway === "home");
  const away = comp?.competitors?.find((c) => c.homeAway === "away");
  if (!home || !away) return null;
  return {
    espnHome: home.team?.displayName,
    espnAway: away.team?.displayName,
    homeML: pick.homeTeamOdds?.moneyLine,
    awayML: pick.awayTeamOdds?.moneyLine,
    drawML: pick.drawOdds?.moneyLine,
    provider: pick.provider?.name || "unknown"
  };
}

function loadHistory() {
  try {
    return JSON.parse(readFileSync(OUT, "utf8"));
  } catch {
    return { updatedAt: null, matches: {} };
  }
}

async function main(nowIso) {
  const history = loadHistory();
  history.matches = history.matches || {};
  let added = 0;

  for (const [matchId, fx] of Object.entries(FULL_MATCH_CALENDAR)) {
    if (!fx.espnGameId) continue;
    // Only track matches that have not kicked off long ago (movement is pre-match).
    if (fx.dateTime && nowIso && new Date(fx.dateTime).getTime() < new Date(nowIso).getTime() - 6 * 3600 * 1000) continue;
    let ml;
    try {
      ml = await fetchMoneylines(fx.espnGameId);
    } catch {
      ml = null;
    }
    if (!ml || ml.homeML == null) continue;

    // teamA is the first team in our calendar's pairing; ESPN home may be either
    // side, so store both ESPN labels and the raw home/away mapping for the UI
    // to align by team name.
    const snapshot = {
      ts: nowIso,
      provider: ml.provider,
      home: ml.espnHome,
      away: ml.espnAway,
      moneylines: { home: ml.homeML, away: ml.awayML, draw: ml.drawML }
    };
    const arr = (history.matches[matchId] = history.matches[matchId] || []);
    const lastTs = arr.length ? arr[arr.length - 1].ts : null;
    if (lastTs !== nowIso) arr.push(snapshot);
    if (arr.length > MAX_SNAPSHOTS) arr.splice(0, arr.length - MAX_SNAPSHOTS);
    added += 1;
  }

  history.updatedAt = nowIso;
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(history, null, 1));
  console.log(`odds-fetcher: wrote ${added} match snapshots to ${OUT} at ${nowIso}`);
}

// Timestamp passed in (Date.now is fine here — this is a CLI script, not the
// resumable workflow runtime).
main(new Date().toISOString()).catch((err) => {
  console.error("odds-fetcher failed:", err.message);
  process.exit(1);
});
