import { loadParser } from "../utils/index.js";

export type ParsingOutput = { workflows: WorkflowMap; parts: Part[] };

export type WorkflowMap = Record<string, Workflow>;

export interface Workflow {
  name: string;
  rules: Rule[];
}

export type Rule = ConditionalRule | UnconditionalRule;

export interface ConditionalRule {
  cat: "x" | "m" | "a" | "s";
  op: "<" | ">";
  val: number;
  outcome: string;
}

export interface UnconditionalRule {
  outcome: string;
}

export interface Part {
  x: number;
  m: number;
  a: number;
  s: number;
}

export const parse = loadParser<ParsingOutput>(
  import.meta.url,
  "./parser.pegjs",
);
