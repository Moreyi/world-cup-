import { matchProbabilities } from "./simulator.js?v=20260613-results6";
import { RESULT_SNAPSHOT, TODAY_DATE, fixtureByMatchId, resultByMatchId } from "./liveResults.js?v=20260613-results6";
import { buildTacticalPreview } from "./teamTactics.js?v=20260613-results6";
import { fuseProbabilities, marketProbabilitiesForMatch } from "./marketFusion.js?v=20260613-results6";
import { fullFixtureByMatchId } from "./fixtureCalendar.js?v=20260613-results6";
import { venueEloBoost } from "./venueFactors.js?v=20260613-results6";
import { officiatingFactor } from "./refereeFactors.js?v=20260613-results6";
import { climateEloBoost, heatStress } from "./climateFactors.js?v=20260613-results6";
import { marketSignal } from "./marketSignal.js?v=20260613-results6";

const GROUP_PAIRINGS = [
  { matchday: 1, pair: [0, 1] },
  { matchday: 1, pair: [2, 3] },
  { matchday: 2, pair: [0, 2] },
  { matchday: 2, pair: [3, 1] },
  { matchday: 3, pair: [3, 0] },
  { matchday: 3, pair: [1, 2] }
];

const MATCHDAY_WINDOWS = {
  1: "6月11-17日",
  2: "6月18-23日",
  3: "6月24-27日"
};

export function buildGroupMatchAnalysis(groups, options = {}) {
  const resultOverrides = options.resultOverrides ?? [];
  const fixtureOverrides = options.fixtureOverrides ?? [];
  const matches = groups.flatMap((group) =>
    GROUP_PAIRINGS.map((fixture, index) => {
      const teamA = group.teams[fixture.pair[0]];
      const teamB = group.teams[fixture.pair[1]];
      const matchId = `${group.name}-${index + 1}`;
      // Fixture info: full generated calendar < manually verified entry < explicit override.
      const fullFixture = fullFixtureByMatchId(matchId);
      const calendarFixture = fixtureByMatchId(matchId);
      const baseFixture = fullFixture || calendarFixture ? { ...fullFixture, ...calendarFixture } : null;
      const fixtureOverride = fixtureOverrides.find((entry) => entry.matchId === matchId);
      const fixtureInfo = fixtureOverride ? { ...baseFixture, ...fixtureOverride } : baseFixture;
      // Altitude venues (Mexico City/Guadalajara) boost acclimatized teams for
      // probability purposes only; displayed base Elo stays untouched.
      const venueBoostA = venueEloBoost(teamA.name, fixtureInfo?.venue);
      const venueBoostB = venueEloBoost(teamB.name, fixtureInfo?.venue);
      // Heat-stress edge to the heat-adapted side (venue climate × kickoff time).
      const climateBoostA = climateEloBoost(teamA.name, fixtureInfo?.venue, fixtureInfo?.timeET);
      const climateBoostB = climateEloBoost(teamB.name, fixtureInfo?.venue, fixtureInfo?.timeET);
      const adjA = venueBoostA + climateBoostA;
      const adjB = venueBoostB + climateBoostB;
      const ratedTeamA = adjA ? { ...teamA, elo: teamA.elo + adjA } : teamA;
      const ratedTeamB = adjB ? { ...teamB, elo: teamB.elo + adjB } : teamB;
      const modelProbabilities = matchProbabilities(ratedTeamA, ratedTeamB, options);
      const marketProbabilities = marketProbabilitiesForMatch(matchId);
      // Published probabilities fuse real market odds when we have them;
      // modelProbabilities stays pure for review/Brier tracking.
      const probabilities = marketProbabilities
        ? { ...modelProbabilities, ...fuseProbabilities(modelProbabilities, marketProbabilities, options.marketWeight ?? 0.5) }
        : modelProbabilities;
      const favorite = probabilities.teamA >= probabilities.teamB ? teamA : teamB;
      const favoriteWinProbability = Math.max(probabilities.teamA, probabilities.teamB);
      const underdogWinProbability = Math.min(probabilities.teamA, probabilities.teamB);
      const edge = Math.abs(probabilities.teamA - probabilities.teamB);
      // Officiating climate raises upset variance (strict refs widen the
      // underdog's path) without shifting the Elo-driven winner.
      const officiating = officiatingFactor(fixtureInfo?.referee);
      const upsetOrDrawProbability = Math.min(0.95, underdogWinProbability + probabilities.draw + officiating.upsetBoost);
      const result = resultOverrides.find((entry) => entry.matchId === matchId) ?? resultByMatchId(matchId);
      validateResultTeams(result, matchId, teamA, teamB);
      const predictedScore = predictScore(teamA, teamB, probabilities);
      const matchShell = {
        teamA,
        teamB,
        probabilities,
        edge
      };

      return {
        id: matchId,
        group: group.name,
        matchday: fixture.matchday,
        window: fixtureInfo?.date ?? MATCHDAY_WINDOWS[fixture.matchday],
        fixture: fixtureInfo,
        teamA,
        teamB,
        probabilities,
        modelProbabilities,
        marketProbabilities,
        venueFactor:
          venueBoostA || venueBoostB
            ? { venue: fixtureInfo?.venue, teamA: venueBoostA, teamB: venueBoostB }
            : null,
        officiating,
        marketSignal: marketSignal(modelProbabilities, marketProbabilities),
        climate: {
          ...heatStress(fixtureInfo?.venue, fixtureInfo?.timeET),
          teamA: climateBoostA,
          teamB: climateBoostB
        },
        predictedScore,
        tacticalPreview: buildTacticalPreview(matchShell),
        favorite,
        favoriteWinProbability,
        underdogWinProbability,
        upsetOrDrawProbability,
        edge,
        result,
        darkHorse: result?.status !== "final" && upsetOrDrawProbability >= 0.55,
        postMatch: result ? analyzeResult(result, probabilities, teamA, teamB) : null,
        profile: result?.status === "final" ? "已结束" : result?.status === "live" ? "进行中" : classifyMatch(edge, probabilities.draw)
      };
    })
  );

  // "Today" is dynamic (US-Eastern, where fixture dates are anchored); falls
  // back to the manual snapshot date when no override is supplied.
  const todayDate = options.todayDate || TODAY_DATE;
  const tomorrowDate = nextDate(todayDate);
  return {
    matches,
    summary: summarizeMatches(matches),
    todayDate,
    todayMatches: matches.filter((match) => match.fixture?.date === todayDate),
    tomorrowDate,
    tomorrowMatches: tomorrowDate ? matches.filter((match) => match.fixture?.date === tomorrowDate) : [],
    upsetMatches: buildUpsetMatches(matches),
    confidenceMatches: buildConfidenceMatches(matches),
    resultSnapshot: RESULT_SNAPSHOT
  };
}

