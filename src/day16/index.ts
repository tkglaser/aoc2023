import run from "aocrunner";

import { Coord } from "../utils/coord.js";
import { Grid } from "../utils/grid.js";

const enum Mirror {
  Horizontal = "-",
  Vertical = "|",
  BSlash = "\\",
  Slash = "/",
}

type MirrorTiles = Mirror | "." | "#";

type MirrorGrid = Grid<MirrorTiles>;

const enum Direction {
  North = "^",
  South = "v",
  East = ">",
  West = "<",
}

interface Ray {
  start: Coord;
  direction: Direction;
}

const rayId = (r: Ray) => `${r.start.hash}#${r.direction}`;

const dirMap = {
  [Direction.North]: Coord.from(-1, 0),
  [Direction.South]: Coord.from(1, 0),
  [Direction.East]: Coord.from(0, 1),
  [Direction.West]: Coord.from(0, -1),
};

interface Beam extends Ray {
  end: Coord;
}

function traceAll(grid: MirrorGrid, r: Ray): Beam[] {
  const beams: Record<string, Beam> = {};

  const traceAllInternal = (r: Ray) => {
    const traceResult = trace(grid, r);
    beams[rayId(traceResult.beam)] = traceResult.beam;
    for (const child of traceResult.children) {
      if (!beams[rayId(child)]) {
        traceAllInternal(child);
      }
    }
  };

  traceAllInternal(r);
  return Object.values(beams);
}

function trace(grid: MirrorGrid, r: Ray): { beam: Beam; children: Ray[] } {
  let pos = r.start;
  let bounce = false;
  do {
    pos = pos.add(dirMap[r.direction]);
    const tile = grid.tileAt(pos, "#");
    if (tile !== ".") {
      bounce = true;
    }
  } while (!bounce);

  const beam = {
    ...r,
    end: pos,
  };

  const childMap: Record<Direction, Record<Mirror | "#", Direction[]>> = {
    [Direction.North]: {
      [Mirror.Horizontal]: [Direction.East, Direction.West],
      [Mirror.Vertical]: [Direction.North],
      [Mirror.BSlash]: [Direction.West],
      [Mirror.Slash]: [Direction.East],
      ["#"]: [],
    },
    [Direction.South]: {
      [Mirror.Horizontal]: [Direction.East, Direction.West],
      [Mirror.Vertical]: [Direction.South],
      [Mirror.BSlash]: [Direction.East],
      [Mirror.Slash]: [Direction.West],
      ["#"]: [],
    },
    [Direction.East]: {
      [Mirror.Horizontal]: [Direction.East],
      [Mirror.Vertical]: [Direction.North, Direction.South],
      [Mirror.BSlash]: [Direction.South],
      [Mirror.Slash]: [Direction.North],
      ["#"]: [],
    },
    [Direction.West]: {
      [Mirror.Horizontal]: [Direction.West],
      [Mirror.Vertical]: [Direction.North, Direction.South],
      [Mirror.BSlash]: [Direction.North],
      [Mirror.Slash]: [Direction.South],
      ["#"]: [],
    },
  };

  const children = childMap[r.direction][
    grid.tileAt(pos, "#") as Mirror | "#"
  ].map((dir) => ({
    start: pos,
    direction: dir,
  }));

  return { beam, children };
}

function score(grid: MirrorGrid, beams: Beam[]) {
  const fields: Record<string, boolean> = {};

  for (const beam of beams) {
    let pos = beam.start;
    do {
      if (grid.tileAt(pos, "#") !== "#") {
        fields[pos.hash] = true;
      }
      pos = pos.add(dirMap[beam.direction]);
    } while (pos.line !== beam.end.line || pos.char !== beam.end.char);
    if (grid.tileAt(pos, "#") !== "#") {
      fields[pos.hash] = true;
    }
  }

  return Object.keys(fields).length;
}

const part1 = (rawInput: string) => {
  const grid = Grid.fromText<MirrorTiles>(rawInput);

  const beams = traceAll(grid, {
    start: Coord.from(0, -1),
    direction: Direction.East,
  });

  return score(grid, beams);
};

const part2 = (rawInput: string) => {
  const grid = Grid.fromText<MirrorTiles>(rawInput);

  const startRays: Ray[] = [];
  for (let l = 0; l < grid.lines; ++l) {
    startRays.push(
      {
        start: Coord.from(l, -1),
        direction: Direction.East,
      },
      {
        start: Coord.from(l, grid.chars),
        direction: Direction.West,
      },
    );
  }

  for (let c = 0; c < grid.chars; ++c) {
    startRays.push(
      {
        start: Coord.from(-1, c),
        direction: Direction.South,
      },
      {
        start: Coord.from(grid.lines, c),
        direction: Direction.North,
      },
    );
  }

  let maxScore = 0;
  for (const start of startRays) {
    const beams = traceAll(grid, start);
    const s = score(grid, beams);
    maxScore = Math.max(maxScore, s);
  }

  return maxScore;
};

run({
  part1: {
    tests: [
      {
        input: `.|...\\....
|.-.\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`,
        expected: 46,
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
