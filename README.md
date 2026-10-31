# PDD base template

Start a new project with a complete [Principle Driven Development](https://github.com/Principle-Driven/pdd) standard.
A project made from this template starts with:

- design principles and their change protocol,
- agent instructions and code review standards,
- a commit message check,
- a principle check on each pull request.

The project does not need to find these standards by trial and error.

## Start a project

1. On GitHub, select **Use this template** to create your repository.
   Do not clone or fork this repository. A clone or fork keeps the template's Git history.
2. Clone your new repository.
3. From the project directory, run:

   ```bash
   bash scripts/setup.sh
   ```

The first run of setup asks for a project name and a one-line description.
It writes your project README, removes the template files, and commits the result.
If a coding agent opens the project first, the agent offers to start the first run.

The first run replaces README.md and removes LICENSE only while they are identical to the template files.
It keeps a package name that you changed.

[CONTRIBUTING.md](CONTRIBUTING.md) describes setup, commands, and the files that your project keeps.

## Work on the template

Mark your copy of the template once, so that setup and agents do not start the first run:

```bash
git config pdd.template-maintainer true
```

Then run `bash scripts/setup.sh`.

After you change `README.md`, `LICENSE`, or `.github/workflows/template.yml`, update their checksums.
GitHub checks them on each pull request.

```bash
shasum -a 256 README.md LICENSE .github/workflows/template.yml > .template/files.sha256
```

## What stays in the template

Your project keeps everything except these files:

| Path | Contents |
| --- | --- |
| `README.md` | This description of the template. |
| `LICENSE` | The template license. |
| `.template/` | Your project's first README, the first-run step, and the template file checksums. |
| `.github/workflows/template.yml` | The checksum check, which runs only in the template repository. |

## License

This template uses the [MIT No Attribution License](LICENSE).
A project made from it does not need to credit this template or keep its license.
Choose your project's license separately.
