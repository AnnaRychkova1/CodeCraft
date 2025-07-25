import handler from "@/pages/api/public/tasks";
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

describe("GET /api/public/tasks", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 405 for non-GET methods", async () => {
    const { req } = createMocks({ method: "POST" });
    const res = createMockRes();

    await handler(req as NextApiRequest, res);

    expect(res.setHeader).toHaveBeenCalledWith("Allow", ["GET"]);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.end).toHaveBeenCalledWith("Method POST Not Allowed");
  });

  it("returns tasks without userTasks if unauthenticated", async () => {
    const { req } = createMocks({ method: "GET" });
    const res = createMockRes();

    mockGetServerSession.mockResolvedValue(null);

    mockGetSupabaseClient.mockReturnValue({
      from: () => ({
        select: jest.fn().mockResolvedValue({
          data: [{ id: "1", title: "Task 1" }],
          error: null,
        }),
      }),
    });

    await handler(req as NextApiRequest, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      tasks: [{ id: "1", title: "Task 1" }],
      userTasks: [],
    });
  });

  it("returns tasks with userTasks if authenticated", async () => {
    const { req } = createMocks({ method: "GET" });
    const res = createMockRes();

    mockGetServerSession.mockResolvedValue({
      user: { access_token: "abc", email: "test@example.com" },
    });

    mockGetSupabaseUserClient.mockReturnValue({
      from: (table: string) => {
        if (table === "task") {
          return {
            select: jest.fn().mockResolvedValue({
              data: [{ id: "task1", title: "Task 1" }],
              error: null,
            }),
          };
        }
        if (table === "user") {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest
                  .fn()
                  .mockResolvedValue({ data: { id: "user1" }, error: null }),
              }),
            }),
          };
        }
        if (table === "user_task") {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: [
                  {
                    task_id: "task1",
                    submitted: true,
                    result: 80,
                    solution: "code",
                  },
                ],
                error: null,
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
      tasks: [{ id: "task1", title: "Task 1" }],
      userTasks: [
        {
          task_id: "task1",
          submitted: true,
          result: 80,
          solution: "code",
        },
      ],
    });
  });

  it("returns 401 if Supabase throws PGRST301 error", async () => {
    const { req } = createMocks({ method: "GET" });
    const res = createMockRes();

    mockGetServerSession.mockResolvedValue({
      user: { access_token: "abc", email: "test@example.com" },
    });

    mockGetSupabaseUserClient.mockReturnValue({
      from: (table: string) => {
        if (table === "task") {
          return {
            select: jest.fn().mockResolvedValue({
              data: [{ id: "task1", title: "Task 1" }],
              error: null,
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
    const { req } = createMocks({ method: "GET" });
    const res = createMockRes();

    mockGetServerSession.mockResolvedValue({
      user: { access_token: "abc", email: "test@example.com" },
    });

    mockGetSupabaseUserClient.mockReturnValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: jest
              .fn()
              .mockRejectedValue(new Error("Some unknown error")),
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
