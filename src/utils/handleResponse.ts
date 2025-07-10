export async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (res.status === 429 || data?.error?.includes("Too Many Requests")) {
    return ["Too many requests"] as unknown as T;
  }

  if (!res.ok || data?.error) {
    throw new Error(data?.error || res.statusText || "Unknown error");
  }

  return data;
}
