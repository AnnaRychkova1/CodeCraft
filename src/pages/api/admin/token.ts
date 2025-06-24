import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// const password = "admin123";

// bcrypt.hash(password, 10, (err, hash) => {
//   if (err) throw err;
//   console.log("Hashed password:", hash);
// });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { password } = req.body;

  const { data: admin, error } = await supabase
    .from("admin")
    .select("*")
    .limit(1)
    .single();

  if (error || !admin)
    return res.status(401).json({ error: "Invalid credentials" });

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) return res.status(401).json({ error: "Wrong password" });

  const token = jwt.sign(
    { role: "admin", id: admin.id },
    process.env.JWT_SECRET!,
    {
      expiresIn: "2h",
    }
  );

  return res.status(200).json({ token });
}
