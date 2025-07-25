import { runJavaScriptCode } from "@/utils/runJavaScriptCode";
import type { CodeTaskTest } from "@/types/tasksTypes";

describe("runJavaScriptCode", () => {
  const correctCode = `
    function add(a, b) {
      return a + b;
    }
  `;

  const tests: CodeTaskTest[] = [
    { input: [1, 2], expected: 3 },
    { input: [5, 7], expected: 12 },
  ];

  it("returns 'passed' for tests that match expected output", () => {
    const results = runJavaScriptCode(correctCode, tests);
    expect(results).toEqual(["passed", "passed"]);
  });

  it("returns 'not passed' when output does not match expected", () => {
    const code = `
      function add(a, b) {
        return a - b;
      }
    `;
    const results = runJavaScriptCode(code, tests);
    expect(results[0]).toMatch(/not passed/);
  });

  it("returns error if code does not return a function", () => {
    const code = `
      const a = 5;
    `;
    const results = runJavaScriptCode(code, tests);
    expect(results[0]).toBe("Your code did not return a function.");
  });

  it("returns error message if function throws during execution", () => {
    const code = `
      function add(a, b) {
        throw new Error("Test error");
      }
    `;
    const results = runJavaScriptCode(code, tests);
    expect(results[0]).toMatch(/error during execution: Test error/);
  });

  it("handles input that is not array", () => {
    const code = `
      function double(x) {
        return x * 2;
      }
    `;
    const singleInputTests: CodeTaskTest[] = [{ input: [4], expected: 8 }];
    const results = runJavaScriptCode(code, singleInputTests);
    expect(results[0]).toBe("passed");
  });

  it("returns error if syntax error in user code", () => {
    const code = `
      function badCode( {
        return 1;
      }
    `;
    const results = runJavaScriptCode(code, tests);
    expect(results[0]).toMatch(/error while evaluating JavaScript code/);
  });
});
