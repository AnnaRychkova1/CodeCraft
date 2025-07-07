import type { FeedbackData } from "@/types/commonTypes";
import { handleResponse } from "@/utils/handleResponse";

export async function sendFeedback(data: FeedbackData) {
  const res = await fetch("/api/public/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}
