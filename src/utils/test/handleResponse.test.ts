import { handleResponse } from "@/utils/handleResponse";

describe("handleResponse", () => {
  it("returns parsed data when response is ok", async () => {
    const mockRes = {
      ok: true,
      status: 200,
      json: async () => ({ message: "Success" }),
    } as Response;

    const data = await handleResponse<{ message: string }>(mockRes);
    expect(data).toEqual({ message: "Success" });
  });

  it("throws error when response contains error field", async () => {
    const mockRes = {
      ok: true,
      status: 200,
      json: async () => ({ error: "Something went wrong" }),
    } as Response;

    await expect(handleResponse(mockRes)).rejects.toThrow(
      "Something went wrong"
    );
  });

  it("throws error when response is not ok and no error in body", async () => {
    const mockRes = {
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({}),
    } as Response;

    await expect(handleResponse(mockRes)).rejects.toThrow(
      "Internal Server Error"
    );
  });

  it("returns fallback error if no statusText or error provided", async () => {
    const mockRes = {
      ok: false,
      status: 500,
      statusText: "",
      json: async () => ({}),
    } as Response;

    await expect(handleResponse(mockRes)).rejects.toThrow("Unknown error");
  });

  it("returns 'Too many requests' array if 429 or contains rate limit error", async () => {
    const mockRes = {
      ok: false,
      status: 429,
      json: async () => ({ error: "Too Many Requests" }),
    } as Response;

    const data = await handleResponse<string[]>(mockRes);
    expect(data).toEqual(["Too many requests"]);
  });

  it("returns 'Too many requests' if body includes rate limit error but status is not 429", async () => {
    const mockRes = {
      ok: false,
      status: 400,
      json: async () => ({ error: "Too Many Requests" }),
    } as Response;

    const data = await handleResponse<string[]>(mockRes);
    expect(data).toEqual(["Too many requests"]);
  });
});
