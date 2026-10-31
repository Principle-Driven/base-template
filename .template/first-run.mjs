// scripts/setup.sh runs this while .template/ exists. It turns a template copy into a new project.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createInterface } from 'node:readline';
import { parseArgs } from 'node:util';

const usage = 'Run: bash scripts/setup.sh --name "<name>" --description "<description>"';
const templatePackageName = 'starter';
// Checksums of the template files that the first run replaces or removes. The template workflow checks them.
const templateChecksums = '.template/files.sha256';
const templateWorkflow = '.github/workflows/template.yml';
// The template-only step in scripts/setup.sh.
const setupStep = '\nif [ -d .template ]; then\n  mise exec -- node .template/first-run.mjs "$@"\nfi\n';
const interactive = process.stdin.isTTY;

function fail(message) {
  console.error(message);
  process.exit(1);
}

function gitOutput(...args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return undefined;
  }
}

function readText(file) {
  return existsSync(file) ? readFileSync(file, 'utf8') : '';
}

// One line reader for both questions. It keeps lines that are pasted ahead of a question.
let reader;
let lines;
async function ask(question) {
  if (!reader) {
    reader = createInterface({ input: process.stdin, terminal: false });
    lines = reader[Symbol.asyncIterator]();
  }
  process.stdout.write(question);
  const { value, done } = await lines.next();
  return done ? '' : value.trim();
}

function parseOptions() {
  try {
    return parseArgs({ options: { name: { type: 'string' }, description: { type: 'string' } } }).values;
  } catch (error) {
    fail(`${error.message}\n${usage}`);
  }
}

const options = parseOptions();
const inGit = gitOutput('rev-parse', '--is-inside-work-tree') === 'true';
const hasCommits = inGit && gitOutput('rev-parse', '--verify', '--quiet', 'HEAD') !== undefined;
if (inGit && gitOutput('config', '--local', '--bool', '--get', 'pdd.template-maintainer') === 'true') {
  console.log('This copy has pdd.template-maintainer set, so setup skips the first run.');
  process.exit(0);
}

async function projectDetails() {
  let { name, description } = options;
  if (name === undefined || description === undefined) {
    if (!interactive) fail(`The first run needs a project name and a description.\n${usage}`);
    const folder = path.basename(process.cwd());
    name ??= (await ask(`Project name (${folder}): `)) || folder;
    description ??= await ask('One-line description: ');
  }
  name = name.trim();
  description = description.trim();
  if (!name || !description) fail(`The project name and description must not be empty.\n${usage}`);
  if (/[\r\n]/.test(name + description)) fail('The project name and description must each be one line.');
  return { name, description };
}

function hasTemplateContent(file) {
  const entry = readText(templateChecksums).split('\n').find((line) => line.endsWith(`  ${file}`));
  return existsSync(file) && entry !== undefined
    && createHash('sha256').update(readFileSync(file)).digest('hex') === entry.split(' ')[0];
}

function withoutFirstRunSection(agents) {
  const start = agents.indexOf('\n## First run\n');
  if (start < 0) return agents;
  const end = agents.indexOf('\n## ', start + 1);
  return end < 0 ? agents.slice(0, start + 1) : agents.slice(0, start) + agents.slice(end);
}

const { name, description } = await projectDetails();
reader?.close();

// Setup reads the files after the questions, so edits made while it waited are not lost.
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
const agents = readText('AGENTS.md');
const agentsWithoutFirstRun = withoutFirstRunSection(agents);
const replaceReadme = hasTemplateContent('README.md');
const removeLicense = hasTemplateContent('LICENSE');
const renamePackage = packageJson.name === templatePackageName;
const setup = readText('scripts/setup.sh');
const removeSetupStep = setup.includes(setupStep);
const removeWorkflow = hasTemplateContent(templateWorkflow);
const packageName = name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^[-._]+|[-._]+$/g, '');
if (renamePackage && !packageName) fail('The project name must contain a letter or a digit.');

