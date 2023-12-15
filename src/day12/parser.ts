import { loadParser } from "../utils/index.js";

export type ParsingOutput = Row[];

interface Row {
  m: string;
  d: number[];
}

export const parse = loadParser<ParsingOutput>(
  import.meta.url,
  "./parser.pegjs",
);