// Confidence picks: the upcoming matches the model is most sure of — the mirror
// image of the upset radar. Ranked by the favorite's win probability so the
// single highest-probability call sits on top as the headline "信心之选".
function buildConfidenceMatches(matches) {
  return matches
    .filter((match) => !match.result || match.result.status !== "final")
    .map((match) => ({
      ...match,
      confidenceLevel: confidenceLevel(match.favoriteWinProbability, match.edge)
    }))
    .sort((a, b) => b.favoriteWinProbability - a.favoriteWinProbability || b.edge - a.edge)
    .slice(0, 6);
}

function confidenceLevel(favoriteWinProbability, edge) {
  if (favoriteWinProbability >= 0.7 && edge >= 0.45) return "极高";
  if (favoriteWinProbability >= 0.62) return "高";
  if (favoriteWinProbability >= 0.5) return "中高";
  return "中";
}

// Calendar day after a "YYYY-MM-DD" string, in UTC, so the tomorrow rail tracks
// the same US-Eastern-anchored fixture dates the today rail uses. Returns null
// for malformed input.
function nextDate(dateStr) {
  if (typeof dateStr !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + 1));
  return next.toISOString().slice(0, 10);
}

// Recompute a single match's prediction from base teams + (optional) market
// odds, parameterized by manually-tuned factors. Pure: never mutates input.
// Used by the match-detail view's factor panel for live what-if recompute.
// Elo-shaped knobs (model toggles, star boost) are folded into eloA/eloB by the
// caller; this helper only needs the final Elo plus the display-time knobs.
export function recomputeMatchPrediction(base, factors = {}) {
  const venueBoostA = Number(factors.venueBoostA ?? 0);
  const venueBoostB = Number(factors.venueBoostB ?? 0);
  const climateBoostA = Number(factors.climateBoostA ?? 0);
  const climateBoostB = Number(factors.climateBoostB ?? 0);
  const eloA = Number(factors.eloA ?? base.teamA.elo);
  const eloB = Number(factors.eloB ?? base.teamB.elo);
  const ratedTeamA = { ...base.teamA, elo: eloA + venueBoostA + climateBoostA };
  const ratedTeamB = { ...base.teamB, elo: eloB + venueBoostB + climateBoostB };
  const options = {
    homeAdvantage: Number(factors.homeAdvantage ?? 0),
    drawBias: Number(factors.drawBias ?? 0.28)
  };
  const modelProbabilities = matchProbabilities(ratedTeamA, ratedTeamB, options);
  const marketProbabilities = base.marketProbabilities ?? null;
  const marketWeight = Number(factors.marketWeight ?? 0.5);
  const probabilities = marketProbabilities
    ? { ...modelProbabilities, ...fuseProbabilities(modelProbabilities, marketProbabilities, marketWeight) }
    : modelProbabilities;
  const favorite = probabilities.teamA >= probabilities.teamB ? base.teamA : base.teamB;
  const favoriteWinProbability = Math.max(probabilities.teamA, probabilities.teamB);
  const underdogWinProbability = Math.min(probabilities.teamA, probabilities.teamB);
  const edge = Math.abs(probabilities.teamA - probabilities.teamB);
  const refereeUpsetBoost = Number(factors.refereeUpsetBoost ?? 0);
  const upsetOrDrawProbability = Math.min(0.95, underdogWinProbability + probabilities.draw + refereeUpsetBoost);
  const predictedScore = predictScore(ratedTeamA, ratedTeamB, probabilities);
  return {
    probabilities,
    modelProbabilities,
    marketProbabilities,
    favorite,
    favoriteWinProbability,
    underdogWinProbability,
    edge,
    upsetOrDrawProbability,
    predictedScore,
    inputs: { eloA, eloB, venueBoostA, venueBoostB, climateBoostA, climateBoostB, ...options, marketWeight, refereeUpsetBoost }
  };
}

