import run from "aocrunner";
import assert from "assert";
import { init as initZ3 } from "z3-solver";

import { Line, parse } from "./parser.js";

function intersection2D(l1: Line, l2: Line): [number, number] | undefined {
  const m1 = l1.v[1] / l1.v[0];
  const m2 = l2.v[1] / l2.v[0];
  if (m1 === m2) {
    return undefined; // lines never intersect
  }
  const c1 = l1.p[1] - l1.p[0] * m1;
  const c2 = l2.p[1] - l2.p[0] * m2;

  const x = (c2 - c1) / (m1 - m2);
  const y = m1 * x + c1;
  return [x, y];
}

function positiveTraj(l: Line, point: [number, number]) {
  if (l.v[0] < 0) {
    return l.p[0] >= point[0];
  } else {
    return l.p[0] <= point[0];
  }
}

function countIntersectionsInArea(lines: Line[], bounds: [number, number]) {
  let intersections = 0;
  for (let i = 1; i < lines.length; ++i) {
    for (let j = 0; j < i; ++j) {
      const intersectionPoint = intersection2D(lines[i], lines[j]);
      if (intersectionPoint) {
        if (
          positiveTraj(lines[i], intersectionPoint) &&
          positiveTraj(lines[j], intersectionPoint)
        ) {
          if (
            intersectionPoint.every((c) => bounds[0] <= c && c <= bounds[1])
          ) {
            intersections++;
          }
        }
      }
    }
  }
  return intersections;
}

export async function getStartingCoordinateSum(hailstones: Line[]) {
  const { Context } = await initZ3();
  const { Real, Solver } = Context("main");

  const x = Real.const("x");
  const y = Real.const("y");
  const z = Real.const("z");

  const vx = Real.const("vx");
  const vy = Real.const("vy");
  const vz = Real.const("vz");

  const solver = new Solver();

  for (const [index, h] of hailstones.slice(0, 3).entries()) {
    const t = Real.const(`t${index}`);

    solver.add(t.ge(0));
    solver.add(x.add(vx.mul(t)).eq(t.mul(h.v[0]).add(h.p[0])));
    solver.add(y.add(vy.mul(t)).eq(t.mul(h.v[1]).add(h.p[1])));
    solver.add(z.add(vz.mul(t)).eq(t.mul(h.v[2]).add(h.p[2])));
  }

  const satisfied = await solver.check();

  assert(satisfied === "sat", "Z3 solver unsatisfied");

  const model = solver.model();

  return [model.eval(x), model.eval(y), model.eval(z)]
    .map(Number)
    .reduce((prev, curr) => prev + curr, 0);
}

const part1 = (rawInput: string) => {
  const input = parse(rawInput);

  return countIntersectionsInArea(input, [200000000000000, 400000000000000]);
  // return countIntersectionsInArea(input, [7, 27]);
};

const part2 = (rawInput: string) => {
  const input = parse(rawInput);

  return getStartingCoordinateSum(input);
};

run({
  part1: {
    tests: [
      {
        input: `19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3`,
        expected: 2,
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
