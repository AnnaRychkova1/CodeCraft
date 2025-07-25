import React from "react";
import { render, screen } from "@testing-library/react";
import { formatTextWithLineBreaks } from "@/helpers/formatTextHelpers";

describe("formatTextWithLineBreaks", () => {
  it("renders text with line breaks", () => {
    const text = "line1\nline2\nline3";

    const result = formatTextWithLineBreaks(text);
    render(<div>{result}</div>);

    const spans = screen.getAllByText(/line\d/);

    expect(spans.length).toBe(3);
    expect(spans[0].textContent).toBe("line1");
    expect(spans[1].textContent).toBe("line2");
    expect(spans[2].textContent).toBe("line3");
  });

  it("renders single line without breaking", () => {
    const text = "just one line";
    const result = formatTextWithLineBreaks(text);
    render(<div>{result}</div>);

    expect(screen.getByText("just one line")).toBeInTheDocument();
  });

  it("includes <br /> after each line", () => {
    const text = "a\nb";
    const { container } = render(<div>{formatTextWithLineBreaks(text)}</div>);

    const lineElements = screen.getAllByText(/a|b/);
    const brElements = container.querySelectorAll("br");

    expect(lineElements.length).toBe(2);
    expect(brElements.length).toBe(2);
  });
});
