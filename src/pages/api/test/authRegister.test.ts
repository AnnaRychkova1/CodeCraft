import handler from "@/pages/api/auth/register";
import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import { getSupabaseClient } from "@/lib/supabaseAccess/getSupabaseClient";
import { hash } from "bcryptjs";
import type { User } from "@supabase/supabase-js";

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

jest.mock("@/lib/supabaseAccess/getSupabaseClient", () => ({
  getSupabaseClient: jest.fn(),
}));

const mockGetSupabaseClient = getSupabaseClient as jest.MockedFunction<
  typeof getSupabaseClient
>;
const mockHash = hash as jest.MockedFunction<
  (password: string, rounds: number) => Promise<string>
>;
type InsertArgs = Array<{
  id: string;
  email: string;
  name: string;
  password: string;
}>;

type SupabaseInsertMock = {
  insert: jest.Mock<
    Promise<{ error: { message: string } | null }>,
    [InsertArgs]
  >;
};

type SupabaseClientMock = {
  auth: {
    signUp: jest.Mock<
      Promise<{
        data: { user: User } | null;
        error: { message: string } | null;
      }>,
      [object]
    >;
  };
  from: (table: string) => SupabaseInsertMock;
};

function createMockRes(): jest.Mocked<NextApiResponse> {
  const { res } = createMocks();
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res as jest.Mocked<NextApiResponse>;
}

describe("POST /api/auth/register handler", () => {
  let supabaseMock: SupabaseClientMock;

  beforeEach(() => {
    const insertMock = jest.fn<
      ReturnType<SupabaseInsertMock["insert"]>,
      Parameters<SupabaseInsertMock["insert"]>
    >();

    supabaseMock = {
      auth: {
        signUp: jest.fn(),
      },
      from: () => ({
        insert: insertMock,
      }),
    };

    mockGetSupabaseClient.mockReturnValue(
      supabaseMock as unknown as ReturnType<typeof getSupabaseClient>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 405 for non-POST methods", async () => {
    const { req } = createMocks({ method: "GET" });
    const res = createMockRes();

    await handler(req as NextApiRequest, res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ message: "Method not allowed" });
  });

  it("returns 400 if missing required fields", async () => {
    const { req } = createMocks({
      method: "POST",
      body: { name: "Test", email: "test@example.com" },
    });
    const res = createMockRes();

    await handler(req as NextApiRequest, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Missing fields" });
  });

  it("returns 400 if Supabase signUp fails", async () => {
    const { req } = createMocks({
      method: "POST",
      body: { name: "Test", email: "test@example.com", password: "secret" },
    });
    const res = createMockRes();

    supabaseMock.auth.signUp.mockResolvedValue({
      data: null,
      error: { message: "Sign up failed" },
    });

    await handler(req as NextApiRequest, res);

    expect(supabaseMock.auth.signUp).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "secret",
      options: { data: { name: "Test" } },
    });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Sign up failed" });
  });

  it("returns 500 if DB insert fails", async () => {
    const { req } = createMocks({
      method: "POST",
      body: { name: "Test", email: "test@example.com", password: "secret" },
    });
    const res = createMockRes();

    const fakeUser: User = {
      id: "user123",
      email: "test@example.com",
      aud: "authenticated",
      role: "user",
      created_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      identities: [],
      app_metadata: {},
      user_metadata: {},
    };

    supabaseMock.auth.signUp.mockResolvedValue({
      data: { user: fakeUser },
      error: null,
    });
    mockHash.mockResolvedValue("hashed-password");

    const insertMock = jest
      .fn()
      .mockResolvedValue({ error: { message: "Insert failed" } });
    supabaseMock.from = () => ({ insert: insertMock });

    await handler(req as NextApiRequest, res);

    expect(mockHash).toHaveBeenCalledWith("secret", 10);
    expect(insertMock).toHaveBeenCalledWith([
      {
        id: "user123",
        name: "Test",
        email: "test@example.com",
        password: "hashed-password",
      },
    ]);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Failed to insert user into DB",
    });
  });

  it("returns 201 on successful registration", async () => {
    const { req } = createMocks({
      method: "POST",
      body: { name: "Test", email: "test@example.com", password: "secret" },
    });
    const res = createMockRes();

    const fakeUser: User = {
      id: "user123",
      email: "test@example.com",
      aud: "authenticated",
      role: "user",
      created_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      identities: [],
      app_metadata: {},
      user_metadata: {},
    };

    supabaseMock.auth.signUp.mockResolvedValue({
      data: { user: fakeUser },
      error: null,
    });

    mockHash.mockResolvedValue("hashed-password");

    const insertMock = jest.fn().mockResolvedValue({ error: null });
    supabaseMock.from = () => ({ insert: insertMock });

    await handler(req as NextApiRequest, res);

    expect(mockHash).toHaveBeenCalledWith("secret", 10);
    expect(insertMock).toHaveBeenCalledWith([
      {
        id: "user123",
        name: "Test",
        email: "test@example.com",
        password: "hashed-password",
      },
    ]);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User registered successfully.",
    });
  });

  it("returns 500 on unexpected exception", async () => {
    const { req } = createMocks({
      method: "POST",
      body: { name: "Test", email: "test@example.com", password: "secret" },
    });
    const res = createMockRes();

    supabaseMock.auth.signUp.mockRejectedValue(new Error("Unexpected error"));

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    await handler(req as NextApiRequest, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    consoleSpy.mockRestore();
  });
});
