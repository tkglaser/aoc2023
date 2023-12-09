import { Grid } from "./grid";
import { PartNumber } from "./part-number";

export class Gear {
  constructor(readonly line: number, readonly pos: number) {}

  static findAllInGrid(grid: Grid) {
    const results: Gear[] = [];
    for (let line = 0; line < grid.height; ++line) {
      for (let pos = 0; pos < grid.width; ++pos) {
        if (grid.isGear(line, pos)) {
          results.push(new Gear(line, pos));
        }
      }
    }
    return results;
  }

  adjacentPartNumbers(partNumbers: PartNumber[]) {
    const adjacentNumbers: PartNumber[] = [];
    for (const partNumber of partNumbers) {
      if (partNumber.isNextToPoint(this.line, this.pos)) {
        adjacentNumbers.push(partNumber);
      }
    }
    return adjacentNumbers;
  }
}
