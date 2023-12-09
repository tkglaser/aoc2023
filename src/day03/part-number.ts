import { Grid } from "./grid";

export class PartNumber {
  constructor(
    readonly number: number,
    readonly line: number,
    readonly start: number,
    readonly end: number
  ) {}

  static findAllInGrid(grid: Grid) {
    const results: PartNumber[] = [];
    let inNumber = false;
    let currStart = -1;
    let currNumberString: string[] = [];
    for (let line = 0; line < grid.height; ++line) {
      for (let pos = 0; pos < grid.width; ++pos) {
        if (grid.isDigit(line, pos)) {
          if (!inNumber) {
            inNumber = true;
            currStart = pos;
          }
          currNumberString.push(grid.charAt(line, pos));
        } else {
          if (inNumber) {
            inNumber = false;
            results.push(
              new PartNumber(
                Number(currNumberString.join("")),
                line,
                currStart,
                pos - 1
              )
            );
            currNumberString = [];
          }
        }
      }
      if (inNumber) {
        inNumber = false;
        results.push(
          new PartNumber(
            Number(currNumberString.join("")),
            line,
            currStart,
            grid.width - 1
          )
        );
        currNumberString = [];
      }
    }
    return results;
  }

  isNextToSymbol(grid: Grid) {
    for (const line of [this.line - 1, this.line, this.line + 1]) {
      for (let pos = this.start - 1; pos <= this.end + 1; ++pos) {
        if (grid.isSymbol(line, pos)) {
          return true;
        }
      }
    }
    return false;
  }

  isNextToPoint(line: number, pos: number) {
    if (line < this.line - 1) {
      return false;
    }
    if (line > this.line + 1) {
      return false;
    }
    if (pos < this.start - 1) {
      return false;
    }
    if (pos > this.end + 1) {
      return false;
    }
    return true;
  }
}
