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

export function range(min: number, max: number) {
  if (min >= max) {
    throw new Error("Min must be less than max.");
  }

  return Array.from(new Array(max - min), (x, i) => i + min);
}

export function shuffle<T>(array: readonly T[]) {
  const outArray = [...array];
  for (let i = outArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = outArray[i];
    outArray[i] = outArray[j];
    outArray[j] = temp;
  }
  return outArray;
}
