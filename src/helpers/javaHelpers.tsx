export function injectMainMethod(
  code: string,
  testInput: string,
  className: string,
  methodName: string
): string {
  const mainMethod = `
    public static void main(String[] args) {
      ${className} obj = new ${className}();
      Object result = obj.${methodName}(${testInput});
      printResult(result);
    }

    public static void printResult(Object result) {
      if (result == null) {
        System.out.println("null");
      } else if (result.getClass().isArray()) {
        int length = java.lang.reflect.Array.getLength(result);
        System.out.print("[");
        for (int i = 0; i < length; i++) {
          Object elem = java.lang.reflect.Array.get(result, i);
          System.out.print(elem);
          if (i < length - 1) System.out.print(",");
        }
        System.out.println("]");
      } else {
        System.out.println(result.toString());
      }
    }
  `;

  const lastBraceIndex = code.lastIndexOf("}");
  if (lastBraceIndex === -1) {
    return code + mainMethod + "\n}";
  }
  return code.slice(0, lastBraceIndex) + mainMethod + "\n}";
}

export function simplifyJavaError(output: string): string {
  return output.trim();
}

export function extractClassName(code: string): string | null {
  const match = code.match(/public\s+class\s+(\w+)/);
  return match ? match[1] : null;
}

export function extractMethodName(code: string): string | null {
  const match = code.match(/public\s+[\w\[\]<>,\s]+\s+(\w+)\s*\(/);
  return match ? match[1] : null;
}

export function formatJavaArgs(args: unknown[]): string {
  return args
    .map((arg) => {
      if (Array.isArray(arg)) {
        if (arg.every((el) => typeof el === "number")) {
          return `new int[]{${arg.join(", ")}}`;
        }
        if (arg.every((el) => typeof el === "string")) {
          return `new String[]{${arg.map((el) => `"${el}"`).join(", ")}}`;
        }
        if (arg.every((el) => typeof el === "boolean")) {
          return `new boolean[]{${arg.map((el) => el.toString()).join(", ")}}`;
        }

        return `new Object[]{${arg
          .map((el) =>
            typeof el === "string"
              ? `"${el}"`
              : typeof el === "boolean"
              ? el.toString()
              : String(el)
          )
          .join(", ")}}`;
      }

      if (typeof arg === "string") return `"${arg}"`;
      if (typeof arg === "boolean") return arg.toString();
      if (typeof arg === "number") return String(arg);

      return String(arg);
    })
    .join(", ");
}

export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (
    typeof a === "object" &&
    a !== null &&
    typeof b === "object" &&
    b !== null
  ) {
    const keysA = Object.keys(a as object);
    const keysB = Object.keys(b as object);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      const valA = (a as Record<string, unknown>)[key];
      const valB = (b as Record<string, unknown>)[key];
      if (!deepEqual(valA, valB)) return false;
    }
    return true;
  }

  return false;
}
