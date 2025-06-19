import { FiTrash2 } from "react-icons/fi";
import { TestEditProps } from "@/types/types";
import { useEffect, useState } from "react";
import AutoGrowTextarea from "./AutoGrowTextarea";

import css from "./taskform.module.css";

export default function TestEdit({
  test,
  index,
  onChange,
  onRemove,
}: TestEditProps) {
  const [inputValue, setInputValue] = useState(JSON.stringify(test.input));
  const [expectedValue, setExpectedValue] = useState(
    JSON.stringify(test.expected)
  );

  useEffect(() => {
    setInputValue(JSON.stringify(test.input));
  }, [test.input]);

  useEffect(() => {
    setExpectedValue(JSON.stringify(test.expected));
  }, [test.expected]);

  const handleInputBlur = () => {
    let parsedInput: unknown;
    try {
      parsedInput = JSON.parse(inputValue);
    } catch {
      parsedInput = inputValue;
    }
    if (!Array.isArray(parsedInput)) {
      parsedInput = [parsedInput];
    }
    onChange(index, { ...test, input: parsedInput as unknown[] });
  };

  const handleExpectedBlur = () => {
    let parsedExpected: unknown;
    try {
      parsedExpected = JSON.parse(expectedValue);
    } catch {
      parsedExpected = expectedValue;
    }
    onChange(index, { ...test, expected: parsedExpected });
  };

  return (
    <div className={css.testWrapper}>
      <div className={css.testInputs}>
        <AutoGrowTextarea
          placeholder="Input"
          value={inputValue}
          name={`test-${index}-input`}
          aria-label={`Test ${index + 1} Input (JSON array)`}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleInputBlur}
          rows={1}
        />
        <AutoGrowTextarea
          placeholder="Expected"
          value={expectedValue}
          name={`test-${index}-expected`}
          aria-label={`Test ${index + 1} Expected`}
          onChange={(e) => setExpectedValue(e.target.value)}
          onBlur={handleExpectedBlur}
          rows={1}
        />
      </div>

      <button
        type="button"
        onClick={() => onRemove(index, test.id)}
        className={css.deleteTestBtn}
      >
        <FiTrash2 />
      </button>
    </div>
  );
}
