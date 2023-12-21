import run from "aocrunner";

import { Instruction, ParsingOutput, parse } from "./parser.js";
import { Grid } from "../utils/grid.js";
import { Coord } from "../utils/coord.js";
import { Direction } from "../utils/direction.js";

const enum Tile {
  Trench = "#",
  Terrain = ".",
}

const dirMap = {
  U: Direction.up,
  D: Direction.down,
  L: Direction.left,
  R: Direction.right,
};
type Patch = Grid<Tile>;

function convertInstruction(instruction: Instruction): Instruction {
  const length = instruction.colour.slice(0, 5);
  const direction = instruction.colour[5] as "0" | "1" | "2" | "3";
  const hexMap = {
    "0": "R",
    "1": "D",
    "2": "L",
    "3": "U",
  };

  const count = Number.parseInt("0x" + length);
  const dir = hexMap[direction] as "R" | "D" | "L" | "U";
  return {
    dir,
    count,
    colour: instruction.colour,
  };
}

function turtle(instructions: ParsingOutput, grid: Patch) {
  let pos = Coord.from(0, 0);
  for (const instruction of instructions) {
    const dir = dirMap[instruction.dir];
    for (let i = 0; i < instruction.count; ++i) {
      grid.setTile(pos, Tile.Trench);
      pos = pos.add(dir.coord);
    }
  }
}

function fill(grid: Patch) {
  grid.mark("fill", Coord.from(0, 10), true);

  let done = false;

  do {
    done = true;
    for (const n of grid.getAllMarked("fill", true)) {
      for (const nb of [n.up, n.down, n.left, n.right]) {
        if (grid.tile(nb) !== Tile.Trench) {
          if (!grid.getMark("fill", nb) && !grid.getMark("processed", nb)) {
            grid.mark("fill", nb, true);
            done = false;
          }
        }
      }
      grid.unMark("fill", n);
      grid.mark("processed", n, true);
    }
  } while (!done);

  for (const c of grid.getAllMarked("processed", true)) {
    grid.setTile(c, Tile.Trench);
  }
}

function score(grid: Patch) {
  return grid.find((val) => val === Tile.Trench).length;
}

const part1 = (rawInput: string) => {
  const input = parse(rawInput);
  const grid = Grid.empty<Tile>();
  turtle(input, grid);
  fill(grid);
  return score(grid);
};

const part2 = (rawInput: string) => {
  const input = parse(rawInput).map(convertInstruction);
  const grid = Grid.empty<Tile>();
  turtle(input, grid);
  // fill(grid);
  // return score(grid);
};

run({
  part1: {
    tests: [
      //       {
      //         input: `R 6 (#70c710)
      // D 5 (#0dc571)
      // L 2 (#5713f0)
      // D 2 (#d2c081)
      // R 2 (#59c680)
      // D 2 (#411b91)
      // L 5 (#8ceee2)
      // U 2 (#caa173)
      // L 1 (#1b58a2)
      // U 2 (#caa171)
      // R 2 (#7807d2)
      // U 3 (#a77fa3)
      // L 2 (#015232)
      // U 2 (#7a21e3)`,
      //         expected: 62,
      //       },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`,
        expected: 62,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
