import type { CodeTaskTest } from "../types/tasksTypes";

export function runJavaScriptCode(
  code: string,
  tests: CodeTaskTest[]
): string[] {
  function extractFunctionName(code: string): string | null {
    const match = code.match(/function\s+([a-zA-Z0-9_]+)/);
    return match?.[1] ?? null;
  }

  try {
    const functionName = extractFunctionName(code);
    if (!functionName) {
      return ["Your code did not return a function."];
    }
    const fullCode = `
      ${code}
      return ${extractFunctionName(code)};
    `;

    const getUserFunction = new Function(fullCode);
    const userFunc = getUserFunction();

    if (typeof userFunc !== "function") {
      return ["❌ Your code did not return a function."];
    }

    const results = tests.map(({ input, expected }) => {
      let result;
      try {
        result = Array.isArray(input) ? userFunc(...input) : userFunc(input);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        return `not passed: error during execution: ${errorMessage}`;
      }

      const passed = String(result) === String(expected);

      return passed
        ? "passed"
        : `not passed: expected ${JSON.stringify(
            expected
          )}, got ${JSON.stringify(result)}`;
    });

    return results;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return [
      `not passed: error while evaluating JavaScript code → ${errorMessage}`,
    ];
  }
}
