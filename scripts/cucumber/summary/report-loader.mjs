import fs from 'node:fs';

export class ReportLoader {
  load(reportFiles) {
    const executionDate = reportFiles
      .map((filePath) => fs.statSync(filePath).mtime)
      .reduce((latest, mtime) => (mtime > latest ? mtime : latest));

    const report = reportFiles.flatMap((filePath) =>
      JSON.parse(fs.readFileSync(filePath, 'utf8'))
    );

    return { report, executionDate };
  }
}
