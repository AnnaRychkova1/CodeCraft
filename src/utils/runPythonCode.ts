import { CodeTaskTest } from "@/types/tasksTypes";

export function runPythonCode(code: string, tests: CodeTaskTest[]): string[] {
  console.log(code);
  console.log(tests);
  return tests.map(
    () => "not passed: Python execution is not implemented yet."
  );
}

// import { CodeTaskTest } from "@/types/types";
// import { loadPyodide } from "pyodide";
// import type { PyodideInterface } from "pyodide";

// let pyodide: PyodideInterface | null = null;

// export async function initializePyodide() {
//   if (!pyodide) {
//     pyodide = await loadPyodide();
//   }
// }

// export async function runPythonCode(
//   code: string,
//   tests: CodeTaskTest[]
// ): Promise<string> {
//   await initializePyodide();

//   if (!pyodide) {
//     throw new Error("Pyodide failed to initialize");
//   }

//   const results: string[] = [];

//   for (let i = 0; i < tests.length; i++) {
//     const { input, expected } = tests[i];

//     try {
//       const args = Array.isArray(input) ? input : [input];
//       const argStr = args.map((a) => JSON.stringify(a)).join(", ");
//       const wrappedCode = `
// def user_func(${args.map((_, i) => "arg" + i).join(", ")}):
// ${code
//   .split("\n")
//   .map((line) => "  " + line)
//   .join("\n")}

// result = user_func(${argStr})
// `;
//       await pyodide.runPythonAsync(wrappedCode);
//       const result = pyodide.globals.get("result");
//       const passed = JSON.stringify(result) === JSON.stringify(expected);

//       results.push(
//         passed
//           ? `✅ Test ${i + 1} passed`
//           : `❌ Test ${i + 1} failed: expected ${JSON.stringify(
//               expected
//             )}, got ${JSON.stringify(result)}`
//       );
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : String(err);
//       results.push(`❌ Test ${i + 1} error: ${errorMessage || err}`);
//     }
//   }

//   return results.join("\n");
// }
