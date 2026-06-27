import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createJiti } from 'jiti';

export class ColorService {
  constructor(moduleUrl = import.meta.url) {
    this.moduleUrl = moduleUrl;
  }

  async load() {
    const moduleFilePath = fileURLToPath(this.moduleUrl);
    const moduleDirectory = path.dirname(moduleFilePath);
    const jiti = createJiti(this.moduleUrl);

    return jiti.import(
      path.join(moduleDirectory, '../../../support/utils/color-utils.ts')
    );
  }
}
