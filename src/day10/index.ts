import run from "aocrunner";

const parse = (rawInput: string) => rawInput.split("\n");

interface Coord {
  line: number;
  char: number;
}

interface Move extends Coord {
  from: Direction;
}

const enum Direction {
  North = "N",
  South = "S",
  East = "E",
  West = "W",
}

const enum Tile {
  Vertical = "|",
  Horizontal = "-",
  NE = "L",
  NW = "J",
  SW = "7",
  SE = "F",
  Ground = ".",
  Start = "S",
}

const enum Space {
  Path = "X",
  Left = "L",
  Right = "R",
  Unknown = ".",
}

const moveMap: Record<Direction, Partial<Record<Tile, Direction>>> = {
  [Direction.North]: {
    [Tile.Vertical]: Direction.South,
    [Tile.NE]: Direction.East,
    [Tile.NW]: Direction.West,
  },
  [Direction.South]: {
    [Tile.Vertical]: Direction.North,
    [Tile.SW]: Direction.West,
    [Tile.SE]: Direction.East,
  },
  [Direction.East]: {
    [Tile.Horizontal]: Direction.West,
    [Tile.NE]: Direction.North,
    [Tile.SE]: Direction.South,
  },
  [Direction.West]: {
    [Tile.Horizontal]: Direction.East,
    [Tile.NW]: Direction.North,
    [Tile.SW]: Direction.South,
  },
};

const tileAt = (input: string[], coord: Coord): Tile =>
  ((input[coord.line] ?? [])[coord.char] as Tile) ?? Tile.Ground;

const posEq = (a: Coord, b: Coord) => a.line === b.line && a.char === b.char;

const moveTo = (coord: Coord, dir: Direction): Move => {
  if (dir === Direction.North) {
    return { line: coord.line - 1, char: coord.char, from: Direction.South };
  }
  if (dir === Direction.East) {
    return { line: coord.line, char: coord.char + 1, from: Direction.West };
  }
  if (dir === Direction.West) {
    return { line: coord.line, char: coord.char - 1, from: Direction.East };
  }
  if (dir === Direction.South) {
    return { line: coord.line + 1, char: coord.char, from: Direction.North };
  }
  throw new Error("Impossible Move");
};

const move = (input: string[]) => (lastMove: Move) => {
  const tile = tileAt(input, lastMove);
  const direction = moveMap[lastMove.from][tile];
  if (!direction) {
    throw new Error("Don't know ehere to move!");
  }
  return moveTo(lastMove, direction);
};

const topoAt = (topo: string[][]) => (coord: Coord) =>
  (topo[coord.line] ?? [])[coord.char] ?? Space.Unknown;

const setTopo = (topo: string[][], coord: Coord, space: Space) => {
  if (!topo[coord.line]) topo[coord.line] = [];
  const curr = topoAt(topo)(coord);
  if (curr === Space.Path) {
    return topo;
  }
  topo[coord.line][coord.char] = space;
  return topo;
};

const mark = (topo: string[][], move: Move) => {
  let topoChanged = setTopo(topo, move, Space.Path);
  if (move.from === Direction.East) {
    topoChanged = setTopo(
      topoChanged,
      { line: move.line - 1, char: move.char },
      Space.Right,
    );
    topoChanged = setTopo(
      topoChanged,
      { line: move.line + 1, char: move.char },
      Space.Left,
    );
  }
  if (move.from === Direction.West) {
    topoChanged = setTopo(
      topoChanged,
      { line: move.line - 1, char: move.char },
      Space.Left,
    );
    topoChanged = setTopo(
      topoChanged,
      { line: move.line + 1, char: move.char },
      Space.Right,
    );
  }
  if (move.from === Direction.North) {
    topoChanged = setTopo(
      topoChanged,
      { line: move.line, char: move.char + 1 },
      Space.Left,
    );
    topoChanged = setTopo(
      topoChanged,
      { line: move.line, char: move.char - 1 },
      Space.Right,
    );
  }
  if (move.from === Direction.South) {
    topoChanged = setTopo(
      topoChanged,
      { line: move.line, char: move.char + 1 },
      Space.Right,
    );
    topoChanged = setTopo(
      topoChanged,
      { line: move.line, char: move.char - 1 },
      Space.Left,
    );
  }
  return topo;
};