function validateResultTeams(result, matchId, teamA, teamB) {
  if (!result?.teams) return;
  if (result.teams.teamA === teamA.name && result.teams.teamB === teamB.name) return;

  throw new Error(
    `Result team mismatch for ${matchId}: expected ${result.teams.teamA} vs ${result.teams.teamB}, actual ${teamA.name} vs ${teamB.name}`
  );
}

// Poisson predicted score: derive each side's expected goals (lambda) from the
// Elo win expectation, then return the most-likely scoreline (modal Poisson
// pair). Principled and self-consistent with the win/draw/loss probabilities,
// replacing the old hand-tuned heuristic.
function predictScore(teamA, teamB, probabilities) {
  const expectedA = clampUnit(probabilities.knockoutA ?? probabilities.teamA ?? 0.5);
  const lambdaA = 1.35 * (0.5 + expectedA) + (teamA.host ? 0.12 : 0);
  const lambdaB = 1.35 * (0.5 + (1 - expectedA)) + (teamB.host ? 0.12 : 0);
  const [goalsA, goalsB] = modalScore(lambdaA, lambdaB);
  return {
    teamA: goalsA,
    teamB: goalsB,
    label: `${goalsA}-${goalsB}`,
    expectedGoals: { teamA: Number(lambdaA.toFixed(2)), teamB: Number(lambdaB.toFixed(2)) }
  };
}

function poissonPmf(lambda, k) {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  let p = Math.exp(-lambda);
  for (let i = 1; i <= k; i += 1) p *= lambda / i;
  return p;
}

// Most-probable (goalsA, goalsB) under two independent Poissons over a 0..6 grid.
function modalScore(lambdaA, lambdaB) {
  let best = [0, 0];
  let bestProb = -1;
  for (let a = 0; a <= 6; a += 1) {
    const pa = poissonPmf(lambdaA, a);
    for (let b = 0; b <= 6; b += 1) {
      const joint = pa * poissonPmf(lambdaB, b);
      if (joint > bestProb) {
        bestProb = joint;
        best = [a, b];
      }
    }
  }
  return best;
}