const edited = [
  renamePackage && 'package.json',
  agentsWithoutFirstRun !== agents && 'AGENTS.md',
  removeSetupStep && 'scripts/setup.sh',
].filter(Boolean);
if (hasCommits) {
  const uncommitted = edited.filter((file) => gitOutput('diff', '--quiet', 'HEAD', '--', file) === undefined);
  if (uncommitted.length > 0) fail(`Commit or stash your changes to ${uncommitted.join(', ')}, then run setup again.`);
}

const summary = [];
const notes = [];
const changed = ['.template'];
if (replaceReadme) {
  const readme = readFileSync('.template/README.md', 'utf8');
  writeFileSync('README.md', readme.replaceAll('{{name}}', () => name).replaceAll('{{description}}', () => description));
  summary.push('The README now describes this project.');
  changed.push('README.md');
} else if (existsSync('README.md')) {
  notes.push('Setup kept README.md, because it differs from the template README.');
}
if (removeLicense) {
  rmSync('LICENSE');
  summary.push('The template license is removed.');
  changed.push('LICENSE');
} else if (existsSync('LICENSE')) {
  notes.push('Setup kept LICENSE, because it differs from the template license.');
}
if (renamePackage) {
  packageJson.name = packageName;
  writeFileSync('package.json', `${JSON.stringify(packageJson, null, 2)}\n`);
  changed.push('package.json');
} else {
  notes.push(`Setup kept the package name "${packageJson.name}".`);
}
if (agentsWithoutFirstRun !== agents) {
  writeFileSync('AGENTS.md', agentsWithoutFirstRun);
  summary.push('The first-run section in AGENTS.md is removed.');
  changed.push('AGENTS.md');
}
if (removeSetupStep) {
  // Bash reads setup.sh while it runs this script. A new file leaves the running copy unchanged.
  writeFileSync('scripts/setup.sh.new', setup.replace(setupStep, ''), { mode: statSync('scripts/setup.sh').mode });
  renameSync('scripts/setup.sh.new', 'scripts/setup.sh');
  summary.push('The first-run step in scripts/setup.sh is removed.');
  changed.push('scripts/setup.sh');
} else if (setup) {
  notes.push('scripts/setup.sh does not have its first-run step in the original form, so setup did not change it.');
}
if (removeWorkflow) {
  rmSync(templateWorkflow);
  summary.push(`The template check in ${templateWorkflow} is removed.`);
  changed.push(templateWorkflow);
} else if (existsSync(templateWorkflow)) {
  notes.push(`Setup kept ${templateWorkflow}, because it differs from the template workflow.`);
}
rmSync('.template', { recursive: true, force: true });
summary.push('The template files in .template/ are removed.');
for (const note of notes) console.log(note);

try {
  execFileSync('pnpm', ['principles:check'], { stdio: 'inherit' });
} catch {
  fail('\nThe project files are ready, but the principle check failed. Correct the error above, then commit the changes.');
}

if (!hasCommits) {
  console.log(`\nThe project is ready. Setup did not commit, because this folder ${inGit ? 'has no commits yet' : 'is not a Git repository'}.`);
  process.exit(0);
}

// Git rejects a path that is neither on disk nor tracked, such as a removed file that was never committed.
const paths = changed.filter((file) => existsSync(file) || gitOutput('ls-files', '--error-unmatch', '--', file) !== undefined);
try {
  execFileSync('git', ['add', '--all', '--', ...paths], { stdio: 'inherit' });
  execFileSync('git', [
    'commit',
    '--message', 'Start this project from the PDD base template',
    '--message', summary.join('\n'),
    '--', ...paths,
  ], { stdio: 'inherit' });
} catch {
  fail('\nThe project files are ready, but the commit failed. Correct the error above, then commit the changes.');
}

console.log('\nThe project is ready.');
