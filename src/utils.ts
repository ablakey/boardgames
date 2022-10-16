export type ValueOf<T> = T[keyof T];

export function assert(condition: any): asserts condition {
  if (!condition) {
    throw new Error("Assertion Error");
  }
}

export function pickRandom<T>(items: readonly T[]) {
  const x = Math.floor(Math.random() * items.length);
  return items[x];
}

export function randInt(min = 0, max = Number.POSITIVE_INFINITY, oddOnly = false): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  const value = Math.floor(Math.random() * (max - min + 1)) + min;

  if (oddOnly && value % 2 === 0) {
    return randInt(min, max, oddOnly);
  }

  return value;
}
