import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/[...nextauth]";
import { createClient } from "@supabase/supabase-js";
import type { Session } from "next-auth";

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

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const session = (await getServerSession(req, res, authOptions)) as Session;
    const userEmail = session?.user?.email ?? null;

    const { data: task, error: taskError } = await supabase
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

    if (taskError) throw taskError;
    if (!task) return res.status(404).json({ error: "Task not found" });

    let userTask: {
      submitted: boolean;
      result: number | null;
      solution: string | null;
    } | null = null;

    if (userEmail) {
      const { data: userData, error: userError } = await supabase
        .from("user")
        .select("id")
        .eq("email", userEmail)
        .single();

      if (userError || !userData) {
        console.error("User not found by email:", userError);
        throw userError || new Error("User not found");
      }

      const userId = userData.id;

      const { data: userTaskData, error: userTaskError } = await supabase
        .from("user_task")
        .select("submitted, result, solution")
        .eq("user_id", userId)
        .eq("task_id", id)
        .single();

      if (userTaskError && userTaskError.code !== "PGRST116") {
        // PGRST116: no rows returned
        console.error("Error fetching user_task:", userTaskError);
        throw userTaskError;
      }

      userTask = userTaskData ?? null;
    }

    return res.status(200).json({ task, userTask });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
