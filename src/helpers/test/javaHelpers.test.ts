import {
  injectMainMethod,
  simplifyJavaError,
  extractClassName,
  extractMethodName,
  formatJavaArgs,
} from "@/helpers/javaHelpers";

describe("injectMainMethod", () => {
  it("inserts main method before last brace", () => {
    const code = `public class Test { public void foo() {} }`;
    const result = injectMainMethod(code, "42", "Test", "foo");

    expect(result).toContain("public static void main(String[] args)");
    expect(result).toContain("Test obj = new Test();");
    expect(result).toContain("obj.foo(42)");
    expect(result.trim().endsWith("}")).toBe(true);
  });

  it("appends main method and closing brace if missing one", () => {
    const code = "public class Test {";
    const result = injectMainMethod(code, "42", "Test", "foo");

    expect(result).toContain("public static void main(String[] args)");
    expect(result.trim().endsWith("}")).toBe(true);
  });
});

describe("simplifyJavaError", () => {
  it("removes surrounding whitespace", () => {
    const err = "   Exception: Something went wrong   ";
    expect(simplifyJavaError(err)).toBe("Exception: Something went wrong");
  });
});

describe("extractClassName", () => {
  it("finds public class name", () => {
    expect(extractClassName("public class Foo {}")).toBe("Foo");
  });

  it("returns null if public modifier is missing", () => {
    expect(extractClassName("class Foo {}")).toBeNull();
  });
});

describe("extractMethodName", () => {
  it("extracts simple method name", () => {
    expect(
      extractMethodName("public int sum(int a, int b) { return a + b; }")
    ).toBe("sum");
  });

  it("extracts method with generics", () => {
    expect(
      extractMethodName("public List<String> process(List<String> input) {}")
    ).toBe("process");
  });

  it("returns null when no public method exists", () => {
    expect(extractMethodName("int sum(int a, int b) {}")).toBeNull();
  });
});

describe("formatJavaArgs", () => {
  it("formats string", () => {
    expect(formatJavaArgs(["hello"])).toBe('"hello"');
  });

  it("formats boolean", () => {
    expect(formatJavaArgs([true])).toBe("true");
  });

  it("formats number", () => {
    expect(formatJavaArgs([123])).toBe("123");
  });

  it("formats int[]", () => {
    expect(formatJavaArgs([[1, 2, 3]])).toBe("new int[]{1, 2, 3}");
  });

  it("formats String[]", () => {
    expect(formatJavaArgs([["a", "b"]])).toBe('new String[]{"a", "b"}');
  });

  it("formats boolean[]", () => {
    expect(formatJavaArgs([[true, false]])).toBe("new boolean[]{true, false}");
  });

  it("formats mixed Object[]", () => {
    expect(formatJavaArgs([[1, "two", true]])).toBe(
      'new Object[]{1, "two", true}'
    );
  });

  it("formats multiple args", () => {
    expect(formatJavaArgs([1, "hi", true])).toBe('1, "hi", true');
  });

  it("handles non-array object", () => {
    expect(formatJavaArgs([{}])).toBe("[object Object]");
  });
});
