import run from "aocrunner";

import { Card, Game, parse } from "./parser.js";

const cardScorePart1 = {
  [Card.Ace]: 13,
  [Card.King]: 12,
  [Card.Queen]: 11,
  [Card.Jack]: 10,
  [Card.Ten]: 9,
  [Card.Nine]: 8,
  [Card.Eight]: 7,
  [Card.Seven]: 6,
  [Card.Six]: 5,
  [Card.Five]: 4,
  [Card.Four]: 3,
  [Card.Three]: 2,
  [Card.Two]: 1,
};

const cardScorePart2 = {
  [Card.Ace]: 13,
  [Card.King]: 12,
  [Card.Queen]: 11,
  [Card.Ten]: 10,
  [Card.Nine]: 9,
  [Card.Eight]: 8,
  [Card.Seven]: 7,
  [Card.Six]: 6,
  [Card.Five]: 5,
  [Card.Four]: 4,
  [Card.Three]: 3,
  [Card.Two]: 2,
  [Card.Jack]: 1,
};

type Hand = Card[];

function scoreHand(hand: Hand) {
  const groupedCards: Partial<Record<Card, number>> = {};

  hand.forEach((c) => {
    groupedCards[c] = (groupedCards[c] ?? 0) + 1;
  });

  const counts = Object.values(groupedCards);

  // five of a kind
  if (counts.includes(5)) {
    return 8;
  }

  // four of a kind
  if (counts.includes(4)) {
    return 7;
  }

  // full house
  if (counts.includes(3) && counts.includes(2)) {
    return 6;
  }

  // three of a kind
  if (counts.includes(3)) {
    return 5;
  }

  // two pair
  if (counts.filter((c) => c === 2).length === 2) {
    return 4;
  }

  // one pair
  if (counts.includes(2)) {
    return 3;
  }

  // high card
  if (counts.every((c) => c === 1)) {
    return 2;
  }
  return 1;
}

function scoreHandWithJoker(hand: Hand) {
  const groupedCards: Partial<Record<Card, number>> = {};

  hand.forEach((c) => {
    groupedCards[c] = (groupedCards[c] ?? 0) + 1;
  });

  const counts = Object.entries(groupedCards)
    .filter(([key]) => key !== Card.Jack)
    .map(([, value]) => value);
  const jokerCount = groupedCards[Card.Jack] ?? 0;

  // edge case
  if (jokerCount === 5) {
    return 8;
  }

  // five of a kind
  if (Math.max(...counts) + jokerCount >= 5) {
    return 8;
  }

  // four of a kind
  if (Math.max(...counts) + jokerCount >= 4) {
    return 7;
  }

  // full house
  if (
    (counts.includes(3) && counts.includes(2)) ||
    (counts.filter((c) => c === 2).length === 2 && jokerCount >= 1) ||
    (counts.includes(3) && jokerCount >= 2) ||
    (counts.includes(2) && jokerCount >= 3)
  ) {
    return 6;
  }

  // three of a kind
  if (
    counts.includes(3) ||
    (counts.includes(2) && jokerCount >= 1) ||
    jokerCount >= 2
  ) {
    return 5;
  }

  // two pair
  if (
    counts.filter((c) => c === 2).length === 2 ||
    (counts.includes(2) && jokerCount >= 1) ||
    jokerCount >= 2
  ) {
    return 4;
  }

  // one pair
  if (counts.includes(2) || jokerCount >= 1) {
    return 3;
  }

  // high card
  if (counts.every((c) => c === 1)) {
    return 2;
  }
  return 1;
}

const spacer = 100;

function scoreCards(hand: Hand, part2: boolean) {
  const scoreCard = part2 ? cardScorePart2 : cardScorePart1;
  return (
    scoreCard[hand[0]] * spacer * spacer * spacer * spacer +
    scoreCard[hand[1]] * spacer * spacer * spacer +
    scoreCard[hand[2]] * spacer * spacer +
    scoreCard[hand[3]] * spacer +
    scoreCard[hand[4]]
  );
}

function fullScore(hand: Hand, part: "part1" | "part2") {
  const handScore = (part === "part2" ? scoreHandWithJoker : scoreHand)(hand);
  const cardScore = scoreCards(hand, part === "part2");
  return handScore * spacer * spacer * spacer * spacer * spacer + cardScore;
}

function orderGamesAscending(games: Game[], part: "part1" | "part2") {
  return games.sort((a, b) => {
    return fullScore(a.hand, part) - fullScore(b.hand, part);
  });
}

function sum(games: Game[]) {
  let sum = 0;
  games.forEach((game, idx) => {
    sum += game.score * (idx + 1);
  });
  return sum;
}

const part1 = (rawInput: string) => {
  const input = parse(rawInput);

  return sum(orderGamesAscending(input, "part1"));
};

const part2 = (rawInput: string) => {
  const input = parse(rawInput);

  return sum(orderGamesAscending(input, "part2"));
};

run({
  part1: {
    tests: [
      {
        input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
        expected: 6440,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
        expected: 5905,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
