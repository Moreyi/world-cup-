# Claude Project Notes

This repository is intentionally prepared for AI-assisted maintenance.

Claude should read `docs/AI_MEMORY.md` before making code changes. That file is the shared project memory for Claude, Codex, and any future coding agent.

## Quick Start

```bash
npm test
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Working Rules

- Keep the app dependency-free unless there is a clear reason to add tooling.
- Treat bundled team Elo ratings and groups as editable demo data, not official live data.
- Keep simulation logic in `src/simulator.js` and UI orchestration in `src/app.js`.
- Update `docs/AI_MEMORY.md` whenever project assumptions, model behavior, commands, or data caveats change.
- Run `npm test` after simulator or data-shape changes.

