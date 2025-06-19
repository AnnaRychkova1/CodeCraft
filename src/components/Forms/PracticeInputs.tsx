import { FiPlus } from "react-icons/fi";
import AutoGrowTextarea from "./AutoGrowTextarea";
import TestEdit from "./TestEdit";
import { PropsPracticeInputs } from "@/types/types";
import css from "./taskform.module.css";

export default function PracticeInputs({
  codeTask,
  onChange,
  onTestChange,
  onTestRemove,
}: PropsPracticeInputs) {
  return (
    <div className={css.typeContainer}>
      <h3 className={css.typeTitle}>Practice Code Task</h3>
      <AutoGrowTextarea
        value={codeTask.prompt}
        name="prompt"
        onChange={(e) => onChange("prompt", e.target.value)}
        placeholder="Prompt"
        rows={1}
      />
      <AutoGrowTextarea
        value={codeTask.starterCode}
        name="starterCode"
        onChange={(e) => onChange("starterCode", e.target.value)}
        placeholder="Starter Code"
        rows={2}
      />

      <div className={css.testsContainer}>
        <p className={css.testTitle}>Tests</p>
        {(codeTask.tests || []).map((test, index) => (
          <TestEdit
            key={index}
            test={test}
            index={index}
            onChange={onTestChange}
            onRemove={onTestRemove}
          />
        ))}

        <button
          type="button"
          onClick={() =>
            onChange("tests", [
              ...(codeTask.tests || []),
              { input: [], expected: "" },
            ])
          }
          className={css.addBtn}
        >
          <FiPlus /> Add Test
        </button>
      </div>
    </div>
  );
}
