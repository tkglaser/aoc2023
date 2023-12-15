import { loadParser } from "../utils/index.js";

export type ParsingOutput = string[][];

export const parse = loadParser<ParsingOutput>(
  import.meta.url,
  "./parser.pegjs",
);
