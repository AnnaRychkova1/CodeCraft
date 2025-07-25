import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import type { Session } from "next-auth";
import { getSupabaseUserClient } from "@/lib/supabaseAccess/getSupabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = (await getServerSession(req, res, authOptions)) as Session;
  if (!session?.user?.access_token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = session.user.access_token;
  const supabase = getSupabaseUserClient(token);

  if (!session?.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const userEmail = session.user.email;

    const { data: userData, error: userError } = await supabase
      .from("user")
      .select("id")
      .eq("email", userEmail)
      .single();

    if (userError || !userData) throw new Error("User not found");

    const userId = userData.id;

    const { data: allTasksData, error: taskError } = await supabase
      .from("task")
      .select("id");

    if (taskError || !allTasksData) throw new Error("Tasks fetch failed");
    const allTasks = allTasksData.length;

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
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error["code"] === "PGRST301"
    ) {
      return res
        .status(401)
        .json({ error: "Your session has expired. Please log in again." });
    } else {
      console.error("Progress API Error:", error);
      return res.status(500).json({ error: "Failed to fetch progress" });
    }
  }
}
