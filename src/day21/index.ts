import run from "aocrunner";
import { Grid } from "../utils/grid.js";
import { Coord } from "../utils/coord.js";

const enum Tile {
  Stone = "#",
  Garden = ".",
  Start = "S",
}

type Garden = Grid<Tile>;

function markEndsOfPathsWithLength(garden: Garden, length: number) {
  const start = garden.find((val) => val === Tile.Start)[0].coord;
  const seen = new Set<string>();
  const traverse = (c: Coord, pathLength: number) => {
    const callId = `${c.hash}#${pathLength}`;
    if (seen.has(callId)) {
      return ``;
    }
    seen.add(callId);
    if (pathLength === length) {
      garden.mark("end", c, true);
      return;
    }
    const neighbours = [c.up, c.down, c.left, c.right];
    for (const n of neighbours) {
      if (garden.tile(n, Tile.Stone) !== Tile.Stone) {
        traverse(n, pathLength + 1);
      }
    }
  };
  traverse(start, 0);
}

function markEndsOfPathsWithLengthWithRepeats(garden: Garden, length: number) {
  const start = garden.find((val) => val === Tile.Start)[0].coord;
  const seen = new Set<string>();
  const traverse = (c: Coord, pathLength: number) => {
    const callId = `${c.hash}#${pathLength}`;
    if (seen.has(callId)) {
      return ``;
    }
    console.log(length);
    seen.add(callId);
    if (pathLength === length) {
      garden.mark("end", c, true);
      return;
    }
    const neighbours = [c.up, c.down, c.left, c.right];
    for (const n of neighbours) {
      if (garden.tile(n, Tile.Stone) !== Tile.Stone) {
        traverse(n, pathLength + 1);
      }
    }
  };
  traverse(start, 0);
}

function markBFS(garden: Garden, length: number) {
  const start = garden.find((val) => val === Tile.Start)[0].coord;
  garden.mark("dist", start, 0);

  let pathLength = 0;
  do {
    ++pathLength;
    if (pathLength % 100 === 0) {
      console.log(pathLength);
    }
    for (const c of garden.getAllMarked("dist", pathLength - 1)) {
      const neighbours = [c.up, c.down, c.left, c.right];
      for (const n of neighbours) {
        if (garden.tile(n, Tile.Stone) !== Tile.Stone) {
          garden.mark("dist", n, pathLength);
        }
      }
    }
  } while (pathLength < length);
}

function countEnds(garden: Garden) {
  return garden.markedCount("end", true);
}

function countDist(garden: Garden, dist: number) {
  return garden.markedCount("dist", dist);
}

const part1 = (rawInput: string) => {
  const garden = Grid.fromText<Tile>(rawInput, { repeats: false });

  const steps = 64;

  markBFS(garden, steps);

  return countDist(garden, steps);

  // markEndsOfPathsWithLength(garden, 64);

  // return countEnds(garden);
};

const part2 = (rawInput: string) => {
  const garden = Grid.fromText<Tile>(rawInput, { repeats: true });

  const steps = 26501365;

  markBFS(garden, steps);

  return countDist(garden, steps);
  // markEndsOfPathsWithLengthWithRepeats(garden, 26501365);

  // return countEnds(garden);
};

run({
  part1: {
    tests: [
      {
        input: `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`,
        expected: 16,
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
  onlyTests: false,
});
