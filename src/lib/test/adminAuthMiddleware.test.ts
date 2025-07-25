import { adminAuthMiddleware } from "@/lib/middlware/adminAuthMiddleware";
import { getSupabaseAdminClient } from "@/lib/supabaseAccess/getSupabaseClient";
import type { NextApiRequest, NextApiResponse } from "next";

jest.mock("@/lib/supabaseAccess/getSupabaseClient", () => ({
  getSupabaseAdminClient: jest.fn(),
}));

const createMockReq = (cookies: Record<string, string> = {}): NextApiRequest =>
  ({
    cookies,
    query: {},
    body: {},
    headers: {},
    method: "GET",
    url: "",
    env: {},
  } as unknown as NextApiRequest);

describe("adminAuthMiddleware", () => {
  const handler = jest.fn((req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json({ success: true });
  });

  const createMockRes = () => {
    const res = {} as NextApiResponse;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it("returns 401 if no token is provided", async () => {
    const req = { cookies: {} } as NextApiRequest;
    const res = createMockRes();

    await adminAuthMiddleware(handler)(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Unauthorized: No token provided",
    });
  });

  it("returns 401 if Supabase returns an error or no user", async () => {
    const req = createMockReq({ adminToken: "fake-token" });
    const res = createMockRes();

    (getSupabaseAdminClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
          error: { message: "Invalid" },
        }),
      },
    });

    await adminAuthMiddleware(handler)(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Unauthorized: Invalid token",
    });
  });

  it("returns 403 if user is not admin", async () => {
    const req = createMockReq({ adminToken: "valid-token" });
    const res = createMockRes();

    (getSupabaseAdminClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { app_metadata: { role: "user" } } },
          error: null,
        }),
      },
    });

    await adminAuthMiddleware(handler)(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Forbidden: Insufficient rights",
    });
  });

  it("calls handler if user is admin", async () => {
    const req = createMockReq({ adminToken: "valid-token" });
    const res = createMockRes();

    (getSupabaseAdminClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { app_metadata: { role: "admin" } } },
          error: null,
        }),
      },
    });

    await adminAuthMiddleware(handler)(req, res);

    expect(handler).toHaveBeenCalledWith(req, res);
  });
});
