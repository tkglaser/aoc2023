import { loadParser } from "../utils/index.js";

export interface InputParsedItem {
  cardId: number;
  lhs: number[];
  rhs: number[];
}

export type InputParsed = InputParsedItem[];


export const parse = loadParser<InputParsed>(
  import.meta.url,
  "./parser.pegjs",
);
