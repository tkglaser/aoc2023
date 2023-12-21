import { loadParser } from "../utils/index.js";

export type ParsingOutput = Instruction[];

export type Instruction = {
  dir: "U" | "D" | "L" | "R";
  count: number;
  colour: string;
};

export const parse = loadParser<ParsingOutput>(
  import.meta.url,
  "./parser.pegjs",
);
