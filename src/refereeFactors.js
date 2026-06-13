// Officiating / referee factor.
//
// Evidence (see docs/forecast-accuracy-research.md): a sent-off player costs a
// team ~1.4 goals of expected value per 90 minutes, and red cards are the
// single biggest in-match variance driver. The 2026 opener (Mexico–South
// Africa) produced THREE red cards — the most in any World Cup opening match —
// which is real evidence this tournament's officiating runs strict.
//
// Referees barely move the expected WINNER (academic consensus), so this
// factor does NOT shift Elo. It raises the upset/draw VARIANCE: strict
// officiating widens the path for the weaker side. Per-referee card tendencies
// can be layered in once a public per-match referee + card-rate source is
// wired (extension point below); we never fabricate referee names or stats.

// Tournament-level card climate, updated from real finished-match card data.
// `redCardsThrough` / `matchesSampled` are filled from ESPN summaries as the
// group stage plays out; do not guess values.
export const CARD_CLIMATE = {
  redCardsThrough: 3, // 2026-06-11 opener: 3 reds (verified, ESPN/Sky)
  matchesSampled: 2,
  note: "揭幕战 3 红牌为世界杯开幕战历史纪录，本届判罚趋严。"
};

// Per-referee tendencies. Empty until a public referee-assignment + card-rate
// source is integrated. Shape: { "Referee Name": { cardsPerGame, redRate } }.
export const REFEREE_TENDENCY = {};

const STRICT_REDS_PER_MATCH = 0.6; // ~strict threshold (reds per match)

// Returns the tournament officiating read: strictness label + a small additive
// applied to a match's upset-or-draw probability. Capped at +0.05 so it nudges
// variance without overwhelming the Elo-driven base.
export function officiatingFactor(refereeName) {
  const sampled = CARD_CLIMATE.matchesSampled || 1;
  const redsPerMatch = CARD_CLIMATE.redCardsThrough / sampled;
  const tendency = refereeName ? REFEREE_TENDENCY[refereeName] : null;

  let strictness = "average";
  let upsetBoost = 0;
  if (tendency) {
    strictness = tendency.cardsPerGame >= 5 ? "high" : tendency.cardsPerGame <= 3 ? "low" : "average";
    upsetBoost = Math.min(0.05, Math.max(0, (tendency.redRate ?? 0) * 0.5 + (tendency.cardsPerGame - 4) * 0.01));
  } else if (redsPerMatch >= STRICT_REDS_PER_MATCH) {
    strictness = "high";
    upsetBoost = Math.min(0.05, (redsPerMatch - STRICT_REDS_PER_MATCH) * 0.04 + 0.02);
  }

  return {
    strictness,
    upsetBoost: Number(upsetBoost.toFixed(3)),
    redsPerMatch: Number(redsPerMatch.toFixed(2)),
    referee: tendency ? refereeName : null,
    note: tendency ? null : CARD_CLIMATE.note
  };
}
