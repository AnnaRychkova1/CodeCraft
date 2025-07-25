import { normalizeCode, pythonCompletion } from "@/helpers/codeHelpers";
import { CompletionContext } from "@codemirror/autocomplete";

describe("normalizeCode", () => {
  it("replaces \\n[4] with newline and 4 spaces", () => {
    const input = "def func():\\n[4]return 5";
    const output = normalizeCode(input);
    expect(output).toBe("def func():\n    return 5");
  });

  it("replaces \\n with newline", () => {
    const input = "print(1)\\nprint(2)";
    const output = normalizeCode(input);
    expect(output).toBe("print(1)\nprint(2)");
  });

  it("leaves plain text unchanged", () => {
    const input = "x = 1 + 2";
    expect(normalizeCode(input)).toBe("x = 1 + 2");
  });

  it("replaces multiple \\n[8] sequences", () => {
    const input = "def test():\\n[8]print(1)\\n[8]return";
    const output = normalizeCode(input);
    expect(output).toBe("def test():\n        print(1)\n        return");
  });
});

describe("pythonCompletion", () => {
  const fakeState = {
    doc: { lineAt: () => ({ text: "" }) },
    selection: { main: { from: 0 } },
  };

  const makeContext = (textBefore: string): CompletionContext =>
    ({
      state: fakeState as unknown,
      pos: textBefore.length,
      explicit: true,
      matchBefore: (re: RegExp) => {
        const match = textBefore.match(re);
        return match
          ? {
              from: textBefore.length - match[0].length,
              to: textBefore.length,
              text: match[0],
            }
          : null;
      },
    } as unknown as CompletionContext);

  it("returns completions for partial word", () => {
    const context = makeContext("ret");
    const result = pythonCompletion(context);

    expect(result).not.toBeNull();
    expect(result?.options).toEqual(
      expect.arrayContaining([{ label: "return", type: "keyword" }])
    );
  });

  it("returns null if no word is matched", () => {
    const context = makeContext(" ");
    const result = pythonCompletion(context);

    expect(result).toBeNull();
  });

  it("returns all keywords if cursor is on a word", () => {
    const context = makeContext("pri");
    const result = pythonCompletion(context);

    expect(result?.options.length).toBeGreaterThan(0);
    expect(result?.options.map((o) => o.label)).toContain("print");
  });
});
