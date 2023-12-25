import { loadParser } from "../utils/index.js";

export type ParsingOutput = Line[];

export interface Line {
  name: string;
  connections: string[];
}

export const parse = loadParser<ParsingOutput>(
  import.meta.url,
  "./parser.pegjs",
);
