# ADHD Ladder — AI development instructions (aligned with dossier v2.2)

## Role, authority and source of truth
- Assist with a TripleTen final project; the owner approves product rules, scope and integration. Do not silently expand scope or invent behavior.
- **Precedence:** owner's latest explicit instruction > `[DECIDIDO]` rules in `docs/dossier.md` v2.2 > `docs/plan-de-trabajo.md` > `[PROP]` proposals. `[ABIERTO]` is unresolved, not permission to choose.
- The dossier is the **complete normative product specification**. The plan is a schedule, not a second set of business rules. This file is an operational guide, not a competing definition.
- Read the dossier sections relevant to a task. For UI changes, use the relevant `docs/design/mockups/` image, `docs/design/paleta-colores.md` and `src/styles/variables.css`. Mockups and reports do not establish that functionality has been tested.
- Historic statements in the dossier or plan do not override the latest normative rules. Report contradictions before implementing.

## Stack and delivery scope
- Vite, React, TypeScript, React Router, semantic HTML, CSS Grid/Flex and responsive design from 320px.
- Supabase Auth + PostgreSQL with RLS for user data. **Stage 1 only**; no custom Express/Node server, MongoDB or home-built JWT system.
- A **separate third-party quotes API** must be called using `fetch()` in `src/utils/quotesApi.ts`; type its verified response and handle loading, empty, error and retry states. The current local sample quotes do not satisfy this requirement; provider selection remains open until verified.
- Target: deployed usable application with README and PR from `stage-frontend` to `main` before November 30, 2026; aim for November 28–29.

## Project structure and architecture
- Pages: Landing, About, SignUp, LogIn, Life, Health, Activities, Learning (`src/pages/`). Shared UI belongs in `src/components/`, auth/shared state in existing `src/context/` or authorized shared hooks, data access in `src/hooks/` or `src/utils/`, types in `src/types/`, constants in `src/config/`, CSS in `src/styles/`, images in `src/images/`, SQL migrations in `supabase/migrations/`.
- **Never query Supabase directly from visual components.** Use typed data hooks and utilities; derive progress, Health color, local dates and streaks in testable pure functions.
- Reuse the task UI and mutations for Activities/Learning; use stable unique IDs as keys, never list indices. Use the existing code and approved patterns rather than creating duplicate providers, hooks or systems.
- Apply Architecture Guardian to changes in shared state, business rules, data access, async operations, auth or routing, as detailed in the skill coordination section. Limit analysis to affected modules and dependencies.

## Skill coordination and scope
- Select only the skills relevant to the task. In new Codex prompts, explicitly name the selected installed skills using `$architecture-guardian`, `$ub-mode` and/or `$ciber-security`; if the interface does not resolve these references, request them by name. Verify availability; never claim a skill was loaded or a tool was run without evidence.
- `architecture-guardian`: project architecture, approved domain rules, shared components/state, routing, data access, lifecycle and preservation of existing contracts. Use the relevant portions even for focused visual tasks.
- `ub-mode`: implementation quality, simplicity, types, behavioral tests, root causes, semantic duplication detection and AHA. Before creating code, check for equivalent responsibilities regardless of name or syntax; do not merge independent domain rules merely because their implementations look alike. Apply checks proportionately; optional tools are not mandatory installation or refactoring gates.
- `ciber-security`: proportionate preventive checks for tasks involving authentication, authorization, persistence, sensitive data, external APIs, credentials or other material security risks. Perform a full audit only when requested; distinguish findings from authorized fixes.
- Consult the installed skill instructions when available (the existing Architecture Guardian path is `.agents/skills/architecture-guardian/SKILL.md`). The shared project reference `ADHD-Ladder-acuerdos-skills-y-metodologia.md` contains the agreed methodology and reference copies of the three skills; do not assume it exists in the local repository or that its copies are installed. Use the relevant principles if a skill is unavailable and disclose the limitation.
- Planning/review assistants should apply relevant skill principles to their own analysis, without claiming an actual skill invocation. Do not repeat full skill instructions in each prompt or load unrelated sections.
- Skills supplement the existing workflow and grant no additional permissions. Preserve approved architecture, UI, behavior and dependencies. Report out-of-scope improvements or duplication separately; stop only the affected part when a material conflict, risk or unresolved decision blocks it. No broad refactor, destructive cleanup, production change or credential rotation without corresponding approval.

