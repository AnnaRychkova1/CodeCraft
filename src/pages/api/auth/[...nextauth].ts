import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { getSupabaseClient } from "@/lib/supabaseAccess/getSupabaseClient";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const supabase = getSupabaseClient();

        const { data: userToCheckPassword, error: userError } = await supabase
          .from("user")
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (userError || !userToCheckPassword) {
          throw new Error("User not found");
        }

        const isValid = await compare(
          credentials.password,
          userToCheckPassword.password
        );
        if (!isValid) {
          throw new Error("Wrong password");
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !data.user || !data.session) {
          throw new Error("Invalid email or password");
        }

        const user = data.user;
        const session = data.session;

        return {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || "",
          access_token: session.access_token,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.access_token = user.access_token ?? "";
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        access_token: token.access_token as string,
      };
      return session;
    },
  },

  pages: {
    signIn: "/",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
