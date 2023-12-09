export const enum IntersectionType {
  None,
  Complete,
  Front,
  Back,
}

export class Mapping {
  constructor(
    private dest: number,
    private source: number,
    private length: number
  ) {}

  applies(input: number): boolean {
    return this.source <= input && input <= this.source + this.length;
  }

  map(input: number): number {
    const delta = input - this.source;
    return this.dest + delta;
  }

  frontMap(input: number, length: number) {
    return {
      unMappedInput: input,
      unMappedLength: this.source - input,
      mappedInput: this.source,
      mappedLength: length - (this.source - input),
    };
  }

  backMap(input: number, length: number) {
    return {
      unMappedInput: this.source + this.length,
      unMappedLength: length - (this.source + this.length - input),
      mappedInput: input,
      mappedLength: this.source + this.length - input,
    };
  }

  testIntersection(input: number, length: number) {
    const start = input;
    const end = input + length;
    const sourceStart = this.source;
    const sourceEnd = this.source + this.length;

    if (end < sourceStart || sourceEnd < start) {
      return IntersectionType.None;
    }

    if (sourceStart <= start && end <= sourceEnd) {
      return IntersectionType.Complete;
    }

    if (start < sourceStart) {
      return IntersectionType.Front;
    }

    return IntersectionType.Back;
  }
}
