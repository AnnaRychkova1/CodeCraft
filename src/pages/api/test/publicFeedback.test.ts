import handler from "@/pages/api/public/feedback";
import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import sgMail from "@sendgrid/mail";

jest.mock("@sendgrid/mail", () => ({
  setApiKey: jest.fn(),
  send: jest.fn(),
}));

const mockSend = sgMail.send as jest.Mock;

const createMockRes = (): jest.Mocked<NextApiResponse> =>
  ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
  } as unknown as jest.Mocked<NextApiResponse>);

describe("POST /api/feedback", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 405 for non-POST methods", async () => {
    const { req } = createMocks({ method: "GET" });
    const res = createMockRes();

    await handler(req as NextApiRequest, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.end).toHaveBeenCalled();
  });

  it("returns 400 if feedback is missing", async () => {
    const { req } = createMocks({
      method: "POST",
      body: { email: "user@example.com" },
    });
    const res = createMockRes();

    await handler(req as NextApiRequest, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Feedback is required" });
  });

  it("sends email and returns 200 on success", async () => {
    const { req } = createMocks({
      method: "POST",
      body: { email: "user@example.com", feedback: "Great site!" },
    });
    const res = createMockRes();

    mockSend.mockResolvedValueOnce([{ statusCode: 202 }]);

    await handler(req as NextApiRequest, res);

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: process.env.SENDGRID_TO,
        from: process.env.SENDGRID_FROM,
        replyTo: "user@example.com",
        subject: "New CodeCraft Feedback",
        text: expect.stringContaining("Great site!"),
      })
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it("handles SendGrid errors and returns 500", async () => {
    const { req } = createMocks({
      method: "POST",
      body: { email: "user@example.com", feedback: "Something bad happened" },
    });
    const res = createMockRes();

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockSend.mockRejectedValueOnce(new Error("SendGrid failure"));

    await handler(req as NextApiRequest, res);

    expect(mockSend).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Email failed to send" });

    consoleErrorSpy.mockRestore();
  });
});
