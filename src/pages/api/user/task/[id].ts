import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import authOptions from "../../auth/[...nextauth]";
import type { SubmitUserTaskBody } from "@/types/tasksTypes";

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
      .from("users")
      .select("id")
      .eq("email", userEmail)
      .single();

    if (userError || !userData) {
      throw new Error("User not found");
    }

    const userId = userData.id;

    const { data: existingTask } = await supabase
      .from("user_tasks")
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
        .from("user_tasks")
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
        .from("user_tasks")
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
    console.error("UserTask API Error:", error);
    return res.status(500).json({ error: "Failed to save user task result" });
  }
}
