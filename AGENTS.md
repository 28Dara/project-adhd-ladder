# ADHD Ladder — Repository operating instructions

## Authority and project sources

- Follow platform and workspace controls. Within those boundaries, precedence is the owner's latest explicit instruction > `[DECIDIDO]` rules in the [dossier](docs/dossier.md) > [work plan](docs/plan-de-trabajo.md) > `[PROP]` proposals. An `[ABIERTO]` decision requires the owner. Report material contradictions before acting on the affected scope.
- [Architect Mode](.agents/skills/architect-mode/SKILL.md) leads methodology. This file defines repository conventions, permissions and verification. The dossier governs product and architectural contracts. The plan is the operational backlog and records the state of each objective.
- Use the official TripleTen checklists for both stages. [07-AUD](docs/07-AUD-cumplimiento-academico.md) links the Stage 1 PDF, cites the Stage 2 checklist at `docs/Etapa_2_checklist.md` and maps academic criterion IDs to the plan. The dossier §§04–05 record release and product acceptance. For UI work, consult the relevant image in `docs/design/mockups/`, the [palette](docs/design/paleta-colores.md) and `src/styles/variables.css` under the frontend root. Mockups establish visual intent. Verify behavior against the current code.
- Start from the local tree and `git status`. Read the affected contracts, modules and consumers before making changes. Local work can be newer than GitHub.

## Owner decisions and delivery workflow

- The owner approves product rules, scope and integration. For frontend, the owner chooses or approves naming, structure, components, variables, functions, patterns and design. Reuse approved conventions. For backend, present one technical proposal covering what, how, why, purpose, affected files/resources, risks and verification. The owner approves it as a whole.
- Keep proposal approval, prompt generation, execution, acceptance and moving to the next objective as distinct owner decisions. ChatGPT coaches and proposes the scope and acceptance criteria. Generate a Codex prompt after explicit authorization. Codex implements the authorized objective, verifies it and stops for review. Follow existing approval for routine steps and corrections within the authorized scope. Request a new decision for a material conflict or scope change.
- Review technical evidence before manual acceptance. Give the owner reproducible, representative checks with the exact location or action, expected behavior and what signals failure. The owner handles visual and manual acceptance. The technical executor verifies runtime behavior and, once persistence is authorized, data integrity, account isolation and concurrency. Optional learning does not gate a technically accepted commit.
- Keep one logical objective per commit. The plan preserves project → phase → section, stable IDs, scope, dependencies, skills, acceptance, status and proposed commits. Use Pending, In development, In review, Completed or Blocked, or their Spanish equivalents. Track implementation, technical checks, manual acceptance, owner approval, local commit, publication and integration separately. Record actual hashes when known. Put independent findings and regressions in the plan as proposals until approved. Preserve P0/P1/P2.
- Use `feature/*`, `stage-frontend`, `stage-fullstack` and `main`. Stage 1 submits the PR from `stage-frontend` and Stage 2 submits a separate PR from `stage-fullstack`, both to `main`. The owner makes commits personally and may accumulate approved local commits before publishing. Use Conventional Commits when proposing a message. Branch creation, staging, push, merge, reset, rebase and other Git writes require explicit authorization. Preserve history and keep approval for publication and integration separate.

## Skill and tool selection

Use Architect's routing for planning, direction, review or learning. For an already authorized implementation, use the relevant specialist instructions and project contracts. Load Architect mode references only as the task calls for them. Select the smallest set that covers the actual work.

