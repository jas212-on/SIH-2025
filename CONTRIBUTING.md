# Contributing to Jalmitra Frontend

Thanks for your interest in improving Jalmitra's frontend. This guide covers local setup, coding conventions, and how to submit changes.

## Local Setup

1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   cd Jalmitra_Frontend
   npm install
   ```
3. Copy the environment template and point it at a running backend (see `../Jalmitra_Backend/README.md`):
   ```bash
   cp .env.example .env
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

## Coding Style

- Components are functional, using hooks — no class components.
- Pages live in `src/pages/`; shared UI lives in `src/components/{common,chat,home}/`.
- Import paths are relative (`../components/...`, `../services/...`) — keep new files within the existing folder layout instead of introducing path aliases.
- Run `npm run lint` before opening a PR and fix any ESLint warnings it reports.
- Match existing TailwindCSS conventions (utility classes in JSX, dark-mode variants via `dark:`).
- Keep translations in sync: if you add user-facing copy, update all locale files touched by `react-i18next`.

## Pull Request Workflow

1. Create a branch from `main` named `feature/<short-description>` or `fix/<short-description>`.
2. Make your changes, keeping commits focused and descriptive.
3. Verify `npm run build` succeeds with no errors.
4. Open a PR against `main` with a clear description of the change and, for UI changes, a screenshot or short clip.
5. Link any related issue in the PR description.

## Reporting Bugs

Open a GitHub issue with steps to reproduce, expected vs. actual behavior, and browser/OS details. For security issues, see [SECURITY.md](SECURITY.md) instead of filing a public issue.
