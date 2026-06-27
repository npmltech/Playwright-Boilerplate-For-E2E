import { CliArguments } from './cli-arguments.mjs';
import { ColorService } from './color-service.mjs';
import { DateService } from './date-service.mjs';
import { DEFAULT_OUTPUT } from './constants.mjs';
import { ReportFileDiscovery } from './report-file-discovery.mjs';
import { ReportLoader } from './report-loader.mjs';
import { SummaryAggregator } from './summary-aggregator.mjs';
import { SummaryPrinter } from './summary-printer.mjs';
import { SummaryWriter } from './summary-writer.mjs';

export class SummaryRunner {
  static async create(overrides = {}) {
    const colorService = overrides.colorService ?? new ColorService();
    const dateService = overrides.dateService ?? new DateService();

    const colors = overrides.colors ?? (await colorService.load());
    const dateFormatter =
      overrides.dateFormatter ?? (await dateService.createFormatter());

    return new SummaryRunner({
      ...overrides,
      colors,
      dateFormatter,
    });
  }

  constructor({
    cliArguments = new CliArguments(process.argv),
    colors,
    fileDiscovery = new ReportFileDiscovery(),
    reportLoader = new ReportLoader(),
    dateFormatter,
    summaryWriter = new SummaryWriter(),
  } = {}) {
    if (!colors) {
      throw new Error(
        'SummaryRunner requires colors. Use SummaryRunner.create().'
      );
    }
    if (!dateFormatter || typeof dateFormatter.format !== 'function') {
      throw new Error(
        'SummaryRunner requires a dateFormatter with format(date). Use SummaryRunner.create().'
      );
    }

    this.cliArguments = cliArguments;
    this.colors = colors;
    this.fileDiscovery = fileDiscovery;
    this.reportLoader = reportLoader;
    this.dateFormatter = dateFormatter;
    this.summaryWriter = summaryWriter;
    this.summaryAggregator = new SummaryAggregator({ dateFormatter });
    this.summaryPrinter = new SummaryPrinter({ colors, dateFormatter });
  }

  run() {
    try {
      const inputArg = this.cliArguments.get('--input');
      const outputPath = this.cliArguments.get('--output', DEFAULT_OUTPUT);

      const { reportFiles, warnings } = this.fileDiscovery.discover(inputArg);
      this.summaryPrinter.printWarnings(warnings);

      if (reportFiles.length === 0) {
        console.error(
          this.colors.boldRed('✖  No cucumber-report*.json files found.')
        );
        process.exit(1);
      }

      const { report, executionDate } = this.reportLoader.load(reportFiles);
      const summary = this.summaryAggregator.aggregate({
        report,
        executionDate,
      });

      this.summaryWriter.save(outputPath, summary);
      this.summaryPrinter.print({
        summary,
        reportFiles,
        executionDate,
        outputPath,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unexpected error while building summary.';
      console.error(this.colors.boldRed(`✖  ${message}`));
      process.exit(1);
    }
  }
}
