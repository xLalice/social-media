import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import axios from "axios";
import { User } from "@packages/prisma";

const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;

  loginWithGoogle: () => void;
  loginWithGithub: () => void;
  logout: () => void;
  handleAuthCallback: (code: string, provider: string) => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        accessToken: null,
        isLoading: false,
        error: null,

        loginWithGoogle: () => {
          window.location.href = `${VITE_API_URL}/auth/google`;
        },

        loginWithGithub: () => {
          window.location.href = `${VITE_API_URL}/auth/github`;
        },

        handleAuthCallback: async (code: string, provider: string) => {
          set({ isLoading: true, error: null });

          try {
            const response = await axios.post(
              `${VITE_API_URL}/auth/${provider}/callback`,
              { code }
            );

            const { accessToken } = response.data;

            const userResponse = await axios.get(`${VITE_API_URL}/auth/me`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

            set({
              user: userResponse.data.user,
              accessToken,
              isLoading: false,
            });
          } catch (error) {
            console.error("Auth callback error:", error);
            set({
              isLoading: false,
              error: "Authentication failed. Please try again.",
            });
          }
        },

        logout: () => {
          set({ user: null, accessToken: null });
          document.cookie =
            "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        },

        refreshToken: async () => {
          try {
            const response = await axios.post(
              `${VITE_API_URL}/auth/refresh-token`,
              {},
              { withCredentials: true }
            );

            const { accessToken } = response.data;
            set({ accessToken });
            return true;
          } catch (error) {
            console.error("Token refresh error:", error);
            set({ user: null, accessToken: null });
            return false;
          }
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
        }),
      }
    ),
    { name: 'Auth Store' }
  )
);
