import { VisitResult } from "./graph.js";

export function dfs<T>(
  start: T,
  neighbours: (c: T) => T[],
  visit: (c: T) => VisitResult,
) {
  const q: T[] = [start];
  do {
    const node = q.pop()!;
    if (visit(node) === VisitResult.Abort) {
      return;
    }
    q.push(...neighbours(node));
  } while (q.length);
}
