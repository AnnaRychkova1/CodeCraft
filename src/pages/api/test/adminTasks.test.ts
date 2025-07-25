import { createMocks } from "node-mocks-http";
import handler from "@/pages/api/admin/tasks";
import { getSupabaseAdminClient } from "@/lib/supabaseAccess/getSupabaseClient";

jest.mock("@/lib/middlware/adminAuthMiddleware", () => ({
  adminAuthMiddleware: jest.fn((handler) => handler),
}));

jest.mock("@/lib/supabaseAccess/getSupabaseClient", () => ({
  getSupabaseAdminClient: jest.fn(),
}));

const mockInsert = jest.fn().mockReturnThis();
const mockSelect = jest.fn().mockReturnThis();
const mockSingle = jest
  .fn()
  .mockResolvedValue({ data: { id: 1 }, error: null });

type SupabaseInsertResult<T = unknown> = {
  select: () => {
    single: () => Promise<{ data: T | null; error: Error | null }>;
  };
};

type SupabaseTableMock = {
  insert: () => SupabaseInsertResult | Promise<{ error: Error | null }>;
};

type SupabaseClientMock = {
  from: (table: string) => SupabaseTableMock;
};

const mockSupabase: SupabaseClientMock = {
  from: jest.fn((table: string): SupabaseTableMock => {
    if (table === "task") {
      return {
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: { id: 42 }, error: null }),
          }),
        }),
      };
    }

    if (table === "theory_question") {
      return {
        insert: () => Promise.resolve({ error: null }),
      };
    }

    return {
      insert: () => Promise.resolve({ error: null }),
    };
  }),
};

describe("POST /api/task", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getSupabaseAdminClient as jest.Mock).mockReturnValue(mockSupabase);
    mockInsert.mockReturnThis();
    mockSelect.mockReturnThis();
    mockSingle.mockResolvedValue({ data: { id: 1 }, error: null });
  });

  it("returns 401 if no token", async () => {
    const { req, res } = createMocks({ method: "POST" });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getData()).toContain("Unauthorized");
  });

  it("creates theory task with questions", async () => {
    const body = {
      title: "Test Task",
      description: "desc",
      level: 1,
      language: "js",
      type: "theory",
      theory_question: [
        {
          question: "What is JS?",
          options: ["lang", "animal"],
          correct_answer: "lang",
        },
      ],
    };

    const { req, res } = createMocks({
      method: "POST",
      body,
      headers: {
        cookie: "adminToken=fake_token",
      },
    });

    mockSupabase.from = jest.fn((table) => {
      if (table === "task") {
        return {
          insert: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: { id: 42 }, error: null }),
            }),
          }),
        };
      }
      if (table === "theory_question") {
        return {
          insert: jest.fn(() => Promise.resolve({ error: null })),
        };
      }
      return { insert: jest.fn() };
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(res._getData()).toContain("Task created successfully");
  });

  it("returns 400 if code_task is invalid", async () => {
    const body = {
      title: "Task",
      description: "desc",
      level: 1,
      language: "ts",
      type: "practice",
      code_task: "bad_format",
    };

    const { req, res } = createMocks({
      method: "POST",
      body,
      headers: {
        cookie: "adminToken=fake_token",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getData()).toContain("Invalid code_task format");
  });

  it("returns 405 for GET method", async () => {
    const { req, res } = createMocks({
      method: "GET",
      headers: {
        cookie: "adminToken=fake_token",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getData()).toContain("Method GET Not Allowed");
  });

  it("returns 500 if task insert fails", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const body = {
      title: "Error Task",
      description: "desc",
      level: 1,
      language: "js",
      type: "theory",
      theory_question: [],
    };

    mockSupabase.from = jest.fn((table) => {
      if (table === "task") {
        return {
          insert: () => ({
            select: () => ({
              single: () =>
                Promise.resolve({ data: null, error: new Error("DB error") }),
            }),
          }),
        };
      }
      return { insert: jest.fn() };
    });

    const { req, res } = createMocks({
      method: "POST",
      body,
      headers: {
        cookie: "adminToken=token",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toContain("Internal Server Error");
    consoleSpy.mockRestore();
  });
});
