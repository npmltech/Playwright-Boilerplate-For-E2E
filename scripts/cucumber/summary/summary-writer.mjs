import fs from 'node:fs';
import path from 'node:path';

export class SummaryWriter {
  save(outputPath, summary) {
    const outputDirectory = path.dirname(outputPath);
    fs.mkdirSync(outputDirectory, { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2));
  }
}
