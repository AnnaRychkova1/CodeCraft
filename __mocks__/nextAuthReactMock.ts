export const useSession = jest.fn(() => ({
  data: { user: { name: "Test User", email: "test@example.com" } },
  status: "authenticated",
}));

export const signIn = jest.fn();
export const signOut = jest.fn();
