import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // const { data: tasks, error } = await supabase.from("task")
    //   .select(`
    //   *,
    //   theory_question(*),
    //   code_task!fk_task(
    //     *,
    //     test_case(*)
    //   )
    // `);
    const { data: tasks, error } = await supabase.from("task").select(`
      id,
      title,
      description,
      level,
      language,
      type
    `);

    if (error) throw error;

    return res.status(200).json(tasks);
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default handler;