| Skill | Selection and local source |
|---|---|
| `architect-mode` | Project planning or a material planning gap (#Creator), technical direction and briefs (#Dev), evidence review (#Guardian), or tailored learning (#Tutor). [Routing](.agents/skills/architect-mode/SKILL.md#mode-routing) |
| `ub-mode` | Implementation quality, reusable responsibilities, types, root-cause fixes and behavioral checks. [Local skill](.agents/skills/ub-mode/SKILL.md) |
| `ciber-security` | Proportionate checks when a change affects Auth, authorization, persistence, sensitive data, credentials or external APIs. Full audit on explicit request. [Local skill](.agents/skills/ciber-security/SKILL.md) |
| `modern-web-guidance` | Read the relevant installed guides for a specific HTML/CSS, browser API, compatibility or accessibility question. [Local guides](.agents/skills/modern-web-guidance/guides/) when installed. |
| `impeccable` | Consult relevant local references for design, UX or visual review within an authorized UI task. A separate request by skill name is optional. [Local references](.agents/skills/impeccable/reference/) when installed. |
| `find-skills` | Consult the available skill catalog when the owner asks to discover capabilities. Installation or connection is a separate action. |
| `architecture-guardian` | Retained ADHD Ladder reference for targeted comparison and transition review. Routine work follows the dossier, repository rules, and selected specialists. [Local reference](.agents/skills/architecture-guardian/SKILL.md) |

- In new Codex prompts, name the relevant installed skills explicitly using `$skill-name` or the plain name if the interface cannot resolve it. Check availability and use the relevant local principles if a skill is missing. End planning responses containing a Codex prompt with the lowest adequate analysis level supported by the environment and a brief rationale.
- Local tools include shell and workspace tools, Git for inspection, project npm scripts and browser/DevTools for authorized checks. External service and GitHub access depend on the session and the authorized operation. Use only agents or connectors actually available for the task. Review can stay in the current session. Delegate only when permitted and worthwhile.
- Treat third-party skill files as local documentation by default. Executing their launchers, engines, scripts, hooks, Live, Loop, or MCP requires specific authorization, as do downloads, account linking/authentication, synchronization and external transmission of project data. Reading guidance or receiving a tool suggestion carries no execution permission.
- Get explicit authorization for data migrations (including local application), remote database operations, schema or production changes, destructive operations, credential rotation and new dependencies or tools outside scope. Keep database credentials and JWT secrets out of frontend code, `VITE_` variables, Git, logs and chat. `VITE_` is for public config. Keep `.env` untracked and `.env.example` sanitized.

## Understand Anything

- Start with the [onboarding guide](.ua/ONBOARDING.md). Check the graph's analyzed commit against the local tree, then consult the relevant nodes and consumers. Use `$understand-chat` for focused questions, `$understand-explain` for a file or symbol, and `$understand-diff` for changes that affect shared contracts or multiple consumers. Skip graph consultation for trivial isolated changes.
- After an approved commit made by the owner, use `$understand --no-auto-update` to update the graph as needed. Keep `autoUpdate=false` and rebuild only when the official workflow requires it. Understand Anything supports Architect Mode's review with dependency evidence. See [MAP-02](.ua/MAP-02.md#flujo-incremental-y-metodología).
- On the configured Windows machine, open the dashboard with `.\.ua\launch-dashboard.cmd` on loopback port 5174. The launcher is local. Direct `$understand-dashboard` defaults to port 5173.

## Stack and repository conventions

- Stage 1 uses Vite, React, TypeScript, React Router, Supabase Auth, Node.js and Express with TypeScript, and npm Workspaces. The browser uses native Fetch for DummyJSON. Use semantic HTML, CSS Grid/Flex and responsive layout from 320 px.
- Follow [Around on `main`](https://github.com/28Dara/web_project_around_full/tree/main) and dossier §03 for the target `client/` and `server/` organization, independent packages/configurations and root evaluation commands. Keep pages under the frontend's `src/pages/` and shared UI under `src/components/`. Preserve legacy migrations as historical evidence until their disposition is authorized. Retain stable task IDs and reuse task UI across Activities and Learning.
- Keep the Express foundation, JSON error handler, development proxy and public `/api/healthz`. Supabase Auth remains the active identity provider. Tasks, completions and Health use account-scoped in-memory state in Stage 1.
- Stage 2 persistence and authentication are undecided pending the November 26, 2026 TripleTen tutoring session and a new owner decision. Keep the implementation objectives suspended and preserve the official rubric, existing Supabase integration and legacy SQL.
- Visual components own presentation and their style imports. Keep drafts and menus local where possible. Route-spanning resources belong to the existing shared state and hooks. Keep private API calls and independent external requests in typed utilities. Derive dates, progress, Health state and streak with pure functions.
- Life, Activities, Learning and Health must support direct access independently of other pages' mounts. Activities and Learning share tasks and completions by account. Life derives progress from those records. Health owns daily check records independently.
- Keep client session state in the existing `AuthProvider` and navigation in the existing route guards. Guests see Landing at `/`. Authenticated users see Life at `/` and `/life` in the same private layout. Verify sign-up, sign-in, sign-out, restoration and protected redirects. Restore the session through Supabase Auth. Handle session races at the provider and key private state by verified account ID.
- Coordinate mutations in the layer that owns the resource. Where relevant, verify order of events across route/account changes, late responses, unmount, retries, loading, empty data and errors. Clean up subscriptions/listeners and revert failed optimistic writes. Check actual consumers before deleting code. Measure the relevant problem before adding memoization or dependencies.

## Contracts to check by change

| Area | Authoritative reference and verification |
|---|---|
| Progress and local date | Dossier §§02.2–02.5 and §04.D. Verify uniqueness, the Today/Total cutoff, Life's numerical sums, active-task denominator, the Monday-to-Tuesday case, and reopening after a gap. Dated writes follow DEC-07-01/02/04 and AUD-02-01. Preserve the date captured at the action and the account's fixed reference. |
| Tasks and popups | Dossier §§02.4, 02.6 and §04.D. Cover seed-once, the active-task limit and last-card rule, title normalization, Escape/outside preserving drafts, Cancel discarding them and valid Submit confirming. Verify archive and effective rename atomically remove today's completion only. Verify historical inclusion of archived tasks and assess persistent integrity when its implementation is authorized. |
| Health and streak | Dossier §§02.7–02.8. Verify the four Health levels, untouched-day decay and explicitly unchecked goals, shared text and the Life status circle, closed-day streak cases and zero Health steps. |
| Auth and persistence | Dossier §§02.1, 02.4, 02.9, 02.11, §03 and the relevant phase 07 objective. Verify Supabase Auth and client state isolation in Stage 1. The selected Stage 2 design will need to prove authorization, ownership and integrity with two test accounts. Route guards govern navigation. |
| Quotes | Dossier §02.10 and phase 07. Keep DummyJSON as a separate real `fetch()` in the frontend's `src/utils/quotesApi.ts`, with response validation and loading/error/empty/retry behavior. Persisted quote history (07-08) is deferred. |

## Verification and release

- Verify the authorized goal, direct consumers, changed files and relevant regressions. Keep visual changes bounded to approved surfaces and shared styles actually affected. Check semantic controls, keyboard, focus and responsive layout from 320 px as applicable. Fix overflow at its source.
- For code changes run the applicable functional, regression and security checks, plus `npm run build`, `npm run lint`, `npm run format:check` and `git diff --check` where applicable. For documentation, check links and consistency, review the diff and check whitespace, including intended new files.
- Report scope, what changed, how and why, relevant decisions, checks actually performed, results, risks and remaining verification. Distinguish runtime evidence from static review and verify each stage against the applicable rubric.
- Evaluate each academic submission independently. Stage 1 needs the real third-party quote, accessible frontend, README and Stage 1 PR. Verify public SPA refresh when deployment applies. Stage 2 has its own PR and rubric. Its architecture awaits academic clarification. Follow the plan for the November 30 deadline and confirm the stage-specific submission and review schedule with TripleTen.
