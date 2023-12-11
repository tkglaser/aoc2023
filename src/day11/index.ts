import run from "aocrunner";

interface Galaxy {
  l: number;
  c: number;
}

class Universe {
  constructor(
    public galaxies: Galaxy[],
    public lines: number,
    public chars: number,
  ) {}
  static fromInput(rawInput: string) {
    const galaxies: Galaxy[] = [];
    const input = rawInput.split("\n");
    for (let line = 0; line < input.length; ++line) {
      for (let char = 0; char < input[0].length; ++char) {
        if (input[line][char] === "#") {
          galaxies.push({ l: line, c: char });
        }
      }
    }
    return new Universe(galaxies, input.length, input[0].length);
  }

  expand(by: number) {
    const linesWithGalaxies = new Set(this.galaxies.map((g) => g.l));
    const charsWithGalaxies = new Set(this.galaxies.map((g) => g.c));

    const emptyLines = [];
    for (let line = 0; line < this.lines; ++line) {
      if (!linesWithGalaxies.has(line)) {
        emptyLines.unshift(line); // ordered descending
      }
    }

    const emptyChars = [];
    for (let char = 0; char < this.chars; ++char) {
      if (!charsWithGalaxies.has(char)) {
        emptyChars.unshift(char); // ordered descending
      }
    }

    for (const el of emptyLines) {
      this.galaxies = this.galaxies.map((g) => {
        if (g.l > el) {
          return { l: g.l + by, c: g.c };
        }
        return g;
      });
    }

    for (const ec of emptyChars) {
      this.galaxies = this.galaxies.map((g) => {
        if (g.c > ec) {
          return { l: g.l, c: g.c + by };
        }
        return g;
      });
    }
  }

  distance(a: Galaxy, b: Galaxy) {
    return Math.abs(a.l - b.l) + Math.abs(a.c - b.c); // Manhattan
  }

  sumPairwiseDistances() {
    const otherGalaxies: Galaxy[] = [];
    let totalDistance = 0;
    for (const galaxy of this.galaxies) {
      for (const otherGalaxy of otherGalaxies) {
        totalDistance += this.distance(galaxy, otherGalaxy);
      }
      otherGalaxies.push(galaxy);
    }
    return totalDistance;
  }
}

const part1 = (rawInput: string) => {
  const universe = Universe.fromInput(rawInput);

  universe.expand(1);

  return universe.sumPairwiseDistances();
};

const part2 = (rawInput: string) => {
  const universe = Universe.fromInput(rawInput);

  universe.expand(999999);

  return universe.sumPairwiseDistances();
};

run({
  part1: {
    tests: [
      {
        input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
        expected: 374,
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
