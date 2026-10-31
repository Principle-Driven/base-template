// scripts/setup.sh runs this while .template/ exists. It turns a template copy into a new project.
import { execFileSync } from 'node:child_process';
import { readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { parseArgs } from 'node:util';

const usage = 'Run: bash scripts/setup.sh --name "<name>" --description "<description>"';
const setupPath = 'scripts/setup.sh';
const setupFirstRunStep = '\nif [ -d .template ]; then\n  mise exec -- node .template/first-run.mjs "$@"\nfi\n';
const changedFiles = ['README.md', 'package.json', 'LICENSE', 'AGENTS.md', setupPath, '.template'];

function fail(message) {
  console.error(message);
  process.exit(1);
}

async function projectDetails() {
  let options;
  try {
    options = parseArgs({ options: { name: { type: 'string' }, description: { type: 'string' } } }).values;
  } catch (error) {
    fail(`${error.message}\n${usage}`);
  }
  let { name, description } = options;

  if (name === undefined || description === undefined) {
    if (!process.stdin.isTTY) fail(`The first run needs a project name and a description.\n${usage}`);
    const prompt = createInterface({ input: process.stdin, output: process.stdout });
    const folder = path.basename(process.cwd());
    name ??= (await prompt.question(`Project name (${folder}): `)).trim() || folder;
    description ??= (await prompt.question('One-line description: ')).trim();
    prompt.close();
  }

  name = name.trim();
  description = description.trim();
  if (!name || !description) fail(`The project name and description must not be empty.\n${usage}`);
  if (/[\r\n]/.test(name + description)) fail('The project name and description must each be one line.');
  return { name, description };
}

function withoutFirstRunSection(agents) {
  const start = agents.indexOf('\n## First run\n');
  const end = agents.indexOf('\n## ', start + 1);
  if (start < 0 || end < 0) fail('AGENTS.md does not contain a complete "First run" section.');
  return agents.slice(0, start) + agents.slice(end);
}

function isGitWorkTree() {
  try {
    return execFileSync('git', ['rev-parse', '--is-inside-work-tree'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() === 'true';
  } catch {
    return false;
  }
}

const { name, description } = await projectDetails();
const packageName = name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^[-._]+|[-._]+$/g, '');
if (!packageName) fail('The project name must contain a letter or a digit.');

const readme = readFileSync('.template/README.md', 'utf8')
  .replaceAll('{{name}}', () => name)
  .replaceAll('{{description}}', () => description);
const agents = withoutFirstRunSection(readFileSync('AGENTS.md', 'utf8'));
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
packageJson.name = packageName;
const setup = readFileSync(setupPath, 'utf8');
if (!setup.includes(setupFirstRunStep)) fail(`${setupPath} does not contain the first-run step.`);

writeFileSync('README.md', readme);
writeFileSync('AGENTS.md', agents);
writeFileSync('package.json', `${JSON.stringify(packageJson, null, 2)}\n`);
// Bash reads setup.sh while it runs this script. A new file leaves the running copy unchanged.
writeFileSync(`${setupPath}.new`, setup.replace(setupFirstRunStep, ''), { mode: statSync(setupPath).mode });
renameSync(`${setupPath}.new`, setupPath);
rmSync('LICENSE', { force: true });
rmSync('.template', { recursive: true, force: true });

execFileSync('pnpm', ['principles:check'], { stdio: 'inherit' });

if (!isGitWorkTree()) {
  console.log(`\nThe ${name} project is ready. This folder is not a Git repository, so nothing was committed.`);
  process.exit(0);
}

try {
  execFileSync('git', ['add', '--all', '--', ...changedFiles], { stdio: 'inherit' });
  execFileSync('git', [
    'commit',
    '--message', 'Start this project from the PDD base template',
    '--message', 'The README now describes this project.\nThe template README, license, and first-run step are removed.',
    '--', ...changedFiles,
  ], { stdio: 'inherit' });
} catch {
  fail('\nThe project files are ready, but the commit failed. Correct the error above, then commit the changes.');
}

console.log(`\nThe ${name} project is ready.`);
