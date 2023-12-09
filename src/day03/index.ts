import run from "aocrunner";
import { Grid } from "./grid.js";
import { PartNumber } from "./part-number.js";
import { Gear } from "./gear.js";

const parseInput = (rawInput: string) => rawInput.split("\n");

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const grid = Grid.fromInput(input);
  const numbers = PartNumber.findAllInGrid(grid);
  const sum = numbers.reduce(
    (prev, curr) => prev + (curr.isNextToSymbol(grid) ? curr.number : 0),
    0,
  );
  return sum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const grid = Grid.fromInput(input);
  const numbers = PartNumber.findAllInGrid(grid);

  const gears = Gear.findAllInGrid(grid);
  let gearRatioSum = 0;
  for (const gear of gears) {
    const adjacent = gear.adjacentPartNumbers(numbers);
    if (adjacent.length === 2) {
      gearRatioSum += adjacent[0].number * adjacent[1].number;
    }
  }
  return gearRatioSum;
};

run({
  part1: {
    tests: [
      {
        input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
