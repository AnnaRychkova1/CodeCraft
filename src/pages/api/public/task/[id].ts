import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import type { Session } from "next-auth";
import {
  getSupabaseClient,
  getSupabaseUserClient,
} from "@/lib/supabaseAccess/getSupabaseClient";

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
    let supabase;
    let userEmail;
    if (session?.user?.access_token) {
      const token = session.user.access_token;
      supabase = getSupabaseUserClient(token);
      userEmail = session?.user?.email;
    } else {
      supabase = getSupabaseClient();
    }

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
        throw userTaskError;
      }

      userTask = userTaskData ?? null;
    }

    return res.status(200).json({ task, userTask });
  } catch (error) {
    console.error("API Error:", error);
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
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
