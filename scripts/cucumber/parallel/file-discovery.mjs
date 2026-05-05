import { readdir } from 'fs/promises';
import path from 'path';

export class FileDiscovery {
  constructor(rootDir) {
    this.rootDir = rootDir;
  }

  #isDebugEntry(entryName) {
    return /(?:^|[._-])deb?bug(?:[._-]|$)/iu.test(entryName);
  }

  async listFeatureFiles(featuresDir) {
    return this.#listFiles(
      featuresDir,
      (entry) => entry.name.endsWith('.feature'),
      false
    );
  }

  async listStepFiles(stepsDir) {
    return this.#listFiles(
      stepsDir,
      (entry) =>
        /\.step\.ts$/u.test(entry.name) && !this.#isDebugEntry(entry.name),
      true,
      (directoryEntry) => this.#isDebugEntry(directoryEntry.name)
    );
  }

  async #listFiles(dir, matcher, relativeToRoot, shouldSkipDirectory = null) {
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      const files = await Promise.all(
        entries.map(async (entry) => {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory()) {
            if (shouldSkipDirectory?.(entry)) return [];
            return this.#listFiles(
              fullPath,
              matcher,
              relativeToRoot,
              shouldSkipDirectory
            );
          }
          if (!entry.isFile() || !matcher(entry)) return [];

          return [
            relativeToRoot ? path.relative(this.rootDir, fullPath) : fullPath,
          ];
        })
      );

      return files.flat().sort();
    } catch (error) {
      if (error?.code === 'ENOENT') return [];
      throw error;
    }
  }
}
