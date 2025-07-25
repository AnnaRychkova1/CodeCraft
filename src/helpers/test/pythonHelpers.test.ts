import {
  extractFunctionName,
  simplifyPythonError,
  stripNonExecutableComments,
  formatPythonArgs,
} from "@/helpers/pythonHelpers";

describe("extractFunctionName", () => {
  it("extracts function name correctly", () => {
    const code = "def my_function(x):\n  return x";
    expect(extractFunctionName(code)).toBe("my_function");
  });

  it("returns 'unknown_function' if no function found", () => {
    const code = "print('Hello')";
    expect(extractFunctionName(code)).toBe("unknown_function");
  });
});

describe("simplifyPythonError", () => {
  it("returns last line of traceback", () => {
    const error =
      'Traceback (most recent call last):\n  File "<stdin>", line 1\nZeroDivisionError: division by zero';
    expect(simplifyPythonError(error)).toBe(
      "ZeroDivisionError: division by zero"
    );
  });

  it("returns full string if single-line error", () => {
    const error = "NameError: name 'x' is not defined";
    expect(simplifyPythonError(error)).toBe(error);
  });
});

describe("stripNonExecutableComments", () => {
  it("removes lines with only comments", () => {
    const code = "# comment line\nx = 5\n# another comment";
    expect(stripNonExecutableComments(code)).toBe("x = 5");
  });

  it("preserves executable lines with inline comments", () => {
    const code = "x = 5  # set x";
    expect(stripNonExecutableComments(code)).toBe("x = 5  # set x");
  });

  it("removes empty lines but keeps indented blocks", () => {
    const code = "def func():\n\n  x = 5\n\n  return x";
    expect(stripNonExecutableComments(code)).toBe(
      "def func():\n  x = 5\n  return x"
    );
  });
});

describe("formatPythonArgs", () => {
  it("formats string argument correctly", () => {
    expect(formatPythonArgs("hello")).toBe('"hello"');
  });

  it("formats boolean correctly", () => {
    expect(formatPythonArgs(true)).toBe("true");
  });

  it("formats array of numbers", () => {
    expect(formatPythonArgs([1, 2, 3])).toBe("1, 2, 3");
  });

  it("formats array of strings", () => {
    expect(formatPythonArgs(["a", "b"])).toBe('"a", "b"');
  });

  it("formats nested single array", () => {
    expect(formatPythonArgs([[1, 2]])).toBe("[1,2]");
  });

  it("formats number directly", () => {
    expect(formatPythonArgs(42)).toBe("42");
  });
});
