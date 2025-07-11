export function injectMainMethod(
  code: string,
  testInput: string,
  className: string,
  methodName: string
): string {
  const mainMethod = `
    public static void main(String[] args) {
       ${className} obj = new ${className}();
        System.out.println(obj.${methodName}(${testInput}));
    }
`;
  const lastBraceIndex = code.lastIndexOf("}");
  if (lastBraceIndex === -1) {
    return code + mainMethod + "\n}";
  }
  const newCode = code.slice(0, lastBraceIndex) + mainMethod + "\n}";
  return newCode;
}

export function simplifyJavaError(output: string): string {
  return output.trim();
}

export function extractClassName(code: string): string | null {
  const match = code.match(/public\s+class\s+(\w+)/);
  return match ? match[1] : null;
}

export function extractMethodName(code: string): string | null {
  const match = code.match(/public\s+\w+\s+(\w+)\s*\(/);
  return match ? match[1] : null;
}

export function formatJavaArgs(input: unknown): string {
  if (typeof input === "string") {
    return `"${input}"`;
  }

  if (typeof input === "boolean") {
    return input.toString();
  }

  if (typeof input === "number") {
    return String(input);
  }

  if (Array.isArray(input)) {
    if (input.length === 1 && Array.isArray(input[0])) {
      return "new int[]{" + input[0].join(", ") + "}";
    }

    return input
      .map((el) =>
        typeof el === "string"
          ? `"${el}"`
          : typeof el === "boolean"
          ? el.toString()
          : String(el)
      )
      .join(", ");
  }

  return String(input);
}