function clampUnit(x) {
  return Math.max(0, Math.min(1, x));
}

function summarizeMatches(matches) {
  const mostBalanced = matches.reduce((best, match) => (match.edge < best.edge ? match : best), matches[0]);
  const biggestFavorite = matches.reduce(
    (best, match) => (match.favoriteWinProbability > best.favoriteWinProbability ? match : best),
    matches[0]
  );
  const highestDraw = matches.reduce(
    (best, match) => (match.probabilities.draw > best.probabilities.draw ? match : best),
    matches[0]
  );
  const upsetSensitive = matches.filter((match) => match.upsetOrDrawProbability >= 0.46).length;
  const completed = matches.filter((match) => match.result?.status === "final");
  const totalGoals = completed.reduce((sum, match) => sum + match.result.score.teamA + match.result.score.teamB, 0);
  const modelHits = completed.filter((match) => match.postMatch.predictionHit).length;
  const biggestDeviation = completed.reduce(
    (best, match) => (!best || match.postMatch.deviationScore > best.postMatch.deviationScore ? match : best),
    null
  );

  return {
    totalMatches: matches.length,
    completedMatches: completed.length,
    totalGoals,
    modelHits,
    biggestDeviation,
    mostBalanced,
    biggestFavorite,
    highestDraw,
    upsetSensitive
  };
}

function analyzeResult(result, probabilities, teamA, teamB) {
  const goalsA = result.score.teamA;
  const goalsB = result.score.teamB;
  const actualOutcome = goalsA > goalsB ? "teamA" : goalsB > goalsA ? "teamB" : "draw";
  const actualWinner = actualOutcome === "teamA" ? teamA : actualOutcome === "teamB" ? teamB : null;
  const forecastProbability =
    actualOutcome === "teamA" ? probabilities.teamA : actualOutcome === "teamB" ? probabilities.teamB : probabilities.draw;
  const modalOutcome = modalProbabilityOutcome(probabilities);
  const predictionHit = actualOutcome === modalOutcome;
  const margin = Math.abs(goalsA - goalsB);
  const deviationScore = Number((1 - forecastProbability + Math.min(margin, 4) * 0.04).toFixed(4));

  return {
    actualOutcome,
    actualWinner,
    forecastProbability,
    predictionHit,
    margin,
    deviationScore,
    points: {
      teamA: goalsA > goalsB ? 3 : goalsA === goalsB ? 1 : 0,
      teamB: goalsB > goalsA ? 3 : goalsA === goalsB ? 1 : 0
    },
    goalDifference: {
      teamA: goalsA - goalsB,
      teamB: goalsB - goalsA
    }
  };
}

function modalProbabilityOutcome(probabilities) {
  return [
    ["teamA", probabilities.teamA],
    ["draw", probabilities.draw],
    ["teamB", probabilities.teamB]
  ].sort((a, b) => b[1] - a[1])[0][0];
}

function buildUpsetMatches(matches) {
  return matches
    .filter((match) => !match.result || match.result.status !== "final")
    .map((match) => {
      const underdogSide = match.probabilities.teamA <= match.probabilities.teamB ? "teamA" : "teamB";
      const underdog = underdogSide === "teamA" ? match.teamA : match.teamB;
      const favorite = underdogSide === "teamA" ? match.teamB : match.teamA;
      const upsetWinProbability = underdogSide === "teamA" ? match.probabilities.teamA : match.probabilities.teamB;
      const riskScore = upsetWinProbability + match.probabilities.draw * 0.7;
      return {
        ...match,
        underdog,
        favorite,
        upsetWinProbability,
        riskScore
      };
    })
    .sort((a, b) => b.riskScore - a.riskScore || b.upsetWinProbability - a.upsetWinProbability)
    .slice(0, 6);
}

function classifyMatch(edge, drawProbability) {
  if (edge < 0.08) return "胶着";
  if (drawProbability >= 0.24) return "平局敏感";
  if (edge >= 0.28) return "强弱明显";
  return "优势可见";
}
