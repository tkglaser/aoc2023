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

  toString() {
    return this.str;
  }
}
