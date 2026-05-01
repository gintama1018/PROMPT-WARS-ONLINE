import { describe, expect, it } from "vitest";
import { sanitizeUserContent } from "./sanitize";

describe("sanitizeUserContent", () => {
  it("removes html tags and scripts", () => {
    const input = "<b>Hello</b><script>alert(1)</script> world";
    const output = sanitizeUserContent(input);

    expect(output).toBe("Hello world");
  });

  it("trims surrounding whitespace", () => {
    const input = "   clean text   ";
    const output = sanitizeUserContent(input);

    expect(output).toBe("clean text");
  });
});
