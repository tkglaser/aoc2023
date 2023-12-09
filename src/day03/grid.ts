export class Grid {
  constructor(
    readonly width: number,
    readonly height: number,
    private readonly map: Record<string, string>
  ) {}

  static fromInput(lines: string[]) {
    const map: Record<string, string> = {};

    lines.forEach((line, y) => {
      line.split("").forEach((char, x) => {
        map[`${y}#${x}`] = char;
      });
    });

    return new Grid(lines[0].length, lines.length, map);
  }

  charAt(y: number, x: number) {
    const char = this.map[`${y}#${x}`];
    return char ?? ".";
  }

  isDigit(y: number, x: number) {
    return !isNaN(Number(this.charAt(y, x)));
  }

  isSymbol(y: number, x: number) {
    const char = this.charAt(y, x);
    return char !== "." && !this.isDigit(y, x);
  }

  isGear(y: number, x: number) {
    return this.charAt(y, x) === "*";
  }
}
