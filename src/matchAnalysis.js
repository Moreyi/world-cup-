import { matchProbabilities } from "./simulator.js";

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
  const matches = groups.flatMap((group) =>
    GROUP_PAIRINGS.map((fixture, index) => {
      const teamA = group.teams[fixture.pair[0]];
      const teamB = group.teams[fixture.pair[1]];
      const probabilities = matchProbabilities(teamA, teamB, options);
      const favorite = probabilities.teamA >= probabilities.teamB ? teamA : teamB;
      const favoriteWinProbability = Math.max(probabilities.teamA, probabilities.teamB);
      const underdogWinProbability = Math.min(probabilities.teamA, probabilities.teamB);
      const edge = Math.abs(probabilities.teamA - probabilities.teamB);

      return {
        id: `${group.name}-${index + 1}`,
        group: group.name,
        matchday: fixture.matchday,
        window: MATCHDAY_WINDOWS[fixture.matchday],
        teamA,
        teamB,
        probabilities,
        favorite,
        favoriteWinProbability,
        underdogWinProbability,
        upsetOrDrawProbability: underdogWinProbability + probabilities.draw,
        edge,
        profile: classifyMatch(edge, probabilities.draw)
      };
    })
  );

  return {
    matches,
    summary: summarizeMatches(matches)
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

  return {
    totalMatches: matches.length,
    mostBalanced,
    biggestFavorite,
    highestDraw,
    upsetSensitive
  };
}

function classifyMatch(edge, drawProbability) {
  if (edge < 0.08) return "胶着";
  if (drawProbability >= 0.24) return "平局敏感";
  if (edge >= 0.28) return "强弱明显";
  return "优势可见";
}
