import { Edge } from "../graph/edge.js";
import { Graph } from "../graph/graph.js";

export function contractEdge(
  graph: Graph,
  edge: Edge,
  opts: { removeSelfEdge: boolean },
) {
  const newEdges: Edge[] = [];
  const newVertex = `${edge.from}#${edge.to}`;

  for (const e of graph.edges) {
    const newFrom = [edge.from, edge.to].includes(e.from) ? newVertex : e.from;
    const newTo = [edge.from, edge.to].includes(e.to) ? newVertex : e.to;
    if (!opts.removeSelfEdge || newFrom !== newTo) {
      newEdges.push({ from: newFrom, to: newTo, value: e.value });
    }
  }

  return new Graph(newEdges, { directed: true });
}

export function contract(original: Graph, target: number) {
  let graph = original;
  do {
    const edges = graph.edges;
    const edge = edges[Math.floor(Math.random() * edges.length)];
    graph = contractEdge(graph, edge, { removeSelfEdge: true });
  } while (graph.vertices.length > target);
  return graph;
}

export function minCutKargerStein(
  original: Graph,
  heuristic: (a: Graph, b: Graph) => Graph,
): Graph {
  const minCutInternal = (g: Graph): Graph => {
    if (g.vertices.length <= 6) {
      return contract(g, 2);
    } else {
      const t = Math.ceil(1 + g.vertices.length / Math.sqrt(2));
      const a = contract(g, t);
      const b = contract(g, t);
      return heuristic(minCutInternal(a), minCutInternal(b));
    }
  };
  return minCutInternal(original);
}
