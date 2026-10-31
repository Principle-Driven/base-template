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
   Do not clone this repository. A clone keeps the template history and remote.
2. Clone your new repository.
3. From the project directory, run:

   ```bash
   bash scripts/setup.sh
   ```

The first setup asks for a project name and a one-line description.
It writes your project README, removes the template files, and commits the result.
If a coding agent opens the project first, the agent offers to do this setup.

[CONTRIBUTING.md](CONTRIBUTING.md) describes setup, commands, and the files that your project keeps.

## What stays in the template

Your project keeps everything except these files:

| Path | Contents |
| --- | --- |
| `README.md` | This description of the template. |
| `LICENSE` | The template license. |
| `.template/` | Your project's first README and the first-run step. |

## License

This template uses the [MIT No Attribution License](LICENSE).
A project made from it does not need to credit this template or keep its license.
Choose your project's license separately.
