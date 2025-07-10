import { CodeTaskTest } from "@/types/tasksTypes";

export async function runPythonCode(
  code: string,
  tests: CodeTaskTest[]
): Promise<string[]> {
  try {
    const response = await fetch("/api/execute/python", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, tests }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return ["Too many requests"];
      }

      throw new Error(`Server error: ${response.statusText}`);
    }

    const { results } = await response.json();
    return results;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return [errorMessage];
  }
}
