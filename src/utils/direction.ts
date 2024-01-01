import { Coord, ICoord } from "./coord.js";

const enum DirectionStr {
  Up = "^",
  Down = "v",
  Right = ">",
  Left = "<",
}

export class Direction implements ICoord {
  constructor(private readonly str: DirectionStr, readonly coord: Coord) {
    Object.freeze(this);
  }

  get line() {
    return this.coord.line;
  }

  get char() {
    return this.coord.char;
  }

  static get up() {
    return new Direction(DirectionStr.Up, Coord.from(-1, 0));
  }

  static get down() {
    return new Direction(DirectionStr.Down, Coord.from(1, 0));
  }

  static get right() {
    return new Direction(DirectionStr.Right, Coord.from(0, 1));
  }

  static get left() {
    return new Direction(DirectionStr.Left, Coord.from(0, -1));
  }

  static get all() {
    return [this.up, this.down, this.left, this.right];
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

  eq(d: Direction) {
    return this.str === d.str;
  }

  turnLeft() {
    return {
      [DirectionStr.Up]: Direction.left,
      [DirectionStr.Left]: Direction.down,
      [DirectionStr.Down]: Direction.right,
      [DirectionStr.Right]: Direction.up,
    }[this.str];
  }

  turnRight() {
    return {
      [DirectionStr.Up]: Direction.right,
      [DirectionStr.Right]: Direction.down,
      [DirectionStr.Down]: Direction.left,
      [DirectionStr.Left]: Direction.up,
    }[this.str];
  }

  toString() {
    return this.str;
  }
}
