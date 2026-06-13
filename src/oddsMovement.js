// Market-movement radar — turns a time series of public market snapshots into a
// pre-match drift signal. Upgrades the single-snapshot marketSignal into "how
// did the public market MOVE", which is useful context for model caution.
//
// Honest scope (same red line as marketSignal.js): movement reflects informed
// injury / lineup news far more often than anything improper. A sharp move is a
// "watch / treat with caution" flag, NEVER a fixing accusation. Copy is
// test-enforced to avoid fixing language.
//
// Snapshots use ESPN home/away/draw market lines (a consistent key over time);
// the UI maps home/away to team names via the snapshot's `home`/`away` labels.

import { americanToImpliedProbability } from "./policyOddsModel.js?v=20260613-results6";

function impliedFromMoneylines(ml) {
  if (!ml || ml.home == null || ml.away == null) return null;
  const raw = {
    home: americanToImpliedProbability(ml.home),
    draw: ml.draw == null ? 0 : americanToImpliedProbability(ml.draw),
    away: americanToImpliedProbability(ml.away)
  };
  const total = raw.home + raw.draw + raw.away;
  if (!(total > 0)) return null;
  return { home: raw.home / total, draw: raw.draw / total, away: raw.away / total };
}

// history: [{ ts, moneylines:{home,away,draw}, home, away }] chronological.
// Returns first→latest drift, the largest single-step jump, a level, the side
// the money moved toward, and display copy. null if <2 usable snapshots.
export function computeOddsMovement(history) {
  const points = (history ?? [])
    .map((h) => ({ ts: h.ts, p: impliedFromMoneylines(h.moneylines) }))
    .filter((x) => x.p);
  if (points.length < 2) return null;

  const first = points[0].p;
  const last = points[points.length - 1].p;
  const drift = { home: last.home - first.home, draw: last.draw - first.draw, away: last.away - first.away };
  const totalDrift = Math.max(Math.abs(drift.home), Math.abs(drift.draw), Math.abs(drift.away));

  let maxStep = 0;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i].p;
    const b = points[i - 1].p;
    maxStep = Math.max(maxStep, Math.abs(a.home - b.home), Math.abs(a.draw - b.draw), Math.abs(a.away - b.away));
  }

  const level = totalDrift > 0.12 || maxStep > 0.09 ? "sharp" : totalDrift >= 0.05 ? "drifting" : "stable";
  const movedToward = Object.entries(drift).sort((a, b) => b[1] - a[1])[0][0];
  const latest = history[history.length - 1];

  return {
    snapshots: points.length,
    totalDrift: Number(totalDrift.toFixed(3)),
    maxStep: Number(maxStep.toFixed(3)),
    level,
    movedToward, // "home" | "draw" | "away"
    movedTowardTeam: movedToward === "home" ? latest?.home : movedToward === "away" ? latest?.away : "Draw",
    note:
      level === "sharp"
        ? "赛前市场明显移动:多因伤停/首发/资金面信息,本场预测请谨慎参考。"
        : level === "drifting"
        ? "市场有温和移动,建议结合最新信息。"
        : "市场基本平稳。"
  };
}

export function oddsMovementForMatch(matchId, oddsHistory) {
  return computeOddsMovement(oddsHistory?.matches?.[matchId]);
}
