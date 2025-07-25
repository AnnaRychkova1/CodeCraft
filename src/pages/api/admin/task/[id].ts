import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { CodeTaskTest, Question } from "@/types/tasksTypes";
import { adminAuthMiddleware } from "@/lib/middlware/adminAuthMiddleware";
import { getSupabaseAdminClient } from "@/lib/supabaseAccess/getSupabaseClient";

const adminHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies.adminToken;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token" });
  }
  const supabase = getSupabaseAdminClient(token);

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
      const { id } = req.query;

      if (typeof id !== "string") {
        return res.status(400).json({ error: "Invalid or missing task ID" });
      }

      const { data, error } = await supabase
        .from("task")
        .delete()
        .eq("id", id)
        .select();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!data || data.length === 0) {
        return res
          .status(404)
          .json({ error: "Task not found or not deleted (RLS?)" });
      }

      return res
        .status(200)
        .json({ message: "Task deleted", data: data[0].id });
    }

    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default adminAuthMiddleware(adminHandler);
