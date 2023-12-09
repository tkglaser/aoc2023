import run from "aocrunner";
import { parse } from "./parser.js";
import { Maps } from "./maps.js";

const parseInput = (rawInput: string) => parse(rawInput);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const seeds = input.seeds;
  const maps = Maps.fromParsedInput(input);

  const convertedSeeds = seeds.map((s) => maps.map(s, "seed", "location"));

  return Math.min(...convertedSeeds);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const seeds = input.seeds;
  const maps = Maps.fromParsedInput(input);

  const groupedSeeds: number[][] = [];

  // seeds.forEach((s, i) => {
  //   if (i % 2 === 0) {
  //     groupedSeeds[i / 2] = [s];
  //   } else {
  //     groupedSeeds[(i - 1) / 2][1] = s;
  //   }
  // });

  // let bestSeed = Number.MAX_SAFE_INTEGER;

  // for (const [start, length] of groupedSeeds) {
  //   for (let i = 0; i < length; ++i) {
  //     const converted = maps.map(start + i, "seed", "location");
  //     if (converted < bestSeed) {
  //       bestSeed = converted;
  //     }
  //   }
  // }

  // return bestSeed;
};

run({
  part1: {
    tests: [
      {
        input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
        expected: 35,
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
