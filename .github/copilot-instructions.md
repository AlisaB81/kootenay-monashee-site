## Purpose

This file gives targeted, repository-specific instructions for automated coding agents (Copilot-style assistants) so they can be immediately productive. If you (a human) update project layout or add build/test scripts, keep this file short and current.

## Top-level summary (what I found)

- Repository root: currently contains no discovered source files or standard manifests (no `package.json`, `pyproject.toml`, `README.md`, or `.github` guidance files were found during analysis).
- Because the codebase is currently empty/undiscovered, instructions below prioritize discovery steps and conventions to follow once sources are added.

## How to be productive (priority checklist)

1. Detect the project type by looking for these files in the repository root (in order):

   - `package.json` → Node/JS/TS project (use `npm`/`pnpm`/`yarn`)
   - `pyproject.toml` or `requirements.txt` → Python
   - `go.mod` → Go
   - `pom.xml` or `build.gradle` → Java
   - `*.sln` / `*.csproj` → .NET
   - `Dockerfile` / `docker-compose.yml` → containerized services

2. If none of the above are present, run a repository-wide search for `src/`, `app/`, `cmd/`, or `services/` to find code locations.

3. Look for CI/workflow files in `.github/workflows/` or Docker/hosting config (`netlify.toml`, `vercel.json`) to learn how the project is built and deployed.

4. When you find a manifest (e.g., `package.json`), prefer using the project's scripted commands. Example: if `package.json` has `scripts.test`, run `npm test` (or `pnpm test`/`yarn test` depending on lockfiles or the repo’s package manager).

## Explicit examples & patterns to look for

- Node monorepo: presence of `pnpm-workspace.yaml`, `lerna.json`, or `workspaces` in `package.json` implies multi-package handling; use the workspace tool configured (pnpm/lerna/yarn).
- TypeScript projects commonly include `tsconfig.json` and `src/` with `index.ts` or `server.ts` entry points. Look for `build` script in `package.json` that runs `tsc` or a bundler (Vite/Rollup/webpack).
- Backend services often live under `api/`, `server/`, or `functions/` directories. Frontend code often in `web/`, `app/`, or `client/`.

## Build/test/debug heuristics (what to run)

- If `package.json` exists: prefer `npm ci` (or `pnpm install` if `pnpm-lock.yaml` exists), then `npm run build` and `npm test` if scripts exist.
- If Python: create venv, `pip install -r requirements.txt` or `pip install .` then run `pytest` if present.
- If Docker: use `docker-compose up --build` to reproduce service composition used locally.

## Project-specific conventions (how to infer them here)

- Look for `.editorconfig`, `.eslintrc*`, or `pyproject.toml` formatting/linters to match code style.
- If a `CONTRIBUTING.md` or `docs/` exists, follow the commit/branch naming and issue labels described there.

## Integration points & dependencies to check

- Check for `.env.example`, `secrets/`, or `infra/` directories to find external integration (databases, cloud providers, 3rd-party APIs).
- CI workflows in `.github/workflows/` often contain test/build matrix details and secret names used in deployment — use them to replicate CI locally.

## Safety & scope rules for automated edits

- If no build/test commands are detectable, avoid large refactors. Prefer small, well-scoped edits and add tests or a README entry describing the change.
- Do not commit secrets or dev-machine specific paths; prefer `.env.example` updates when documenting config.

## Merge guidance (when file exists)

- If `.github/copilot-instructions.md` already exists, merge by preserving existing bullet points and add only concrete, discovered facts. Do not remove human-written rationale.

## What I could not infer automatically

- Concrete build/test commands and representative code examples — the repository currently contains no discoverable manifests or source files. Update this file with one-line examples (entry files, scripts) once the project adds source files.

## Next steps for maintainers (what to add here)

- Add a one-line summary of the project's language/runtime and the main entrypoint (e.g., `Node - entry: web/server.js`, `Python - entry: app/main.py`).
- Add one representative command for building and testing (e.g., `npm ci && npm run build && npm test`).

---

If you'd like, I can now re-run a deeper scan after you add or point me to the source files and then update this guidance with concrete examples from your code. What would you like me to do next?
