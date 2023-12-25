import run from "aocrunner";

import { Edge } from "../utils/graph/edge.js";
import { Graph } from "../utils/graph/graph.js";
import { ParsingOutput, parse } from "./parser.js";

function toGraph(input: ParsingOutput): Graph {
  const edges: Edge[] = [];
  for (const { name, connections } of input) {
    for (const to of connections) {
      edges.push({ from: name, value: 1, to });
    }
  }

  return new Graph(edges, { directed: false });
}

function contract(original: Graph, target: number) {
  let graph = original;
  do {
    const edges = graph.edges;
    const edge = edges[Math.floor(Math.random() * edges.length)];
    graph = graph.contract(edge.from, edge.to, { removeSelfEdges: true });
  } while (graph.vertices.length > target);
  return graph;
}

// Karger-Stein
function fastCut(
  original: Graph,
  heuristic: (a: Graph, b: Graph) => Graph,
): Graph {
  if (original.vertices.length <= 6) {
    return contract(original, 2);
  } else {
    const t = Math.ceil(1 + original.vertices.length / Math.sqrt(2));
    const a = contract(original, t);
    const b = contract(original, t);
    return heuristic(fastCut(a, heuristic), fastCut(b, heuristic));
  }
}

const part1 = (rawInput: string) => {
  const input = parse(rawInput);
  const original = toGraph(input);

  let graph = original;
  do {
    // graph = contract(original, 2);
    graph = fastCut(original, (a, b) => {
      const scoreA = Math.abs(a.edges[0].value - 3);
      const scoreB = Math.abs(b.edges[0].value - 3);
      return scoreA < scoreB ? a : b;
    });
  } while (graph.neigbours(graph.vertices[0])[0].value !== 3);

  const length1 = graph.vertices[0].split("#").length;
  const length2 = graph.vertices[1].split("#").length;

  return length1 * length2;
};

const part2 = (rawInput: string) => {
  const input = parse(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr`,
        expected: 54,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
