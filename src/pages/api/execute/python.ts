import type { NextApiRequest, NextApiResponse } from "next";
import { CodeTaskTest } from "@/types/tasksTypes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { code, tests }: { code: string; tests: CodeTaskTest[] } = req.body;

  const cleanedCode = stripNonExecutableComments(code).trim();

  const results: string[] = [];

  for (const { input, expected } of tests) {
    const testInput = Array.isArray(input) ? input.join(", ") : input;

    const program = `${code}\nprint(${extractFunctionName(
      cleanedCode
    )}(${testInput}))`;
    const content = program.trim();
    try {
      const runResult = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: "python3",
          version: "3.10.0",
          files: [
            {
              name: "main.py",
              content: content,
            },
          ],
        }),
      });

      const json = await runResult.json();

      if (!runResult.ok) {
        if (json.message && json.message.includes("Requests limited")) {
          return res.status(429).json({
            error: "Too Many Requests",
          });
        }
        console.error("Execution API error:", json);
        throw new Error(
          `Execution API error: ${json.message || "Unknown error"}`
        );
      }

      if (!json.run || typeof json.run.output !== "string") {
        throw new Error("Invalid response format: missing run.output");
      }

      const output = json.run.output.trim();
      const simplifiedOutput = simplifyPythonError(output);

      const passed = simplifiedOutput === String(expected);
      results.push(
        passed
          ? "passed"
          : `not passed: expected ${JSON.stringify(
              expected
            )}, got ${JSON.stringify(simplifiedOutput)}`
      );
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error || "Server error" });
    }
    // delay
    // await new Promise((resolve) => setTimeout(resolve, 250));
  }

  res.status(200).json({ results });
}

function extractFunctionName(code: string): string {
  const match = code.match(/def\s+([a-zA-Z0-9_]+)\s*\(/);
  return match?.[1] || "unknown_function";
}

function simplifyPythonError(output: string): string {
  const lines = output.split("\n");
  const lastLine = lines[lines.length - 1];
  return lastLine || output;
}

function stripNonExecutableComments(code: string): string {
  return code
    .split("\n")
    .filter((line) => {
      const trimmedStart = line.trimStart();
      const trimmedFull = line.trim();
      return (
        !trimmedStart.startsWith("#") && !(trimmedFull === "" && line !== "")
      );
    })
    .join("\n");
}
