import run from "aocrunner";

import { Node, ParsingOutput, parse } from "./parser.js";

function traverse(
  parsedInput: ParsingOutput,
  start: string,
  end: (node: string, steps: number) => boolean,
) {
  let steps = 0;
  let pathIdx = 0;
  let node = start;
  const map: Record<string, Node> = parsedInput.nodes.reduce(
    (prev, curr) => ({ ...prev, [curr.curr]: curr }),
    {},
  );

  while (true) {
    let dir = parsedInput.path[pathIdx];
    if (!dir) {
      pathIdx = 0;
      dir = parsedInput.path[pathIdx];
    }
    node = map[node][dir];
    ++steps;
    ++pathIdx;

    if (end(node, steps)) {
      return steps;
    }
  }
}

function gcd(a: number, b: number): number {
  if (b == 0) return a;
  return gcd(b, a % b);
}

// Returns LCM of array elements
function findlcm(arr: number[], n: number) {
  // Initialize result
  let ans = arr[0];

  // ans contains LCM of arr[0], ..arr[i]
  // after i'th iteration,
  for (let i = 1; i < n; i++) ans = (arr[i] * ans) / gcd(arr[i], ans);

  return ans;
}

const part1 = (rawInput: string) => {
  const input = parse(rawInput);

  return traverse(input, "AAA", (n) => n === "ZZZ");
};

const part2 = (rawInput: string) => {
  const input = parse(rawInput);

  let nodes = input.nodes.map((n) => n.curr).filter((n) => n.endsWith("A"));

  const steps = nodes.map((node) =>
    traverse(input, node, (n) => n.endsWith("Z")),
  );

  return findlcm(steps, steps.length);
};

run({
  part1: {
    tests: [
      {
        input: `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`,
        expected: 2,
      },
      {
        input: `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
