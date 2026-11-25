---
name: ub-mode
description: >
  Follow the reduced principles when writing or changing code. Every change
  follows First Make it Work, then Then Make it Right, then Follow Practice.
  Use when the user runs /ub-mode or asks for the reduced principles.
---

# ub-mode

## Scope and compatibility

Follow the operating workflow in `AGENTS.md` for design responsibilities, approvals and manual review. The dossier defines approved product rules. Architecture Guardian applies them to project architecture, and ciber-security provides security checks. Do not invent decisions or silently change working architecture, UI, dependencies or behavior. Report unrelated findings separately. If a material conflict or unsafe change arises, stop only the affected work and seek approval. No skill grants additional permissions.

For authorized code changes, apply the following phases proportionately:
* First Make it Work.
* Then Make it Right.
* Follow Practice

# First Make it Work

## Laziness Protocol

* One decision lives in one place.
* Ship the smallest edit that solves the problem.

## Foundational Thinking

* Get the data shape right before you write the logic.
* Do first whatever helps every later phase.
* If a concurrent writer would matter, do not share state.

## TDD

* For testable behavior changes, write a failing test before changing code when practical. For small visual or documentary changes, use appropriate focused verification.
* See it fail for the reason you expect.
* Make the smallest change that makes it pass.
* If an honest test is impractical, do not write a bad one.

## Redesign From First Principles

* Evaluate whether a new requirement fits the existing design; prefer the smallest compatible change.
* Consider the first-principles design as an analytical exercise; propose broader redesign separately and implement it only with approval.

## Attack the Premise

* When two fixes that share one premise fail the same gate, write that premise in one sentence and count which actors hold the imbalance.
* Identify and challenge the shared assumption; propose a correction within the approved scope.
* Do not start another fix until you have done that.

## Subtract Before You Add

* Take complexity out before you add anything.

## Outcome-Oriented Execution

* Aim at the end state you can check.
* A break in the middle is allowed when you planned it and can undo it.

## Build the Lever

* Consider a tool only when it demonstrably reduces total effort or risk; do not add tooling or dependencies without authorization.
* Do one unit by hand, then make the tool match that unit.

## Architecture

### Model the Domain

* Put the domain in a structure that makes the illegal states impossible.
* Use the existing project glossary; propose additions when needed.
* If the code is already clear and local, leave it.

### Boundary Discipline

* Check the data where it enters.
* Inside, rely on validated types within the same trust boundary; never skip authorization or checks at another trust boundary.
* Keep the business logic in a pure function.

### Type System Discipline

* Make the illegal value impossible to write.
* Parse outside data once, where it comes in.
* Do not silence the compiler.

### Make Operations Idempotent

* For operations intended to be retry-safe, ensure repeated execution or recovery does not duplicate effects; preserve intentional non-idempotent behavior.

### Separate Before Serializing Shared State

* If they do not need the same mutable thing, give each its own.
* If they do, allow one writer, and enforce that in the structure.

# Then Make it Right

## Fix Root Causes

* Reproduce it.
* Fix the cause.
* A guard that only hides the crash is not a fix.

## Sequence work into verifiable units

* Finish one small unit and check it.
* Then start the next.

## Test Behavior, Not Implementation

* The test calls the code the way its user does and checks the result that user would see.
* If the test would still pass when every function returned nothing, throw it out.

## Crapper

* Use the crapper tool if available and relevant; do not install it automatically.
* Treat CRAP below 10 as a diagnostic target, not a mandatory refactoring gate. Improve relevant code only when justified.
* Consider whether case statements are worth reducing.

## Dryer

* Use dryer if available and relevant. Treat similarity of 0.8 or above as a review signal; consolidate only genuinely shared responsibilities within scope.

## Semantic Duplication Detection and AHA

* Before creating new code, search for existing implementations with equivalent responsibilities, regardless of naming, location or syntax.
* Compare behavior, inputs, outputs, side effects, consumers and domain intent.
* Inspect functions, hooks, components, queries, utilities, validation rules, types and styles when relevant.
* Prefer reusing existing implementations when they represent the same responsibility.
* Consolidate genuinely duplicated responsibilities into a single source of truth when safe and within the authorized scope.
* Do not merge implementations solely because their code or current behavior looks similar.
* Apply AHA (Avoid Hasty Abstractions): identical implementations do not necessarily represent identical responsibilities.
* Keep implementations separate when they belong to independent domain rules or have different reasons to change.
* Prefer temporary duplication over an incorrect or premature abstraction.
* Do not introduce abstractions based solely on hypothetical future requirements.
* If equivalence is uncertain, preserve the existing implementations and report the finding.
* Preserve existing contracts, approved behavior and project architecture.
* Verify behavioral equivalence before and after consolidation.
* Report duplication outside the authorized scope without modifying it.
* Do not perform a project-wide refactor without explicit approval.

## Mutator

* Use mutator if available and relevant; do not claim results from unavailable tools.
* Cover the uncovered.
* Kill the survivors.
* Delete verified dead code only within scope after checking consumers, dynamic usage and approved future work.

## Refactoring

* Pin what the code does.
* Change the structure.
* Prove the behavior did not change.

# Practice

## Keep a Log

* Keep a concise record of material changes, decisions and verification.
* Report that log upon completion.

## Guard the Context Window

* Keep the main thread small.
* Use available delegation when permitted; otherwise summarize locally.

## Worktree Cleanup

* Identify safe cleanup candidates; do not remove worktrees or files outside scope without approval.
* Uncommitted work waits for a decision.

## Commit and Push

* Follow the Git workflow in `AGENTS.md`. The owner makes the commit personally.
* For commit review, explain why the change was made, what changed and how it was verified.
