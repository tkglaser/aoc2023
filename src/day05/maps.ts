import { Map } from "./map.js";
import { ParsingOutput } from "./parser.js";

export class Maps {
  constructor(readonly maps: Map[]) {}

  static fromParsedInput(input: ParsingOutput): Maps {
    return new Maps(input.maps.map((m) => new Map(m.from, m.to, m.mappings)));
  }

  map(input: number, from: string, to: string) {
    let currentSource = from;
    let value = input;

    while (currentSource !== to) {
      const map = this.maps.find((m) => m.from === currentSource)!;
      value = map.map(value);
      currentSource = map.to;
    }

    return value;
  }
}
