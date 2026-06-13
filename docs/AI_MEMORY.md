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
- `src/liveResults.js` contains a manually verified result snapshot and today's fixture snapshot for 2026 matches. Keep it narrow: final scores, today's scheduled matches, source note, and update timestamp.
- `src/localization.js` contains Chinese display names for national teams, clubs, positions, and score text.
- `src/matchAnalysis.js` creates group-stage match-by-match probability rows from the current team data and selected model options.
- `src/fixtureCalendar.js` is the generated full 72-match group-stage calendar (real dates, US-Eastern times, venues, ESPN gameIds; source: ESPN scoreboard API, retrieved 2026-06-13). Manually verified `liveResults.js` entries override it at merge time. Regenerate if FIFA reschedules.
- `src/venueFactors.js` maps high-altitude venues (Mexico City 2,240m / Guadalajara 1,566m, pattern-matched across naming variants) to Elo boosts for acclimatized teams (Mexico/Ecuador/Colombia, max +40). Applied inside matchAnalysis to probability inputs only — displayed Elo unchanged; each affected row carries a `venueFactor` field.
- `src/marketFusion.js` converts moneylines to vig-free probabilities and blends model/market output (see Model Notes).
- `src/nationalStars.js` contains major national-team star-pool profiles for display and explanation.
- `src/policyOddsModel.js` contains external policy/logistics factors and an odds snapshot converted into model boosts.
- `src/realtimeData.js` fetches the public ESPN soccer scoreboard for same-day fixtures, live/final status, score, venue, and available market odds.
- `src/teamStaff.js` contains coach display data for teams in the modeled tournament field.
- `src/teamTactics.js` contains tactical style snapshots and match-level tactical preview text.
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
Run it after changes to `src/localization.js`; the test suite checks representative Chinese mappings.

## Model Notes

- Elo expected score formula: `1 / (1 + 10 ** ((eloB - eloA) / 400))`.
- Dynamic Elo: `simulateTournament` applies finished results from `options.matchResults` to team Elo before simulating (eloratings.net rule, K=60, goal-difference multiplier via `goalDifferenceMultiplier`). On by default whenever `matchResults` is passed; opt out with `options.dynamicElo: false`. Pure helper: `applyMatchResultsToElo(groups, results)` — never mutates input. Completed-match rows in `matchAnalysis` still use pre-match Elo (no hindsight leakage) because the analysis path does not apply updates.
- Market fusion: `src/marketFusion.js` converts win/draw/win moneylines to vig-free probabilities (`impliedMatchProbabilities`) and blends them with model output (`fuseProbabilities`, default weight 0.5). `MARKET_SNAPSHOT` holds manually verified DraftKings lines keyed by matchId. UI wiring is pending (app.js is being reworked); integrate at the display boundary only, and tune the weight from the Brier scoreboard in docs/match-reviews/.
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
- Star rows display English short name, Chinese name, full English name, club, role, and a market-value field. Market values should remain null/`身价待核` until a source and retrieval date are documented.
- These are not official final World Cup squads. Keep that caveat in user-facing text and docs.
- When updating clubs or players, prefer current club context and avoid overfitting to a single recent match.

## Coach / Staff Notes

- `src/teamStaff.js` is display data, not a modeling input yet.
- Keep coach names source-checkable and mark uncertain items with a note instead of pretending they are verified.
- If the tournament field is replaced with a current official FIFA field, update this file in the same change.

## Localization Notes

- Keep model data keys in English for stable joins across Elo, club/star, policy, odds, match, and trend modules.
- Use `src/localization.js` only at display boundaries.
- When adding a new country, club, or position, add the Chinese display name there and update tests if it is a major surface.
- `localizeCountryText` is used for historical score strings such as finals.

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
- Each row shows win/draw/win probabilities, favorite, match profile, and upset-or-draw probability. Completed matches from `src/liveResults.js` show final score, model hit/deviation, and points/goal-difference impact. Today's fixtures are also surfaced as a separate homepage rail before the full 72-match list.
- `predictionHit` means the real outcome matched the modal pre-match outcome: whichever of team A win, draw, or team B win had the highest modeled probability. Draws are not automatically counted as hits.
- `src/liveResults.js` final-result rows include redundant English team keys (`teams.teamA` / `teams.teamB`) and `src/matchAnalysis.js` validates them against the generated fixture before attaching scores, so reordered group data fails loudly instead of silently misassigning scores.
- Champion predictions now apply final group-stage results before simulating remaining group matches, so already-completed games change qualification and title probabilities.
- The "更新实时数据" button fetches the ESPN scoreboard client-side. Available odds are shown only as public market/odds direction, not as global betting volume or betting advice.
- Each match now has a model predicted score and tactical preview. Today's match cards show richer team data: Elo, coach, core stars, predicted score, tactical matchup, and forecast explanation.
- It reflects the currently selected model layers in the UI because `src/app.js` passes boosted groups into `buildGroupMatchAnalysis`.
- Future real-result tracking should continue adding actual score fields and prediction-error calculations without replacing this forecast mode.

