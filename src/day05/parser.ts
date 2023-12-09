import { loadParser } from "../utils/index.js";

export interface ParsingOutput {
  seeds: number[];
  maps: Map[];
}

export interface Map {
  from: string;
  to: string;
  mappings: Mapping[];
}

export interface Mapping {
  dest: number;
  source: number;
  length: number;
}

export const parse = loadParser<ParsingOutput>(
  import.meta.url,
  "./parser.pegjs",
);
