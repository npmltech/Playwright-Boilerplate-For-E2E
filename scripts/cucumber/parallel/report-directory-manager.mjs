import { mkdir } from 'fs/promises';
import path from 'path';

export class ReportDirectoryManager {
  constructor({ reportsBaseDir, allureResultsDir }) {
    this.reportsBaseDir = reportsBaseDir;
    this.allureResultsDir = allureResultsDir;
  }

  async ensureDirectories(workerCount) {
    await mkdir(this.allureResultsDir, { recursive: true });
    await Promise.all(
      Array.from({ length: workerCount }, (_, index) =>
        mkdir(this.getWorkerReportsDir(index + 1), { recursive: true })
      )
    );
  }

  getWorkerReportsDir(workerId) {
    return path.join(this.reportsBaseDir, `worker-${workerId}`);
  }
}