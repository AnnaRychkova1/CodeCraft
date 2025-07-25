import { createMocks } from "node-mocks-http";
import handler from "@/pages/api/admin/task/[id]";
import { getSupabaseAdminClient } from "@/lib/supabaseAccess/getSupabaseClient";

jest.mock("@/lib/middlware/adminAuthMiddleware", () => ({
  adminAuthMiddleware: jest.fn((handler) => handler),
}));

jest.mock("@/lib/supabaseAccess/getSupabaseClient", () => ({
  getSupabaseAdminClient: jest.fn(),
}));

jest.mock("@/lib/supabaseAccess/getSupabaseClient");

const mockFrom = jest.fn();

(getSupabaseAdminClient as jest.Mock).mockReturnValue({
  from: mockFrom,
});

describe("PUT/DELETE /api/task/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns 401 if no token", async () => {
    const { req, res } = createMocks({ method: "PUT", query: { id: "1" } });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(401);
    expect(res._getData()).toContain("Unauthorized");
  });

  it("returns 400 if id is invalid", async () => {
    const { req, res } = createMocks({
      method: "PUT",
      query: { id: ["1", "2"] },
      headers: { cookie: "adminToken=fake" },
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getData()).toContain("Invalid or missing id");
  });

  it("returns 400 if code_task format is invalid", async () => {
    const { req, res } = createMocks({
      method: "PUT",
      query: { id: "123" },
      headers: { cookie: "adminToken=token" },
      body: {
        title: "task",
        description: "desc",
        level: 1,
        language: "ts",
        type: "practice",
        code_task: "invalid",
      },
    });

    mockFrom.mockReturnValue({
      update: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getData()).toContain("Invalid code_task format");
  });

  it("returns 404 when task not found on delete", async () => {
    mockFrom.mockReturnValue({
      delete: () => ({
        eq: () => ({
          select: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
    });

    const { req, res } = createMocks({
      method: "DELETE",
      query: { id: "999" },
      headers: { cookie: "adminToken=token" },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(404);
    expect(res._getData()).toContain("Task not found or not deleted");
  });

  it("returns 200 when task deleted", async () => {
    mockFrom.mockReturnValue({
      delete: () => ({
        eq: () => ({
          select: () => Promise.resolve({ data: [{ id: 2 }], error: null }),
        }),
      }),
    });

    const { req, res } = createMocks({
      method: "DELETE",
      query: { id: "2" },
      headers: { cookie: "adminToken=token" },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toContain("Task deleted");
  });

  it("returns 405 for unsupported method", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: { id: "123" },
      headers: { cookie: "adminToken=token" },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
    expect(res._getData()).toContain("Method GET Not Allowed");
  });
});
