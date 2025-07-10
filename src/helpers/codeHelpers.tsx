import { indentUnit } from "@codemirror/language";
import { CompletionContext } from "@codemirror/autocomplete";
export function normalizeCode(code: string): string {
  return code.replace(/\\n/g, "\n    ").replace(/\n/g, "\n");
}

export function getIndentExtensions(language: string) {
  return [
    indentUnit.of(language === "python" || language === "java" ? "    " : "  "),
  ];
}

const pythonKeywords = [
  "def",
  "return",
  "if",
  "else",
  "elif",
  "for",
  "while",
  "import",
  "from",
  "as",
  "pass",
  "break",
  "continue",
  "class",
  "with",
  "try",
  "except",
  "finally",
  "lambda",
  "print",
  "True",
  "False",
  "None",
];

export function pythonCompletion(context: CompletionContext) {
  const word = context.matchBefore(/\w*/);
  if (!word || word.from === word.to) return null;

  return {
    from: word.from,
    options: pythonKeywords.map((kw) => ({ label: kw, type: "keyword" })),
  };
}
