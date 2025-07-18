import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest } from "next";
import { parse } from "cookie";

export function getSupabaseUserClient(token: string) {
  if (!token) {
    throw new Error("No auth token provided");
  }

  return createClient(
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
}

export function getSupabaseAdminClient(req: NextApiRequest) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies.adminToken;

  if (!token) {
    throw new Error("No auth token provided");
  }

  return createClient(
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
}

export function getSupabaseClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );
}
