import { IntersectionType, Mapping } from "./mapping.js";
import { Mapping as ParserMapping } from "./parser.js";

export class Map {
  readonly mappings: Mapping[];

  constructor(
    readonly from: string,
    readonly to: string,
    mappings: ParserMapping[]
  ) {
    this.mappings = mappings.map(
      (m) => new Mapping(m.dest, m.source, m.length)
    );
  }

  map(input: number): number {
    for (const mapping of this.mappings) {
      if (mapping.applies(input)) {
        return mapping.map(input);
      }
    }
    return input;
  }

  mapRange(input: number, length: number) {
    let remainingInput = input;
    let remainingLength = length;

    const mapped: { input: number; length: number }[] = [];

    for (const mapping of this.mappings) {
      const type = mapping.testIntersection(remainingInput, remainingLength);
      if (type === IntersectionType.None) {
        continue;
      }
      if (type === IntersectionType.Complete) {
        mapped.push({
          input: mapping.map(remainingInput),
          length: remainingLength,
        });
      }
    }
  }
}
