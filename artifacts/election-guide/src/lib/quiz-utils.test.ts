import { describe, expect, it } from "vitest";
import { shuffleArray } from "./quiz-utils";

describe("shuffleArray", () => {
  it("returns same elements as input", () => {
    const source = [1, 2, 3, 4, 5, 6];
    const result = shuffleArray(source);

    expect(result).toHaveLength(source.length);
    expect([...result].sort()).toEqual([...source].sort());
  });

  it("does not mutate original array", () => {
    const source = ["a", "b", "c"];
    const snapshot = [...source];

    shuffleArray(source);

    expect(source).toEqual(snapshot);
  });
});
