import { loadParser } from "../utils/index.js";

export type ParsingOutput = Line[];

export interface Line {
  p: Vector;
  v: Vector;
}

export type Vector = [number, number, number];

export const parse = loadParser<ParsingOutput>(
  import.meta.url,
  "./parser.pegjs",
);
