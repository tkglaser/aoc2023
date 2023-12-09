import run from "aocrunner";
import { parsePart1, parsePart2 } from "./parser.js";

/**
 * Total given race time `t`
 * Time the button was held down `tb`
 * Achieved race distance `d`
 * Target distance `dt`
 *
 * Speed after button press = (tb in mm)/ms
 * Total distance = (t - tb) * tb
 *
 * Quadratic equation:
 * ax^2 + bx + c = 0 ==> x = (-b +- sqrt(b^2 - 4ac))/2a
 *
 * To solve
 * (t-tb)*tb - dt = 0
 * -tb^2 + t*tb - dt = 0
 *   ==> tb = (-t +- sqrt(t^2 - 4(-1)(-dt)))/2(-1)
 *   ==> tb = (-t +- sqrt(t^2 - 4dt))/-2
 */

function solutions(t: number, dt: number) {
  const first = (-t + Math.sqrt(t * t - 4 * dt)) / -2;
  const second = (-t - Math.sqrt(t * t - 4 * dt)) / -2;
  return { first, second };
}

function waysToWin(t: number, dt: number) {
  const { first, second } = solutions(t, dt);

  let adjustedFirst = Math.ceil(first);
  if (first === adjustedFirst) {
    adjustedFirst = first + 1;
  }

  let adjustedLast = Math.floor(second);
  if (second === adjustedLast) {
    adjustedLast = second - 1;
  }

  return adjustedLast - adjustedFirst + 1;
}

const part1 = (rawInput: string) => {
  const input = parsePart1(rawInput);

  return input
    .map((race) => waysToWin(race.time, race.distance))
    .reduce((prev, curr) => prev * curr, 1);
};

const part2 = (rawInput: string) => {
  const input = parsePart2(rawInput);

  return waysToWin(input.time, input.distance);
};

run({
  part1: {
    tests: [
      {
        input: `Time:      7  15   30
Distance:  9  40  200`,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Time:      7  15   30
Distance:  9  40  200`,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
