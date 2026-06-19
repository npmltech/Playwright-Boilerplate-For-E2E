#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ── ANSI helpers ──────────────────────────────────────────────────────────────
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
  bgGreen: '\x1b[42m',
  bgRed: '\x1b[41m',
};

const isTTY = process.stdout.isTTY;
const paint = (code, text) => (isTTY ? `${code}${text}${c.reset}` : text);
const bold = (t) => paint(c.bold, t);
const dim = (t) => paint(c.dim, t);
const green = (t) => paint(c.green, t);
const red = (t) => paint(c.red, t);
const yellow = (t) => paint(c.yellow, t);
const cyan = (t) => paint(c.cyan, t);
const blue = (t) => paint(c.blue, t);
const magenta = (t) => paint(c.magenta, t);
const boldGreen = (t) => paint(c.bold + c.green, t);
const boldRed = (t) => paint(c.bold + c.red, t);
const boldCyan = (t) => paint(c.bold + c.cyan, t);
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_INPUT_DIR = 'cucumber-reports';
const DEFAULT_OUTPUT = '.tmp/cucumber-report-summary.json';

function getArg(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

function ensureDirFor(filePath) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

const inputArg = getArg('--input');
const outputPath = getArg('--output') || DEFAULT_OUTPUT;

// Resolve input: single file or directory (merge all cucumber-report-*.json inside it)
let reportFiles = [];
if (inputArg) {
  if (!fs.existsSync(inputArg)) {
    console.error(`Input not found: ${inputArg}`);
    process.exit(1);
  }
  const stat = fs.statSync(inputArg);
  if (stat.isDirectory()) {
    reportFiles = fs
      .readdirSync(inputArg)
      .filter((f) => f.startsWith('cucumber-report-') && f.endsWith('.json'))
      .map((f) => path.join(inputArg, f));
  } else {
    reportFiles = [inputArg];
  }
} else {
  const dir = DEFAULT_INPUT_DIR;
  if (!fs.existsSync(dir)) {
    console.error(boldRed(`✖  Reports directory not found: ${dir}`));
    process.exit(1);
  }

  // Prefer locale-specific files (generated after runner fix).
  // Fall back to the legacy cucumber-report.json if none exist yet.
  const localeFiles = fs
    .readdirSync(dir)
    .filter((f) => /^cucumber-report-.+\.json$/.test(f))
    .map((f) => path.join(dir, f));

  if (localeFiles.length > 0) {
    reportFiles = localeFiles;
  } else {
    const legacy = path.join(dir, 'cucumber-report.json');
    if (fs.existsSync(legacy)) {
      reportFiles = [legacy];
      process.stderr.write(
        yellow(
          '⚠  No locale-specific report files found. Using legacy cucumber-report.json.\n' +
            '   This file may contain only one locale. Re-run the test suite to generate\n' +
            '   cucumber-report-<locale>.json files and get the full combined summary.\n\n'
        )
      );
    }
  }
}

if (reportFiles.length === 0) {
  console.error(boldRed('✖  No cucumber-report*.json files found.'));
  process.exit(1);
}

// Derive execution timestamp from the most recently modified report file
const executionDate = reportFiles
  .map((f) => fs.statSync(f).mtime)
  .reduce((latest, mtime) => (mtime > latest ? mtime : latest));

function formatDate(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}` +
    ` ${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

const report = reportFiles.flatMap((f) => JSON.parse(fs.readFileSync(f, 'utf8')));

let features = 0;
let scenarios = 0;
let steps = 0;

const status = {
  passed: 0,
  failed: 0,
  skipped: 0,
  pending: 0,
  undefined: 0,
  other: 0,
};

const failures = [];

for (const feature of report) {
  features += 1;

  for (const scenario of feature.elements || []) {
    scenarios += 1;

    for (const step of scenario.steps || []) {
      steps += 1;

      const stepStatus = step.result?.status || 'other';
      if (Object.prototype.hasOwnProperty.call(status, stepStatus)) {
        status[stepStatus] += 1;
      } else {
        status.other += 1;
      }

      if (stepStatus === 'failed') {
        failures.push({
          feature: feature.name || feature.uri || '(feature sem nome)',
          scenario: scenario.name || '(cenario sem nome)',
          step: step.name || '(step sem nome)',
          error: step.result?.error_message || '(sem erro detalhado)',
        });
      }
    }
  }
}

const failedScenarioKeys = new Set(
  failures.map((item) => `${item.feature} :: ${item.scenario}`)
);

const summary = {
  executionDate: formatDate(executionDate),
  features,
  scenarios,
  steps,
  status,
  failedScenarios: failedScenarioKeys.size,
  failedSteps: failures.length,
  failures,
};

ensureDirFor(outputPath);
fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2));

// ── Formatted output ──────────────────────────────────────────────────────────
const LINE = dim('─'.repeat(52));
const allPassed = summary.failedSteps === 0;
const badge = allPassed
  ? paint(c.bold + c.bgGreen + c.white, ' PASSED ')
  : paint(c.bold + c.bgRed + c.white, ' FAILED ');

console.log('');
console.log(`  ${bold('Cucumber Report Summary')}  ${badge}`);
  console.log(`  ${dim('Test Run:')} ${cyan(formatDate(executionDate))}`);
console.log(`  ${LINE}`);

// Source files
for (const f of reportFiles) {
  console.log(`  ${dim('↪')} ${dim(f)}`);
}
console.log(`  ${LINE}`);

// Counters
console.log(`  ${blue('◈')} ${bold('Features  ')}  ${boldCyan(String(features).padStart(4))}`);
console.log(`  ${blue('◈')} ${bold('Scenarios ')}  ${boldCyan(String(scenarios).padStart(4))}`);
console.log(`  ${blue('◈')} ${bold('Steps     ')}  ${boldCyan(String(steps).padStart(4))}`);
console.log(`  ${LINE}`);

// Step status breakdown
const statusIcon = { passed: '✔', failed: '✖', skipped: '⊘', pending: '◌', undefined: '?', other: '~' };
const statusColor = {
  passed: green,
  failed: red,
  skipped: yellow,
  pending: yellow,
  undefined: magenta,
  other: dim,
};
for (const [key, count] of Object.entries(status)) {
  if (count === 0 && key !== 'passed' && key !== 'failed') continue;
  const icon = statusIcon[key] || '·';
  const colorFn = statusColor[key] || dim;
  const label = key.charAt(0).toUpperCase() + key.slice(1);
  console.log(`  ${colorFn(icon)} ${colorFn(label.padEnd(10))}  ${colorFn(String(count).padStart(4))}`);
}
console.log(`  ${LINE}`);

// Failures detail
if (failures.length > 0) {
  console.log(`  ${boldRed('✖ Failures')}`);
  console.log('');
  const seenScenarios = new Set();
  for (const fail of failures) {
    const key = `${fail.feature} :: ${fail.scenario}`;
    if (!seenScenarios.has(key)) {
      seenScenarios.add(key);
      console.log(`  ${red('Feature:')}  ${bold(fail.feature)}`);
      console.log(`  ${red('Scenario:')} ${bold(fail.scenario)}`);
    }
    console.log(`  ${red('  ✖')} ${fail.step}`);
    const errorLines = fail.error.split('\n').slice(0, 5);
    for (const line of errorLines) {
      console.log(`     ${dim(line)}`);
    }
    console.log('');
  }
} else {
  console.log(`  ${boldGreen('✔ All scenarios passed!')}`);
}

console.log(`  ${LINE}`);
console.log(`  ${dim('Summary saved →')} ${dim(outputPath)}`);
console.log('');