const completeTopo = (topo: string[][], lines: number, chars: number) => {
  for (let line = 0; line < lines; ++line) {
    for (let char = 0; char < chars; ++char) {
      if (!topo[line][char]) {
        topo[line][char] = Space.Unknown;
      }
    }
  }

  let unknowns = 0;

  do {
    unknowns = 0;
    for (let line = 0; line < lines; ++line) {
      for (let char = 0; char < chars; ++char) {
        const pos = { line, char };
        const topoAtCurr = topoAt(topo);
        if (topoAtCurr(pos) === Space.Unknown) {
          ++unknowns;
          const neighbours = [
            topoAtCurr(moveTo(pos, Direction.North)),
            topoAtCurr(moveTo(pos, Direction.South)),
            topoAtCurr(moveTo(pos, Direction.East)),
            topoAtCurr(moveTo(pos, Direction.West)),
          ];
          if (
            neighbours.includes(Space.Left) &&
            neighbours.includes(Space.Right)
          ) {
            throw new Error("Inconsistent space");
          }
          if (neighbours.includes(Space.Left)) {
            topo[line][char] = Space.Left;
          }
          if (neighbours.includes(Space.Right)) {
            topo[line][char] = Space.Right;
          }
        }
      }
    }
  } while (unknowns > 5);

  let L = 0;
  let R = 0;

  const topoAtCurr = topoAt(topo);

  for (let line = 0; line < lines; ++line) {
    for (let char = 0; char < chars; ++char) {
      if (topoAtCurr({ line, char }) === Space.Left) {
        ++L;
      }
      if (topoAtCurr({ line, char }) === Space.Right) {
        ++R;
      }
    }
  }

  return Math.min(L, R); // heuristic
};

function start(input: string[]): Coord {
  for (let line = 0; line < input.length; ++line) {
    for (let char = 0; char < input[line].length; ++char) {
      if (input[line][char] === Tile.Start) {
        return { line, char };
      }
    }
  }

  throw new Error("Start not found");
}

const identifyPossibleMoves = (input: string[]) => (start: Coord) => {
  const moves: Move[] = [];

  // North
  const north = moveTo(start, Direction.North);
  if ([Tile.Vertical, Tile.SE, Tile.SW].includes(tileAt(input, north))) {
    moves.push(north);
  }

  // East
  const east = moveTo(start, Direction.East);
  if ([Tile.Horizontal, Tile.NW, Tile.SW].includes(tileAt(input, east))) {
    moves.push(east);
  }

  // West
  const west = moveTo(start, Direction.West);
  if ([Tile.Horizontal, Tile.NE, Tile.SE].includes(tileAt(input, west))) {
    moves.push(west);
  }

  // South
  const south = moveTo(start, Direction.South);
  if ([Tile.Vertical, Tile.NE, Tile.NW].includes(tileAt(input, south))) {
    moves.push(south);
  }
  return moves;
};

const part1 = (rawInput: string) => {
  const input = parse(rawInput);

  const startCoords = start(input);
  let positions = identifyPossibleMoves(input)(startCoords);

  const moveOnInput = move(input);

  let steps = 0;
  do {
    steps++;
    if (posEq(positions[0], positions[1])) {
      return steps;
    }
    positions = positions.map(moveOnInput);
  } while (steps < 1000000); // endless loop protection
};

const part2 = (rawInput: string) => {
  const input = parse(rawInput);

  const startCoords = start(input);
  const startMove = identifyPossibleMoves(input)(startCoords)[0];
  let pos = startMove;
  let topo: string[][] = setTopo([], startMove, Space.Path);

  const moveOnInput = move(input);

  let steps = 0;
  do {
    steps++;
    if (posEq(pos, startCoords)) {
      return completeTopo(topo, input.length, input[0].length);
    }
    pos = moveOnInput(pos);
    topo = mark(topo, pos);
  } while (steps < 1000000); // endless loop protection

  return;
};

run({
  part1: {
    tests: [
      {
        input: `.....
.S-7.
.|.|.
.L-J.
.....`,
        expected: 4,
      },
      {
        input: `7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`,
        expected: 4,
      },
      {
        input: `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`,
        expected: 8,
      },
      {
        input: `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`,
        expected: 10,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
