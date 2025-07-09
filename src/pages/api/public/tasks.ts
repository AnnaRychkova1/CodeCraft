import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]";
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
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const session = (await getServerSession(req, res, authOptions)) as Session;

    const userEmail = session?.user?.email ?? null;

    const { data: tasks, error: taskError } = await supabase.from("task")
      .select(`
        id,
        title,
        description,
        level,
        language,
        type
      `);

    if (taskError) {
      console.error("Failed to fetch tasks:", taskError);
      throw taskError;
    }

    let userTasks: {
      task_id: string;
      submitted: boolean;
      result: number | null;
      solution: string | null;
    }[] = [];

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
        .select("task_id, submitted, result, solution")
        .eq("user_id", userId);

      if (userTaskError) {
        console.error("Failed to fetch user tasks:", userTaskError);
        throw userTaskError;
      }

      userTasks = userTaskData ?? [];
    }

    return res.status(200).json({ tasks, userTasks });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
