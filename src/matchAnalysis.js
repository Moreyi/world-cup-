import { matchProbabilities } from "./simulator.js";
import { RESULT_SNAPSHOT, TODAY_DATE, fixtureByMatchId, resultByMatchId } from "./liveResults.js?v=20260612-tactic";
import { buildTacticalPreview } from "./teamTactics.js";
import { fuseProbabilities, marketProbabilitiesForMatch } from "./marketFusion.js";
import { fullFixtureByMatchId } from "./fixtureCalendar.js";
import { venueEloBoost } from "./venueFactors.js";
import { officiatingFactor } from "./refereeFactors.js";
import { climateEloBoost, heatStress } from "./climateFactors.js";

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

  return {
    matches,
    summary: summarizeMatches(matches),
    todayDate: TODAY_DATE,
    todayMatches: matches.filter((match) => match.fixture?.date === TODAY_DATE),
    upsetMatches: buildUpsetMatches(matches),
    resultSnapshot: RESULT_SNAPSHOT
  };
}

function validateResultTeams(result, matchId, teamA, teamB) {
  if (!result?.teams) return;
  if (result.teams.teamA === teamA.name && result.teams.teamB === teamB.name) return;

  throw new Error(
    `Result team mismatch for ${matchId}: expected ${result.teams.teamA} vs ${result.teams.teamB}, actual ${teamA.name} vs ${teamB.name}`
  );
}

function predictScore(teamA, teamB, probabilities) {
  const baseGoals = 1.15 + (1 - probabilities.draw) * 0.55;
  const attackA = baseGoals * (0.72 + probabilities.teamA * 1.15) + (teamA.host ? 0.14 : 0);
  const attackB = baseGoals * (0.72 + probabilities.teamB * 1.15) + (teamB.host ? 0.14 : 0);
  let goalsA = Math.max(0, Math.min(4, Math.round(attackA - 0.35)));
  let goalsB = Math.max(0, Math.min(4, Math.round(attackB - 0.35)));

  if (probabilities.draw >= Math.max(probabilities.teamA, probabilities.teamB) - 0.04) {
    const shared = Math.max(1, Math.round((goalsA + goalsB) / 2));
    goalsA = shared;
    goalsB = shared;
  } else if (probabilities.teamA > probabilities.teamB && goalsA <= goalsB) {
    goalsA = goalsB + 1;
  } else if (probabilities.teamB > probabilities.teamA && goalsB <= goalsA) {
    goalsB = goalsA + 1;
  }

  return {
    teamA: goalsA,
    teamB: goalsB,
    label: `${goalsA}-${goalsB}`
  };
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
