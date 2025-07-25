import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import handler from "@/pages/api/admin/access/verify";
import { getSupabaseAdminClient } from "@/lib/supabaseAccess/getSupabaseClient";

jest.mock("cookie");
jest.mock("@/lib/supabaseAccess/getSupabaseClient");

const mockParse = parse as jest.Mock;
const mockGetSupabaseAdminClient = getSupabaseAdminClient as jest.Mock;

describe("Verify admin token API handler", () => {
  let getUserMock: jest.Mock;

  beforeEach(() => {
    getUserMock = jest.fn();

    mockGetSupabaseAdminClient.mockReturnValue({
      auth: { getUser: getUserMock },
    });

    mockParse.mockReset();
    mockGetSupabaseAdminClient.mockClear();
  });

  const createMocks = () => {
    const jsonMock = jest.fn();
    const endMock = jest.fn();
    const statusMock = jest.fn(() => ({ json: jsonMock, end: endMock }));
    const res = {
      status: statusMock,
      json: jsonMock,
      end: endMock,
    } as unknown as NextApiResponse;
    return { res, statusMock, jsonMock, endMock };
  };

  it("returns 405 if method is not POST", async () => {
    const req = { method: "GET", headers: {} } as NextApiRequest;
    const { res, statusMock, endMock } = createMocks();

    await handler(req, res);

    expect(statusMock).toHaveBeenCalledWith(405);
    expect(endMock).toHaveBeenCalledWith("Method Not Allowed");
  });

  it("returns 401 if adminToken cookie is missing", async () => {
    const req = { method: "POST", headers: { cookie: "" } } as NextApiRequest;
    const { res, statusMock, jsonMock } = createMocks();

    mockParse.mockReturnValue({});

    await handler(req, res);

    expect(mockParse).not.toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      valid: false,
      message: "Missing token",
    });
  });

  it("returns 401 if getUser returns error or no user", async () => {
    const req = {
      method: "POST",
      headers: { cookie: "adminToken=token" },
    } as NextApiRequest;
    const { res, statusMock, jsonMock } = createMocks();

    mockParse.mockReturnValue({ adminToken: "token" });

    getUserMock.mockResolvedValue({
      data: { user: null },
      error: { message: "Invalid token" },
    });

    await handler(req, res);

    expect(mockGetSupabaseAdminClient).toHaveBeenCalledWith("token");
    expect(getUserMock).toHaveBeenCalledWith("token");
    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      valid: false,
      message: "Invalid token",
    });
  });

  it("returns 403 if user role is not admin", async () => {
    const req = {
      method: "POST",
      headers: { cookie: "adminToken=token" },
    } as NextApiRequest;
    const { res, statusMock, jsonMock } = createMocks();

    mockParse.mockReturnValue({ adminToken: "token" });

    getUserMock.mockResolvedValue({
      data: { user: { user_metadata: { role: "user" } } },
      error: null,
    });

    await handler(req, res);

    expect(statusMock).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({
      valid: false,
      message: "Invalid role",
    });
  });

  it("returns 200 and valid true if admin token is valid", async () => {
    const req = {
      method: "POST",
      headers: { cookie: "adminToken=token" },
    } as NextApiRequest;
    const { res, statusMock, jsonMock } = createMocks();

    mockParse.mockReturnValue({ adminToken: "token" });

    getUserMock.mockResolvedValue({
      data: { user: { user_metadata: { role: "admin" } } },
      error: null,
    });

    await handler(req, res);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ valid: true });
  });

  it("returns 500 on unexpected error", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const req = {
      method: "POST",
      headers: { cookie: "adminToken=token" },
    } as NextApiRequest;
    const { res, statusMock, jsonMock } = createMocks();

    mockParse.mockReturnValue({ adminToken: "token" });

    getUserMock.mockRejectedValue(new Error("Unexpected error"));

    await handler(req, res);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      valid: false,
      message: "Internal Server Error",
    });
    consoleErrorSpy.mockRestore();
  });
});