## Forecast Trend Notes

- `src/trendAnalysis.js` compares four stages: pure Elo, form, form+policy, and full model.
- In the UI, trend simulations are capped at 2000 iterations per stage to keep the browser responsive.
- The trend is a model-layer sensitivity curve, not live odds movement or real-match momentum.
- Keep trend output focused on probability change, risers/fallers, and volatility.

## Data Caveats

- Groups in `src/data.js` were verified against the ESPN FIFA World Cup standings API (`site.api.espn.com/apis/v2/sports/soccer/fifa.world/standings?season=2026`, retrieved 2026-06-12). The earlier demo groups E/G/L were wrong (had Serbia and Jamaica, missed Egypt and Curacao) and were corrected.
- Team Elo values in `src/data.js` are real ratings from eloratings.net (`World.tsv` + `en.teams.tsv` for code mapping, retrieved 2026-06-12), used as-is with no transformation. They drift as matches are played; refresh from the same source and update this date when refreshing.
- Team order inside each group follows the real matchday-1 pairing (1v2, 3v4), verified against the ESPN scoreboard for 2026-06-11 through 2026-06-17.
- Beware eloratings.net team codes: they are not ISO (Scotland=SQ, South Africa=ZA, Saudi Arabia=SA). Always join through `en.teams.tsv`, never assume ISO codes.
- Historical chart data covers completed tournaments from 2002 through 2022.
- The 2026 context is intentionally separate because the tournament is in progress as of 2026-06-12.
- Club/star data is a curated current snapshot, not an exhaustive feed. Document source dates and rationale when updating it.
- National star-pool data is explanatory, not official roster data.
- Odds data is a market snapshot. It will become stale quickly and should be refreshed before any serious comparison.
- Real match results must be source-checked before updating `src/liveResults.js`; do not mark a match as final unless the public scoreboard agrees.
- Do not claim to know "global betting volume" unless a real aggregate source is added. Public odds/market direction is acceptable when the provider and timestamp are visible.
- Do not fill friendly/recent warmup results until a source is integrated. The current tactical cards explicitly mark this as pending public match-result sourcing.

## Boss Product Directives (2026-06-13)

Prediction accuracy is the revenue model. Standing requirements from the boss:

- Same-day match predictions must be multi-factor (Elo + form + coach/tactics + market odds + venue factors), not single-model.
- Each same-day match needs a very detailed head-to-head presentation: our predicted score, our win/draw/loss probabilities, AND a comparison against market/bookmaker odds. The data layer for this is ready (each match row carries `probabilities` (published, fused), `modelProbabilities`, `marketProbabilities`, `predictedScore`); the unlock-view UI should render the three-way comparison.
- When the model produces a standout signal (e.g. high dark-horse/upset probability like D-1 USA-Paraguay at 62.8% upset+draw), it must be highlighted prominently, not buried in a list.
- Coach strategy quality matters. `TEAM_TACTICS` covers only 4 teams with real entries (rest fall back to DEFAULT_TACTIC) — expand with real per-team tactical/coach data, scraping free sources first (boss authorized scraping; paid data available on request, but check free sources suffice first).
- Every finished match gets a post-mortem within 24h (docs/match-reviews/ SOP) comparing model vs market vs actual with running Brier — this is the "model training" loop that tunes marketWeight and factor boosts.
- The site needs a Chinese/English language toggle (boss directive 2026-06-13). Suggested approach: UI chrome strings move into a zh/en string table; team/club/position names already have English keys + `localization.js` for Chinese, so data display just needs the toggle to bypass/apply localization; persist choice in localStorage. Best implemented by whoever owns app.js/index.html at the time.

## UI Review Findings (2026-06-13, Claude — measured on live site, 1440px + 375px)

P0 (fix first): (1) Empty dashed ad-placeholder box sits at the very top of the page and eats ~1/4 of the mobile first screen when AdSense has no fill — collapse the slot when unfilled or move it below the fold. (2) Contrast failures measured: header subtitle ~1.1:1 (nearly invisible), "模型在线" badge ~1.1:1, eyebrow labels 3.07:1, ESPN links 3.67:1, green-button text 3.86:1, recent-form list rows 2.92:1 — all below the 4.5:1 WCAG floor; lighten/darken these grays one step. (3) Mobile header (title block + buttons + tab row) consumes ~half the first screen before any content; compress on ≤680px.

