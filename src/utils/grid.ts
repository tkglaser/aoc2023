import { Coord } from "./coord.js";

export class Grid<T> {
  private readonly markMap: Record<string, Record<string, unknown>> = {};
  public zLine = 0;
  public zChar = 0;

  constructor(
    private readonly idx: Map<string, T>,
    public lines: number,
    public chars: number,
    private readonly repeats: boolean,
    private readonly autoExpand: boolean,
  ) {}

  static fromText<T extends string>(
    input: string,
    opts: { repeats: boolean },
  ): Grid<T>;
  static fromText<T>(
    input: string,
    opts: { repeats: boolean },
    process: (tile: string) => T,
  ): Grid<T>;
  static fromText<T>(
    input: string,
    opts: { repeats?: boolean; autoExpand?: boolean },
    process?: (tile: string) => T,
  ) {
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
    return new Grid<T>(
      idx,
      lines.length,
      lines[0].length,
      opts.repeats ?? false,
      opts.autoExpand ?? false,
    );
  }

  static empty<T>() {
    return new Grid<T>(new Map(), 0, 0, false, true);
  }

  find(pred: (val: T, c: Coord) => boolean) {
    return Array.from(this.idx.entries())
      .map(([c, val]) => ({ coord: Coord.fromHash(c), val }))
      .filter(({ coord, val }) => pred(val, coord));
  }

  mark(label: string, c: Coord, value: unknown) {
    if (!this.markMap[label]) {
      this.markMap[label] = {};
    }
    this.markMap[label][c.hash] = value;
  }

  unMark(label: string, c: Coord) {
    if (!this.markMap[label]) {
      this.markMap[label] = {};
    }
    delete this.markMap[label][c.hash];
  }

  getMark<M>(label: string, c: Coord) {
    return this.markMap[label]?.[c.hash] as M;
  }

  getAllMarked(label: string, value: unknown) {
    return Object.entries(this.markMap[label] ?? {})
      .filter(([, v]) => v === value)
      .map(([key]) => Coord.fromHash(key));
  }

  markedCount(label: string, value: unknown) {
    return Object.values(this.markMap[label] ?? {}).filter((v) => v === value)
      .length;
  }

  clearAllMarks(label: string): void {
    delete this.markMap[label];
  }

  renderLabel(label: string, cellWidth: number): string {
    const result = [];
    for (let line = this.zLine; line < this.lines; ++line) {
      let l: string[] = [];
      for (let char = this.zChar; char < this.chars; ++char) {
        l.push(
          (this.getMark<number>(label, Coord.from(line, char)) ?? 0).toString(),
        );
      }
      result.push(l.map((s) => s.padStart(cellWidth, " ")).join(" "));
    }
    return result.join("\n");
  }

  tile(c: Coord): T | undefined;
  tile(c: Coord, defaultValue: T): T;
  tile(c: Coord, defaultValue?: T) {
    if (this.repeats) {
      const line = c.line % this.lines;
      const char = c.char % this.chars;
      this.idx.get(Coord.from(line, char).hash);
    }
    return this.idx.has(c.hash) ? this.idx.get(c.hash) : defaultValue;
  }

  setTile(c: Coord, value: T) {
    this.idx.set(c.hash, value);
    if (this.autoExpand) {
      if (c.line < this.zLine) {
        this.zLine = c.line;
      }
      if (c.char < this.zChar) {
        this.zChar = c.char;
      }
      if (this.lines < c.line + 1) {
        this.lines = c.line + 1;
      }
      if (this.chars < c.char + 1) {
        this.chars = c.char + 1;
      }
    }
  }

  isInBounds(c: Coord) {
    if (
      c.line < this.zLine ||
      c.char < this.zChar ||
      c.line >= this.lines ||
      c.char >= this.chars
    ) {
      return false;
    }
    return true;
  }

  toString() {
    const result = [];
    for (let line = this.zLine; line < this.lines; ++line) {
      let l = "";
      for (let char = this.zChar; char < this.chars; ++char) {
        l = l + this.tile(Coord.from(line, char), "." as T);
      }
      result.push(l);
    }
    return result.join("\n");
  }
}
