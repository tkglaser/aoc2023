import { loadParser } from "../utils/index.js";

export type ParsingOutput = ParsedModule[];

export interface ParsedModule {
  type: "&" | "%" | "broadcaster";
  name: string;
  targets: string[];
}

export const parse = loadParser<ParsingOutput>(
  import.meta.url,
  "./parser.pegjs",
);
