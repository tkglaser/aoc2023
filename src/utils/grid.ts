import { Coord } from "./coord.js";

export class Grid<T> {
  private readonly markMap: Record<string, Record<string, unknown>> = {};

  constructor(
    private readonly idx: Map<string, T>,
    readonly lines: number,
    readonly chars: number,
  ) {}

  static fromText<T extends string>(input: string): Grid<T>;
  static fromText<T>(input: string, process: (tile: string) => T): Grid<T>;
  static fromText<T>(input: string, process?: (tile: string) => T) {
    const lines = input.split("\n");
    const idx = new Map<string, T>();
    for (let l = 0; l < lines.length; ++l) {
      for (let c = 0; c < lines[0].length; ++c) {
        idx.set(
          Coord.from(l, c).hash,
          process ? process(lines[l][c]) : (lines[l][c] as T),
        );
      }
    }
    return new Grid<T>(idx, lines.length, lines[0].length);
  }

  mark(label: string, c: Coord, value: unknown) {
    if (!this.markMap[label]) {
      this.markMap[label] = {};
    }
    this.markMap[label][c.hash] = value;
  }

  getMark<M>(label: string, c: Coord) {
    return this.markMap[label]?.[c.hash] as M;
  }

  tileAt(c: Coord): T | undefined;
  tileAt(c: Coord, defaultValue: T): T;
  tileAt(c: Coord, defaultValue?: T) {
    return this.idx.has(c.hash) ? this.idx.get(c.hash) : defaultValue;
  }

  isInBounds(c: Coord) {
    if (
      c.line < 0 ||
      c.char < 0 ||
      c.line >= this.lines ||
      c.char >= this.chars
    ) {
      return false;
    }
    return true;
  }
}
