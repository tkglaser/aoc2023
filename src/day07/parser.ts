import { loadParser } from "../utils/index.js";

export type ParsingOutput = Game[];

export const enum Card {
  Ace = "A",
  King = "K",
  Queen = "Q",
  Jack = "J",
  Ten = "T",
  Nine = "9",
  Eight = "8",
  Seven = "7",
  Six = "6",
  Five = "5",
  Four = "4",
  Three = "3",
  Two = "2",
}

export interface Game {
  hand: Card[];
  score: number;
}

export const parse = loadParser<ParsingOutput>(
  import.meta.url,
  "./parser.pegjs",
);
