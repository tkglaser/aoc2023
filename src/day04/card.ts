import { InputParsed, parse } from "./parser.js";

export class Card {
  constructor(
    readonly cardId: number,
    readonly rhs: number[],
    readonly lhs: number[],
  ) {}

  static fromInput(input: string) {
    const inputParsed: InputParsed = parse(input);

    return inputParsed.map((ip) => new Card(ip.cardId, ip.rhs, ip.lhs));
  }

  get matches() {
    const rhs = new Set<number>(this.rhs);
    let matches = 0;
    for (const lhsItem of this.lhs) {
      if (rhs.has(lhsItem)) {
        matches++;
      }
    }

    return matches;
  }

  get points() {
    const matches = this.matches;

    if (matches === 0) {
      return 0;
    }
    return 2 ** (matches - 1);
  }
}
