import fetchMock from "jest-fetch-mock";
import { registerUser } from "@/services/user";

import type { RegisterUserDto } from "@/types/userTypes";

beforeEach(() => {
  fetchMock.resetMocks();
});

describe("registerUser", () => {
  const mockData: RegisterUserDto = {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
  };

  test("should register a new user successfully", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        message: "User registered successfully.",
      }),
      { status: 201 }
    );

    const res = await registerUser(mockData);

    expect(fetchMock).toHaveBeenCalledWith("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockData),
    });

    expect(res).toEqual({
      message: "User registered successfully.",
    });
  });

  test("should throw error if missing fields", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ error: "Missing fields" }), {
      status: 400,
    });

    await expect(
      registerUser({ name: "", email: "", password: "" })
    ).rejects.toThrow("Missing fields");
  });

  test("should throw error if Supabase auth fails", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Failed to create auth user" }),
      { status: 400 }
    );

    await expect(registerUser(mockData)).rejects.toThrow(
      "Failed to create auth user"
    );
  });

  test("should throw error if DB insert fails", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Failed to insert user into DB" }),
      { status: 500 }
    );

    await expect(registerUser(mockData)).rejects.toThrow(
      "Failed to insert user into DB"
    );
  });

  test("should handle unexpected server error", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );

    await expect(registerUser(mockData)).rejects.toThrow(
      "Internal server error"
    );
  });
});
