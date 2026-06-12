# Shared AI Memory

This file is the durable project memory for Claude, Codex, and future maintainers.

## Project Intent

Build a lightweight 2026 World Cup prediction tool that:

- estimates any two teams' win probability from Elo-style ratings
- simulates a full tournament with Monte Carlo runs
- displays championship odds in a browser UI
- lets users edit team ratings locally without a backend

The app is meant to be transparent and easy to adjust, not a betting model.

## Current Shape

- `index.html` defines the single-page app shell.
- `styles.css` contains responsive layout and visual design.
- `src/clubModel.js` contains post-2022 club events, star form samples, and the national boost model.
- `src/data.js` contains starter groups and Elo-like ratings.
- `src/history.js` contains 2002-2022 completed World Cup history plus a separate 2026 context object.
- `src/matchAnalysis.js` creates group-stage match-by-match probability rows from the current team data and selected model options.
- `src/nationalStars.js` contains major national-team star-pool profiles for display and explanation.
- `src/policyOddsModel.js` contains external policy/logistics factors and an odds snapshot converted into model boosts.
- `src/trendAnalysis.js` compares championship probabilities across model stages.
- `src/simulator.js` contains deterministic RNG, Elo probability, group-stage simulation, knockout simulation, and tournament aggregation.
- `src/app.js` wires DOM controls to the simulator.
- `test/simulator.test.js` covers probability invariants and tournament flow.

## Commands

```bash
npm test
python3 -m http.server 8000
```

Use `npm test` after changes to `src/simulator.js`, `src/data.js`, or any data contract consumed by the UI.
Also run it after changes to `src/history.js`; the test suite verifies key historical totals.
Run it after changes to `src/clubModel.js`; the test suite checks model shape and country boost behavior.
Run it after changes to `src/policyOddsModel.js`; the test suite checks odds conversion and boost lookup behavior.
Run it after changes to `src/matchAnalysis.js`; the test suite checks 72 group-stage matches and normalized result distributions.
Run it after changes to `src/trendAnalysis.js`; the test suite checks stage comparison and riser/faller ranking.
Run it after changes to `src/nationalStars.js`; the test suite checks profile counts and score ranges.

## Model Notes

- Elo expected score formula: `1 / (1 + 10 ** ((eloB - eloA) / 400))`.
- Group-stage matches include a draw probability controlled by `drawBias`.
- Knockout matches use decisive Elo probability only.
- Group ranking uses points, goal difference, goals for, Elo, then random tie-break.
- The 32-team knockout bracket is a stable simplified seed rule based on team strength after selecting 12 group winners, 12 runners-up, and 8 best third-place teams.

## Club / Star Model Notes

- `src/clubModel.js` covers a curated sample from the 2022 World Cup aftermath through 2026-06-12.
- Club events award points to winners and runners-up, adjusted by competition importance and recency.
- Club points flow to national teams through `CLUB_COUNTRY_LINKS`, which approximates how strongly a club's current cycle maps to national-team player pools.
- Star impact = form x influence x availability x position weight.
- National `eloBoost` is capped at 55 and applied only when the UI checkbox is enabled.
- This is a transparent heuristic, not a full player-level database. If adding richer data, preserve this file's readability and update tests.

## National Star Pool Notes

- `src/nationalStars.js` is a curated core-player snapshot for major national teams.
- Each profile has exactly four stars for compact UI comparison.
- `impactScore` is generated from form, national-team influence, and availability.
- These are not official final World Cup squads. Keep that caveat in user-facing text and docs.
- When updating clubs or players, prefer current club context and avoid overfitting to a single recent match.

## Policy / Odds Model Notes

- `src/policyOddsModel.js` separates policy/logistics assumptions from odds market assumptions.
- Policy factors are small external-environment adjustments: co-host preparation, regional familiarity, expanded-format squad depth, long-haul travel adaptation, and administrative uncertainty.
- Odds entries use American odds and convert them with `americanToImpliedProbability`.
- Odds boosts are intentionally small and capped; they calibrate the model toward market consensus without replacing Elo or simulation logic.
- The odds snapshot is not live and must not be described as betting advice. If updated, document the source, bookmaker/market type, timestamp, and region if available.
- Keep policy factors explainable. Avoid broad political claims; model only concrete tournament-preparation effects.

## Match Analysis Notes

- `src/matchAnalysis.js` currently covers all 72 group-stage matches generated from the 12 groups in `src/data.js`.
- Pairing order is a stable modeled schedule: 1v2, 3v4, 1v3, 4v2, 4v1, 2v3.
- Each row shows win/draw/win probabilities, favorite, match profile, and upset-or-draw probability.
- It reflects the currently selected model layers in the UI because `src/app.js` passes boosted groups into `buildGroupMatchAnalysis`.
- Future real-result tracking should add actual score fields and prediction-error calculations without replacing this forecast mode.

## Forecast Trend Notes

- `src/trendAnalysis.js` compares four stages: pure Elo, form, form+policy, and full model.
- In the UI, trend simulations are capped at 2000 iterations per stage to keep the browser responsive.
- The trend is a model-layer sensitivity curve, not live odds movement or real-match momentum.
- Keep trend output focused on probability change, risers/fallers, and volatility.

## Data Caveats

- Starter teams, groups, and ratings are demonstration data.
- Do not describe the built-in ratings as official or live.
- If replacing with official fixtures or a current Elo source, document the source, retrieval date, and transformation rules here.
- Historical chart data covers completed tournaments from 2002 through 2022.
- The 2026 context is intentionally separate because the tournament is in progress as of 2026-06-12.
- Club/star data is a curated current snapshot, not an exhaustive feed. Document source dates and rationale when updating it.
- National star-pool data is explanatory, not official roster data.
- Odds data is a market snapshot. It will become stale quickly and should be refreshed before any serious comparison.

## Maintenance Rules

- Keep the app buildless and static unless the user asks for a larger framework.
- Prefer small, testable changes in `src/simulator.js` for model behavior.
- Keep UI copy concise and in Chinese unless the user asks otherwise.
- If adding external data import/export, preserve the current built-in demo mode.
- When a future agent learns an important durable fact, add it to this file.

## Known Environment Notes

- Local git commits exist in this workspace.
- Pushing to `Moreyi/world-cup-` failed from this environment because SSH and HTTPS git credentials were unavailable.
- GitHub connector metadata access worked, but contents API writes returned `403 Resource not accessible by integration`.

## Change Log

- 2026-06-12: Created initial static World Cup Elo forecast app with tests.
- 2026-06-12: Added shared AI memory files for Claude/Codex co-maintenance.
- 2026-06-12: Added 2002-2022 World Cup historical chart analysis and separate 2026 context panel.
- 2026-06-12: Added post-2022 club/star form model and optional Elo boost switch.
- 2026-06-12: Added international policy/external environment model and odds calibration switch.
- 2026-06-12: Added match-by-match group-stage result probability charts.
- 2026-06-12: Added forecast trend analysis across model stages.
- 2026-06-12: Added major national-team star-pool data and display panel.
