import { spawn } from 'child_process';
import path from 'path';

import { toPosix } from './import-args-builder.mjs';

export class FeatureRunner {
  constructor({ rootDir, allureResultsDir, reportDirectoryManager }) {
    this.rootDir = rootDir;
    this.allureResultsDir = allureResultsDir;
    this.reportDirectoryManager = reportDirectoryManager;
  }

  run(featurePath, workerId, importArgs) {
    const relativeFeaturePath = path.relative(this.rootDir, featurePath);
    const featureName = path.basename(featurePath, '.feature');
    const jsonReportPath = path.join(
      this.reportDirectoryManager.getWorkerReportsDir(workerId),
      `${featureName}.json`
    );
    const args = [
      'cucumber-js',
      ...importArgs,
      '--format',
      '@cucumber/pretty-formatter',
      '--format',
      'summary',
      '--format',
      `json:${toPosix(jsonReportPath)}`,
      '--format',
      './node_modules/allure-cucumberjs/dist/esm/reporter.js',
      '--format-options',
      JSON.stringify({ resultsDir: toPosix(this.allureResultsDir) }),
      '--backtrace',
      toPosix(relativeFeaturePath),
    ];

    return new Promise((resolve) => {
      const child = spawn('yarn', args, {
        cwd: this.rootDir,
        env: {
          ...process.env,
          CUCUMBER_VERBOSE: '1',
          CUCUMBER_COLOR: '1',
          FORCE_COLOR: '1',
          NODE_OPTIONS: '--import tsx/esm',
        },
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      const prefix = `[worker-${workerId}]`;

      child.stdout?.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines.forEach((line) => {
          if (line.trim()) {
            process.stdout.write(`${prefix} ${line}\n`);
          }
        });
      });

      child.stderr?.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines.forEach((line) => {
          if (line.trim()) {
            process.stderr.write(`${prefix} ${line}\n`);
          }
        });
      });

      child.on('close', (code) => {
        resolve({ code: code ?? 1, featurePath: relativeFeaturePath });
      });
    });
  }
}
