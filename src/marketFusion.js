import { americanToImpliedProbability } from "./policyOddsModel.js?v=20260613-results6";

// Converts a win/draw/win moneyline triple (American odds) into vig-free
// probabilities that sum to 1.
export function impliedMatchProbabilities(moneylines) {
  const raw = {
    teamA: americanToImpliedProbability(moneylines.teamA),
    draw: americanToImpliedProbability(moneylines.draw),
    teamB: americanToImpliedProbability(moneylines.teamB)
  };
  const total = raw.teamA + raw.draw + raw.teamB;
  if (!(total > 0)) return null;
  return {
    teamA: raw.teamA / total,
    draw: raw.draw / total,
    teamB: raw.teamB / total
  };
}

// Blends model probabilities with vig-free market probabilities and
// renormalizes. marketWeight 0 = pure model, 1 = pure market. The default
// 0.5 is a starting point; tune it from the running Brier scoreboard in
// docs/match-reviews/ once enough matches have been logged.
export function fuseProbabilities(model, market, marketWeight = 0.5) {
  if (!market) return { ...model, fused: false };
  const w = Math.min(1, Math.max(0, Number(marketWeight)));
  const blended = {
    teamA: model.teamA * (1 - w) + market.teamA * w,
    draw: model.draw * (1 - w) + market.draw * w,
    teamB: model.teamB * (1 - w) + market.teamB * w
  };
  const total = blended.teamA + blended.draw + blended.teamB;
  return {
    teamA: blended.teamA / total,
    draw: blended.draw / total,
    teamB: blended.teamB / total,
    fused: true,
    marketWeight: w
  };
}

// Manually verified market snapshot for fixtures we track in
// src/liveResults.js. Keyed by matchId. Refresh from the ESPN summary API
// (pickcenter) or the live realtimeData fetch; keep provider and timestamp.
export const MARKET_SNAPSHOT = {
  retrievedAt: "2026-06-12 23:20 CST",
  provider: "DraftKings via ESPN pickcenter",
  entries: {
    "B-1": { teamA: -120, draw: 250, teamB: 380 },
    "D-1": { teamA: 110, draw: 220, teamB: 290 }
  }
};

export function marketProbabilitiesForMatch(matchId, snapshot = MARKET_SNAPSHOT) {
  const moneylines = snapshot.entries?.[matchId];
  if (!moneylines) return null;
  return impliedMatchProbabilities(moneylines);
}
