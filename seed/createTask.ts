import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import type {
  InitialTask,
  CodeTask,
  CodeTaskTest,
  Question,
} from "@/types/tasksTypes";
// import { initialTasks } from "./data/initialBeginnerTheoryTasks";
// import { initialTasks } from "./data/initialIntermediateTheoryTasks";
// import { initialTasks } from "./data/initialAdvancedTheoryTasks";
import { initialTasks } from "./data/initialPracticeTasks";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seedFinalTasks(initialTasks: InitialTask[]) {
  for (const task of initialTasks) {
    const { data: insertedTask, error: taskError } = await supabase
      .from("task")
      .insert([
        {
          title: task.title,
          description: task.description,
          level: task.level,
          language: task.language,
          type: task.type,
        },
      ])
      .select("id")
      .single();

    if (taskError || !insertedTask) {
      console.error("❌ Task insert error:", taskError);
      continue;
    }

    const taskId = insertedTask.id;

    if (task.code_task?.length) {
      for (const codeTask of task.code_task as CodeTask[]) {
        const { data: insertedCodeTask, error: codeTaskError } = await supabase
          .from("code_task")
          .insert([
            {
              task_id: taskId,
              prompt: codeTask.prompt,
              starter_code: codeTask.starter_code ?? null,
            },
          ])
          .select("id")
          .single();

        if (codeTaskError || !insertedCodeTask) {
          console.error("❌ CodeTask insert error:", codeTaskError);
          continue;
        }

        const codeTaskId = insertedCodeTask.id;

        if (codeTask.test_case?.length) {
          const testCases = codeTask.test_case.map((tc: CodeTaskTest) => ({
            code_task_id: codeTaskId,
            input: tc.input,
            expected: tc.expected,
          }));

          const { error: testCaseError } = await supabase
            .from("test_case")
            .insert(testCases);

          if (testCaseError) {
            console.error("❌ TestCase insert error:", testCaseError);
          }
        }
      }
    }

    if (task.theory_question?.length) {
      const questions = task.theory_question.map((q: Question) => ({
        task_id: taskId,
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
      }));

      const { error: questionError } = await supabase
        .from("theory_question")
        .insert(questions);

      if (questionError) {
        console.error("❌ TheoryQuestion insert error:", questionError);
      }
    }
  }

  console.log("✅ All tasks (practice + theory) seeded successfully.");
}

seedFinalTasks(initialTasks);
