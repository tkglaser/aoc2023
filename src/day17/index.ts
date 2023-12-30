import run from "aocrunner";

import { algorithms } from "../utils/algorithms/index.js";
import { Coord } from "../utils/coord.js";
import { Edge } from "../utils/graph/edge.js";
import { GraphAdapter } from "../utils/graph/graph-adapter.js";
import { Grid } from "../utils/grid.js";
import { IGraph } from "../utils/graph/igraph.js";
import { Direction } from "../utils/direction.js";

type CrucibleMap = Grid<number>;

const tracePath = (graph: IGraph, target: string) => {
  const path: string[] = [];
  let curr: string | undefined = target;

  do {
    path.unshift(curr);
    curr = graph.getMark<string>("origin", curr);
    if (!curr) {
      return path;
    }
  } while (true);
};

function pathDirections(path: string[]) {
  const dirs: Direction[] = [];
  for (let i = 1; i < path.length; ++i) {
    dirs.push(
      Direction.of(Coord.fromHash(path[i - 1]), Coord.fromHash(path[i])),
    );
  }
  return dirs;
}

function countDirections(dirs: Direction[]) {
  let up = 0;
  let down = 0;
  let left = 0;
  let right = 0;
  for (const dir of dirs) {
    if (dir.toString() === "^") {
      ++up;
    }
    if (dir.toString() === "v") {
      ++down;
    }
    if (dir.toString() === ">") {
      ++right;
    }
    if (dir.toString() === "<") {
      ++left;
    }
  }
  return { up, down, left, right };
}

const pathCost = (grid: CrucibleMap, path: string[]) =>
  path.map(Coord.fromHash).reduce((prev, curr) => prev + grid.tile(curr)!, 0);

const part1 = (rawInput: string) => {
  const grid = Grid.fromText(rawInput, { repeats: false }, (t) => +t);

  const graph = new GraphAdapter((from) => {
    const curr = Coord.fromHash(from);

    const maxDir = 3;

    let pathSoFar = tracePath(graph, from);
    const directions = countDirections(
      pathDirections(pathSoFar.slice(pathSoFar.length - (maxDir + 1))),
    );

    const edgesToInvestigate: Edge[] = [
      directions.up < maxDir ? curr.up : undefined,
      directions.down < maxDir ? curr.down : undefined,
      directions.left < maxDir ? curr.left : undefined,
      directions.right < maxDir ? curr.right : undefined,
    ]
      .filter((c) => !!c)
      .filter((c) => grid.isInBounds(c!))
      .map((to) => ({
        from,
        value: grid.tile(to!)!,
        to: to!.hash,
      }));

    return edgesToInvestigate;
  });

  const path = algorithms.dijkstra(
    graph,
    Coord.from(0, 0).hash,
    Coord.from(grid.lines - 1, grid.chars - 1).hash,
  )!;

  console.log(
    pathDirections(path)
      .map((d) => d.toString())
      .join(""),
  );

  console.log(path.join("=>"))

  return pathCost(grid, path);
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
