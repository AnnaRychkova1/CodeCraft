import type { NextApiRequest, NextApiResponse } from "next";
import handler from "@/pages/api/admin/access/access";
import { compare } from "bcryptjs";
import { serialize } from "cookie";
import { getSupabaseClient } from "@/lib/supabaseAccess/getSupabaseClient";

jest.mock("bcryptjs");
jest.mock("cookie");
jest.mock("@/lib/supabaseAccess/getSupabaseClient");

const mockCompare = compare as jest.Mock;
const mockSerialize = serialize as jest.Mock;
const mockGetSupabaseClient = getSupabaseClient as jest.Mock;

describe("Admin login API handler", () => {
  let singleMock: jest.Mock;
  let eqMock: jest.Mock;
  let selectMock: jest.Mock;
  let fromMock: jest.Mock;
  let signInWithPasswordMock: jest.Mock;

  beforeAll(() => {
    process.env.ADMIN_EMAIL = "admin@test.com";
  });

  beforeEach(() => {
    singleMock = jest.fn();
    eqMock = jest.fn(() => ({ single: singleMock }));
    selectMock = jest.fn(() => ({ eq: eqMock }));
    fromMock = jest.fn((tableName: string) => {
      if (tableName === "admin") {
        return { select: selectMock };
      }
      return {};
    });

    signInWithPasswordMock = jest.fn();

    mockGetSupabaseClient.mockReturnValue({
      from: fromMock,
      auth: { signInWithPassword: signInWithPasswordMock },
    });

    mockCompare.mockReset();
    mockSerialize.mockReset();
  });

  const createMocks = () => {
    const endMock = jest.fn();
    const jsonMock = jest.fn();
    const setHeaderMock = jest.fn();

    const statusMock = jest.fn((code: number) => {
      void code;
      return { json: jsonMock, end: endMock };
    });

    const res = {
      status: statusMock,
      json: jsonMock,
      setHeader: setHeaderMock,
      end: endMock,
    } as unknown as NextApiResponse;

    return { res, statusMock, jsonMock, setHeaderMock, endMock };
  };

  it("returns 405 if method is not POST", async () => {
    const req = { method: "GET" } as NextApiRequest;
    const { res, statusMock, endMock } = createMocks();

    await handler(req, res);

    expect(statusMock).toHaveBeenCalledWith(405);
    expect(endMock).toHaveBeenCalledWith("Method Not Allowed");
  });

  it("returns 404 if admin not found", async () => {
    const req = {
      method: "POST",
      body: { password: "any" },
    } as NextApiRequest;
    const { res, statusMock, jsonMock } = createMocks();

    singleMock.mockResolvedValue({ data: null, error: {} });

    await handler(req, res);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ error: "Admin not found" });
  });

  it("returns 401 if password is incorrect", async () => {
    const req = {
      method: "POST",
      body: { password: "wrongpass" },
    } as NextApiRequest;
    const { res, statusMock, jsonMock } = createMocks();

    singleMock.mockResolvedValue({
      data: { password: "hashedPassword" },
      error: null,
    });
    mockCompare.mockResolvedValue(false);

    await handler(req, res);

    expect(mockCompare).toHaveBeenCalledWith("wrongpass", "hashedPassword");
    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({ error: "Wrong password" });
  });

  it("returns 401 if signInWithPassword fails or no session", async () => {
    const req = {
      method: "POST",
      body: { password: "correctpass" },
    } as NextApiRequest;
    const { res, statusMock, jsonMock } = createMocks();

    singleMock.mockResolvedValue({
      data: { password: "hashedPassword" },
      error: null,
    });
    mockCompare.mockResolvedValue(true);
    signInWithPasswordMock.mockResolvedValue({
      data: { session: null },
      error: {},
    });

    await handler(req, res);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({ error: "Invalid credentials" });
  });

  it("returns 403 if user role is not admin", async () => {
    const req = {
      method: "POST",
      body: { password: "correctpass" },
    } as NextApiRequest;
    const { res, statusMock, jsonMock } = createMocks();

    singleMock.mockResolvedValue({
      data: { password: "hashedPassword" },
      error: null,
    });
    mockCompare.mockResolvedValue(true);
    signInWithPasswordMock.mockResolvedValue({
      data: {
        session: { access_token: "token" },
        user: { app_metadata: { role: "user" } },
      },
      error: null,
    });

    await handler(req, res);

    expect(statusMock).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({ error: "Access denied" });
  });

  it("sets cookie and returns 200 on success", async () => {
    const req = {
      method: "POST",
      body: { password: "correctpass" },
    } as NextApiRequest;
    const { res, statusMock, jsonMock, setHeaderMock } = createMocks();

    singleMock.mockResolvedValue({
      data: { password: "hashedPassword" },
      error: null,
    });
    mockCompare.mockResolvedValue(true);
    signInWithPasswordMock.mockResolvedValue({
      data: {
        session: { access_token: "token" },
        user: { app_metadata: { role: "admin" } },
      },
      error: null,
    });

    mockSerialize.mockReturnValue("adminToken=cookievalue; Path=/; HttpOnly");

    await handler(req, res);

    expect(mockSerialize).toHaveBeenCalledWith(
      "adminToken",
      "token",
      expect.objectContaining({
        httpOnly: true,
        secure: expect.any(Boolean),
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 2,
      })
    );

    expect(setHeaderMock).toHaveBeenCalledWith(
      "Set-Cookie",
      "adminToken=cookievalue; Path=/; HttpOnly"
    );
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ success: true });
  });

  it("returns 500 on unexpected error", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const req = {
      method: "POST",
      body: { password: "anything" },
    } as NextApiRequest;
    const { res, statusMock, jsonMock } = createMocks();

    singleMock.mockRejectedValue(new Error("Unexpected error"));

    await handler(req, res);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ error: "Internal Server Error" });
    consoleErrorSpy.mockRestore();
  });
});
