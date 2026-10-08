# Agent instructions

Read [README.md](README.md) for setup, commands, and directory descriptions.
Before making a covered decision, read the applicable principle file.
Its Rule is authoritative. Rationale explains it, and Implications are examples.

## Principles

- **DP-01@v1 — Use Ubiquitous Language** — Make product concepts easy to identify through consistent names in customer conversations, interfaces, and code. → `docs/principles/dp-01-ubiquitous-language.md`
- **DP-02@v1 — Validate at Use** — Check the current facts at the action that depends on them. → `docs/principles/dp-02-validate-at-use.md`
- **DP-03@v1 — Use Simplified Technical English** — Use ASD-STE100 structural rules to make technical text clear, consistent, and easy to translate. → `docs/principles/dp-03-simplified-technical-english.md`
- **DP-04@v2 — Avoid Sunk Cost Fallacy** — Keep future changes aligned with current requirements. → `docs/principles/dp-04-do-not-let-sunk-costs-decide.md`
- **DP-05@v1 — Cite the rule, do not copy it** — Keep comments accurate by linking them to one versioned rule instead of repeating that rule across the codebase. → `docs/principles/dp-05-cite-dont-copy.md`
- **DP-06@v1 — Make accepted risks explicit** — Show that a known risk is a deliberate trade, and state when the team must review it again. → `docs/principles/dp-06-mark-accepted-risks.md`
- **DP-09@v1 — Borrow infrastructure and own domain behavior** — Use maintained packages for established technical problems and keep product decisions in your code. → `docs/principles/dp-09-borrow-infrastructure-own-domain-behavior.md`
- **DP-10@v1 — Tests earn their cost** — Test a concrete failure at the least costly layer that gives sufficient new confidence. → `docs/principles/dp-10-tests-earn-their-cost.md`
- **DP-11@v1 — Keep domain decisions in one place** — Keep product decisions consistent by giving each domain rule one owner. → `docs/principles/dp-11-contracts-express-intent.md`
- **DP-14@v1 — Write for future readers** — Make repository artifacts explain their current purpose, decisions, and evidence without the original conversation. → `docs/principles/dp-14-write-for-future-readers.md`

## Principle changes

Follow the [change protocol](docs/principles/change-protocol.md) before adding or changing a principle.
A “working as designed” review decision must cite a current, versioned token.
Run `pnpm principles:check` before completing a change.

## Collaboration

- Keep changes small and easy to review.
- Make changes on a branch.
- Discuss outcomes and tradeoffs in customer or user language.
- For important or required questions, use the harness's Ask User Question tool.
- **Critical:** Before saving durable memory in any form, agents must get explicit user approval to save the exact wording. Save only the requested content. Do not add unrequested hedges, qualifications, or restrictions.
- Use the principles to resolve technical choices.
- Humans decide product outcomes. They do not read code.
- Write code to a principal engineer's standard.
- Arrange an independent agent review before finalizing a branch.
- Resolve its findings and run the required checks.

## Code review

- Follow the [review standards](docs/code-review.md).
- If auto mode is enabled, ask the user once for permission to run reviews for the current session.
- If available, use the harness's built-in review function.
- Request a full branch review against its base branch.
- Give the reviewing agent the intended outcome in its steer.
- If the CLI supports this function, start the review through the CLI.
- Example For Codex: `codex exec review --base <base-branch>`.

## Icebox

- Record discussed, unscheduled ideas in `docs/icebox/<slug>.md`.
- Preserve the intent, decisions and their reasons, and unusual open questions.
- Treat entries as discussion records. Reconsider their decisions when planning starts.
- When implementation begins, move relevant context into the plan and remove the entry in the same change.
- Log each addition or removal in `docs/icebox/LOG.md`, with the date, slug, reason, and destination when applicable.
