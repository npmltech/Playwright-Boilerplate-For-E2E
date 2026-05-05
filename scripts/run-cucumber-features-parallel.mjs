#!/usr/bin/env node

import path from 'path';

import { FeatureRunner } from './parallel_exec/feature-runner.mjs';
import { FileDiscovery } from './parallel_exec/file-discovery.mjs';
import { ImportArgsBuilder } from './parallel_exec/import-args-builder.mjs';
import { ParallelFeatureExecutor } from './parallel_exec/parallel-feature-executor.mjs';
import { ReportDirectoryManager } from './parallel_exec/report-directory-manager.mjs';

const rootDir = process.cwd();
const featureLocale = process.env.FEATURE_LOCALE ?? 'pt-br';
const featuresDir = path.join(rootDir, 'features', featureLocale);
const stepsDir = path.join(rootDir, 'steps');
const reportsBaseDir = path.join(
  rootDir,
  'cucumber-reports',
  'parallel',
  'features'
);
const allureResultsDir = path.join(rootDir, 'allure-results');

const workers = Number(process.env.CUCUMBER_FEATURE_WORKERS ?? 4);

console.log(
  'Environment variable CUCUMBER_FEATURE_WORKERS:',
  process.env.CUCUMBER_FEATURE_WORKERS
);
console.log('Workers configured:', workers);
console.log('Feature locale:', featureLocale);

if (!Number.isInteger(workers) || workers < 1) {
  console.error('CUCUMBER_FEATURE_WORKERS must be an integer >= 1');
  process.exit(1);
}

async function run() {
  const fileDiscovery = new FileDiscovery(rootDir);
  const importArgsBuilder = new ImportArgsBuilder();
  const reportDirectoryManager = new ReportDirectoryManager({
    reportsBaseDir,
    allureResultsDir,
  });
  const featureRunner = new FeatureRunner({
    rootDir,
    allureResultsDir,
    reportDirectoryManager,
  });
  const parallelFeatureExecutor = new ParallelFeatureExecutor({
    rootDir,
    workers,
    fileDiscovery,
    importArgsBuilder,
    reportDirectoryManager,
    featureRunner,
  });

  const failures = await parallelFeatureExecutor.run({
    featuresDir,
    stepsDir,
    supportImports: ['support/world.ts', 'support/hooks.ts'],
  });

  if (failures.length) {
    console.error('\nParallel feature run completed with failures:');
    failures.forEach((feature) => console.error(`- ${feature}`));
    process.exit(1);
  }

  console.log('\nParallel feature run completed successfully.');
}

run().catch((error) => {
  console.error('Unexpected error during parallel feature execution:', error);
  process.exit(1);
});
