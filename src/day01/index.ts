import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let total = 0;
  for (const line of input) {
    let startIdx = 0;
    let endIdx = line.length - 1;
    while (isNaN(Number(line[startIdx]))) {
      startIdx++;
    }
    while (isNaN(Number(line[endIdx]))) {
      endIdx--;
    }
    total += Number(line[startIdx]) * 10 + Number(line[endIdx]);
  }

  return total;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const map = {
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  };
  let total = 0;
  for (const line of input) {
    // find first
    let firstNumber: number;
    let firstIndex = 0;
    while (true) {
      const currLine = line.slice(firstIndex);
      let found = false;
      for (const [key, value] of Object.entries(map)) {
        if (currLine.startsWith(key)) {
          firstNumber = value;
          found = true;
        }
      }

      if (found) {
        break;
      } else {
        firstIndex++;
      }
    }

    let secondNumber: number;
    let secondIndex = 0;

    while (true) {
      const currLine = line.split("").reverse().join("").slice(secondIndex);
      let found = false;
      for (const [key, value] of Object.entries(map)) {
        const reversedKey = key.split("").reverse().join("");
        if (currLine.startsWith(reversedKey)) {
          secondNumber = value;
          found = true;
        }
      }

      if (found) {
        break;
      } else {
        secondIndex++;
      }
    }

    total += firstNumber! * 10 + secondNumber!;
  }

  return total;
};

run({
  part1: {
    tests: [
      {
        input: `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
