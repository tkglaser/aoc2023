import run from "aocrunner";

import { Card } from "./card.js";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const cards = Card.fromInput(input);

  return cards.map((card) => card.points).reduce((prev, curr) => prev + curr);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const cards = Card.fromInput(input);

  const numbers: number[] = [];

  for (const card of cards) {
    const copies = numbers[card.cardId] ?? 0;
    const matches = card.matches;
    const delta = 1 + copies;
    for (let m = 1; m <= matches; ++m) {
      numbers[card.cardId + m] = (numbers[card.cardId + m] ?? 0) + delta;
    }
  }

  const cardsCount =
    cards.length + numbers.reduce((prev, curr) => prev + (curr ?? 0), 0);

  return cardsCount;
};

run({
  part1: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
