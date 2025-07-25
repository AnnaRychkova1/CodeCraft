import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { validateUserCredentials } from "@/helpers/authHelpers";

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

        return await validateUserCredentials(
          credentials.email,
          credentials.password
        );
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
