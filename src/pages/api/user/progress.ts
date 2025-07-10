import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import authOptions from "../auth/[...nextauth]";
import type { Session } from "next-auth";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = (await getServerSession(req, res, authOptions)) as Session;

  if (!session?.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const userEmail = session.user.email;

    // Get user ID
    const { data: userData, error: userError } = await supabase
      .from("user")
      .select("id")
      .eq("email", userEmail)
      .single();

    if (userError || !userData) throw new Error("User not found");
    const userId = userData.id;

    // Get all tasks
    const { data: allTasksData, error: taskError } = await supabase
      .from("task")
      .select("id");

    if (taskError || !allTasksData) throw new Error("Tasks fetch failed");
    const allTasks = allTasksData.length;

    // Get user_task rows
    const { data: userTasks, error: userTaskError } = await supabase
      .from("user_task")
      .select("result, solution")
      .eq("user_id", userId);

    if (userTaskError) throw new Error("User tasks fetch failed");

    const doneTasks = userTasks.length;
    const theory = userTasks.filter((t) => t.result !== null).length;
    const practice = userTasks.filter((t) => t.solution !== null).length;

    return res.status(200).json({
      allTasks,
      doneTasks,
      theory,
      practice,
    });
  } catch (error) {
    console.error("Progress API Error:", error);
    return res.status(500).json({ error: "Failed to fetch progress" });
  }
}
