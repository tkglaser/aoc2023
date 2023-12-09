import { loadParser } from "../utils/index.js";

export type ParsingOutput = Game[];

export interface Game {
  game: number;
  rounds: Round[][];
}

export interface Round {
  count: number;
  colour: string;
}

export const parse = loadParser<ParsingOutput>(
  import.meta.url,
  "./parser.pegjs",
);
