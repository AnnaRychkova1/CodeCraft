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
      return (
        !trimmedStart.startsWith("#") && !(trimmedFull === "" && line !== "")
      );
    })
    .join("\n");
}

export function formatPythonArgs(input: unknown): string {
  if (Array.isArray(input)) {
    if (input.length === 1 && Array.isArray(input[0])) {
      return JSON.stringify(input[0]);
    }

    return input
      .map((el) =>
        typeof el === "string"
          ? JSON.stringify(el)
          : typeof el === "boolean"
          ? el.toString()
          : String(el)
      )
      .join(", ");
  }

  if (typeof input === "string") return JSON.stringify(input);
  if (typeof input === "boolean") return input.toString();
  return String(input);
}
