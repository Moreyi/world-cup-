// In-play (live) win-probability model.
//
// Blends the pre-match Elo expectation with the current game state: as minutes
// elapse, the remaining goals each side can still score shrink, so the current
// scoreline weighs more and more. A lead late in the game becomes decisive.
// Red cards cut the sent-off side's remaining attack and lift the opponent's.
//
// Method: derive each side's full-match expected goals (lambda) from the
// pre-match Elo expectation, scale by the fraction of the match remaining, then
// convolve two Poisson distributions of REMAINING goals on top of the current
// score to get live win/draw/loss probabilities. Transparent and dependency-free.

function poissonPmf(lambda, k) {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  let p = Math.exp(-lambda);
  for (let i = 1; i <= k; i += 1) p *= lambda / i;
  return p;
}

// preMatch: the match's probabilities object (uses knockoutA = Elo expected
// score for A, 0..1). state: { goalsA, goalsB, minute, redA, redB }.
export function liveWinProbability(preMatch, state) {
  const expectedA = clamp01(preMatch?.knockoutA ?? preMatch?.teamA ?? 0.5);
  const goalsA = Math.max(0, Math.floor(state.goalsA ?? 0));
  const goalsB = Math.max(0, Math.floor(state.goalsB ?? 0));
  const minute = Math.max(0, Math.min(96, state.minute ?? 0));
  const remaining = Math.max(0, (90 - Math.min(minute, 90)) / 90);

  // Full-match expected goals from the Elo split (≈1.35 each when even).
  const baseLambdaA = 1.35 * (0.5 + expectedA);
  const baseLambdaB = 1.35 * (0.5 + (1 - expectedA));

  // Red-card effect: −28% remaining attack for the sent-off side, +15% for the
  // opponent (compounds if multiple reds).
  const redFactor = (own, opp) => Math.pow(0.72, own) * Math.pow(1.15, opp);
  let lamRemA = baseLambdaA * remaining * redFactor(state.redA ?? 0, state.redB ?? 0);
  let lamRemB = baseLambdaB * remaining * redFactor(state.redB ?? 0, state.redA ?? 0);
  lamRemA = Math.max(0, lamRemA);
  lamRemB = Math.max(0, lamRemB);

  // Convolve remaining-goal Poissons (cap at 7 extra each — tail is negligible).
  const CAP = 7;
  let pA = 0;
  let pDraw = 0;
  let pB = 0;
  for (let addA = 0; addA <= CAP; addA += 1) {
    const probAddA = poissonPmf(lamRemA, addA);
    for (let addB = 0; addB <= CAP; addB += 1) {
      const probAddB = poissonPmf(lamRemB, addB);
      const finalA = goalsA + addA;
      const finalB = goalsB + addB;
      const joint = probAddA * probAddB;
      if (finalA > finalB) pA += joint;
      else if (finalA < finalB) pB += joint;
      else pDraw += joint;
    }
  }
  const total = pA + pDraw + pB || 1;
  return {
    teamA: Number((pA / total).toFixed(4)),
    draw: Number((pDraw / total).toFixed(4)),
    teamB: Number((pB / total).toFixed(4)),
    minute,
    scoreline: `${goalsA}-${goalsB}`,
    remainingShare: Number(remaining.toFixed(3))
  };
}

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}
