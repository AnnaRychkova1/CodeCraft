import { FiPlus } from "react-icons/fi";
import type { PracticeInputsProps } from "@/types/tasksTypes";
import TestEdit from "./TestEdit";
import AutoGrowTextarea from "../AutoGrowTextarea/AutoGrowTextarea";
import css from "./TaskForm.module.css";

export default function PracticeInputs({
  code_task,
  onChange,
  onTestChange,
  onTestRemove,
}: PracticeInputsProps) {
  return (
    <div className={css.typeContainer}>
      <h3 className={css.typeTitle}>Practice Code Task</h3>

      <AutoGrowTextarea
        value={code_task.prompt}
        name="prompt"
        onChange={(e) => {
          onChange("prompt", e.target.value);
        }}
        placeholder="Prompt"
        rows={1}
      />
      {/*instruction*/}
      <AutoGrowTextarea
        value={code_task.starter_code}
        name="starter_code"
        onChange={(e) => onChange("starter_code", e.target.value)}
        placeholder="Starter Code"
        rows={2}
        required
      />
      <div className={css.instruction}>
        <b>How to write starter code indentation:</b>
        <p>
          Use <code className={css.code}>\n</code> for new lines. To add spaces
          after a line break, write <code className={css.code}>\n[4]</code>,{" "}
          <code className={css.code}>\n[8]</code>, etc., where the number means
          spaces. Indentation for any language is a multiple of <b>4</b> spaces.
        </p>
        <p>Example:</p>
        <code className={css.code}>
          {
            "public class SumTask {\\\\n[4]public int sum(int a, int b) {\\\\n[8]// your code here\\\\n[8]return 0;\\\\n[4]}\\\\n}"
          }
        </code>
      </div>

      <div className={css.testsContainer}>
        <p className={css.testTitle}>Tests</p>

        {(code_task.test_case || []).map((test, index) => (
          <TestEdit
            key={index}
            test_case={test}
            index={index}
            onChange={onTestChange}
            onRemove={onTestRemove}
          />
        ))}

        <button
          type="button"
          onClick={() =>
            onChange("test_case", [
              ...(code_task.test_case || []),
              { input: [], expected: "", id: crypto.randomUUID() },
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
