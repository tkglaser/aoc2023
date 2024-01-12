import run from "aocrunner";
import ProgressBar from "progress";

import { Grid as UtilGrid } from "../utils/grid.js";
import { Coord } from "../utils/coord.js";
import { Direction } from "../utils/direction.js";

const enum Tile {
  Blank = ".",
  Roller = "O",
  Fixed = "#",
}

type Dish = UtilGrid<Tile>;

function rollCoord (grid: Dish, pos: Coord, dir: Direction) {
  if (grid.tile(pos) !== Tile.Blank) {
    return false;
  }
  if (grid.tile(pos.add(dir)) === Tile.Roller) {
    grid.setTile(pos, Tile.Roller);
    grid.setTile(pos.add(dir), Tile.Blank);
    return true;
  }
  return false;
}

function rollUntilSettled (grid: Dish, dir: Direction) {
  let isSettled = false;
  do {
    isSettled = true;
    for (let l = 0; l < grid.lines; ++l) {
      for (let c = 0; c < grid.chars; ++c) {
        const rolled = rollCoord(grid, Coord.from(l, c), dir);
        if (rolled) {
          isSettled = false;
        }
      }
    }
  } while (!isSettled);
}

function score (grid: Dish) {
  let score = 0;
  for (let l = 0; l < grid.lines; ++l) {
    for (let c = 0; c < grid.chars; ++c) {
      if (grid.tile(Coord.from(l, c)) === Tile.Roller) {
        score += grid.lines - l;
      }
    }
  }
  return score;
}

function cycle (grid: Dish) {
  rollUntilSettled(grid, Direction.up);
  rollUntilSettled(grid, Direction.right);
  rollUntilSettled(grid, Direction.down);
  rollUntilSettled(grid, Direction.left);
}

function spin (grid: Dish, cycles: number) {
  let progress = new ProgressBar(
    "(((BRRRRRRRR))) [:bar] :percent :elapseds ETA :etas ",
    {
      total: cycles,
      width: 30,
    },
  );

  for (let i = 0; i < cycles; ++i) {
    cycle(grid);
    progress.tick();
  }
}

const part1 = (rawInput: string) => {
  const grid = UtilGrid.fromText<Tile>(rawInput, { repeats: false });

  rollUntilSettled(grid, Direction.down);

  return score(grid);
};

const part2 = (rawInput: string) => {
  const grid = UtilGrid.fromText<Tile>(rawInput, { repeats: false });

  let lastScore = 0;
  let scoreNumber = 0;
  do {
    spin(grid, 111);
    lastScore = scoreNumber;
    scoreNumber = score(grid);
    console.log(scoreNumber);
  } while (lastScore !== scoreNumber);

  return scoreNumber;
};

run({
  part1: {
    tests: [
      {
        input: `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`,
        expected: 136,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`,
        expected: 64,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
