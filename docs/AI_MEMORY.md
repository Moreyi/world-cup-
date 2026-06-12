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
- `src/data.js` contains starter groups and Elo-like ratings.
- `src/history.js` contains 2002-2022 completed World Cup history plus a separate 2026 context object.
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

## Model Notes

- Elo expected score formula: `1 / (1 + 10 ** ((eloB - eloA) / 400))`.
- Group-stage matches include a draw probability controlled by `drawBias`.
- Knockout matches use decisive Elo probability only.
- Group ranking uses points, goal difference, goals for, Elo, then random tie-break.
- The 32-team knockout bracket is a stable simplified seed rule based on team strength after selecting 12 group winners, 12 runners-up, and 8 best third-place teams.

## Data Caveats

- Starter teams, groups, and ratings are demonstration data.
- Do not describe the built-in ratings as official or live.
- If replacing with official fixtures or a current Elo source, document the source, retrieval date, and transformation rules here.
- Historical chart data covers completed tournaments from 2002 through 2022.
- The 2026 context is intentionally separate because the tournament is in progress as of 2026-06-12.

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
