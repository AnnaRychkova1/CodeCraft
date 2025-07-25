import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcryptjs";
import { getSupabaseClient } from "@/lib/supabaseAccess/getSupabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = getSupabaseClient();
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (authError || !authData?.user) {
      return res
        .status(400)
        .json({ message: authError?.message || "Failed to create auth user" });
    }

    const authUser = authData.user;

    const hashedPassword = await hash(password, 10);

    const { error: insertError } = await supabase.from("user").insert([
      {
        id: authUser.id,
        email,
        name,
        password: hashedPassword,
      },
    ]);

    if (insertError) {
      return res.status(500).json({ message: "Failed to insert user into DB" });
    }

    return res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
