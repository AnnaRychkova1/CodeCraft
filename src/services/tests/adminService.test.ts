import fetchMock from "jest-fetch-mock";
import {
  getAdminAccess,
  verifyAdminToken,
  removeAdminAccess,
} from "@/services/admin";

import type { Admin } from "@/types/adminTypes";

beforeEach(() => {
  fetchMock.resetMocks();
});

describe("adminService", () => {
  const mockAdmin: Admin = {
    password: "secureAdminPassword",
  };

  test("getAdminAccess: should successfully login admin", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    await getAdminAccess(mockAdmin);

    expect(fetchMock).toHaveBeenCalledWith("/api/admin/access/access", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(mockAdmin),
    });
  });

  test("getAdminAccess: should throw error on wrong password", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ error: "Wrong password" }), {
      status: 401,
    });

    await expect(getAdminAccess(mockAdmin)).rejects.toThrow("Wrong password");
  });

  test("verifyAdminToken: should return true when token is valid", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ valid: true }));

    const isValid = await verifyAdminToken();

    expect(fetchMock).toHaveBeenCalledWith("/api/admin/access/verify", {
      method: "POST",
      credentials: "include",
    });
    expect(isValid).toBe(true);
  });

  test("verifyAdminToken: should return false when token is invalid", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ valid: false }));

    const isValid = await verifyAdminToken();

    expect(isValid).toBe(false);
  });

  test("verifyAdminToken: should throw error on server failure", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );

    await expect(verifyAdminToken()).rejects.toThrow("Internal Server Error");
  });

  test("removeAdminAccess: should log out admin successfully", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ message: "Logged out successfully" })
    );

    await removeAdminAccess();

    expect(fetchMock).toHaveBeenCalledWith("/api/admin/access/logout", {
      method: "POST",
      credentials: "include",
    });
  });

  test("removeAdminAccess: should throw error if logout fails", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: "Logout failed" }), {
      status: 400,
    });

    await expect(removeAdminAccess()).rejects.toThrow("Logout failed");
  });

  test("removeAdminAccess: should handle generic error", async () => {
    fetchMock.mockRejectOnce(new Error("Network error"));

    await expect(removeAdminAccess()).rejects.toThrow("Network error");
  });
});
