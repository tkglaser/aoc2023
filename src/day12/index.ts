import run from "aocrunner";

import { parse } from "./parser.js";

const countPermutations = (
  map: string,
  predicate: (s: string) => boolean,
): number => {
  const numberQuestionMarks = map.split("").filter((c) => c === "?").length;
  const maxCount = 2 ** numberQuestionMarks;
  let permutationCount = 0;

  console.log(`Testing [${maxCount}] permutations`);

  for (let permDec = 0; permDec < maxCount; ++permDec) {
    if (permDec % 1000000 === 0) {
      console.log(
        `Checking permutation [${permDec}] [${
          Math.floor(permDec * 100 / maxCount)
        }%]`,
      );
    }
    const permBin = permDec.toString(2).padStart(numberQuestionMarks, "0");
    const permutation: string[] = [];
    let permIdx = 0;
    for (let i = 0; i < map.length; ++i) {
      if (map[i] === "?") {
        permutation[i] = permBin[permIdx] === "0" ? "." : "#";
        ++permIdx;
      } else {
        permutation[i] = map[i];
      }
    }
    const permJoined = permutation.join("");
    if (predicate(permJoined)) {
      ++permutationCount;
    }
  }

  console.log(`[${permutationCount}] permutations are valid`);

  return permutationCount;
};

const fitsNumbersMap = (n: number[]) => (map: string) => {
  const runs = map
    .split(".")
    .filter((c) => c !== "")
    .map((c) => c.length);

  return runs.join("#") === n.join("#");
};

const sum = (n: number[]) => n.reduce((prev, curr) => prev + curr, 0);

const part1 = (rawInput: string) => {
  const input = parse(rawInput);

  return sum(
    input.map((line) => countPermutations(line.m, fitsNumbersMap(line.d))),
  );
};

const part2 = (rawInput: string) => {
  const input = parse(rawInput);

  const inputExpanded = input.map((line) => ({
    m: [line.m, line.m, line.m, line.m, line.m].join("?"),
    d: [...line.d, ...line.d, ...line.d, ...line.d, ...line.d],
  }));

  return sum(
    inputExpanded.map((line) =>
      countPermutations(line.m, fitsNumbersMap(line.d)),
    ),
  );
};

run({
  part1: {
    tests: [
      {
        input: `???.### 1,1,3
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
        input: `???.### 1,1,3
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
  onlyTests: true,
});
