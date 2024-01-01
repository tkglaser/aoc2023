export interface ICoord {
  readonly line: number;
  readonly char: number;
}

export class Coord implements ICoord {
  private constructor(readonly line: number, readonly char: number) {
    Object.freeze(this);
  }

  static from(line: number, char: number) {
    return new Coord(line, char);
  }

  static fromHash(hash: string) {
    const [line, char] = hash.split("#").map(Number);
    return new Coord(line, char);
  }

  add(c: ICoord) {
    return new Coord(this.line + c.line, this.char + c.char);
  }

  eq(c: ICoord) {
    return this.line === c.line && this.char === c.char;
  }

  get up() {
    return new Coord(this.line - 1, this.char);
  }

  get down() {
    return new Coord(this.line + 1, this.char);
  }

  get left() {
    return new Coord(this.line, this.char - 1);
  }

  get right() {
    return new Coord(this.line, this.char + 1);
  }

  get not() {
    return new Coord(-this.line, -this.char);
  }

  get hash() {
    return `${this.line}#${this.char}`;
  }
}
