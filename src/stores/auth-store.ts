import { create } from "zustand";
import { authClient } from "../lib/auth-client";

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
}

interface AuthState {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  fetchSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: false,
  error: null,

  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "http://localhost:5173",
        fetchOptions: {
          onSuccess: async () => {
            console.log("Social sign in success, fetching session...");
            await get().fetchSession();
            set({ isLoading: false });
          },
          onError: (ctx: any) => {
            console.error("Social Sign In Error:", ctx.error);
            set({
              error: ctx.error.message || "Sign in failed.",
              isLoading: false,
            });
          },
        },
      });
    } catch (err: any) {
      console.error("Social Sign In Catch Error:", err);
      set({ error: err.message || "Failed to sign in", isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await authClient.signOut();
      set({ user: null, session: null, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to sign out", isLoading: false });
    }
  },

  fetchSession: async () => {
    set({ isLoading: true });
    try {
      const { data: session } = await authClient.getSession();
      if (session) {
        set({
          user: session.user as User,
          session: session.session,
          isLoading: false,
        });
      } else {
        set({ user: null, session: null, isLoading: false });
      }
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch session",
        isLoading: false,
      });
    }
  },
}));
