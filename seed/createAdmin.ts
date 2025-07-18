import "dotenv/config";
import { hash } from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Load admin credentials from environment variables
const email = process.env.ADMIN_EMAIL!;
const password = process.env.ADMIN_PASSWORD!;

async function main() {
  // 1. Fetch all users to check if the admin already exists
  const { data: userList, error: fetchError } =
    await supabase.auth.admin.listUsers();

  if (fetchError) {
    console.error("Error fetching users:", fetchError.message);
    return;
  }

  // 2. Look for an existing user with the admin email
  const existingUser = userList.users.find((user) => user.email === email);
  let userId: string;

  if (existingUser) {
    console.log("Admin already exists in Supabase Auth.");
    userId = existingUser.id;

    // Optional: Ensure the user has the correct role in metadata
    await supabase.auth.admin.updateUserById(userId, {
      app_metadata: { role: "admin" },
    });
  } else {
    // 3. Create a new user if not found
    const { data: newUser, error: createError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Skip email confirmation
        app_metadata: { role: "admin" },
      });

    if (createError || !newUser?.user) {
      console.error("Error creating admin:", createError?.message);
      return;
    }

    userId = newUser.user.id;
    console.log("Admin user created in Supabase Auth:", newUser);
  }

  // 4. Check if the admin exists in the custom 'admin' table
  const { data: existingAdmin } = await supabase
    .from("admin")
    .select("id")
    .eq("id", userId)
    .single();

  if (existingAdmin) {
    console.log("Admin already exists in 'admin' table.");
  } else {
    // 5. Insert admin into 'admin' table with hashed password
    const hashedPassword = await hash(password, 10);

    const { error: insertError } = await supabase.from("admin").insert([
      {
        id: userId,
        email,
        password: hashedPassword,
      },
    ]);

    if (insertError) {
      console.error("Error inserting into admin table:", insertError.message);
    } else {
      console.log("Admin user inserted into admin table.");
    }
  }
}

main();
