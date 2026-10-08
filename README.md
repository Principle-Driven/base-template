# Starter

## Set up on macOS

From the project directory, run:

```bash
bash scripts/setup.sh
```

The script installs [mise](https://mise.jdx.dev/getting-started.html) if needed, then installs the pinned Node.js, pnpm, and project dependencies.
It installs [prosecheck](https://github.com/DheerG/prosecheck) if needed.
Dependency installation also installs the Git hooks.
It adds mise activation to your zsh configuration if absent.
Open a new terminal after setup.

## PDD

[PDD](https://github.com/Principle-Driven/pdd) is a project dependency. Use it through pnpm:

```bash
pnpm exec pdd catalog
pnpm exec pdd list
pnpm principles:check
```

Design principles use the `DP` token prefix.
Their definitions are in `docs/principles/`, with an index in `AGENTS.md`.
GitHub checks principles on each pull request.

## Commit messages

Husky runs prosecheck on each commit message.
The check uses local rules. It does not install or run a language model.
Errors and warnings block the commit.

To check a message manually, run:

```bash
mise exec -- prosecheck check --semantic off --message "Reject unclear commit messages"
```

## Files and directories

| Path | Contents |
| --- | --- |
| `AGENTS.md` | Agent instructions and the design principle index. |
| `CLAUDE.md` | Imports of the agent instructions and this README. |
| `docs/principles/` | Principle definitions, the change protocol, and a template. |
| `docs/icebox/` | Unscheduled idea notes, their format, and their log. |
| `scripts/` | The macOS setup script. |
| `.husky/` | The Git hook that checks commit messages. |
| `.prosecheck.json` | The shared commit message policy. |
| `.github/workflows/` | Principle checks on every pull request. |
| `mise.toml` | Pinned Node.js and pnpm versions. |
| `package.json` | Project dependencies and commands. |
| `pnpm-lock.yaml` | The resolved dependency versions. |
| `pdd.config.json` | The token prefix, principle directory, and agent index configuration. |
