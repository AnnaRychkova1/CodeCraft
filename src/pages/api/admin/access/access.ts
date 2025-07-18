import type { NextApiRequest, NextApiResponse } from "next";
import { compare } from "bcryptjs";

import { serialize } from "cookie";
import { getSupabaseClient } from "@/lib/supabaseAccess/getSupabaseClient";

const supabase = getSupabaseClient();
const email = process.env.ADMIN_EMAIL!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const { password } = req.body;

    const { data: adminToCheckPassword, error: userError } = await supabase
      .from("admin")
      .select("*")
      .eq("email", email)
      .single();

    if (userError || !adminToCheckPassword) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const isValid = await compare(password, adminToCheckPassword.password);
    if (!isValid) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (data.user?.app_metadata?.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const supabaseAccessToken = data.session.access_token;

    const cookie = serialize("adminToken", supabaseAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 2,
    });

    res.setHeader("Set-Cookie", cookie);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
