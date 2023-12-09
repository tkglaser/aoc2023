import { loadParser } from "../utils/index.js";

export const enum Direction {
  Left = "L",
  Right = "R",
}

export type ParsingOutput = { path: Direction[]; nodes: Node[] };

export interface Node {
  curr: string;
  [Direction.Left]: string;
  [Direction.Right]: string;
}

export const parse = loadParser<ParsingOutput>(
  import.meta.url,
  "./parser.pegjs",
);
