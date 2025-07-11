import {
  extractFunctionName,
  formatPythonArgs,
  simplifyPythonError,
  stripNonExecutableComments,
} from "@/helpers/pythonHelpers";
import type { CodeTaskTest } from "@/types/tasksTypes";

export async function runPythonCode(
  code: string,
  tests: CodeTaskTest[]
): Promise<string[]> {
  try {
    const cleanedCode = stripNonExecutableComments(code).trim();
    const results: string[] = [];

    for (const { input, expected } of tests) {
      const testInput = formatPythonArgs(input);

      const program = `${code}\nprint(${extractFunctionName(
        cleanedCode
      )}(${testInput}))`;

      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: "python3",
          version: "3.10.0",
          files: [{ name: "main.py", content: program.trim() }],
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        if (json.message && json.message.includes("Requests limited")) {
          return ["Too many requests"];
        }
        throw new Error(json.message || "Unknown execution error");
      }

      if (!json.run || typeof json.run.output !== "string") {
        throw new Error("Invalid response from execution API");
      }

      const rawOutput = json.run.output.trim();
      const simplifiedOutput = simplifyPythonError(rawOutput);

      let parsedOutput: unknown;

      try {
        const normalizedOutput =
          simplifiedOutput === "True"
            ? true
            : simplifiedOutput === "False"
            ? false
            : simplifiedOutput;
        parsedOutput =
          typeof normalizedOutput === "string"
            ? JSON.parse(normalizedOutput)
            : normalizedOutput;
      } catch {
        parsedOutput = simplifiedOutput;
      }

      const passed = Object.is(parsedOutput, expected);
      results.push(
        passed
          ? "passed"
          : `not passed: expected ${JSON.stringify(
              expected
            )}, got ${JSON.stringify(simplifiedOutput)}`
      );
    }

    return results;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return [errorMessage];
  }
}
