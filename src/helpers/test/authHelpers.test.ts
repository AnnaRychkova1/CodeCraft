import { validateUserCredentials } from "@/helpers/authHelpers";
import { compare } from "bcryptjs";
import { getSupabaseClient } from "@/lib/supabaseAccess/getSupabaseClient";

jest.mock("bcryptjs");
jest.mock("@/lib/supabaseAccess/getSupabaseClient");

describe("validateUserCredentials", () => {
  const mockCompare = compare as jest.Mock;
  const mockGetSupabaseClient = getSupabaseClient as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws error if email or password is missing", async () => {
    await expect(validateUserCredentials("", "password")).rejects.toThrow(
      "Missing email or password"
    );
    await expect(validateUserCredentials("email@test.com", "")).rejects.toThrow(
      "Missing email or password"
    );
  });

  it("throws error if user is not found", async () => {
    mockGetSupabaseClient.mockReturnValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: true }),
          }),
        }),
      }),
      auth: {
        signInWithPassword: jest.fn(),
      },
    });

    await expect(
      validateUserCredentials("notfound@test.com", "password")
    ).rejects.toThrow("User not found");
  });

  it("throws error if password is invalid", async () => {
    mockGetSupabaseClient.mockReturnValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: { password: "hashedpassword" },
              error: null,
            }),
          }),
        }),
      }),
      auth: {
        signInWithPassword: jest.fn(),
      },
    });

    mockCompare.mockResolvedValue(false);

    await expect(
      validateUserCredentials("email@test.com", "wrongpassword")
    ).rejects.toThrow("Wrong password");
  });

  it("throws error if supabase signInWithPassword fails", async () => {
    mockGetSupabaseClient.mockReturnValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: { password: "hashedpassword" },
              error: null,
            }),
          }),
        }),
      }),
      auth: {
        signInWithPassword: async () => ({
          data: null,
          error: { message: "Invalid credentials" },
        }),
      },
    });

    mockCompare.mockResolvedValue(true);

    await expect(
      validateUserCredentials("email@test.com", "correctpassword")
    ).rejects.toThrow("Invalid email or password");
  });

  it("returns user object on successful validation", async () => {
    const mockUser = {
      id: "123",
      email: "email@test.com",
      user_metadata: { name: "John" },
    };
    const mockSession = { access_token: "token123" };

    mockGetSupabaseClient.mockReturnValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: { password: "hashedpassword" },
              error: null,
            }),
          }),
        }),
      }),
      auth: {
        signInWithPassword: async () => ({
          data: { user: mockUser, session: mockSession },
          error: null,
        }),
      },
    });

    mockCompare.mockResolvedValue(true);

    const result = await validateUserCredentials(
      "email@test.com",
      "correctpassword"
    );

    expect(result).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      name: "John",
      access_token: mockSession.access_token,
    });
  });
});
