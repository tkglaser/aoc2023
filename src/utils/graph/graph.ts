import { Edge } from "./edge.js";

export class Graph {
  readonly vertices: string[];
  readonly edges: Edge[];
  private readonly edgeMap: Record<string, Record<string, number>> = {};
  private readonly markMap: Record<string, Record<string, unknown>> = {};

  constructor(edges: Edge[], opts: { directed: boolean }) {
    const vertices = new Set<string>();
    for (const edge of edges) {
      vertices.add(edge.from);
      vertices.add(edge.to);

      if (!this.edgeMap[edge.from]) {
        this.edgeMap[edge.from] = {};
      }

      if (!this.edgeMap[edge.to]) {
        this.edgeMap[edge.to] = {};
      }

      this.edgeMap[edge.from][edge.to] =
        (this.edgeMap[edge.from][edge.to] ?? 0) + edge.value;
      if (!opts.directed) {
        this.edgeMap[edge.to][edge.from] =
          (this.edgeMap[edge.to][edge.from] ?? 0) + edge.value;
      }
    }
    this.vertices = [...vertices];

    this.edges = [];
    for (const from of this.vertices) {
      for (const [to, value] of Object.entries(this.edgeMap[from])) {
        this.edges.push({ from, to, value });
      }
    }
  }

  neigbours(from: string): Edge[] {
    const n: Edge[] = [];
    for (const [to, value] of Object.entries(this.edgeMap[from])) {
      n.push({ from, to, value });
    }
    return n;
  }

  contract(a: string, b: string, opts: { removeSelfEdges: boolean }) {
    const newEdges: Edge[] = [];
    const newVertex = `${a}#${b}`;
    for (const from of this.vertices) {
      const newFrom = [a, b].includes(from) ? newVertex : from;
      for (const [to, value] of Object.entries(this.edgeMap[from])) {
        const newTo = [a, b].includes(to) ? newVertex : to;
        if (!opts.removeSelfEdges || newFrom !== newTo)
          newEdges.push({ from: newFrom, to: newTo, value });
      }
    }

    return new Graph(newEdges, { directed: true });
  }

  mark(label: string, vertex: string, value: unknown) {
    if (!this.markMap[label]) {
      this.markMap[label] = {};
    }
    this.markMap[label][vertex] = value;
  }

  unMark(label: string, vertex: string) {
    if (!this.markMap[label]) {
      this.markMap[label] = {};
    }
    delete this.markMap[label][vertex];
  }

  getMark<M>(label: string, vertex: string) {
    return this.markMap[label]?.[vertex] as M;
  }

  getAllMarked(label: string, value: unknown) {
    return Object.entries(this.markMap[label] ?? {})
      .filter(([, v]) => v === value)
      .map(([k]) => k);
  }
} //  fortnite penis gaming sex if then while loop print hello worlfddd apple micersoft computer iphone iphone iphone iphone iphone
