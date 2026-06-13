// Market-signal factor — model-vs-market divergence.
//
// What this IS: when the bookmaker's vig-free probabilities disagree sharply
// with our model, the market usually knows something the model doesn't yet —
// a late injury, a rotated lineup, suspension news, or heavy informed money.
// Surfacing that divergence is genuinely useful: it tells the user "treat our
// pick here with caution; the market sees it differently."
//
// What this IS NOT: a match-fixing detector. Real integrity monitoring (FIFA /
// Sportradar UFDS) needs time-series odds across many bookmakers to spot
// abnormal pre-match drift, and even then flags are probabilistic. We have a
// single-snapshot price, so we MUST NOT label any match or team as "fixed" or
// "manipulated" — that is defamatory and false-positive-prone. The strongest
// honest statement is "unusual market signal — worth watching." World Cup
// matches are also the least likely to be fixed (maximum scrutiny).

function maxOutcomeDivergence(modelProb, marketProb) {
  return Math.max(
    Math.abs(modelProb.teamA - marketProb.teamA),
    Math.abs(modelProb.draw - marketProb.draw),
    Math.abs(modelProb.teamB - marketProb.teamB)
  );
}

// Returns the model-vs-market divergence read, or null when there is no market
// data. `level`: aligned (<0.08), notable (0.08–0.15), strong (>0.15).
export function marketSignal(modelProb, marketProb) {
  if (!marketProb) return null;
  const divergence = maxOutcomeDivergence(modelProb, marketProb);
  const level = divergence > 0.15 ? "strong" : divergence >= 0.08 ? "notable" : "aligned";

  // Which side the market favors more than our model does.
  const deltas = {
    teamA: marketProb.teamA - modelProb.teamA,
    draw: marketProb.draw - modelProb.draw,
    teamB: marketProb.teamB - modelProb.teamB
  };
  const marketLeansTo = Object.entries(deltas).sort((a, b) => b[1] - a[1])[0][0];

  return {
    divergence: Number(divergence.toFixed(3)),
    level,
    marketLeansTo,
    // Display copy: a caution flag, never a fixing claim.
    note:
      level === "strong"
        ? "市场与模型分歧大：盘口可能已计入伤停/阵容/资金面信息，谨慎看待本场预测。"
        : level === "notable"
        ? "市场与模型存在分歧,建议结合盘口参考。"
        : "市场与模型基本一致。"
  };
}
