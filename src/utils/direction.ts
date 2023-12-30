import { Coord } from "./coord.js";

export class Direction {
  constructor(private readonly str: string, readonly coord: Coord) {}

  static get up() {
    return new Direction("^", Coord.from(-1, 0));
  }

  static get down() {
    return new Direction("v", Coord.from(1, 0));
  }

  static get right() {
    return new Direction(">", Coord.from(0, 1));
  }

  static get left() {
    return new Direction("<", Coord.from(0, -1));
  }

  static isUp(a: Coord, b: Coord) {
    return a.line > b.line;
  }

  static isDown(a: Coord, b: Coord) {
    return a.line < b.line;
  }

  static isRight(a: Coord, b: Coord) {
    return a.char < b.char;
  }

  static isLeft(a: Coord, b: Coord) {
    return a.char > b.char;
  }

  static of(a: Coord, b: Coord) {
    if (this.isUp(a, b)) {
      return this.up;
    }
    if (this.isDown(a, b)) {
      return this.down;
    }
    if (this.isLeft(a, b)) {
      return this.left;
    }
    return this.right;
  }

  toString() {
    return this.str;
  }
}
