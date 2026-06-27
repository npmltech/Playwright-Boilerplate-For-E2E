const DEFAULT_LINE_LENGTH = 52;

export class SummaryPrinter {
  constructor({ colors, dateFormatter, statusRenderers = {} } = {}) {
    if (!dateFormatter || typeof dateFormatter.format !== 'function') {
      throw new Error(
        'SummaryPrinter requires a dateFormatter with format(date).'
      );
    }

    this.colors = colors;
    this.dateFormatter = dateFormatter;
    this.statusRenderers = {
      passed: { icon: '✔', color: this.colors.green },
      failed: { icon: '✖', color: this.colors.red },
      skipped: { icon: '⊘', color: this.colors.yellow },
      pending: { icon: '◌', color: this.colors.yellow },
      undefined: { icon: '?', color: this.colors.magenta },
      other: { icon: '~', color: this.colors.dim },
      ...statusRenderers,
    };
  }

  print({ summary, reportFiles, executionDate, outputPath }) {
    const line = this.colors.dim('─'.repeat(DEFAULT_LINE_LENGTH));
    const allPassed = summary.failedSteps === 0;
    const badge = allPassed
      ? this.colors.withStyles(' PASSED ', 'bold', 'bgGreen', 'white')
      : this.colors.withStyles(' FAILED ', 'bold', 'bgRed', 'white');

    console.log('');
    console.log(`  ${this.colors.bold('Cucumber Report Summary')}  ${badge}`);
    console.log(
      `  ${this.colors.dim('Test Run:')} ${this.colors.cyan(this.dateFormatter.format(executionDate))}`
    );
    console.log(`  ${line}`);

    for (const filePath of reportFiles) {
      console.log(`  ${this.colors.dim('↪')} ${this.colors.dim(filePath)}`);
    }
    console.log(`  ${line}`);

    console.log(
      `  ${this.colors.blue('◈')} ${this.colors.bold('Features  ')}  ${this.colors.boldCyan(String(summary.features).padStart(4))}`
    );
    console.log(
      `  ${this.colors.blue('◈')} ${this.colors.bold('Scenarios ')}  ${this.colors.boldCyan(String(summary.scenarios).padStart(4))}`
    );
    console.log(
      `  ${this.colors.blue('◈')} ${this.colors.bold('Steps     ')}  ${this.colors.boldCyan(String(summary.steps).padStart(4))}`
    );
    console.log(`  ${line}`);

    for (const [key, count] of Object.entries(summary.status)) {
      if (count === 0 && key !== 'passed' && key !== 'failed') continue;

      const renderer = this.statusRenderers[key] || {
        icon: '·',
        color: this.colors.dim,
      };
      const label = key.charAt(0).toUpperCase() + key.slice(1);

      console.log(
        `  ${renderer.color(renderer.icon)} ${renderer.color(label.padEnd(10))}  ${renderer.color(String(count).padStart(4))}`
      );
    }
    console.log(`  ${line}`);

    if (summary.failures.length > 0) {
      console.log(`  ${this.colors.boldRed('✖ Failures')}`);
      console.log('');

      const seenScenarios = new Set();
      for (const failure of summary.failures) {
        const scenarioKey = `${failure.feature} :: ${failure.scenario}`;
        if (!seenScenarios.has(scenarioKey)) {
          seenScenarios.add(scenarioKey);
          console.log(
            `  ${this.colors.red('Feature:')}  ${this.colors.bold(failure.feature)}`
          );
          console.log(
            `  ${this.colors.red('Scenario:')} ${this.colors.bold(failure.scenario)}`
          );
        }

        console.log(`  ${this.colors.red('  ✖')} ${failure.step}`);
        const errorLines = failure.error.split('\n').slice(0, 5);
        for (const lineText of errorLines) {
          console.log(`     ${this.colors.dim(lineText)}`);
        }
        console.log('');
      }
    } else {
      console.log(`  ${this.colors.boldGreen('✔ All scenarios passed!')}`);
    }

    console.log(`  ${line}`);
    console.log(
      `  ${this.colors.dim('Summary saved →')} ${this.colors.dim(outputPath)}`
    );
    console.log('');
  }

  printWarnings(warnings) {
    for (const warning of warnings) {
      process.stderr.write(
        this.colors.yellow(`⚠  ${warning.replace(/\n/gu, '\n   ')}\n\n`)
      );
    }
  }
}
