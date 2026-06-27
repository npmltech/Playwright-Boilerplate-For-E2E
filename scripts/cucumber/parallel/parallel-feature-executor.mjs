import path from 'path';

export class ParallelFeatureExecutor {
  constructor({
    rootDir,
    workers,
    fileDiscovery,
    importArgsBuilder,
    reportDirectoryManager,
    featureRunner,
  }) {
    this.rootDir = rootDir;
    this.workers = workers;
    this.fileDiscovery = fileDiscovery;
    this.importArgsBuilder = importArgsBuilder;
    this.reportDirectoryManager = reportDirectoryManager;
    this.featureRunner = featureRunner;
  }

  async run({ featuresDirs, stepsDirs, supportImports }) {
    const featureFilesArrays = await Promise.all(
      featuresDirs.map((dir) => this.fileDiscovery.listFeatureFiles(dir))
    );
    const featureFiles = featureFilesArrays.flat().sort();

    const stepFilesArrays = await Promise.all(
      stepsDirs.map((dir) => this.fileDiscovery.listStepFiles(dir))
    );
    const stepFiles = stepFilesArrays.flat();

    const importArgs = this.importArgsBuilder.build([
      ...supportImports,
      ...stepFiles,
    ]);

    if (!featureFiles.length) {
      throw new Error('No feature files found in features/.');
    }

    if (!stepFiles.length) {
      console.warn(
        'No step files found in steps/. Running with support imports only.'
      );
    }

    await this.reportDirectoryManager.ensureDirectories(this.workers);

    console.log(
      `Running ${featureFiles.length} features with ${this.workers} worker(s)...`
    );

    const queue = [...featureFiles];
    const failures = [];
    const workerTasks = Array.from({ length: this.workers }, (_, index) => {
      const workerId = index + 1;

      return (async () => {
        while (queue.length) {
          const nextFeature = queue.shift();
          if (!nextFeature) break;

          console.log(
            `[worker-${workerId}] Starting ${path.relative(this.rootDir, nextFeature)}`
          );
          const result = await this.featureRunner.run(
            nextFeature,
            workerId,
            importArgs
          );

          if (result.code !== 0) {
            failures.push(result.featurePath);
            console.error(`[worker-${workerId}] Failed ${result.featurePath}`);
          } else {
            console.log(`[worker-${workerId}] Passed ${result.featurePath}`);
          }
        }
      })();
    });

    await Promise.all(workerTasks);

    return failures;
  }
}
