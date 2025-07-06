import type { RegisterUserDto, UserRegisterResponse } from "@/types/userTypes";
import { handleResponse } from "@/utils/handleResponse";

export async function registerUser(
  data: RegisterUserDto
): Promise<UserRegisterResponse> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}
