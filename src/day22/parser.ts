import { loadParser } from "../utils/index.js";

export type ParsingOutput = Brick[];

export interface Brick {
  a: [number, number, number];
  b: [number, number, number];
}

export const parse = loadParser<ParsingOutput>(
  import.meta.url,
  "./parser.pegjs",
);
