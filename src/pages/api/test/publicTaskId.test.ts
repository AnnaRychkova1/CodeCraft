import handler from "@/pages/api/public/task/[id]";
import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import { getServerSession } from "next-auth";
import {
  getSupabaseClient,
  getSupabaseUserClient,
} from "@/lib/supabaseAccess/getSupabaseClient";

jest.mock("next-auth", () => ({
  __esModule: true,
  default: jest.fn(),
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/supabaseAccess/getSupabaseClient", () => ({
  getSupabaseClient: jest.fn(),
  getSupabaseUserClient: jest.fn(),
}));

const createMockRes = (): jest.Mocked<NextApiResponse> =>
  ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn(),
    end: jest.fn(),
  } as unknown as jest.Mocked<NextApiResponse>);

const mockGetServerSession = getServerSession as jest.Mock;
const mockGetSupabaseClient = getSupabaseClient as jest.Mock;
const mockGetSupabaseUserClient = getSupabaseUserClient as jest.Mock;

describe("GET /api/task", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if id is missing or invalid", async () => {
    const { req } = createMocks({
      method: "GET",
      query: { id: ["array-instead-of-string"] },
    });
    const res = createMockRes();

    await handler(req as NextApiRequest, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid or missing id" });
  });

  it("returns 405 for non-GET methods", async () => {
    const { req } = createMocks({
      method: "POST",
      query: { id: "task1" },
    });
    const res = createMockRes();

    await handler(req as NextApiRequest, res);

    expect(res.setHeader).toHaveBeenCalledWith("Allow", ["GET"]);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.end).toHaveBeenCalledWith("Method POST Not Allowed");
  });

  it("returns 404 if task not found", async () => {
    const { req } = createMocks({
      method: "GET",
      query: { id: "task1" },
    });
    const res = createMockRes();

    mockGetServerSession.mockResolvedValue(null);
    mockGetSupabaseClient.mockReturnValue({
      from: () => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      }),
    });

    await handler(req as NextApiRequest, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Task not found" });
  });

  it("returns task without userTask if unauthenticated", async () => {
    const { req } = createMocks({
      method: "GET",
      query: { id: "task1" },
    });
    const res = createMockRes();

    mockGetServerSession.mockResolvedValue(null);

    mockGetSupabaseClient.mockReturnValue({
      from: () => ({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: "task1", title: "Task 1" },
              error: null,
            }),
          }),
        }),
      }),
    });

    await handler(req as NextApiRequest, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      task: { id: "task1", title: "Task 1" },
      userTask: null,
    });
  });

  it("returns task with userTask if authenticated", async () => {
    const { req } = createMocks({
      method: "GET",
      query: { id: "task1" },
    });
    const res = createMockRes();

    mockGetServerSession.mockResolvedValue({
      user: { access_token: "abc", email: "test@example.com" },
    });

    mockGetSupabaseUserClient.mockReturnValue({
      from: (table: string) => {
        if (table === "task") {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: { id: "task1", title: "Task 1" },
                  error: null,
                }),
              }),
            }),
          };
        }
        if (table === "user") {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: { id: "user1" },
                  error: null,
                }),
              }),
            }),
          };
        }
        if (table === "user_task") {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                  single: jest.fn().mockResolvedValue({
                    data: {
                      submitted: true,
                      result: 100,
                      solution: "code here",
                    },
                    error: null,
                  }),
                }),
              }),
            }),
          };
        }
        return {
          select: jest.fn().mockResolvedValue({ data: null, error: null }),
        };
      },
    });

    await handler(req as NextApiRequest, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      task: { id: "task1", title: "Task 1" },
      userTask: {
        submitted: true,
        result: 100,
        solution: "code here",
      },
    });
  });

  it("returns 401 if Supabase throws PGRST301 error", async () => {
    const { req } = createMocks({
      method: "GET",
      query: { id: "task1" },
    });
    const res = createMockRes();

    mockGetServerSession.mockResolvedValue({
      user: { access_token: "abc", email: "test@example.com" },
    });

    mockGetSupabaseUserClient.mockReturnValue({
      from: (table: string) => {
        if (table === "task") {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: { id: "task1", title: "Task 1" },
                  error: null,
                }),
              }),
            }),
          };
        }
        if (table === "user") {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockRejectedValue({ code: "PGRST301" }),
              }),
            }),
          };
        }
        return {
          select: jest.fn(),
        };
      },
    });

    await handler(req as NextApiRequest, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Your session has expired. Please log in again.",
    });
  });

  it("returns 500 if unknown error is thrown", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const { req } = createMocks({
      method: "GET",
      query: { id: "task1" },
    });
    const res = createMockRes();

    mockGetServerSession.mockResolvedValue({
      user: { access_token: "abc", email: "test@example.com" },
    });

    mockGetSupabaseUserClient.mockReturnValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: jest.fn().mockRejectedValue(new Error("Unknown error")),
          }),
        }),
      }),
    });

    await handler(req as NextApiRequest, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Internal Server Error",
    });

    consoleErrorSpy.mockRestore();
  });
});
