import { MinPriorityQueue } from "@datastructures-js/priority-queue";
import { IGraph } from "../graph/igraph.js";

export function dijkstra(graph: IGraph, start: string, target: string) {
  graph.mark("distance", start, 0);
  let curr = start;
  const q = new MinPriorityQueue<{ node: string; distance: number }>(
    (v) => v.distance,
  );
  q.enqueue({ node: start, distance: 0 });

  const cleanup = () => {
    graph.clearAllMarks("visited");
  };

  const tracePath = () => {
    const path: string[] = [];
    let curr = target;

    do {
      path.unshift(curr);
      curr = graph.getMark("origin", curr)!;
    } while (curr !== start);
    return path;
  };

  do {
    console.log(q.toArray().map((v) => `[${v.node}](${v.distance})`).join(" "));
    curr = q.dequeue()?.node;

    if (!curr) {
      cleanup();
      return;
    }

    if (curr === target) {
      cleanup();
      return tracePath();
    }

    if (graph.getMark("visited", curr)) {
      continue;
    }

    const currDist = graph.getMark<number>("distance", curr)!;

    for (const n of graph.neigbours(curr)) {
      let nDist = graph.getMark<number>("distance", n.to);
      if (typeof nDist === "undefined") {
        nDist = Number.MAX_SAFE_INTEGER;
      }

      const newNDist = currDist + n.value;
      const isBetter = newNDist < nDist;
      if (isBetter) {
        graph.mark("distance", n.to, newNDist);
        graph.mark("origin", n.to, curr);
        q.enqueue({ node: n.to, distance: newNDist });
      }
    }
    graph.mark("visited", curr, true);
  } while (true);
}
