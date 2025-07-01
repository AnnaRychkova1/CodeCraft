import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { CodeTaskTest, Question } from "@/types/types";
import { adminAuthMiddleware } from "@/lib/adminAuthMiddleware";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const adminHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid or missing id" });
  }

  try {
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

      return res.status(200).json({ message: "Task deleted" });
    }

    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default adminAuthMiddleware(adminHandler);
