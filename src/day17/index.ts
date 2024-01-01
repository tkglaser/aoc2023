import { MinPriorityQueue } from "@datastructures-js/priority-queue";
import run from "aocrunner";

import { Coord } from "../utils/coord.js";
import { Grid } from "../utils/grid.js";
import { Direction } from "../utils/direction.js";

type CrucibleMap = Grid<number>;

type QueueEntry = {
  node: Coord;
  direction: Direction;
  distance: number;
  steps: number;
};

function dijkstraMinMax(grid: CrucibleMap, min: number, max: number) {
  const start = Coord.from(0, 0);
  const target = Coord.from(grid.lines - 1, grid.chars - 1);

  let curr: QueueEntry;
  const q = new MinPriorityQueue<QueueEntry>((v) => v.distance);
  q.enqueue({ node: start, distance: 0, direction: Direction.right, steps: 0 });
  q.enqueue({ node: start, distance: 0, direction: Direction.down, steps: 0 });

  const seen = new Set<string>();

  do {
    curr = q.dequeue();

    if (!curr) {
      return;
    }

    if (curr.node.eq(target) && curr.steps >= min) {
      return curr.distance;
    }

    const directions: Direction[] = [];

    if (curr.steps >= min) {
      directions.push(curr.direction.turnLeft(), curr.direction.turnRight());
    }

    if (curr.steps < max) {
      directions.push(curr.direction);
    }

    for (const dir of directions) {
      let newPos = curr.node.add(dir);
      const steps = dir.eq(curr.direction) ? curr.steps + 1 : 1;
      if (!grid.isInBounds(newPos)) {
        continue;
      }

      let newVal = curr.distance + grid.tile(newPos)!;

      const id = [newPos.hash, dir.coord.hash, steps].join("#");
      if (seen.has(id)) {
        continue;
      }
      seen.add(id);
      const next = { node: newPos, distance: newVal, direction: dir, steps };
      q.enqueue(next);
    }
  } while (true);
}

const part1 = (rawInput: string) => {
  const grid = Grid.fromText(rawInput, { repeats: false }, (t) => +t);

  return dijkstraMinMax(grid, 1, 3);
};

const part2 = (rawInput: string) => {
  const grid = Grid.fromText(rawInput, { repeats: false }, (t) => +t);

  return dijkstraMinMax(grid, 4, 10);
};

run({
  part1: {
    tests: [
      {
        input: `
2413432311323
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
      {
        input: `
2413432311323
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
        expected: 94,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
