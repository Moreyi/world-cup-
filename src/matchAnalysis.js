import { matchProbabilities } from "./simulator.js";
import { RESULT_SNAPSHOT, TODAY_DATE, fixtureByMatchId, resultByMatchId } from "./liveResults.js?v=20260612-live";

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
      const probabilities = matchProbabilities(teamA, teamB, options);
      const favorite = probabilities.teamA >= probabilities.teamB ? teamA : teamB;
      const favoriteWinProbability = Math.max(probabilities.teamA, probabilities.teamB);
      const underdogWinProbability = Math.min(probabilities.teamA, probabilities.teamB);
      const edge = Math.abs(probabilities.teamA - probabilities.teamB);
      const calendarFixture = fixtureByMatchId(`${group.name}-${index + 1}`);
      const fixtureOverride = fixtureOverrides.find((entry) => entry.matchId === `${group.name}-${index + 1}`);
      const fixtureInfo = fixtureOverride ? { ...calendarFixture, ...fixtureOverride } : calendarFixture;
      const result = resultOverrides.find((entry) => entry.matchId === `${group.name}-${index + 1}`) ?? resultByMatchId(`${group.name}-${index + 1}`);

      return {
        id: `${group.name}-${index + 1}`,
        group: group.name,
        matchday: fixture.matchday,
        window: fixtureInfo?.date ?? MATCHDAY_WINDOWS[fixture.matchday],
        fixture: fixtureInfo,
        teamA,
        teamB,
        probabilities,
        favorite,
        favoriteWinProbability,
        underdogWinProbability,
        upsetOrDrawProbability: underdogWinProbability + probabilities.draw,
        edge,
        result,
        postMatch: result ? analyzeResult(result, probabilities, teamA, teamB, favorite) : null,
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

function analyzeResult(result, probabilities, teamA, teamB, favorite) {
  const goalsA = result.score.teamA;
  const goalsB = result.score.teamB;
  const actualOutcome = goalsA > goalsB ? "teamA" : goalsB > goalsA ? "teamB" : "draw";
  const actualWinner = actualOutcome === "teamA" ? teamA : actualOutcome === "teamB" ? teamB : null;
  const forecastProbability =
    actualOutcome === "teamA" ? probabilities.teamA : actualOutcome === "teamB" ? probabilities.teamB : probabilities.draw;
  const predictionHit =
    (actualOutcome === "teamA" && favorite.name === teamA.name) ||
    (actualOutcome === "teamB" && favorite.name === teamB.name) ||
    actualOutcome === "draw";
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
