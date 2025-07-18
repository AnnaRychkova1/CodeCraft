import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { getSupabaseAdminClient } from "@/lib/supabaseAccess/getSupabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const adminToken = cookies.adminToken;

  if (!adminToken) {
    return res.status(401).json({ valid: false, message: "Missing token" });
  }

  const supabase = getSupabaseAdminClient(req);

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(adminToken);

    if (error || !user) {
      return res.status(401).json({ valid: false, message: "Invalid token" });
    }

    if (user.user_metadata?.role !== "admin") {
      return res.status(403).json({ valid: false, message: "Invalid role" });
    }

    return res.status(200).json({ valid: true });
  } catch (error) {
    console.error("Error validating token:", error);
    return res
      .status(500)
      .json({ valid: false, message: "Internal Server Error" });
  }
}
