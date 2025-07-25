import type { NextApiRequest, NextApiResponse } from "next";
import handler from "@/pages/api/admin/access/logout";
import { serialize } from "cookie";

jest.mock("cookie");

const mockSerialize = serialize as jest.Mock;

describe("Logout API handler", () => {
  beforeEach(() => {
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

  it("sets expired cookie and returns 200 on POST", async () => {
    const req = { method: "POST" } as NextApiRequest;
    const { res, statusMock, jsonMock, setHeaderMock } = createMocks();

    mockSerialize.mockReturnValue("adminToken=; Path=/; Max-Age=0; HttpOnly");

    await handler(req, res);

    expect(mockSerialize).toHaveBeenCalledWith(
      "adminToken",
      "",
      expect.objectContaining({
        httpOnly: true,
        secure: expect.any(Boolean),
        sameSite: "strict",
        path: "/",
        maxAge: 0,
      })
    );

    expect(setHeaderMock).toHaveBeenCalledWith(
      "Set-Cookie",
      "adminToken=; Path=/; Max-Age=0; HttpOnly"
    );

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Logged out successfully",
    });
  });

  it("returns 500 on unexpected error", async () => {
    mockSerialize.mockImplementation(() => {
      throw new Error("Test error");
    });
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const req = { method: "POST" } as NextApiRequest;
    const { res, statusMock, jsonMock } = createMocks();

    await handler(req, res);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ error: "Internal Server Error" });
    consoleErrorSpy.mockRestore();
  });
});
