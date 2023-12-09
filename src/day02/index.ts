import run from "aocrunner";

import { Game, parse } from "./parser.js";

const parseInput = parse;

type Bag = Record<string, number>;

const bag = {
  red: 12,
  green: 13,
  blue: 14,
};

function isGamePossible(game: Game, bag: Bag) {
  for (const round of game.rounds) {
    for (const { colour, count } of round) {
      if ((bag[colour] ?? 0) < count) {
        return false;
      }
    }
  }
  return true;
}

function power(game: Game) {
  const minSet: Record<string, number> = {};
  for (const round of game.rounds) {
    for (const { colour, count } of round) {
      minSet[colour] = Math.max(minSet[colour] ?? 0, count);
    }
  }
  return Object.values(minSet).reduce((prev, curr) => prev * curr, 1);
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let sumGames = 0;

  for (const game of input) {
    if (isGamePossible(game, bag)) {
      sumGames += game.game;
    }
  }
  return sumGames;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let sumPowers = 0;
  for (const game of input) {
    sumPowers += power(game);
  }
  return sumPowers;
};

run({
  part1: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
