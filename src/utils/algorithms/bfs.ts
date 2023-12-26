import { VisitResult } from "./visit-result.js";

export function bfs<T>(
  start: T,
  neighbours: (c: T) => T[],
  visit: (c: T) => VisitResult,
) {
  const q: T[] = [start];
  do {
    const node = q.shift()!;
    if (visit(node) === VisitResult.Abort) {
      return;
    }
    q.push(...neighbours(node));
  } while (q.length);
}
