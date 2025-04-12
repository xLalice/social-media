import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuthStore } from "../stores/authStore";
import { useEffect } from "react";
import { toast } from "sonner";

export function useUser() {
  const { user, accessToken } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await api.get('/auth/me');
      return response.data.user;
    },
    enabled: !!accessToken && !user
  });

  useEffect(() => {
    if (data && !user) {
      useAuthStore.setState({ user: data });
    }
  }, [data, user]);

  return {
    user: user || data,
    isLoading,
    error,
    isAuthenticated: !!user || !!data
  };
}

export function useLogout() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      try {
        await api.post("/auth/logout");
        toast.success("Logged out successfully");
      } catch (error) {
        console.error("Logout API error:", error);
        toast.error("Failed to log out");
      }

      logout();
    },
    onSuccess: () => {
      navigate("/login");
    },
  });

  return { logout: mutate, isLoading: isPending };
}

export function useAuthCallback() {
  const navigate = useNavigate();
  const handleAuthCallback = useAuthStore((state) => state.handleAuthCallback);

  const { mutate, isPending, error } = useMutation({
    mutationFn: async ({
      code,
      provider,
    }: {
      code: string;
      provider: string;
    }) => {
      await handleAuthCallback(code, provider);
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  return {
    processAuthCallback: mutate,
    isLoading: isPending,
    error,
  };
}
