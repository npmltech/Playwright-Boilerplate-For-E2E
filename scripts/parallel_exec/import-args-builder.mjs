import path from 'path';

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function isExcludedImport(filePath) {
  return /(^|\/)debug-[^/]+\.cjs$/iu.test(toPosix(filePath));
}

export class ImportArgsBuilder {
  build(importFiles) {
    return importFiles
      .filter((file) => !isExcludedImport(file))
      .flatMap((file) => ['--import', toPosix(file)]);
  }
}

export { isExcludedImport, toPosix };
