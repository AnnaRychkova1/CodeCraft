import { runPythonCode } from "@/utils/runPythonCode";
import * as pythonHelpers from "@/helpers/pythonHelpers";
import type { CodeTaskTest } from "@/types/tasksTypes";

global.fetch = jest.fn();

describe("runPythonCode", () => {
  const mockCode = "def add(a, b): return a + b";

  const testCases: CodeTaskTest[] = [
    { input: [1, 2], expected: 3 },
    { input: [5, 5], expected: 10 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(pythonHelpers, "stripNonExecutableComments")
      .mockImplementation((code) => code);
    jest.spyOn(pythonHelpers, "extractFunctionName").mockReturnValue("add");
    jest
      .spyOn(pythonHelpers, "formatPythonArgs")
      .mockImplementation((args: unknown): string => {
        return typeof args === "string" ? args : JSON.stringify(args);
      });
    jest
      .spyOn(pythonHelpers, "simplifyPythonError")
      .mockImplementation((output) => output.trim());
  });

  it("returns 'passed' when output matches expected", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        run: { output: "3\n" },
      }),
    });

    const results = await runPythonCode(mockCode, [testCases[0]]);
    expect(results).toEqual(["passed"]);
  });

  it("returns 'not passed' if output does not match expected", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        run: { output: "4\n" },
      }),
    });

    const results = await runPythonCode(mockCode, [testCases[0]]);
    expect(results[0]).toMatch(/not passed/);
  });

  it("returns error if function name cannot be extracted", async () => {
    jest.spyOn(pythonHelpers, "extractFunctionName").mockReturnValue("");
    const results = await runPythonCode(mockCode, testCases);
    expect(results[0]).toMatch(/Function name could not be extracted/);
  });

  it("returns error message on failed fetch with error message", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Execution failed" }),
    });

    const results = await runPythonCode(mockCode, testCases);
    expect(results[0]).toBe("Execution failed");
  });

  it("returns 'Too many requests' if rate limited", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Requests limited" }),
    });

    const results = await runPythonCode(mockCode, testCases);
    expect(results[0]).toBe("Too many requests");
  });

  it("returns fallback error on invalid API structure", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    const results = await runPythonCode(mockCode, testCases);
    expect(results[0]).toBe("Invalid response from execution API");
  });
});
