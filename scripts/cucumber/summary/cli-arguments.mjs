export class CliArguments {
  constructor(argv = process.argv) {
    this.argv = argv;
  }

  get(flag, fallback = undefined) {
    const index = this.argv.indexOf(flag);
    if (index === -1) return fallback;

    const nextValue = this.argv[index + 1];
    return nextValue ?? fallback;
  }
}
