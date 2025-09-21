# AGENTS

## Tech stack
- React Native app bootstrapped with Expo SDK 54
- TypeScript for all application code

## Tooling
- Oxlint enforces linting rules
- Prettier formats the codebase

## Setup
```bash
npm install
npm run start
npx oxlint .
```

## Agent workflow
- Run `npx oxlint .` before raising a PR to mirror the CI checks
- Run `npx prettier --check .` to ensure formatting; re-run with `--write` to fix
- Use `npm run start:android` or `npm run start:ios` when debugging on devices; `npm run start` is fine for the simulator or web
- Keep changes scoped and document context in PR descriptions so future agents can trace decisions

## Navigation
- Screen structure follows `expo-router` conventions and file-system based routing principles

## Testing
- No automated tests are in place yet
- Maestro will be introduced for end-to-end flows in the near future
