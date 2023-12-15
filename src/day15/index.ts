import run from "aocrunner";

const parse = (rawInput: string) => rawInput.split(",");

const hash = (input: string) => {
  let hash = 0;
  for (const char of input) {
    const ascii = char.charCodeAt(0);
    hash += ascii;
    hash *= 17;
    hash %= 256;
  }
  return hash;
};

interface Lens {
  label: string;
  strength: number;
}

class Boxes {
  private lenses: Lens[][] = [];

  runCommand(cmd: string) {
    const ensureBox = (box: number) => {
      if (!this.lenses[box]) this.lenses[box] = [];
    };

    if (cmd.includes("=")) {
      const [label, strength] = cmd.split("=");
      const lens: Lens = { label, strength: +strength };
      const box = hash(label);
      ensureBox(box);
      if (this.lenses[box].find((l) => l.label === lens.label)) {
        this.lenses[box] = this.lenses[box].map((l) =>
          l.label === lens.label ? lens : l,
        );
      } else {
        this.lenses[box].push(lens);
      }
    } else {
      const [label] = cmd.split("-");
      const box = hash(label);
      ensureBox(box);
      this.lenses[box] = this.lenses[box].filter((l) => l.label !== label);
    }
  }

  score() {
    let total = 0;
    for (let box = 0; box < this.lenses.length; ++box) {
      if (!this.lenses[box]) {
        continue;
      }
      for (let lens = 0; lens < this.lenses[box].length; ++lens) {
        const score = (box + 1) * (lens + 1) * this.lenses[box][lens].strength;
        total += score;
      }
    }
    return total;
  }
}

const sum = (n: number[]) => n.reduce((prev, curr) => prev + curr, 0);

const part1 = (rawInput: string) => {
  const input = parse(rawInput);

  return sum(input.map(hash));
};

const part2 = (rawInput: string) => {
  const input = parse(rawInput);

  const boxes = new Boxes();

  input.forEach((cmd) => boxes.runCommand(cmd));

  return boxes.score();
};

run({
  part1: {
    tests: [
      {
        input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
        expected: 1320,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
        expected: 145,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
