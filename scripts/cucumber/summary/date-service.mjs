import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createJiti } from 'jiti';

export class DateService {
  constructor(moduleUrl = import.meta.url) {
    this.moduleUrl = moduleUrl;
  }

  async createFormatter() {
    const moduleFilePath = fileURLToPath(this.moduleUrl);
    const moduleDirectory = path.dirname(moduleFilePath);
    const jiti = createJiti(this.moduleUrl);

    const dateUtilsModule = await jiti.import(
      path.join(moduleDirectory, '../../../support/utils/date-utils.ts')
    );

    const formatDate =
      dateUtilsModule?.formatDate ?? dateUtilsModule?.DateUtils?.formatDate;

    if (typeof formatDate !== 'function') {
      throw new Error(
        'Could not load formatDate from support/utils/date-utils.ts'
      );
    }

    return {
      format: (date) => formatDate(date),
    };
  }
}
