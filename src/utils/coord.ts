export class Coord {
  private constructor(readonly line: number, readonly char: number) {}

  static from(line: number, char: number) {
    return new Coord(line, char);
  }

  static fromHash(hash: string) {
    const [line, char] = hash.split("#").map(Number);
    return new Coord(line, char);
  }

  add(c: Coord) {
    return new Coord(this.line + c.line, this.char + c.char);
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

  get hash() {
    return `${this.line}#${this.char}`;
  }
}
