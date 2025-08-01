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
    // Format array as Python list, recursively
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
    // If input is an array of multiple arguments, map each one individually and join by commas
    return input.map((el) => formatPythonArg(el)).join(", ");
  }
  // If input is single argument (not an array), format it normally
  return formatPythonArg(input);
}
