import run from "aocrunner";

import { ConditionalRule, Part, Rule, WorkflowMap, parse } from "./parser.js";

const isConditionalRule = (r: Rule): r is ConditionalRule =>
  !!(r as ConditionalRule).op;

const isConditionMet = (r: ConditionalRule, p: Part) => {
  if (r.op === ">") {
    return p[r.cat] > r.val;
  } else {
    return p[r.cat] < r.val;
  }
};

const isDecision = (outcome: string) => ["A", "R"].includes(outcome);
const isAccepted = (outcome: string) => outcome === "A";

const outcome = (workflows: WorkflowMap) => (part: Part) => {
  let currentWorkflowName = "in";

  console.log("Part", JSON.stringify(part));

  do {
    const workflow = workflows[currentWorkflowName];
    console.log("Workflow ", currentWorkflowName);
    for (const rule of workflow.rules) {
      if (isConditionalRule(rule)) {
        console.log(`Rule [${rule.cat}${rule.op}${rule.val}]=>${rule.outcome}`);
        if (isConditionMet(rule, part)) {
          if (isDecision(rule.outcome)) {
            console.log("Decision ", rule.outcome);
            return isAccepted(rule.outcome);
          } else {
            console.log("Transfer ", rule.outcome);
            currentWorkflowName = rule.outcome;
            break;
          }
        }
      } else {
        console.log(`Rule []=>${rule.outcome}`);
        if (isDecision(rule.outcome)) {
          console.log("Decision ", rule.outcome);
          return isAccepted(rule.outcome);
        } else {
          console.log("Transfer ", rule.outcome);
          currentWorkflowName = rule.outcome;
          break;
        }
      }
      console.log("Rule not applicable");
    }
  } while (true);
};

const partScore = (p: Part) => p.x + p.m + p.a + p.s;

const sum = (n: number[]) => n.reduce((prev, curr) => prev + curr, 0);

const score = (p: Part[]) => sum(p.map(partScore));

type Volume = {
  min: [number, number, number, number];
  max: [number, number, number, number];
};

const volIdx = {
  x: 0,
  m: 1,
  a: 2,
  s: 3,
};

const deepCopy = <T>(val: T): T => JSON.parse(JSON.stringify(val));

function split(r: ConditionalRule, volume: Volume) {
  const inside = deepCopy(volume);
  const outside = deepCopy(volume);
  const dim = volIdx[r.cat];
  if (r.op === "<") {
    inside.max[dim] = r.val - 1;
    outside.min[dim] = r.val;
  } else {
    inside.min[dim] = r.val + 1;
    outside.max[dim] = r.val;
  }
  return { inside, outside };
}

function calcVol(v: Volume) {
  return (
    (v.max[0] - v.min[0] + 1) *
    (v.max[1] - v.min[1] + 1) *
    (v.max[2] - v.min[2] + 1) *
    (v.max[3] - v.min[3] + 1)
  );
}

function calcHypercubeVolumes(workflows: WorkflowMap) {
  let total = 0;
  const traverse = (node: string, volume: Volume) => {
    const wf = workflows[node];
    let vol = volume;
    for (const rule of wf.rules) {
      if (isConditionalRule(rule)) {
        const { inside, outside } = split(rule, vol);
        if (isDecision(rule.outcome)) {
          if (isAccepted(rule.outcome)) {
            total += calcVol(inside);
          }
        } else {
          // not a decision
          traverse(rule.outcome, inside);
        }
        vol = outside;
      } else {
        // unconditional rule
        if (isDecision(rule.outcome)) {
          if (isAccepted(rule.outcome)) {
            // calc and add
            total += calcVol(vol);
          }
        } else {
          traverse(rule.outcome, vol);
        }
      }
    }
  };

  traverse("in", {
    min: [1, 1, 1, 1],
    max: [4000, 4000, 4000, 4000],
  });
  return total;
}

const part1 = (rawInput: string) => {
  const input = parse(rawInput);

  const acceptedParts = input.parts.filter(outcome(input.workflows));

  return score(acceptedParts);
};

const part2 = (rawInput: string) => {
  const { workflows } = parse(rawInput);

  const vols = calcHypercubeVolumes(workflows);
  return vols;
};

const input = `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 19114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 167409079868000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
