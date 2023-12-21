import run from "aocrunner";

import { ParsedModule, parse } from "./parser.js";

const enum ImpulseType {
  High = "H",
  Low = "L",
}

type Impulse = {
  from: string;
  type: ImpulseType;
  to: string;
};

interface Module {
  receive(impulse: Impulse): Impulse[];
  readonly state: string;
}

class BroadcastModule implements Module {
  constructor(private readonly name: string, private targets: string[]) {}

  receive(impulse: Impulse): Impulse[] {
    return this.targets.map((to) => ({
      from: this.name,
      type: impulse.type,
      to,
    }));
  }

  get state() {
    return "";
  }
}

class FlipFlopModule implements Module {
  private on = false;
  constructor(private readonly name: string, private targets: string[]) {}

  receive({ type }: Impulse): Impulse[] {
    if (type === ImpulseType.High) {
      return [];
    } else {
      this.on = !this.on;
      const sendType = this.on ? ImpulseType.High : ImpulseType.Low;
      return this.targets.map((to) => ({
        from: this.name,
        type: sendType,
        to,
      }));
    }
  }

  get state() {
    return this.on ? "H" : "L";
  }
}

class ConjunctionModule implements Module {
  private lastImpulse: Record<string, ImpulseType> = {};
  constructor(
    private readonly name: string,
    private targets: string[],
    sources: string[],
  ) {
    for (const source of sources) {
      this.lastImpulse[source] = ImpulseType.Low;
    }
  }
  receive({ from, type }: Impulse): Impulse[] {
    this.lastImpulse[from] = type;
    const allHigh = Object.values(this.lastImpulse).every(
      (t) => t === ImpulseType.High,
    );
    const sendType = allHigh ? ImpulseType.Low : ImpulseType.High;
    return this.targets.map((to) => ({
      from: this.name,
      type: sendType,
      to,
    }));
  }

  get state() {
    return Object.entries(this.lastImpulse)
      .map(([, i]) => `${i}`)
      .join("");
  }
}

type Modules = Record<string, Module>;

function moduleFactory(parsed: ParsedModule[]) {
  const sources: Record<string, string[]> = {};
  const modules: Record<string, Module> = {};
  for (const pm of parsed) {
    for (const target of pm.targets) {
      if (!sources[target]) {
        sources[target] = [];
      }
      sources[target].push(pm.name);
    }
  }

  for (const pm of parsed) {
    if (pm.type === "broadcaster") {
      modules[pm.name] = new BroadcastModule(pm.name, pm.targets);
    }
    if (pm.type === "%") {
      modules[pm.name] = new FlipFlopModule(pm.name, pm.targets);
    }
    if (pm.type === "&") {
      modules[pm.name] = new ConjunctionModule(
        pm.name,
        pm.targets,
        sources[pm.name],
      );
    }
  }
  return modules;
}

function singleSimulator(
  modules: Modules,
  testImpulse?: (impulse: Impulse) => void,
) {
  const impulseQueue: Impulse[] = [];
  const processedImpulses: Impulse[] = [];

  impulseQueue.push({
    from: "button",
    type: ImpulseType.Low,
    to: "broadcaster",
  });

  do {
    const impulse = impulseQueue.shift()!;
    testImpulse?.(impulse);
    processedImpulses.push(impulse);
    const module = modules[impulse.to];
    if (module) {
      impulseQueue.push(...module.receive(impulse));
    }
  } while (impulseQueue.length);

  return processedImpulses;
}

function score(impulses: Impulse[]) {
  const low = impulses.filter((i) => i.type === ImpulseType.High).length;
  let high = impulses.filter((i) => i.type === ImpulseType.Low).length;
  return high * low;
}

function state(modules: Modules) {
  return Object.values(modules)
    .map((m) => m.state)
    .join("");
}

const part1 = (rawInput: string) => {
  const input = parse(rawInput);
  const modules = moduleFactory(input);

  const impulses: Impulse[] = [];
  for (let i = 0; i < 1000; ++i) {
    impulses.push(...singleSimulator(modules));
  }

  return score(impulses);
};

const part2 = (rawInput: string) => {
  const input = parse(rawInput);

  const modules = moduleFactory(input);

  let buttonPresses = 0;
  let rx = false;
  do {
    ++buttonPresses;
    singleSimulator(modules, (impulse) => {
      if (impulse.to === "rx" && impulse.type === ImpulseType.Low) {
        rx = true;
      }
    });
    if (buttonPresses % 100000 === 0) {
      console.log(state(modules).length);
    }
  } while (!rx);

  return buttonPresses;
};

run({
  part1: {
    tests: [
      {
        input: `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`,
        expected: 32000000,
      },
      {
        input: `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`,
        expected: 11687500,
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
