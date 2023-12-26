import run from "aocrunner";

import { Grid } from "../utils/grid.js";
import { algorithms } from "../utils/algorithms/index.js";
import { VisitResult } from "../utils/algorithms/visit-result.js";
import { Coord } from "../utils/coord.js";

const enum Tile {
  Path = ".",
  Forest = "#",
  Up = "^",
  Down = "v",
  Left = "<",
  Right = ">",
}

type Path = { c: Coord; visited: string[] };

const part1 = (rawInput: string) => {
  const grid = Grid.fromText<Tile>(rawInput, { repeats: false });

  const { coord: start } = grid.find(
    (val, c) => val === Tile.Path && c.line === 0,
  )[0];

  const { coord: end } = grid.find(
    (val, c) => val === Tile.Path && c.line === grid.lines - 1,
  )[0];

  let maxLength = 0;

  algorithms.dfs<Path>(
    { c: start, visited: [] },
    ({ c, visited }) => {
      if (visited.includes(c.hash)) {
        return [];
      }
      const n: Path[] = [];
      const newVisit = [...visited, c.hash];
      if ([Tile.Path, Tile.Up].includes(grid.tile(c.up, Tile.Forest))) {
        n.push({ c: c.up, visited: newVisit });
      }
      if ([Tile.Path, Tile.Down].includes(grid.tile(c.down, Tile.Forest))) {
        n.push({ c: c.down, visited: newVisit });
      }
      if ([Tile.Path, Tile.Right].includes(grid.tile(c.right, Tile.Forest))) {
        n.push({ c: c.right, visited: newVisit });
      }
      if ([Tile.Path, Tile.Left].includes(grid.tile(c.left, Tile.Forest))) {
        n.push({ c: c.left, visited: newVisit });
      }
      return n;
    },
    ({ visited }) => {
      if (visited[visited.length - 1] === end.hash) {
        maxLength = Math.max(maxLength, visited.length - 1);
      }
      return VisitResult.Continue;
    },
  );

  return maxLength;
};

const part2 = (rawInput: string) => {
  const grid = Grid.fromText<Tile>(rawInput, { repeats: false });

  const { coord: start } = grid.find(
    (val, c) => val === Tile.Path && c.line === 0,
  )[0];

  const { coord: end } = grid.find(
    (val, c) => val === Tile.Path && c.line === grid.lines - 1,
  )[0];

  let maxLength = 0;

  algorithms.dfs<Path>(
    { c: start, visited: [] },
    ({ c, visited }) => {
      if (visited.includes(c.hash)) {
        return [];
      }
      const n: Path[] = [];
      const newVisit = [...visited, c.hash];
      const allowedTiles = [
        Tile.Path,
        Tile.Up,
        Tile.Down,
        Tile.Left,
        Tile.Right,
      ];
      if (allowedTiles.includes(grid.tile(c.up, Tile.Forest))) {
        n.push({ c: c.up, visited: newVisit });
      }
      if (allowedTiles.includes(grid.tile(c.down, Tile.Forest))) {
        n.push({ c: c.down, visited: newVisit });
      }
      if (allowedTiles.includes(grid.tile(c.right, Tile.Forest))) {
        n.push({ c: c.right, visited: newVisit });
      }
      if (allowedTiles.includes(grid.tile(c.left, Tile.Forest))) {
        n.push({ c: c.left, visited: newVisit });
      }
      return n;
    },
    ({ visited }) => {
      if (visited[visited.length - 1] === end.hash) {
        maxLength = Math.max(maxLength, visited.length - 1);
        console.log(maxLength);
      }
      return VisitResult.Continue;
    },
  );

  return maxLength;
};

run({
  part1: {
    tests: [
      {
        input: `#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#`,
        expected: 94,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#`,
        expected: 154,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
