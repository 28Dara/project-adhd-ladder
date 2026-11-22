# ADHD Ladder — AI development instructions

## Role and authority
- Act as an implementation assistant for a TripleTen final project. The project owner approves product decisions and integration; do not silently expand scope.
- Follow approved requirements in `docs/dossier.md` and the schedule in `docs/plan-de-trabajo.md`. For visual work, use `docs/design/paleta-colores.md`, `src/styles/variables.css`, and the **relevant** mockup in `docs/design/mockups/`.
- Source precedence: explicit latest instruction from the owner > approved decisions marked `[DECIDIDO]` in the dossier > current plan > implementation proposals `[PROP]`. Treat `[ABIERTO]` as undecided; ask before making consequential choices.
- Read only the relevant documentation sections for the current task; do not repeatedly load the full dossier or all mockups. Do not treat mockups as proof of implemented behavior.

## Stack and delivery scope
- Vite + React + TypeScript; React Router; semantic HTML; CSS with Flex/Grid and mobile-first layout.
- Supabase Auth + PostgreSQL with Row Level Security (RLS) for persistence. No custom Express/Node API or MongoDB; this submission is **TripleTen Stage 1** only.
- A **separate third-party quotes API** must be called with `fetch()` in `src/utils/quotesApi.ts`, with typed data and visible loading, error and empty states on the Life page. The provider is not yet approved; do not assume DummyJSON is confirmed.
- Prioritize a deployed, functional Stage 1 application and the `stage-frontend` → `main` pull request before November 30, 2026. The plan targets PR submission November 28–29.

## Project structure
- Pages: Landing, About, SignUp, LogIn, Life, Health, Activities and Learning in `src/pages/`.
- Reusable UI in `src/components/`; session state in `src/context/`; data access in `src/hooks/` and `src/utils/`; shared interfaces in `src/types/`; constants in `src/config/`; styling in `src/styles/`; production images in `src/images/`; SQL migrations in `supabase/migrations/`.
- Do not make UI components query Supabase directly. Use typed hooks/utilities. Keep progress, dates, Health and streak calculations in testable pure functions.
- Reuse task components for Activities and Learning. Use unique stable IDs as React keys; do not use array indices.

## Approved business rules — do not change implicitly
- Health has three fixed daily checks: Good Nutrition, Good Sleep and Daily Movement. Health does **not** add steps to Life.
- Life today = completed Activities tasks today + completed Learning tasks today; lifetime Life total combines completions from these two ladders. Each ladder also has its own daily and lifetime total.
- Each task may be completed once per **local calendar day**. Unchecking today reverses today's count; prior-day history remains. Handle dates using the browser's local day, not raw UTC `toISOString()`.
- New accounts receive the six example tasks listed in the dossier **once only**. Archiving hides a task but preserves completion history and lifetime totals; hard-delete is only a documented time-pressure fallback requiring approval.
- Health color logic: 3 checks = green; 1–2 = yellow; 0 = yellow if yesterday had any checks, red if yesterday also had 0, and yellow on the first account day. Always pair color with text; never represent medical assessment.
- Streaks are calculated for closed days: a day with >=1 Activities/Learning step adds one; a day with zero steps may preserve the streak if Health is green/yellow and the previous day had steps; consecutive no-step days or no-step day with red Health resets it. Follow the dossier for edge cases; flag ambiguous sequences rather than inventing rules.
- Do not store derived counters or Health color as independent sources of truth.

## Security and correctness
- Enable and test RLS for **all** user-owned tables; test that two separate accounts cannot read or mutate each other's data, including completion references.
- Keep user-owned records attached to the authenticated user. Use the `task_completions` uniqueness rule and cross-user FK protections described in the dossier when implementing SQL.
- Only browser-safe Supabase public configuration may use `VITE_` variables. Never expose `service_role`, secret keys, credentials or `.env` contents; do not commit `.env`.
- Authentication must support sign-up, sign-in, sign-out, session restoration and private-route redirects; React route guards are not substitutes for RLS.
- Treat Supabase/quotes failures explicitly. Roll back optimistic updates when mutations fail. Avoid destructive database operations without explicit approval.

## Design, accessibility and TripleTen criteria
- Follow approved mockups and `variables.css`; keep backgrounds/gradients in CSS, text and buttons in HTML, optimized illustration in WebP, icons in SVG where possible.
- Ensure responsive behavior down to **320px**, without horizontal overflow or hiding overflow as a workaround. Use accessible labels, keyboard support, focus states and meaningful image alt text.
- Maintain `npm run dev`, `npm run build` and `npm run lint`. Keep at least `/` and `/about` reachable with React Router; configure deployment to avoid 404 on refresh.
- Keep `README.md` accurate, including technologies and deployment URL when available. Follow the Stage 1 checklist in the dossier before PR submission.

## Working style — small, reviewable changes
1. Before editing, state a short plan: goal, affected files and how success will be checked.
2. Work on **one requested task**; inspect only relevant files; prefer minimal changes. Do not install dependencies, redesign screens or add features without permission.
3. Do not create branches, commit, push, merge or modify `main` unless explicitly requested. If asked to use feature branches, target `stage-frontend` for review, not `main`.
4. After editing, run focused checks and, when practical, `npm run build` and `npm run lint`. Report commands actually run and results; never claim unrun tests passed.
5. Finish with: files changed, brief explanation, verification results, any open questions or blockers. Stop for review before starting another feature.

## Current priorities
- Use `docs/plan-de-trabajo.md` for task order; do not assume checkboxes are complete without verifying the repository.
- Preserve the November 24 Auth/RLS checkpoint and time-box optional polish. Never cut RLS, third-party API integration, required routes, deploy or the final PR to save time.
