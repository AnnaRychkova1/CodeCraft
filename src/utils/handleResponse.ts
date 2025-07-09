export async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();

  if (!res.ok || data?.error) {
    throw new Error(data?.error || res.statusText || "Unknown error");
  }

  return data;
}
