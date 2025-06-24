import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { CodeTaskTest, Question } from "@/types/types";

import { verifyAdminToken } from "@/utils/verifyAdminToken";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid or missing id" });
  }

  if (["PUT", "DELETE"].includes(req.method || "")) {
    const { valid, error } = verifyAdminToken(req, res);
    if (!valid) return res.status(403).json({ error });
  }

  try {
    if (req.method === "GET") {
      const { data: task, error } = await supabase
        .from("task")
        .select(
          `
          *,
          theory_question(*),
          code_task!fk_task( 
            *,
            test_case(*)
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!task) return res.status(404).json({ error: "Task not found" });

      return res.status(200).json(task);
    }

    if (req.method === "PUT") {
      const {
        title,
        description,
        level,
        language,
        type,
        theory_question,
        code_task,
      } = req.body;

      const { error: updateError } = await supabase
        .from("task")
        .update({ title, description, level, language, type })
        .eq("id", id);

      if (updateError) throw updateError;

      if (type === "theory") {
        await supabase.from("theory_question").delete().eq("task_id", id);

        if (Array.isArray(theory_question)) {
          const formatted = theory_question.map((q: Question) => ({
            task_id: id,
            question: q.question,
            options: q.options,
            correct_answer: q.correct_answer,
          }));

          const { error: insertError } = await supabase
            .from("theory_question")
            .insert(formatted);

          if (insertError) throw insertError;
        }

        await supabase.from("code_task").delete().eq("task_id", id);
      }

      if (type === "practice") {
        const singleCodeTask = Array.isArray(code_task)
          ? code_task[0]
          : code_task;

        if (!singleCodeTask || typeof singleCodeTask !== "object") {
          return res.status(400).json({ error: "Invalid code_task format" });
        }

        const { data: existingCodeTask } = await supabase
          .from("code_task")
          .select("id")
          .eq("task_id", id)
          .single();

        if (existingCodeTask) {
          const { error: codeTaskUpdateError } = await supabase
            .from("code_task")
            .update({
              prompt: singleCodeTask.prompt,
              starter_code: singleCodeTask.starter_code ?? null,
            })
            .eq("id", existingCodeTask.id);

          if (codeTaskUpdateError) throw codeTaskUpdateError;

          await supabase
            .from("test_case")
            .delete()
            .eq("code_task_id", existingCodeTask.id);

          if (Array.isArray(singleCodeTask.test_case)) {
            const testCases = singleCodeTask.test_case.map(
              (test: CodeTaskTest) => ({
                code_task_id: existingCodeTask.id,
                input: test.input,
                expected: test.expected,
              })
            );

            const { error: testsInsertError } = await supabase
              .from("test_case")
              .insert(testCases);

            if (testsInsertError) throw testsInsertError;
          }
        } else {
          const { data: newCodeTask, error: codeTaskCreateError } =
            await supabase
              .from("code_task")
              .insert([
                {
                  task_id: id,
                  prompt: singleCodeTask.prompt,
                  starter_code: singleCodeTask.starter_code ?? null,
                },
              ])
              .select()
              .single();

          if (codeTaskCreateError) throw codeTaskCreateError;

          if (Array.isArray(singleCodeTask.test_case)) {
            const testCases = singleCodeTask.test_case.map(
              (test: CodeTaskTest) => ({
                code_task_id: newCodeTask.id,
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

        await supabase.from("theory_question").delete().eq("task_id", id);
      }

      return res.status(200).json({ message: "Task updated successfully" });
    }

    if (req.method === "DELETE") {
      const { error } = await supabase.from("task").delete().eq("id", id);
      if (error) throw error;

      res.status(204).end();
      return;
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("❌ API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
