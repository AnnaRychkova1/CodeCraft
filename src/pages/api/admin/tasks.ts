import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { CodeTaskTest, Question } from "@/types/tasksTypes";
import { adminAuthMiddleware } from "@/lib/middlware/adminAuthMiddleware";
import { getSupabaseAdminClient } from "@/lib/supabaseAccess/getSupabaseClient";

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies.adminToken;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token" });
  }
  const supabase = getSupabaseAdminClient(token);
  try {
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
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default adminAuthMiddleware(postHandler);
