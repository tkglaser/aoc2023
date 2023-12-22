import run from "aocrunner";

import { Brick, parse } from "./parser.js";
import { deepCopy } from "../utils/deep-copy.js";

function separate(a: Brick, b: Brick) {
  const separateDim = (x: number, y: number, u: number, v: number) =>
    y < u || v < x;

  return (
    separateDim(a.a[0], a.b[0], b.a[0], b.b[0]) ||
    separateDim(a.a[1], a.b[1], b.a[1], b.b[1]) ||
    separateDim(a.a[2], a.b[2], b.a[2], b.b[2])
  );
}

function onGround(b: Brick) {
  return b.a[2] <= 1;
}

function fall(bricks: Brick[]) {
  bricks.sort((a, b) => a.a[2] - b.a[2]);
  let fallen;
  do {
    fallen = false;
    for (let i = 0; i < bricks.length; ++i) {
      if (onGround(bricks[i])) {
        continue;
      }
      const brickWhenFallen = deepCopy(bricks[i]);
      brickWhenFallen.a[2] -= 1;
      brickWhenFallen.b[2] -= 1;
      let collided = false;
      for (let j = 0; j < i; j++) {
        if (!separate(brickWhenFallen, bricks[j])) {
          collided = true;
        }
      }
      if (!collided) {
        fallen = true;
        bricks[i] = brickWhenFallen;
      }
    }
  } while (fallen);
}

function wouldFall(bricks: Brick[], idx: number) {
  for (let i = 0; i < bricks.length; ++i) {
    if (onGround(bricks[i])) {
      continue;
    }
    if (i === idx) {
      continue;
    }
    const brickWhenFallen = deepCopy(bricks[i]);
    brickWhenFallen.a[2] -= 1;
    brickWhenFallen.b[2] -= 1;
    let collided = false;
    for (let j = 0; j < i; j++) {
      if (j === idx) {
        continue;
      }
      if (!separate(brickWhenFallen, bricks[j])) {
        collided = true;
      }
    }
    if (!collided) {
      return true;
    }
  }
  return false;
}

function wouldFallCount(bricks: Brick[], idx: number) {
  let fallCount = 0;
  for (let i = 0; i < bricks.length; ++i) {
    if (onGround(bricks[i])) {
      continue;
    }
    if (i === idx) {
      continue;
    }
    const brickWhenFallen = deepCopy(bricks[i]);
    brickWhenFallen.a[2] -= 1;
    brickWhenFallen.b[2] -= 1;
    let collided = false;
    for (let j = 0; j < i; j++) {
      if (j === idx) {
        continue;
      }
      if (!separate(brickWhenFallen, bricks[j])) {
        collided = true;
      }
    }
    if (!collided) {
      fallCount++;
      bricks[i] = brickWhenFallen;
    }
  }
  return fallCount;
}

function notFallCount(bricks: Brick[]) {
  let notFallCount = 0;
  for (let i = 0; i < bricks.length; ++i) {
    if (!wouldFall(bricks, i)) {
      notFallCount++;
    }
  }
  return notFallCount;
}

function wouldFallCountTotal(bricks: Brick[]) {
  let wouldFallCounter = 0;
  for (let i = 0; i < bricks.length; ++i) {
    wouldFallCounter += wouldFallCount(deepCopy(bricks), i);
  }
  return wouldFallCounter;
}

const part1 = (rawInput: string) => {
  const input = parse(rawInput);
  fall(input);
  return notFallCount(input);
};

const part2 = (rawInput: string) => {
  const input = parse(rawInput);
  fall(input);
  return wouldFallCountTotal(input);
};

run({
  part1: {
    tests: [
      {
        input: `1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`,
        expected: 5,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`,
        expected: 7,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
