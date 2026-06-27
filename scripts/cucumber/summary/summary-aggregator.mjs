import { DEFAULT_STATUS } from './constants.mjs';

export class SummaryAggregator {
  constructor({ dateFormatter } = {}) {
    this.dateFormatter = dateFormatter;
  }

  aggregate({ report, executionDate }) {
    let features = 0;
    let scenarios = 0;
    let steps = 0;

    const status = { ...DEFAULT_STATUS };
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

    return {
      executionDate: this.dateFormatter.format(executionDate),
      features,
      scenarios,
      steps,
      status,
      failedScenarios: failedScenarioKeys.size,
      failedSteps: failures.length,
      failures,
    };
  }
}
