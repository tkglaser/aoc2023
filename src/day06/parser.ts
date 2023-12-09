import { loadParser } from "../utils/index.js";

export interface TimeDistance {
  time: number;
  distance: number;
}

export const parsePart1 = loadParser<TimeDistance[]>(
  import.meta.url,
  "./parser1.pegjs",
);

export const parsePart2 = loadParser<TimeDistance>(
  import.meta.url,
  "./parser2.pegjs",
);
