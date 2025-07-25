import fetchMock from "jest-fetch-mock";
import { sendFeedback } from "@/services/feedback";
import type { FeedbackData } from "@/types/commonTypes";

beforeEach(() => {
  fetchMock.resetMocks();
});

describe("feedbackService", () => {
  const validData: FeedbackData = {
    email: "user@example.com",
    feedback: "Great platform!",
  };

  test("should send feedback and return success", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }), {
      status: 200,
    });

    const result = await sendFeedback(validData);

    expect(fetchMock).toHaveBeenCalledWith("/api/public/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validData),
    });

    expect(result).toEqual({ success: true });
  });

  test("should throw an error if feedback is missing", async () => {
    const dataWithNoFeedback: FeedbackData = {
      email: "test@mail.com",
      feedback: "",
    };

    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Feedback is required" }),
      {
        status: 400,
      }
    );

    await expect(sendFeedback(dataWithNoFeedback)).rejects.toThrow(
      "Feedback is required"
    );
  });

  test("should throw an error if server fails to send email", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Email failed to send" }),
      {
        status: 500,
      }
    );

    await expect(sendFeedback(validData)).rejects.toThrow(
      "Email failed to send"
    );
  });

  test("should throw a generic error if fetch fails", async () => {
    fetchMock.mockRejectOnce(new Error("Network error"));

    await expect(sendFeedback(validData)).rejects.toThrow("Network error");
  });

  test("should throw status text if no error message is provided", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), {
      status: 405,
      statusText: "Method Not Allowed",
    });

    await expect(sendFeedback(validData)).rejects.toThrow("Method Not Allowed");
  });
});
