import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { CodeTaskTest, Question } from "@/types/types";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const { data: tasks, error } = await supabase.from("task").select(`
        *,
        theory_question(*),
        code_task!fk_task( 
          *,
          test_case(*)
        )
      `);

      if (error) throw error;

      return res.status(200).json(tasks);
    }

    if (req.method === "POST") {
      const {
        title,
        description,
        level,
        language,
        type,
        theory_question,
        code_task,
      } = req.body;

      const { data: newTask, error: taskInsertError } = await supabase
        .from("task")
        .insert([{ title, description, level, language, type }])
        .select()
        .single();

      if (taskInsertError) throw taskInsertError;

      const taskId = newTask.id;

      if (type === "theory" && Array.isArray(theory_question)) {
        const formattedQuestions = theory_question.map((q: Question) => ({
          task_id: taskId,
          question: q.question,
          options: q.options,
          correct_answer: q.correct_answer,
        }));

        const { error: insertTheoryError } = await supabase
          .from("theory_question")
          .insert(formattedQuestions);

        if (insertTheoryError) throw insertTheoryError;
      }

      if (type === "practice") {
        const singleCodeTask = Array.isArray(code_task)
          ? code_task[0]
          : code_task;

        if (!singleCodeTask || typeof singleCodeTask !== "object") {
          return res.status(400).json({ error: "Invalid code_task format" });
        }

        const { data: createdCodeTask, error: codeTaskInsertError } =
          await supabase
            .from("code_task")
            .insert([
              {
                task_id: taskId,
                prompt: singleCodeTask.prompt,
                starter_code: singleCodeTask.starter_code ?? null,
              },
            ])
            .select()
            .single();

        if (codeTaskInsertError) throw codeTaskInsertError;

        if (Array.isArray(singleCodeTask.test_case)) {
          const testCases = singleCodeTask.test_case.map(
            (test: CodeTaskTest) => ({
              code_task_id: createdCodeTask.id,
              input: test.input,
              expected: test.expected,
            })
          );

          const { error: testInsertError } = await supabase
            .from("test_case")
            .insert(testCases);

          if (testInsertError) throw testInsertError;
        }
      }

      return res
        .status(201)
        .json({ message: "Task created successfully", id: taskId });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("API error:", error.message);
    } else {
      console.error("Unknown API error:", error);
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
}