## Commit-oriented planning and task lifecycle
- Preserve the existing project → phase → section hierarchy. Subdivide remaining sections in `docs/plan-de-trabajo.md` into small, logical, measurable objectives suitable for atomic commits as work is planned. Do not split trivial changes artificially or rewrite completed history.
- For each objective record a stable ID, objective, authorized scope, relevant skills, acceptance criteria, status and proposed commit message. Use `Pending`, `In development`, `In review`, `Completed` or `Blocked` (or their Spanish equivalents). Record actual commit hashes only when available; distinguish technical acceptance from Git execution and integration.
- Prefer Conventional Commits (`type(scope): description`) consistent with the repository. Include tests in the same logical change when appropriate; explain why, what changed and how it was verified.
- Keep the plan dynamic: add separately identified objectives for approved improvements or changes, reorder pending work according to dependencies and priorities, and keep unrelated findings as proposals until approved. A finding does not authorize implementation.
- Before implementation, inspect current local code and Git status, consult relevant sources, identify scope and acceptance checks, and obtain any outstanding approvals. Implement one authorized objective, verify it, report results and stop for owner review before starting another. Do not mark objectives complete solely from a report or the presence of code.
- Keep the existing branch workflow (`feature/*`, `stage-frontend`, `main`). Planning a commit does not authorize creating a branch, staging changes, committing, pushing or merging. Obtain explicit authorization for the corresponding Git operations; do not rewrite history merely to adopt this methodology.

## Pending work and decision tracking
- `docs/plan-de-trabajo.md` is the single operational backlog for remaining tasks, dependencies, verification and status. Record new proposed improvements there as separate pending objectives, subject to owner approval; do not create a parallel backlog or silently broaden scope.
- `docs/dossier.md` remains the authority for product decisions, including `[ABIERTO]` items. Reference the relevant decision from the plan rather than inventing a resolution or duplicating a second normative rule. Once the owner decides, synchronize the affected documents and skill references as authorized.
- Distinguish a reported defect, a proposed improvement, a blocked decision and verified completion. Preserve P0/P1/P2 priorities from the dossier and plan; do not let optional cleanup delay required delivery.

## Approved counter rules — v2.2, mandatory
- **Steps:** only completions of Activities or Learning tasks count. Health NEVER adds steps to Life, Activities or Learning.
- **Today:** `activitiesToday` and `learningToday` count each respective user's completions where `completed_date === todayLocalDate` (local browser calendar day as `YYYY-MM-DD`). `lifeToday = activitiesToday + learningToday`. The Life section cards display the corresponding numerical ladder counts, not one point per section card.
- Checking a task records at most one completion **per task per local day** and adds +1 today; unchecking today removes that day's completion and subtracts 1. No duplicates or negative counters; past days are not affected by today's unchecking.
- **Historical totals:** `activitiesTotal` and `learningTotal` count ONLY completions with `completed_date < todayLocalDate`. `lifeTotal = activitiesTotal + learningTotal`. The ongoing day is EXCLUDED even if tasks are checked. Checking/unchecking today NEVER changes totals for previous days.
- At the next local calendar date, yesterday's completion records naturally qualify as historical; today's checkboxes start unchecked and today's counts at 0 if there are no records for the new date. **Do not delete/move yesterday's records; do not add an incrementing lifetime counter or require a midnight cron job.** Reopening after multiple days must not duplicate anything.
- Do not confuse the `Your steps today` numerator with a separate fraction's denominator (active tasks), and never compute historical totals by counting currently visible task cards.
- Dates must be based on the **browser's local calendar date**, not raw `new Date().toISOString().slice(0,10)` or a hard-coded timezone. Keep date handling coherent across all views.
- Historical completions must survive renaming or removing a task from the active list. **No physical deletion/cascade that destroys history.** Existing `archived_at` is the proposed storage mechanism; `Delete Card` is the UI label, not permission for hard-delete.
- **OPEN PRODUCT DECISION:** removing a task *already checked today* before the day closes. Do not invent whether today's check remains or is reversed. Resolve with owner before implementing persistent deletion/archiving that affects this case.

