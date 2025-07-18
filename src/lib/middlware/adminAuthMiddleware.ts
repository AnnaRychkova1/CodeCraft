import type { NextApiHandler } from "next";

import { createClient } from "@supabase/supabase-js";

export function adminAuthMiddleware(handler: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    const token = req.cookies.adminToken;

    if (!token)
      return res.status(401).json({ error: "Unauthorized: No token provided" });

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const { data, error } = await supabase.auth.getUser(token);
    const user = data.user;

    if (error || !user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    if (user.app_metadata.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Insufficient rights" });
    }

    return handler(req, res);
  };
}
