export function formatTextWithLineBreaks(text: string) {
  const fixedText = text.replace(/\\n/g, "\n");

  return fixedText.split("\n").map((line, index) => (
    <span key={index}>
      {line}
      <br />
    </span>
  ));
}
