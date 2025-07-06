import { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import type { TestEditProps } from "@/types/types";
import AutoGrowTextarea from "../AutoGrowTextarea/AutoGrowTextarea";
import css from "./taskForm.module.css";

export default function TestEdit({
  test_case,
  index,
  onChange,
  onRemove,
}: TestEditProps) {
  const [inputValue, setInputValue] = useState<string>(
    JSON.stringify(test_case.input)
  );
  const [expectedValue, setExpectedValue] = useState<string>(
    JSON.stringify(test_case.expected)
  );

  useEffect(() => {
    setInputValue(JSON.stringify(test_case.input));
  }, [test_case.input]);

  useEffect(() => {
    setExpectedValue(JSON.stringify(test_case.expected));
  }, [test_case.expected]);

  const handleInputBlur = () => {
    let parsedInput: unknown;
    try {
      parsedInput = JSON.parse(inputValue);
    } catch {
      parsedInput = inputValue;
    }

    const normalizedInput = Array.isArray(parsedInput)
      ? parsedInput
      : [parsedInput];

    onChange(index, { ...test_case, input: normalizedInput });
  };

  const handleExpectedBlur = () => {
    let parsedExpected: unknown;
    try {
      parsedExpected = JSON.parse(expectedValue);
    } catch {
      parsedExpected = expectedValue;
    }

    onChange(index, { ...test_case, expected: parsedExpected });
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
        className={css.deleteTestBtn}
        onClick={() => onRemove(index, test_case.id)}
      >
        <FiTrash2 />
      </button>
    </div>
  );
}
