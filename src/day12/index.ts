import run from "aocrunner";
import memoize from "lodash/memoize.js";

import { parse } from "./parser.js";

const countPermutations = memoize(
  (map: string, n: number[]): number => {
    if (map.length === 0) {
      if (n.length === 0) {
        return 1; // valid
      }
      return 0; // invalid
    }

    const firstChar = map[0];
    const restMap = map.slice(1);

    if (map.length < sum(n) + n.length - 1) {
      // the expected strings don't fit
      return 0;
    }

    if (firstChar === ".") {
      return countPermutations(restMap, n);
    }

    if (firstChar === "#") {
      if (n.length === 0) {
        return 0; // invalid
      }
      // take the first run and run it
      const firstRun = n[0];
      for (let i = 0; i < firstRun; ++i) {
        if (map[i] === ".") {
          return 0; // invalid
        }
      }
      if (map[firstRun] === "#") {
        return 0; // invalid
      }
      return countPermutations(map.slice(firstRun + 1), n.slice(1));
    }

    // firstChar is ? so count both ways
    return (
      countPermutations("#" + restMap, n) + countPermutations("." + restMap, n)
    );
  },
  (map: string, n: number[]) =>
    `${map}||${n.map((n) => n.toString()).join("#")}`,
);

const sum = (n: number[]) => n.reduce((prev, curr) => prev + curr, 0);

const part1 = (rawInput: string) => {
  const input = parse(rawInput);

  return sum(input.map((line) => countPermutations(line.m, line.d)));
};

const part2 = (rawInput: string) => {
  const input = parse(rawInput);

  const inputExpanded = input.map((line) => ({
    m: [line.m, line.m, line.m, line.m, line.m].join("?"),
    d: [...line.d, ...line.d, ...line.d, ...line.d, ...line.d],
  }));

  return sum(inputExpanded.map((line) => countPermutations(line.m, line.d)));
};

run({
  part1: {
    tests: [
      {
        input: `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
        expected: 525152,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
