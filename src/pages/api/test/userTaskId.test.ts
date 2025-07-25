import handler from "@/pages/api/user/task/[id]";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { getSupabaseUserClient } from "@/lib/supabaseAccess/getSupabaseClient";

jest.mock("next-auth/next");
jest.mock("@/lib/supabaseAccess/getSupabaseClient");

const mockGetServerSession = getServerSession as jest.Mock;
const mockGetSupabaseUserClient = getSupabaseUserClient as jest.Mock;

describe("POST /api/user/task/[id]", () => {
  let mockReq: Partial<NextApiRequest>;
  let mockRes: Partial<NextApiResponse>;
  let statusMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    mockReq = {
      method: "POST",
      query: { id: "123" },
      body: { submitted: true },
    };
    mockRes = {
      status: statusMock,
      json: jest.fn(),
      setHeader: jest.fn(),
      end: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("returns 401 if no session token", async () => {
    mockGetServerSession.mockResolvedValueOnce({ user: {} });
    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  it("returns 400 if taskId is not a string", async () => {
    mockReq.query = { id: 123 as unknown as string };
    mockGetServerSession.mockResolvedValue({
      user: { access_token: "token", email: "test@mail.com" },
    });
    mockGetSupabaseUserClient.mockReturnValue({});

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid task ID" });
  });

  it("returns 405 for unsupported method", async () => {
    mockReq.method = "GET";
    mockGetServerSession.mockResolvedValue({
      user: { access_token: "token", email: "test@mail.com" },
    });

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);
    expect(mockRes.setHeader).toHaveBeenCalledWith("Allow", ["POST"]);
    expect(mockRes.status).toHaveBeenCalledWith(405);
    expect(mockRes.end).toHaveBeenCalledWith("Method GET Not Allowed");
  });

  it("returns 400 if submitted is not boolean", async () => {
    mockReq.body = { submitted: "yes" };
    mockGetServerSession.mockResolvedValue({
      user: { access_token: "token", email: "test@mail.com" },
    });

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "`submitted` is required and must be boolean",
    });
  });

  it("handles expired session error with code PGRST301", async () => {
    const errorWithCode = { code: "PGRST301" };

    mockGetServerSession.mockResolvedValue({
      user: { access_token: "token", email: "test@mail.com" },
    });

    mockGetSupabaseUserClient.mockReturnValue({
      from: (table: string) => {
        if (table === "user") {
          return {
            select: () => ({
              eq: () => ({
                single: async () => {
                  throw errorWithCode;
                },
              }),
            }),
          };
        }
        return {};
      },
    });

    await handler(
      mockReq as unknown as NextApiRequest,
      mockRes as NextApiResponse
    );

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Your session has expired. Please log in again.",
    });
  });

  it("returns 500 if unknown error occurs", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockGetServerSession.mockResolvedValue({
      user: { access_token: "token", email: "test@mail.com" },
    });
    mockGetSupabaseUserClient.mockReturnValue({
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockRejectedValue(new Error("DB down")),
    });

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Failed to save user task result",
    });
    consoleErrorSpy.mockRestore();
  });
});
