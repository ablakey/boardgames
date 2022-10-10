export function assert(condition: any): asserts condition {
  if (!condition) {
    throw new Error("Assertion Error");
  }
}

export function pickRandom<T>(items: T[]) {
  const x = Math.floor(Math.random() * items.length);
  return items[x];
}
