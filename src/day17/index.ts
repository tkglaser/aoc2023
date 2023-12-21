import run from "aocrunner";

import { Grid } from "../utils/grid.js";

const part1 = (rawInput: string) => {
  const input = Grid.fromText(rawInput, { repeats: false }, (t) => +t);

  return;
};

const part2 = (rawInput: string) => {
  const input = Grid.fromText(rawInput, { repeats: false }, (t) => +t);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`,
        expected: 102,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
