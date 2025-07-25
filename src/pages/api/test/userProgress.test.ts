import handler from "@/pages/api/user/progress";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { getSupabaseUserClient } from "@/lib/supabaseAccess/getSupabaseClient";

jest.mock("next-auth/next");
jest.mock("@/lib/supabaseAccess/getSupabaseClient");

describe("API handler", () => {
  const mockReq = {} as NextApiRequest;

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as NextApiResponse;

  const mockSession = {
    user: {
      access_token: "token",
      email: "test@example.com",
    },
  };

  const mockSupabaseFrom = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (getSupabaseUserClient as jest.Mock).mockReturnValue({
      from: mockSupabaseFrom,
    });
  });

  it("returns 401 if no access_token", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: {} });
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  it("returns 401 if no email", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { access_token: "token" },
    });
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  it("returns progress data on success", async () => {
    const userData = { id: "user-id" };
    const allTasksData = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const userTasks = [
      { result: "pass", solution: null },
      { result: null, solution: "solved" },
      { result: "pass", solution: "solved" },
    ];

    mockSupabaseFrom.mockImplementation((table) => {
      if (table === "user") {
        return {
          select: () => ({
            eq: () => ({
              single: async () => ({ data: userData, error: null }),
            }),
          }),
        };
      }
      if (table === "task") {
        return {
          select: async () => ({ data: allTasksData, error: null }),
        };
      }
      if (table === "user_task") {
        return {
          select: () => ({
            eq: async () => ({ data: userTasks, error: null }),
          }),
        };
      }
      return null;
    });

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      allTasks: 3,
      doneTasks: 3,
      theory: 2,
      practice: 2,
    });
  });

  it("handles expired session error with code PGRST301", async () => {
    const errorWithCode = { code: "PGRST301" };
    mockSupabaseFrom.mockImplementation((table) => {
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
      return null;
    });

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Your session has expired. Please log in again.",
    });
  });

  it("returns 500 if unknown error occurs", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockSupabaseFrom.mockImplementation(() => {
      throw new Error("Unexpected failure");
    });

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Failed to fetch progress",
    });

    consoleErrorSpy.mockRestore();
  });
});
