import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

import type { Session } from "next-auth";
import {
  getSupabaseClient,
  getSupabaseUserClient,
} from "@/lib/supabaseAccess/getSupabaseClient";

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
    let supabase;
    let userEmail;
    if (session?.user?.access_token) {
      const token = session.user.access_token;
      supabase = getSupabaseUserClient(token);
      userEmail = session?.user?.email;
    } else {
      supabase = getSupabaseClient();
    }

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
        throw userError || new Error("User not found");
      }

      const userId = userData.id;

      const { data: userTaskData, error: userTaskError } = await supabase
        .from("user_task")
        .select("task_id, submitted, result, solution")
        .eq("user_id", userId);

      if (userTaskError) {
        throw userTaskError;
      }

      userTasks = userTaskData ?? [];
    }

    return res.status(200).json({ tasks, userTasks });
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
      console.error("API error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