## Other approved business rules
- Maximum **4 active tasks** per Activities/Learning. A new account receives the six named example tasks from the dossier once only; do not recreate them on later visits. With one active task, Settings hides `Delete Card`; still support an empty list state if encountered.
- Health has exactly three daily checks: Good Nutrition, Good Sleep, Daily Movement; new local day has no checks until recorded. **Rule B:** 3 today -> green; 1–2 -> yellow; 0 -> yellow if yesterday had any check, red if yesterday also had zero, yellow on first account day. Pair semaphoric colors with explanatory text; never imply medical assessment.
- The Health indicator in Life is a colored semantic circle, not a step check.
- Streak evaluates **closed days only**. A day with at least one Activities/Learning step increments; zero steps may hold if Health was green/yellow and previous day had steps; two consecutive zero-step days or zero steps with red Health reset. Consult the dossier's exact cases; don't conflate streak with historical total or days since signup.
- 06A includes *temporary UI behavior* (username/title edits in React, popups, Health checkboxes, quotes example by local date); do not treat it as persisted data or a real quotes API. Preserve draft-close/cancel/submit behavior and previously approved responsive composition.
- Derived counters and Health color are **not independently persisted sources of truth**.

## Security, async behavior and correctness
- RLS must protect every user-owned table. Test account A vs B, including completion foreign-key cross-user attempts and all relevant CRUD operations.
- Use the approved unique task/date completion constraint and composite user/task reference. Review migrations and cascade actions before changes; the existing SQL may require follow-up work to enforce v2.2 history preservation. Do not run migrations, delete databases or alter schemas without authorization.
- Never expose `service_role`, passwords or secret keys in client code, `VITE_` variables, repo or chat. Public Supabase config may be exposed through `VITE_`. Keep `.env` untracked and `.env.example` sanitized.
- Support sign up, sign in, sign out, session restoration and private-route redirects; UI route guards do not provide data security.
- Coordinate mutations of shared resources in their owning layer; avoid races, stale responses across navigation/account changes and leaked effects; roll back failed optimistic updates. Handle Supabase and quotes errors.

## UX, verification and delivery
- Honor mockups, palette, typography, WebP illustrations and existing CSS. Use real accessible buttons/links/labels; keyboard, focus, responsive width >=320px. Do not hide horizontal overflow to mask layout defects.
- Prefer the smallest safe change; no unrelated redesign, extra dependencies or broad refactoring. Review affected files and their direct consumers for regressions and dead code.
- Before editing: identify goal, files, relevant rules and verification. After editing: run appropriate focused checks and where applicable `npm run build`, `npm run lint`, `npm run format:check`, `git diff --check`. Report **only actually executed** tests.
- **Do not create branches, commit, push, merge or modify `main` without explicit owner authorization.** Do not assume checked-off work exists without inspecting current local code. Local unpushed changes take precedence over remote snapshots for implementation.
- Finish with changed files, behavior, verification and blockers. Stop before starting another feature.
- Non-negotiable final checks: real third-party quote via fetch, Supabase persistence, RLS isolation with two accounts, accessibility, deployment without SPA refresh 404, full README and a PR delivered by deadline.
