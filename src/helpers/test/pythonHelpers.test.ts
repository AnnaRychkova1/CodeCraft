import {
  extractFunctionName,
  simplifyPythonError,
  stripNonExecutableComments,
  formatPythonArgs,
} from "@/helpers/pythonHelpers";

describe("extractFunctionName", () => {
  it("extracts function name from def line", () => {
    expect(extractFunctionName("def my_func(x):\n  return x")).toBe("my_func");
  });

  it("returns 'unknown_function' when no def found", () => {
    expect(extractFunctionName("print('hi')")).toBe("unknown_function");
  });
});

describe("simplifyPythonError", () => {
  it("returns last line of multiline traceback", () => {
    const err = `Traceback (most recent call last):\n  File "test.py", line 1\nZeroDivisionError: division by zero`;
    expect(simplifyPythonError(err)).toBe(
      "ZeroDivisionError: division by zero"
    );
  });

  it("returns input unchanged if single-line", () => {
    const err = "NameError: name 'x' is not defined";
    expect(simplifyPythonError(err)).toBe(err);
  });
});

describe("stripNonExecutableComments", () => {
  it("removes full-line comments", () => {
    const code = "# comment\nx = 5\n# another";
    expect(stripNonExecutableComments(code)).toBe("x = 5");
  });

  it("keeps inline comments", () => {
    expect(stripNonExecutableComments("x = 5  # value")).toBe("x = 5  # value");
  });

  it("removes empty lines", () => {
    const code = "def foo():\n\n  x = 1\n\n  return x";
    const expected = "def foo():\n  x = 1\n  return x";
    expect(stripNonExecutableComments(code)).toBe(expected);
  });
});

describe("formatPythonArgs", () => {
  it("formats string", () => {
    expect(formatPythonArgs("hello")).toBe('"hello"');
  });

  it("formats number", () => {
    expect(formatPythonArgs(42)).toBe("42");
  });

  it("formats boolean true", () => {
    expect(formatPythonArgs(true)).toBe("True");
  });

  it("formats boolean false", () => {
    expect(formatPythonArgs(false)).toBe("False");
  });

  it("formats null/undefined as None", () => {
    expect(formatPythonArgs(null)).toBe("None");
    expect(formatPythonArgs(undefined)).toBe("None");
  });

  it("formats array of numbers", () => {
    expect(formatPythonArgs([1, 2, 3])).toBe("1, 2, 3");
  });

  it("formats array of strings", () => {
    expect(formatPythonArgs(["a", "b"])).toBe('"a", "b"');
  });

  it("formats nested array", () => {
    expect(formatPythonArgs([[1, 2]])).toBe("[1, 2]");
  });

  it("formats mixed nested args", () => {
    expect(formatPythonArgs([1, "x", true])).toBe('1, "x", True');
  });
});
