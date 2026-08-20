import fs from 'node:fs';
import path from 'node:path';
import { DEFAULT_INPUT_DIR } from './constants.mjs';

export class ReportFileDiscovery {
  constructor({ defaultInputDir = DEFAULT_INPUT_DIR } = {}) {
    this.defaultInputDir = defaultInputDir;
  }

  discover(inputArg) {
    if (inputArg) {
      return {
        reportFiles: this.#discoverFromProvidedInput(inputArg),
        warnings: [],
      };
    }

    return this.#discoverFromDefaultDirectory();
  }

  #discoverFromProvidedInput(inputArg) {
    if (!fs.existsSync(inputArg)) {
      throw new Error(`Input not found: ${inputArg}`);
    }

    const stat = fs.statSync(inputArg);
    if (!stat.isDirectory()) {
      return [inputArg];
    }

    const discoveredFiles = this.#walkJsonFiles(inputArg);
    const selectedFiles = this.#selectPreferredReports(discoveredFiles);
    if (selectedFiles.length > 0) {
      return selectedFiles;
    }

    const legacy = path.join(inputArg, 'cucumber-report.json');
    if (fs.existsSync(legacy)) {
      return [legacy];
    }

    return selectedFiles;
  }

  #discoverFromDefaultDirectory() {
    if (!fs.existsSync(this.defaultInputDir)) {
      throw new Error(`Reports directory not found: ${this.defaultInputDir}`);
    }

    const discoveredFiles = this.#walkJsonFiles(this.defaultInputDir);
    const selectedFiles = this.#selectPreferredReports(discoveredFiles);
    if (selectedFiles.length > 0) {
      return { reportFiles: selectedFiles, warnings: [] };
    }

    const legacy = path.join(this.defaultInputDir, 'cucumber-report.json');
    if (fs.existsSync(legacy)) {
      return {
        reportFiles: [legacy],
        warnings: [
          'No locale or worker-specific report files found. Using legacy cucumber-report.json.\n' +
            'This file may contain only one locale. To generate a combined summary, run\n' +
            'yarn test:cucumber:workers:headless:video:all and then run\n' +
            'yarn report:cucumber:summary again.',
        ],
      };
    }

    return { reportFiles: [], warnings: [] };
  }

  #walkJsonFiles(baseDir) {
    const collected = [];

    const walk = (currentDir) => {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          walk(fullPath);
          continue;
        }

        if (entry.isFile() && entry.name.endsWith('.json')) {
          collected.push(fullPath);
        }
      }
    };

    walk(baseDir);
    return collected;
  }

  #selectPreferredReports(reportFiles) {
    const normalized = [...new Set(reportFiles.map((filePath) => path.normalize(filePath)))];

    const localeFiles = normalized.filter((filePath) => {
      const fileName = path.basename(filePath);
      return /^cucumber-report-.+\.json$/u.test(fileName);
    });
    if (localeFiles.length > 0) {
      return localeFiles.sort();
    }

    const workerFiles = normalized.filter((filePath) => {
      const relativePath = filePath.split(path.sep).join('/');
      return /\/worker-\d+\//u.test(relativePath) && filePath.endsWith('.json');
    });
    if (workerFiles.length > 0) {
      return workerFiles.sort();
    }

    return [];
  }
}
