import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import type { SubmitUserTaskBody } from "@/types/userTypes";
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

  const userEmail = session.user.email;
  const { id: taskId } = req.query;

  if (typeof taskId !== "string") {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const payload: SubmitUserTaskBody = req.body;

    if (typeof payload.submitted !== "boolean") {
      return res
        .status(400)
        .json({ error: "`submitted` is required and must be boolean" });
    }

    const { data: userData, error: userError } = await supabase
      .from("user")
      .select("id")
      .eq("email", userEmail)
      .single();

    if (userError || !userData) {
      throw new Error("User not found");
    }

    const userId = userData.id;

    const { data: existingTask } = await supabase
      .from("user_task")
      .select("id")
      .eq("user_id", userId)
      .eq("task_id", taskId)
      .maybeSingle();

    const updateData: SubmitUserTaskBody = {
      submitted: payload.submitted,
    };

    if (typeof payload.result === "number") {
      updateData.result = payload.result;
    }

    if (typeof payload.solution === "string") {
      updateData.solution = payload.solution;
    }

    let result;

    if (existingTask) {
      result = await supabase
        .from("user_task")
        .update(updateData)
        .eq("id", existingTask.id)
        .select()
        .single();
      if (result.error) throw result.error;
      let message;
      if (typeof payload.result === "number") {
        message = "Your new result is saved";
      }
      if (typeof payload.solution === "string") {
        message = "Your new solution is saved";
      }
      return res.status(200).json({ message, data: result.data });
    } else {
      result = await supabase
        .from("user_task")
        .insert({
          user_id: userId,
          task_id: taskId,
          ...updateData,
        })
        .select()
        .single();
      if (result.error) throw result.error;
      let message;
      if (typeof payload.result === "number") {
        message = "Your result is saved";
      }
      if (typeof payload.solution === "string") {
        message = "Your solution is saved";
      }
      return res.status(200).json({ message, data: result.data });
    }
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
      console.error("UserTask API Error:", error);
      return res.status(500).json({ error: "Failed to save user task result" });
    }
  }
}
