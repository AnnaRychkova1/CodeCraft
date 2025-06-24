import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

dotenv.config({ path: ".env" });

// Setup Supabase client using service role key
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  try {
    // Clean up existing data (order matters due to foreign key constraints)
    await supabase.from("test_case").delete().neq("id", "");
    await supabase.from("theory_question").delete().neq("id", "");
    await supabase.from("code_task").delete().neq("id", "");
    await supabase.from("task").delete().neq("id", "");

    // === Theory Task ===
    const theoryTaskId = uuidv4();
    const { error: theoryTaskError } = await supabase.from("task").insert([
      {
        id: theoryTaskId,
        title: "Basics of Python Variables",
        description: "Learn how to declare and use variables in Python.",
        level: "beginner",
        language: "python",
        type: "theory",
      },
    ]);

    if (theoryTaskError) throw theoryTaskError;

    const { error: theoryQuestionsError } = await supabase
      .from("theory_question")
      .insert([
        {
          task_id: theoryTaskId,
          question:
            "Which of the following is a valid variable name in Python?",
          options: ["1variable", "_variable", "variable-name", "variable name"],
          correct_answer: ["_variable"],
        },
        {
          task_id: theoryTaskId,
          question: "What will `x = 5 + 3` result in?",
          options: ["8", "53", "Error", "None"],
          correct_answer: ["8"],
        },
      ]);

    if (theoryQuestionsError) throw theoryQuestionsError;

    // === Practice Task ===
    const practiceTaskId = uuidv4();
    const codeTaskId = uuidv4();

    const { error: practiceTaskError } = await supabase.from("task").insert([
      {
        id: practiceTaskId,
        title: "Sum of Two Numbers",
        description:
          "Write a function that takes two numbers and returns their sum.",
        level: "beginner",
        language: "javascript",
        type: "practice",
      },
    ]);

    if (practiceTaskError) throw practiceTaskError;

    const { error: codeTaskError } = await supabase.from("code_task").insert([
      {
        id: codeTaskId,
        task_id: practiceTaskId,
        prompt:
          "Implement a function `sum(a, b)` that returns the sum of two numbers.",
        starter_code: `function sum(a, b) {\n  // your code here\n}`,
      },
    ]);

    if (codeTaskError) throw codeTaskError;

    const { error: testsError } = await supabase.from("test_case").insert([
      { code_task_id: codeTaskId, input: [1, 2], expected: 3 },
      { code_task_id: codeTaskId, input: [-3, 5], expected: 2 },
      { code_task_id: codeTaskId, input: [100, 250], expected: 350 },
    ]);

    if (testsError) throw testsError;

    console.log("✅ Seed completed successfully.");
  } catch (error) {
    console.error("❌ Seed failed:", error);
  }
}

seed();
