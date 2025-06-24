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
        theoryQuestions,
        codeTask,
      } = req.body;

      if (!title || !description || !level || !language || !type) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const { data: createdTask, error: insertError } = await supabase
        .from("task")
        .insert([
          {
            title,
            description,
            level,
            language,
            type,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      if (type === "theory" && Array.isArray(theoryQuestions)) {
        const questionsToInsert = (theoryQuestions as Question[]).map((q) => ({
          ...q,
          task_id: createdTask.id,
        }));

        const { error: theoryError } = await supabase
          .from("theoryQuestions")
          .insert(questionsToInsert);

        if (theoryError) throw theoryError;
      }

      if (type === "practice" && Array.isArray(codeTask)) {
        for (const singleTask of codeTask) {
          const { data: createdCodeTask, error: codeTaskError } = await supabase
            .from("codeTask")
            .insert([
              {
                task_id: createdTask.id,
                prompt: singleTask.prompt,
                starterCode: singleTask.starterCode ?? null,
              },
            ])
            .select()
            .single();

          if (codeTaskError) throw codeTaskError;

          if (Array.isArray(singleTask.tests) && singleTask.tests.length > 0) {
            const testsToInsert = singleTask.tests.map(
              (test: CodeTaskTest) => ({
                code_task_id: createdCodeTask.id,
                input: test.input,
                expected: test.expected,
              })
            );

            const { error: testError } = await supabase
              .from("tests")
              .insert(testsToInsert);

            if (testError) throw testError;
          }
        }
      }

      return res.status(201).json({ success: true, task: createdTask });
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
