import { FeedbackData } from "@/types/types";
import { handleResponse } from "@/utils/handleResponse";

export async function sendFeedback(data: FeedbackData) {
  const res = await fetch("/api/public/feedback/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}
