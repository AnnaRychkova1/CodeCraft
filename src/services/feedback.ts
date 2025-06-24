import { FeedbackData } from "@/types/types";

export async function sendFeedback(data: FeedbackData): Promise<Response> {
  const response = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to send feedback");
  }

  return response;
}
