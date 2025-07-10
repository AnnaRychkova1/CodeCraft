import { CodeTaskTest } from "@/types/tasksTypes";

// export function runJavaCode(code: string, tests: CodeTaskTest[]): string[] {
//   console.log(code);
//   console.log(tests);
//   return tests.map(() => "not passed: Java execution is not implemented yet.");
// }

export async function runJavaCode(
  code: string,
  tests: CodeTaskTest[]
): Promise<string[]> {
  try {
    const response = await fetch("/api/execute/java", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, tests }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const { results } = await response.json();
    return results;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return [`not passed: error while executing Java code → ${errorMessage}`];
  }
}
