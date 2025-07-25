import {
  injectMainMethod,
  simplifyJavaError,
  extractClassName,
  extractMethodName,
  formatJavaArgs,
} from "@/helpers/javaHelpers";

describe("injectMainMethod", () => {
  it("injects main method before last closing brace", () => {
    const code = `
      public class Test {
        public void foo() {}
      }
    `;
    const className = "Test";
    const methodName = "foo";
    const testInput = "5";

    const result = injectMainMethod(code, testInput, className, methodName);

    expect(result).toContain(`public static void main(String[] args)`);
    expect(result).toContain(`Test obj = new Test();`);
    expect(result).toContain(`obj.foo(5)`);
    expect(result.trim().endsWith("}")).toBe(true);
  });

  it("adds main method with closing brace if no closing brace found", () => {
    const code = "public class Test {";
    const className = "Test";
    const methodName = "foo";
    const testInput = "5";

    const result = injectMainMethod(code, testInput, className, methodName);

    expect(result).toContain(`public static void main(String[] args)`);
    expect(result).toContain(`Test obj = new Test();`);
    expect(result).toContain(`obj.foo(5)`);
    expect(result.trim().endsWith("}")).toBe(true);
  });
});

describe("simplifyJavaError", () => {
  it("trims whitespace from error output", () => {
    const error =
      '  Exception in thread "main" java.lang.NullPointerException  ';
    expect(simplifyJavaError(error)).toBe(
      'Exception in thread "main" java.lang.NullPointerException'
    );
  });
});

describe("extractClassName", () => {
  it("extracts class name", () => {
    const code = "public class MyClass { }";
    expect(extractClassName(code)).toBe("MyClass");
  });

  it("returns null if no class found", () => {
    const code = "class MyClass { }";
    expect(extractClassName(code)).toBeNull();
  });
});

describe("extractMethodName", () => {
  it("extracts method name", () => {
    const code = "public int calculateSum(int a, int b) { return a + b; }";
    expect(extractMethodName(code)).toBe("calculateSum");
  });

  it("returns null if no method found", () => {
    const code = "int calculateSum(int a, int b) { return a + b; }";
    expect(extractMethodName(code)).toBeNull();
  });
});

describe("formatJavaArgs", () => {
  it("formats string argument", () => {
    expect(formatJavaArgs("hello")).toBe('"hello"');
  });

  it("formats boolean argument", () => {
    expect(formatJavaArgs(true)).toBe("true");
  });

  it("formats number argument", () => {
    expect(formatJavaArgs(42)).toBe("42");
  });

  it("formats array of strings", () => {
    expect(formatJavaArgs(["a", "b"])).toBe(`"a", "b"`);
  });

  it("formats nested array as int[]", () => {
    expect(formatJavaArgs([[1, 2, 3]])).toBe("new int[]{1, 2, 3}");
  });

  it("formats array of mixed types", () => {
    expect(formatJavaArgs([1, "two", true])).toBe(`1, "two", true`);
  });

  it("formats other types as string", () => {
    expect(formatJavaArgs({})).toBe("[object Object]");
  });
});
