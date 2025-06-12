import { CodeTaskTest } from "@/types/types";

export function runJavaCode(code: string, tests: CodeTaskTest[]): string[] {
  console.log(code);
  console.log(tests);
  return tests.map(() => "not passed: Java execution is not implemented yet.");
}