P1: nav tabs are 34px tall and detail links 32px (14 targets below the 44px touch minimum); 10.6px/11.5px fonts below the 12px floor; ALL seven modules render stacked in one page (tabs are anchor links, not view switches) so the full 72-match list renders upfront — switch views or lazy-render below-fold modules; the horizontally scrollable tab row clips ("球队数...") with no fade/scroll affordance.

P2: only 3 breakpoints (1180/980/680) — no narrow-phone tier; the upset radar renders as a plain list — the boss wants high-upset matches visually highlighted (badge/color/top placement); use font-variant-numeric: tabular-nums for probability columns.

Good already: token-based CSS (18 vars), zero !important, consistent dark-green identity, clear desktop hero hierarchy, sensible module order.

Polish status (2026-06-13, Claude): the P0s and quick P1/P2s are live via `styles-polish.css`, loaded after styles.css from index.html. It fixes the muted-token contrast (--muted #8b968d → #5e6d64), header text opacity, button green to 4.5:1 (#11875a), eyebrow size/color, 44px tabs, tabular-nums, collapses unfilled/empty ad slots (`:has` rules), hides the mobile header subtitle, and adds a tab-row fade hint plus a ready-to-use `.upset-alert` dark-horse badge style. Match rows now carry a `darkHorse` boolean (no-result matches with upset+draw ≥ 0.55) — render `.upset-alert` on today cards/upset radar using it. **This file is a temporary layer: whoever finishes the styles.css rework should merge these rules in and delete the file.** Contrast re-measured live after deploy: 4.53–5.46:1 on all previously failing elements. Remaining from the review: view-switching/lazy render for the 7 stacked modules, narrow-phone breakpoint tier.

## Multi-Factor Model Stack (2026-06-13) — the product's differentiator

Predictions fuse these, layered in matchAnalysis on top of base eloratings Elo:
1. Base Elo (eloratings.net, real) + dynamic Elo updates from finished results (K=60).
2. Club/star form + policy/odds boosts (pre-existing toggleable layers).
3. Market fusion (`marketFusion.js`): blend model with vig-free DraftKings odds (weight 0.5).
4. Venue/altitude (`venueFactors.js`): Mexico City 2,240m / Guadalajara 1,566m → up to +40 Elo for acclimatized teams (Mexico/Ecuador/Colombia).
5. Officiating (`refereeFactors.js`): strict card climate (opener had 3 reds) raises upset/draw variance; per-referee table is an empty extension point (no fabricated data).
6. Climate/heat-stress (`climateFactors.js`): venue June–July heat × humidity × kickoff time × roof/AC → up to +18 Elo edge to heat-adapted side; each row carries a climate read.

All factors adjust *probability inputs only* — displayed base Elo is untouched. Each match row exposes `venueFactor`, `officiating`, `climate`, `modelProbabilities`, `marketProbabilities`, `darkHorse`. Flagship dark-horse pick: **Ecuador** (docs/analysis/dark-horse-of-2026.md); Japan dossier alongside.

## Agent Division of Labor (set 2026-06-13 — concurrency safety)

Claude and Codex are editing this ONE worktree at the same time, which collides on shared files (memory rule: concurrent agents need isolation). Working split to avoid clobbering:
- **Claude owns**: data/model layer — `src/*Factors.js`, `simulator.js`, `marketFusion.js`, `matchAnalysis.js`, `fixtureCalendar.js`, `liveResults.js`, `data.js`, all `docs/`. Deploys these + commits to GitHub.
- **Codex owns**: UI shell — `index.html`, `app.js`, `styles.css`, ad/unlock wiring. (adUnlock.js/config.local.js/ads.txt are server-only, gitignored.)
- UI/layout/i18n requests (English-first + Chinese toggle, "more attractive layout") belong to whoever holds app.js/index.html; Claude only touches them with a version-string bump or a non-conflicting additive file (e.g. styles-polish.css) and flags it.

## Open Requests Backlog (2026-06-13, from boss rapid-fire)

Done & live: data fixes, dynamic Elo, market fusion, 72-match calendar, venue/officiating/climate factors, dark-horse pick+flag, unlock free, finished-match free report, UI polish layer, GitHub boundary secured (pub ID never leaked; ads.txt gitignored).
Pending (need boss steer or Codex coordination): (a) nginx HTML no-cache to root-fix mobile stale cache — classifier-blocked, needs boss to run/permit; clear-cache workaround works now; (b) English-first UI + Chinese toggle (Codex's files); (c) more attractive layout (Codex's files); (d) parlay/足彩串 data engine — authorized, data-entertainment scope, not yet built; (e) live in-play data → live re-prediction (ESPN live, feasible); (f) deeper player-form/sharpness; (g) automated post-match→model-calibration loop (foundation exists in docs/match-reviews + Brier).

## i18n (2026-06-13, live)

English-first with a Chinese toggle. `src/i18n.js` holds the EN/ZH string table (default EN, persisted in localStorage `worldcup_lang`), `applyStaticTranslations()` swaps every `[data-i18n]` element in index.html, and `t(key)` is for dynamic copy. `localization.js` is now language-aware (English key in EN mode, ZH map in ZH mode) so all team/club/position names switch on re-render. `app.js` applies translations on boot and the `#langToggle` header button flips language + re-renders. Verified both directions live. Remaining: some dynamic strings still built in app.js render functions (match cards, post-match copy) are not yet routed through `t()` — convert incrementally using the existing STRINGS table.

**index.html is blocked from GitHub**: Codex hardcodes the real AdSense pub ID in it (a `<meta google-adsense-account>` + the adsbygoogle loader `?client=ca-pub-…`). Per the public/server boundary that ID must not be committed, so index.html stays deployed-only and out of GitHub. To unblock GitHub sync, move the pub ID into server-only `config.local.js` (inject the meta + loader at runtime) so committed index.html carries no real ID. This is Codex's ad-wiring lane — coordinate before changing.

## Parlay engine (2026-06-13, data-entertainment scope)

`src/parlay.js` builds multi-leg parlays ("串") from match-analysis rows: `buildParlay(selections)` → combined hit rate + theoretical fair decimal odds + per-leg breakdown + combined market odds when every leg has market data; `recommendedParlay(matches, {legs, minConfidence})` auto-picks each match's modal outcome, most-confident first; `valueParlay(matches, {legs, minEdge})` picks legs where model prob beats market implied prob. Legs treated as independent (caveat surfaced in the `note`). Strictly data-entertainment: theoretical odds from our own probabilities, NO real betting, NO bookmaker links — keep that framing in any UI. Deployed; UI surface ("今日高信心串" card) is Codex's app.js/index.html lane — wire it there. Tests in test/modelUpdates.test.js (51 pass).

## Maintenance Rules

- Keep the app buildless and static unless the user asks for a larger framework.
- Prefer small, testable changes in `src/simulator.js` for model behavior.
- Keep UI copy concise and in Chinese unless the user asks otherwise.
- If adding external data import/export, preserve the current built-in demo mode.
- When a future agent learns an important durable fact, add it to this file.

## Public / Server-Only Boundary

- GitHub is allowed to receive only public/free material: daily match list, basic team information, recent form, head-to-head notes, simple model lean, README screenshots, tests, and shared documentation.
- GitHub public pages and README screenshots must not reveal exact score predictions, win/draw/loss percentages, upset index, model confidence, or one-line final conclusions for an unplayed match.
- Paid, ad-unlocked, or commercially sensitive content must stay off GitHub.
- Real ad IDs, Google Offerwall/Rewarded Ad production config, server IP/SSH/nginx details, tokens, secrets, and private deployment notes must not be committed.
- Server-only monetization work should load configuration from a non-committed local/server file such as `config.local.js`.
- Ordinary display ad slots are for display only and must not be used as unlock triggers. Rewarded/offerwall flows need a separate compliant interface and a friendly unavailable state.

## Known Environment Notes

- Local git commits exist in this workspace.
- Pushing to `Moreyi/world-cup-` failed from this environment because SSH and HTTPS git credentials were unavailable.
- GitHub connector metadata access worked, but contents API writes returned `403 Resource not accessible by integration`.
- The Claude Design share link for the visual refresh returned Claude's region-unavailable page from this environment. The follow-up visual pass used the user's screenshot as the reference and rebuilt the first screen as a light operations dashboard: dark green top navigation, overview cards, white ranking table, and right-side model cards.

## Change Log

- 2026-06-12: Created initial static World Cup Elo forecast app with tests.
- 2026-06-12: Added shared AI memory files for Claude/Codex co-maintenance.
- 2026-06-12: Added 2002-2022 World Cup historical chart analysis and separate 2026 context panel.
- 2026-06-12: Added post-2022 club/star form model and optional Elo boost switch.
- 2026-06-12: Added international policy/external environment model and odds calibration switch.
- 2026-06-12: Added match-by-match group-stage result probability charts.
- 2026-06-12: Added forecast trend analysis across model stages.
- 2026-06-12: Added major national-team star-pool data and display panel.
- 2026-06-12: Added Chinese display-name localization for teams, clubs, positions, and historical score text.
- 2026-06-12: Reworked the app shell to match the shared design screenshot more closely: dark green header, module tabs, light dashboard canvas, overview cards, ranking table, model interpretation sidebar, and responsive model settings.
- 2026-06-12: Tightened the mobile breakpoint so the dashboard is readable on phone widths: compact header, horizontal module tabs, shorter overview cards, denser ranking rows, and single-column controls.
- 2026-06-12: Added completed-match tracking for the first two Group A matches: final score cards, post-match probability/deviation readout, and completed-match summary stats.
- 2026-06-12: Added a standalone "今日比赛" rail for Canada vs Bosnia and Herzegovina plus United States vs Paraguay, using the same model probability feed while keeping the full match analysis list below.
- 2026-06-12: Added live data refresh from ESPN scoreboard, public odds direction display, an upset prediction rail, hour-level ET/Beijing kickoff display, coach data, player Chinese/English display metadata, and current-result-adjusted champion simulation.
- 2026-06-12: Added model predicted scores and richer tactical previews for each match, with expanded same-day match cards for coach/core-player/model/tactical context.
- 2026-06-12: Tightened completed-match analysis: model-hit stats now use modal-outcome matching, final-result rows carry redundant team keys, and result-to-fixture joins validate team names before attaching scores.
- 2026-06-12: Documented the public/server-only boundary for Claude and future agents: GitHub may sync free daily data and public screenshots, while ad unlocks, paid content, production ad config, and server details remain server-only.
- 2026-06-12: Corrected the public README/demo boundary: replaced the single-match prediction screenshot with the provided dashboard screenshot, added the free daily schedule table, and removed exact score/probability/upset readouts from the public match UI.
- 2026-06-12: Data accuracy pass (Claude). Fixed groups E/G/L to the real draw (E: Germany/Curacao/Ivory Coast/Ecuador, G: Belgium/Egypt/Iran/New Zealand, L: England/Croatia/Ghana/Panama; removed Serbia and Jamaica, added Egypt and Curacao localization/coach/policy entries). Replaced all 48 demo Elo values with real eloratings.net ratings (old demo values averaged ~61 points absolute error; worst: Qatar +184, Jordan -180). Fixed A-2 result venue (Estadio Akron, Guadalajara — was wrongly Estadio Azteca) and A-2 kickoff ET (22:00, was 21:00). Verified both finished scores and today's two fixtures (incl. gameIds) against ESPN. All 25 tests pass.
- 2026-06-12: Added `docs/forecast-accuracy-research.md` (how to improve accuracy + off-field factor catalog with 2026 specifics and an implementation priority list) and `docs/match-reviews/` (per-match post-mortems comparing model probabilities vs market odds vs actual result/xG, with a running Brier scoreboard and a 5-step review SOP). Every finished match must get a review within 24h following that SOP. First reviews: Mexico 2-0 South Africa (model 77.7% modal hit; altitude/red cards unmodeled) and South Korea 2-1 Czechia (model 45.3% modal hit but underestimated Korea — xG 1.84-0.81; style matchup and set pieces are pure-Elo blind spots). Tonight's USA-Paraguay is the first direct model-vs-market disagreement (model favors Paraguay 43%, DraftKings implies USA 46%) — log the outcome.
- 2026-06-13: Added the full real group-stage calendar (`src/fixtureCalendar.js`, 72/72 matches mapped from ESPN with venues/dates/gameIds — our modeled 1v2/3v4 pairing order matched the real schedule exactly) and the altitude venue factor (`src/venueFactors.js`), wired into matchAnalysis probabilities. First affected upcoming match: A-3 Mexico vs South Korea (2026-06-18, Estadio Akron) where Mexico carries +28 altitude Elo. Suite: 39 pass.
- 2026-06-12: Model upgrade (Claude). Added dynamic Elo updates to `simulateTournament` (K=60, eloratings goal-diff multiplier, applied from `options.matchResults`, opt-out via `dynamicElo: false`) and the pure `src/marketFusion.js` module (vig-free implied probabilities + model/market blending with a verified DraftKings snapshot for B-1/D-1). 10 new tests in `test/modelUpdates.test.js`; suite at 35 pass. Ops: origin nginx now serves `.js` with `no-cache` (Cloudflare was serving 4h-stale data files to users), and a stray `.bak` vhost copy was moved out of sites-enabled (it caused duplicate server_name warnings — never leave backups inside sites-enabled).
