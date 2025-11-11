import { authService } from "@/features/auth/services/auth-service";
import type { IUser } from "@/types/user";
import { GC_TIME, STALE_TIME } from "@/utils/constants";
import { getErrorMessage } from "@/utils/functions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  session: () => [...authKeys.all, "session"] as const,
};

const saveUserData = (
  userData: IUser | null,
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>
) => {
  if (userData) {
    localStorage.setItem("app_user", JSON.stringify(userData));
  } else {
    localStorage.removeItem("app_user");
  }
  setUser(userData);
};

export const useGetCurrentUser = (
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>
) => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const response = await authService.getCurrentUser();
      if (response.success) {
        const userData = response.payload;
        saveUserData(userData, setUser);
        return userData;
      }
      throw new Error("Failed to get user data");
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

export const useLogin = (
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      authService.login(credentials.email, credentials.password),
    onSuccess: async () => {
      setError(null);
      const userResponse = await authService.getCurrentUser();
      if (userResponse) {
        saveUserData(userResponse.payload, setUser);
        toast.success("Login successful");
      } else {
        //@ts-ignore
        toast.error(userResponse.detail);
      }
    },
    onError: (err: any) => {
      setError(getErrorMessage(err) || "Login failed");
      toast.error(getErrorMessage(err) || "Login failed");
      authService.logout();
      saveUserData(null, setUser);
      return { success: false, error: getErrorMessage(err) };
    },
  });
};

export const useRegister = (
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  return useMutation({
    mutationFn: (userData: {
      email: string;
      password: string;
      full_name?: string;
    }) => authService.register(userData),
    onSuccess: () => {
      setError(null);
      toast.success("Registration successful! Please log in.");
      return { success: true };
    },
    onError: (err: any) => {
      setError(getErrorMessage(err) || "Registration failed");
      toast.error(getErrorMessage(err) || "Registration failed");
      return { success: false, error: getErrorMessage(err) };
    },
  });
};

export const useLogout = (
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return authService.logout();
    },
    onSuccess: () => {
      saveUserData(null, setUser);
      toast.success("Logged out successfully");
      queryClient.clear();
      setError(null);
      return { success: true };
    },
    onError: (err: any) => {
      setError(getErrorMessage(err) || "Logout failed");
      toast.error(getErrorMessage(err) || "Logout failed");
      saveUserData(null, setUser);
      return { success: false, error: getErrorMessage(err) };
    },
  });
};

export const useAuthStatus = () => {
  const session = useQuery({
    queryKey: authKeys.session(),
    queryFn: async () => {
      const { payload } = await authService.checkAuth();
      return payload;
    },
    initialData: { isAuthenticated: false, user: null },
  });
  return {
    isAuthenticated: session.data.isAuthenticated,
    user: session.data.user,
    isAuthChecked: session.isSuccess || session.isError,
    isLoading: session.isLoading,
  };
};
