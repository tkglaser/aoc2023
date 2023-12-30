import { Edge } from "./edge.js";

export type Vertex = string;

export interface IGraph {
  neigbours(from: string): Edge[];

  mark<M>(label: string, vertex: Vertex, value: M): void;

  unMark(label: string, vertex: Vertex): void;

  getMark<M>(label: string, vertex: Vertex): M | undefined;

  getAllMarked(label: string, value: unknown): Vertex[];

  clearAllMarks(label: string): void;
}
