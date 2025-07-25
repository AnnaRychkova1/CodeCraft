import {
  getSupabaseClient,
  getSupabaseAdminClient,
  getSupabaseUserClient,
} from "@/lib/supabaseAccess/getSupabaseClient";

import { createClient } from "@supabase/supabase-js";

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(),
}));

describe("Supabase client creators", () => {
  const SUPABASE_URL = "https://example.supabase.co";
  const SUPABASE_ANON_KEY = "anon-key";
  const mockClient = { fake: "client" };

  beforeEach(() => {
    (createClient as jest.Mock).mockClear();
    (createClient as jest.Mock).mockReturnValue(mockClient);

    process.env.SUPABASE_URL = SUPABASE_URL;
    process.env.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
  });

  it("getSupabaseClient creates client without headers", () => {
    const client = getSupabaseClient();

    expect(createClient).toHaveBeenCalledWith(SUPABASE_URL, SUPABASE_ANON_KEY);
    expect(client).toBe(mockClient);
  });

  it("getSupabaseUserClient sets Authorization header", () => {
    const token = "user-token";
    const client = getSupabaseUserClient(token);

    expect(createClient).toHaveBeenCalledWith(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    expect(client).toBe(mockClient);
  });

  it("getSupabaseAdminClient sets Authorization header", () => {
    const token = "admin-token";
    const client = getSupabaseAdminClient(token);

    expect(createClient).toHaveBeenCalledWith(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    expect(client).toBe(mockClient);
  });
});
