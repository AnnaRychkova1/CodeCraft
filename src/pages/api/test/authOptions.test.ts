import { authOptions } from "@/pages/api/auth/[...nextauth]";
import * as authHelpers from "@/helpers/authHelpers";
import { CredentialsConfig } from "next-auth/providers/credentials";
import { User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

jest.mock("@/helpers/authHelpers", () => ({
  validateUserCredentials: jest.fn(),
}));

describe("authOptions", () => {
  const mockValidateUserCredentials =
    authHelpers.validateUserCredentials as jest.MockedFunction<
      (email: string, password: string) => Promise<User>
    >;

  describe("CredentialsProvider authorize", () => {
    it("calls validateUserCredentials with correct args", async () => {
      const fakeUser: User = {
        id: "123",
        name: "Test User",
        email: "test@example.com",
        access_token: "abc123",
      };

      mockValidateUserCredentials.mockResolvedValue(fakeUser);

      const credentialsProvider = authOptions.providers.find(
        (provider): provider is CredentialsConfig =>
          provider.id === "credentials"
      );

      if (!credentialsProvider) {
        throw new Error("CredentialsProvider not found in authOptions");
      }

      const authorize = credentialsProvider.options.authorize;

      if (!authorize) {
        throw new Error("authorize function not found in CredentialsProvider");
      }

      const result = await authorize(
        {
          email: "test@example.com",
          password: "secret",
        },
        {} as Parameters<typeof authorize>[1]
      );

      expect(mockValidateUserCredentials).toHaveBeenCalledWith(
        "test@example.com",
        "secret"
      );
      expect(result).toEqual(fakeUser);
    });

    it("throws error if email or password missing", async () => {
      const credentialsProvider = authOptions.providers.find(
        (provider): provider is CredentialsConfig =>
          provider.id === "credentials"
      );

      if (!credentialsProvider) {
        throw new Error("CredentialsProvider not found in authOptions");
      }

      const authorize = credentialsProvider.options.authorize;

      if (!authorize) {
        throw new Error("authorize function not found in CredentialsProvider");
      }

      await expect(
        authorize(
          { email: "", password: "" },
          {} as Parameters<typeof authorize>[1]
        )
      ).rejects.toThrow("Missing email or password");
    });
  });

  describe("callbacks", () => {
    it("jwt callback sets custom token fields", async () => {
      const token = await authOptions.callbacks?.jwt?.({
        token: {},
        user: {
          id: "123",
          email: "test@example.com",
          name: "Test User",
          access_token: "abc123",
        },
        account: null,
        profile: undefined,
        trigger: "signIn",
      });

      expect(token).toEqual({
        id: "123",
        email: "test@example.com",
        name: "Test User",
        access_token: "abc123",
      });
    });

    it("session callback maps token to session.user", async () => {
      const session = await authOptions.callbacks?.session?.({
        session: {} as Session,
        token: {
          id: "123",
          email: "test@example.com",
          name: "Test User",
          access_token: "abc123",
        } as JWT,
        user: {
          id: "123",
          email: "test@example.com",
          name: "Test User",
          emailVerified: null,
        },
        trigger: "update",
        newSession: undefined,
      });

      expect(session?.user).toEqual({
        id: "123",
        email: "test@example.com",
        name: "Test User",
        access_token: "abc123",
      });
    });
  });
});
