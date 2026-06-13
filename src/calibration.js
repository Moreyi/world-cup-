// Model self-calibration loop.
//
// As matches finish, this scores how well the model's pre-match probabilities
// matched reality (Brier score), compares it against the market reference, and
// grid-searches the market-blend weight that WOULD have minimized error so far.
// That recommended weight feeds back into marketFusion over the tournament —
// the model tunes itself from real results instead of a fixed guess.
//
// Brier score = mean over matches of Σ_outcome (p − actual)², actual ∈ {0,1}.
// Lower is better; 0 = perfect, ~0.667 = uninformed three-way guess.

import { fuseProbabilities } from "./marketFusion.js?v=20260613-results5";

export function outcomeOfScore(score) {
  if (!score) return null;
  if (score.teamA > score.teamB) return "teamA";
  if (score.teamA < score.teamB) return "teamB";
  return "draw";
}

export function brier(probs, actual) {
  if (!probs || !actual) return null;
  return ["teamA", "draw", "teamB"].reduce((sum, k) => {
    const p = probs[k] ?? 0;
    const y = actual === k ? 1 : 0;
    return sum + (p - y) ** 2;
  }, 0);
}

function modalOutcome(probs) {
  return [
    ["teamA", probs.teamA],
    ["draw", probs.draw],
    ["teamB", probs.teamB]
  ].sort((a, b) => b[1] - a[1])[0][0];
}

// Pulls finished matches that carry pre-match model probabilities + a result.
function finishedSamples(matches) {
  return (matches ?? [])
    .filter((m) => m.result?.status === "final" && m.modelProbabilities && m.result.score)
    .map((m) => ({
      id: m.id,
      model: m.modelProbabilities,
      market: m.marketProbabilities ?? null,
      actual: outcomeOfScore(m.result.score)
    }))
    .filter((s) => s.actual);
}

// Overall scorecard: model Brier, market Brier (where available), modal hit rate.
export function evaluateModel(matches) {
  const samples = finishedSamples(matches);
  if (!samples.length) return { count: 0, modelBrier: null, marketBrier: null, modelHitRate: null };

  const modelBrier = mean(samples.map((s) => brier(s.model, s.actual)));
  const withMarket = samples.filter((s) => s.market);
  const marketBrier = withMarket.length ? mean(withMarket.map((s) => brier(s.market, s.actual))) : null;
  const hits = samples.filter((s) => modalOutcome(s.model) === s.actual).length;

  return {
    count: samples.length,
    marketCount: withMarket.length,
    modelBrier: round4(modelBrier),
    marketBrier: marketBrier == null ? null : round4(marketBrier),
    modelHitRate: round4(hits / samples.length)
  };
}

// Grid-searches the market-blend weight (0..1) that minimizes blended Brier on
// the matches that have market data. Returns the best weight + the full curve.
// Needs at least a few market samples to be meaningful (guarded by minSamples).
export function recommendMarketWeight(matches, { step = 0.1, minSamples = 4 } = {}) {
  const samples = finishedSamples(matches).filter((s) => s.market);
  if (samples.length < minSamples) {
    return { ready: false, samples: samples.length, minSamples, recommended: 0.5, curve: [] };
  }
  const curve = [];
  let best = { weight: 0.5, brier: Infinity };
  for (let w = 0; w <= 1.0001; w += step) {
    const weight = Number(w.toFixed(2));
    const avg = mean(
      samples.map((s) => {
        const fused = fuseProbabilities(s.model, s.market, weight);
        return brier(fused, s.actual);
      })
    );
    curve.push({ weight, brier: round4(avg) });
    if (avg < best.brier) best = { weight, brier: avg };
  }
  return { ready: true, samples: samples.length, recommended: best.weight, recommendedBrier: round4(best.brier), curve };
}

function mean(xs) {
  return xs.reduce((a, b) => a + b, 0) / (xs.length || 1);
}
function round4(x) {
  return x == null ? null : Number(x.toFixed(4));
}
