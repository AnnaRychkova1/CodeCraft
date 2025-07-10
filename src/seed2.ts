import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  try {
    const javaPracticeTaskId = uuidv4();
    const javaCodeTaskId = uuidv4();

    const { error: javaTaskError } = await supabase.from("task").insert([
      {
        id: javaPracticeTaskId,
        title: "Sum of Two Numbers in Java",
        description:
          "Implement a method that takes two integers and returns their sum.",
        level: "beginner",
        language: "java",
        type: "practice",
      },
    ]);
    if (javaTaskError) throw javaTaskError;

    const { error: javaCodeTaskError } = await supabase
      .from("code_task")
      .insert([
        {
          id: javaCodeTaskId,
          task_id: javaPracticeTaskId,
          prompt:
            "Implement the method `public int sum(int a, int b)` that returns the sum of two numbers.",
          starter_code: `public class SumTask {
    public int sum(int a, int b) {
    // your code here
        return 0;
    }
}`,
        },
      ]);
    if (javaCodeTaskError) throw javaCodeTaskError;

    const { error: javaTestsError } = await supabase.from("test_case").insert([
      { code_task_id: javaCodeTaskId, input: [1, 2], expected: 3 },
      { code_task_id: javaCodeTaskId, input: [-3, 5], expected: 2 },
      { code_task_id: javaCodeTaskId, input: [100, 250], expected: 350 },
    ]);
    if (javaTestsError) throw javaTestsError;

    const pythonPracticeTaskId = uuidv4();
    const pythonCodeTaskId = uuidv4();

    const { error: pythonTaskError } = await supabase.from("task").insert([
      {
        id: pythonPracticeTaskId,
        title: "Sum of Two Numbers in Python",
        description:
          "Write a function that takes two numbers and returns their sum.",
        level: "beginner",
        language: "python",
        type: "practice",
      },
    ]);
    if (pythonTaskError) throw pythonTaskError;

    const { error: pythonCodeTaskError } = await supabase
      .from("code_task")
      .insert([
        {
          id: pythonCodeTaskId,
          task_id: pythonPracticeTaskId,
          prompt:
            "Implement a function `def sum(a, b):` that returns the sum of two numbers.",
          starter_code: `def sum(a, b):\\n# your code here\\npass`,
        },
      ]);
    if (pythonCodeTaskError) throw pythonCodeTaskError;

    const { error: pythonTestsError } = await supabase
      .from("test_case")
      .insert([
        { code_task_id: pythonCodeTaskId, input: [1, 2], expected: 3 },
        { code_task_id: pythonCodeTaskId, input: [-3, 5], expected: 2 },
        { code_task_id: pythonCodeTaskId, input: [100, 250], expected: 350 },
      ]);
    if (pythonTestsError) throw pythonTestsError;

    console.log("✅ Seed completed successfully.");
  } catch (error) {
    console.error("❌ Seed failed:", error);
  }
}

seed();
