export function extractFunctionName(code: string): string {
  const match = code.match(/def\s+([a-zA-Z0-9_]+)\s*\(/);
  return match?.[1] || "unknown_function";
}

export function simplifyPythonError(output: string): string {
  const lines = output.split("\n");
  const lastLine = lines[lines.length - 1];
  return lastLine || output;
}

export function stripNonExecutableComments(code: string): string {
  return code
    .split("\n")
    .filter((line) => {
      const trimmedStart = line.trimStart();
      const trimmedFull = line.trim();
      return !trimmedStart.startsWith("#") && trimmedFull !== "";
    })
    .join("\n");
}

function formatPythonArg(input: unknown): string {
  if (Array.isArray(input)) {
    const formattedElements = input.map((el) => formatPythonArg(el));
    return `[${formattedElements.join(", ")}]`;
  }

  if (typeof input === "string") {
    return JSON.stringify(input);
  }

  if (typeof input === "boolean") {
    return input ? "True" : "False";
  }

  if (typeof input === "number") {
    return input.toString();
  }

  if (input === null || input === undefined) {
    return "None";
  }

  return JSON.stringify(input);
}

export function formatPythonArgs(input: unknown): string {
  if (Array.isArray(input)) {
    return input.map((el) => formatPythonArg(el)).join(", ");
  }
  return formatPythonArg(input);
}

export function deepEqual<T>(a: T, b: T): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
