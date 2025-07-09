import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const { password } = req.body;

    const { data: admin, error } = await supabase
      .from("admin")
      .select("*")
      .limit(1)
      .single();

    if (error || !admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const adminToken = jwt.sign(
      { role: "admin", id: admin.id },
      process.env.JWT_SECRET!,
      {
        expiresIn: "2h",
      }
    );

    const cookie = serialize("adminToken", adminToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 2,
    });

    res.setHeader("Set-Cookie", cookie);

    return res.status(200).json({ succcess: true });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
