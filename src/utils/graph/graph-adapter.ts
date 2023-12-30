import { Edge } from "./edge.js";
import { IGraph } from "./igraph.js";

export class GraphAdapter implements IGraph {
  constructor(private neigboursFn: (from: string) => Edge[]) {}

  neigbours(from: string): Edge[] {
    return this.neigboursFn(from);
  }

  private readonly markMap: Record<string, Record<string, unknown>> = {};

  mark<M>(label: string, vertex: string, value: M): void {
    if (!this.markMap[label]) {
      this.markMap[label] = {};
    }
    this.markMap[label][vertex] = value;
  }

  unMark(label: string, vertex: string): void {
    if (!this.markMap[label]) {
      this.markMap[label] = {};
    }
    delete this.markMap[label][vertex];
  }

  getMark<M>(label: string, vertex: string): M | undefined {
    return this.markMap[label]?.[vertex] as M;
  }

  getAllMarked(label: string, value: unknown): string[] {
    return Object.entries(this.markMap[label] ?? {})
      .filter(([, v]) => v === value)
      .map(([k]) => k);
  }

  clearAllMarks(label: string): void {
    delete this.markMap[label];
  }
}
