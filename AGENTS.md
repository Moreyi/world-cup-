# Agent Project Notes

This repository uses a shared memory file so Claude, Codex, and other coding agents can maintain the same project context.

Read `docs/AI_MEMORY.md` before making code changes, then update it when you change architecture, model assumptions, data sources, commands, or known limitations.

## Commands

```bash
npm test
python3 -m http.server 8000
```

## Local Conventions

- No build step is required.
- Source files are browser-native ES modules.
- Tests use Node's built-in `node:test` runner.
- Keep generated artifacts and local scratch files out of commits.

