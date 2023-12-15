import run from "aocrunner";

import { parse } from "./parser.js";

const lineChecksums = (lines: string[]) =>
  lines.map((line) => +line.replaceAll(".", "0").replaceAll("#", "1"));

const colChecksums = (lines: string[]) => {
  const colSums: string[] = [];
  for (let line = 0; line < lines.length; ++line) {
    for (let char = 0; char < lines[0].length; ++char) {
      const charVal = lines[line][char] === "#" ? "1" : "0";
      colSums[char] = (colSums[char] ?? "") + charVal;
    }
  }
  return colSums.map(Number);
};

const centers = (allowedDiff: number) => (n: number[]) => {
  let centers = [];
  for (let i = 1; i < n.length; ++i) {
    if (n[i - 1] === n[i]) {
      centers.push(i);
    }
  }

  let confirmedCenters = [];
  for (const center of centers) {
    let h = center;
    let l = center - 1;
    let finished = false;
    let diffCount = 0;
    do {
      if (typeof n[h] === "undefined" || typeof n[l] === "undefined") {
        finished = true;
      } else if (n[l] !== n[h]) {
        ++diffCount;
      }
      --l;
      ++h;
    } while (!finished);
    if (diffCount == allowedDiff) {
      confirmedCenters.push(center);
    }
  }

  return confirmedCenters;
};

const sum = (n: number[]) => n.reduce((prev, curr) => prev + curr, 0);

const part1 = (rawInput: string) => {
  const input = parse(rawInput);

  return (
    sum(input.map(lineChecksums).flatMap(centers(0))) * 100 +
    sum(input.map(colChecksums).flatMap(centers(0)))
  );
};

const part2 = (rawInput: string) => {
  const input = parse(rawInput);

  return (
    sum(input.map(lineChecksums).flatMap(centers(1))) * 100 +
    sum(input.map(colChecksums).flatMap(centers(1)))
  );
};

run({
  part1: {
    tests: [
      {
        input: `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
        expected: 405,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
        expected: 400,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
