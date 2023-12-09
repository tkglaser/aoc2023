import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(" ").map(Number));

const allZero = (line: number[]) => line.every((n) => n === 0);
const lastItems = (line: number[][]) =>
  line.map((line) => line[line.length - 1]);
const firstItems = (line: number[][]) => line.map((line) => line[0]);

const diff = (line: number[]) => {
  const result = [];
  for (let i = 1; i < line.length; ++i) {
    result[i - 1] = line[i] - line[i - 1];
  }
  return result;
};

const diffToZero = (line: number[]) => {
  const result: number[][] = [line];
  let currLine = line;
  do {
    currLine = diff(currLine);
    result.unshift(currLine);
  } while (!allZero(currLine));
  return result;
};

const predict = (dir: "forward" | "backward") => (line: number[]) => {
  let delta = line[0];
  const coeff = dir === "forward" ? 1 : -1;
  for (let i = 1; i < line.length; ++i) {
    delta = line[i] + delta * coeff;
  }
  return delta;
};

const sum = (input: number[]) => input.reduce((prev, curr) => prev + curr, 0);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return sum(input.map(diffToZero).map(lastItems).map(predict("forward")));
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return sum(input.map(diffToZero).map(firstItems).map(predict("backward")));
};

run({
  part1: {
    tests: [
      {
        input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
        expected: 114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
