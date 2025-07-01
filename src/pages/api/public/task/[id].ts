import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid or missing id" });
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  try {
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
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default handler;
