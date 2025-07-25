import { compare } from "bcryptjs";
import { getSupabaseClient } from "@/lib/supabaseAccess/getSupabaseClient";

export async function validateUserCredentials(email: string, password: string) {
  if (!email || !password) {
    throw new Error("Missing email or password");
  }

  const supabase = getSupabaseClient();

  const { data: user, error: userError } = await supabase
    .from("user")
    .select("*")
    .eq("email", email)
    .single();

  if (userError || !user) {
    throw new Error("User not found");
  }

  const isValid = await compare(password, user.password);
  if (!isValid) {
    throw new Error("Wrong password");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user || !data.session) {
    throw new Error("Invalid email or password");
  }

  return {
    id: data.user.id,
    email: data.user.email,
    name: data.user.user_metadata?.name || "",
    access_token: data.session.access_token,
  };
}
