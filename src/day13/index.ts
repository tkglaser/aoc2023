import run from "aocrunner";

import { parse } from "./parser.js";

const asLines = (lines: string[]) => lines;

const asColumns = (lines: string[]) => {
  const colSums: string[] = [];
  for (let line = 0; line < lines.length; ++line) {
    for (let char = 0; char < lines[0].length; ++char) {
      const charVal = lines[line][char];
      colSums[char] = (colSums[char] ?? "") + charVal;
    }
  }
  return colSums;
};

const stringDiff = (a: string, b: string) =>
  a.split("").reduce((prev, curr, idx) => prev + (curr === b[idx] ? 0 : 1), 0);

const centersPart1 = (n: string[]) => {
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
    let valid = true;
    do {
      if (typeof n[h] === "undefined" || typeof n[l] === "undefined") {
        finished = true;
      } else if (n[l] !== n[h]) {
        valid = false;
      }
      --l;
      ++h;
    } while (!finished);
    if (valid) {
      confirmedCenters.push(center);
    }
  }

  return confirmedCenters;
};

const centersPart2 = (n: string[]) => {
  let centers = [];
  for (let i = 1; i < n.length; ++i) {
    centers.push(i);
  }

  let confirmedCenters = [];
  for (const center of centers) {
    let h = center;
    let l = center - 1;
    let finished = false;
    let valid = true;
    let seenSmudge = false;
    do {
      if (typeof n[h] === "undefined" || typeof n[l] === "undefined") {
        finished = true;
      } else {
        const diff = stringDiff(n[l], n[h]);
        if (diff === 1) {
          if (!seenSmudge) {
            seenSmudge = true;
          } else {
            valid = false;
          }
        } else if (diff > 1) {
          valid = false;
        }
      }
      --l;
      ++h;
    } while (!finished);
    if (valid && seenSmudge) {
      confirmedCenters.push(center);
    }
  }

  return confirmedCenters;
};

const sum = (n: number[]) => n.reduce((prev, curr) => prev + curr, 0);

const part1 = (rawInput: string) => {
  const input = parse(rawInput);

  return (
    sum(input.map(asLines).flatMap(centersPart1)) * 100 +
    sum(input.map(asColumns).flatMap(centersPart1))
  );
};

const part2 = (rawInput: string) => {
  const input = parse(rawInput);

  return (
    sum(input.map(asLines).flatMap(centersPart2)) * 100 +
    sum(input.map(asColumns).flatMap(centersPart2))
  );
};

run({
  part1: {
    tests: [
      {
        input: `
#.##..##.
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
        input: `
#.##..##.
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
