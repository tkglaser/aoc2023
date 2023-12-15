import run from "aocrunner";
import ProgressBar from "progress";

const enum Tile {
  Blank = ".",
  Roller = "O",
  Fixed = "#",
}

class Grid {
  constructor(
    private readonly tiles: Record<string, Tile>,
    private readonly lines: number,
    private readonly chars: number,
  ) {}

  static coordHash(line: number, char: number) {
    return `${line}#${char}`;
  }

  static fromInput(input: string) {
    const tiles: Record<string, Tile> = {};
    const lines = input.split("\n");
    for (let l = 0; l < lines.length; ++l) {
      for (let c = 0; c < lines[0].length; ++c) {
        const char = lines[l][c];
        tiles[this.coordHash(l, c)] = char as Tile;
      }
    }
    return new Grid(tiles, lines.length, lines[0].length);
  }

  tileAt(line: number, char: number) {
    return this.tiles[Grid.coordHash(line, char)] ?? Tile.Fixed;
  }

  setTile(line: number, char: number, tile: Tile) {
    this.tiles[Grid.coordHash(line, char)] = tile;
  }

  rollCoord(line: number, char: number, dir: { line: number; char: number }) {
    if (this.tileAt(line, char) !== Tile.Blank) {
      return false;
    }
    if (this.tileAt(line + dir.line, char + dir.char) === Tile.Roller) {
      this.setTile(line, char, Tile.Roller);
      this.setTile(line + dir.line, char + dir.char, Tile.Blank);
      return true;
    }
    return false;
  }

  rollUntilSettled(dir: { line: number; char: number }) {
    let isSettled = false;
    do {
      isSettled = true;
      for (let l = 0; l < this.lines; ++l) {
        for (let c = 0; c < this.chars; ++c) {
          const rolled = this.rollCoord(l, c, dir);
          if (rolled) {
            isSettled = false;
          }
        }
      }
    } while (!isSettled);
  }

  cycle() {
    const directions = {
      north: { line: 1, char: 0 },
      west: { line: 0, char: -1 },
      south: { line: -1, char: 0 },
      east: { line: 0, char: 1 },
    };
    this.rollUntilSettled(directions.north);
    this.rollUntilSettled(directions.west);
    this.rollUntilSettled(directions.south);
    this.rollUntilSettled(directions.east);
  }

  spin(cycles: number) {
    let progress = new ProgressBar(
      "(((BRRRRRRRR))) [:bar] :percent :elapseds ETA :etas ",
      {
        total: cycles,
        width: 30,
      },
    );

    for (let i = 0; i < cycles; ++i) {
      this.cycle();
      progress.tick();
    }
  }

  score() {
    let score = 0;
    for (let l = 0; l < this.lines; ++l) {
      for (let c = 0; c < this.chars; ++c) {
        if (this.tileAt(l, c) === Tile.Roller) {
          score += this.lines - l;
        }
      }
    }
    return score;
  }
}

const part1 = (rawInput: string) => {
  const grid = Grid.fromInput(rawInput);

  grid.rollUntilSettled({ line: 1, char: 0 });

  return grid.score();
};

const part2 = (rawInput: string) => {
  const grid = Grid.fromInput(rawInput);

  grid.spin(1000);
  // let lastScore = 0;
  // let score = 0;
  // do {
  //   grid.spin(100);
  //   lastScore = score;
  //   score = grid.score();
  // } while (lastScore !== score);

  return grid.score();
};

run({
  part1: {
    tests: [
      {
        input: `O....#....
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
        input: `O....#....
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
