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
