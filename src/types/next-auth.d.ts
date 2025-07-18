// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      access_token?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    access_token?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    access_token?: string;
  }
}
