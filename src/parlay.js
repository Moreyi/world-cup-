// Multi-match confidence-combo engine — data-entertainment only.
//
// Combines the model's per-match win/draw/loss probabilities into a multi-leg
// combination: combined hit rate + the theoretical fair decimal reference value
// it implies, and (when market signals exist) the combined market reference for comparison. This
// is a model-confidence combination for research/entertainment — it does NOT
// trigger transactions, does not link to market operators, and theoretical
// values are derived from our own probabilities, not an invitation to act on them.
//
// Legs are treated as independent; real matches have mild correlations, so the
// combined number is an upper-ish estimate. Always surface that caveat.

const OUTCOME_LABELS = {
  teamA: (m) => m.teamA?.name ?? "Team A",
  draw: () => "Draw",
  teamB: (m) => m.teamB?.name ?? "Team B"
};

function probFor(probabilities, pick) {
  return pick === "teamA" ? probabilities.teamA : pick === "teamB" ? probabilities.teamB : probabilities.draw;
}

function modalPick(probabilities) {
  return [
    ["teamA", probabilities.teamA],
    ["draw", probabilities.draw],
    ["teamB", probabilities.teamB]
  ].sort((a, b) => b[1] - a[1])[0][0];
}

// Builds a parlay from explicit selections: [{ match, pick }].
// Returns combined probability, theoretical fair decimal odds, combined market
// odds (if every leg has market data), and a per-leg breakdown.
export function buildParlay(selections) {
  const legs = selections
    .filter((s) => s.match && s.pick)
    .map(({ match, pick }) => {
      const p = probFor(match.probabilities, pick);
      const marketP = match.marketProbabilities ? probFor(match.marketProbabilities, pick) : null;
      return {
        matchId: match.id,
        pick,
        selection: OUTCOME_LABELS[pick](match),
        probability: p,
        fairOdds: p > 0 ? Number((1 / p).toFixed(2)) : null,
        marketProbability: marketP,
        marketOdds: marketP > 0 ? Number((1 / marketP).toFixed(2)) : null
      };
    });

  if (!legs.length) return null;

  const combinedProbability = legs.reduce((acc, leg) => acc * leg.probability, 1);
  const everyLegHasMarket = legs.every((leg) => leg.marketProbability > 0);
  const combinedMarketProbability = everyLegHasMarket
    ? legs.reduce((acc, leg) => acc * leg.marketProbability, 1)
    : null;

  return {
    legs,
    legCount: legs.length,
    combinedProbability: Number(combinedProbability.toFixed(4)),
    theoreticalOdds: combinedProbability > 0 ? Number((1 / combinedProbability).toFixed(2)) : null,
    combinedMarketOdds: combinedMarketProbability ? Number((1 / combinedMarketProbability).toFixed(2)) : null,
    note: "模型置信组合，腿间按独立处理；仅供娱乐与数据研究，不构成收益、投资或财务建议。"
  };
}

// Auto-builds a "high-confidence parlay" from upcoming (non-final) matches:
// take each match's most likely outcome, keep the most confident `legs`.
export function recommendedParlay(matches, { legs = 3, minConfidence = 0.5 } = {}) {
  const candidates = matches
    .filter((m) => !m.result || m.result.status !== "final")
    .map((m) => {
      const pick = modalPick(m.probabilities);
      return { match: m, pick, confidence: probFor(m.probabilities, pick) };
    })
    .filter((c) => c.confidence >= minConfidence)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, legs);

  if (candidates.length < 2) return null; // a parlay needs at least two legs
  return buildParlay(candidates);
}

// Value parlay: legs where the model's probability beats the market's implied
// probability (model sees more value than the bookmaker), most-confident first.
export function valueParlay(matches, { legs = 3, minEdge = 0.04 } = {}) {
  const candidates = matches
    .filter((m) => (!m.result || m.result.status !== "final") && m.marketProbabilities)
    .map((m) => {
      const pick = modalPick(m.probabilities);
      const edge = probFor(m.probabilities, pick) - probFor(m.marketProbabilities, pick);
      return { match: m, pick, edge };
    })
    .filter((c) => c.edge >= minEdge)
    .sort((a, b) => b.edge - a.edge)
    .slice(0, legs);

  if (candidates.length < 2) return null;
  return { ...buildParlay(candidates), edges: candidates.map((c) => ({ matchId: c.match.id, edge: Number(c.edge.toFixed(3)) })) };
}
