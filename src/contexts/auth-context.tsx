import {
  useGetCurrentUser,
  useLogin,
  useLogout,
  useRegister,
} from "@/features/auth";
import { authTokenManagement } from "@/lib/utils";
import type {
  IAuthContextType,
  IAuthProviderProps,
} from "@/types/auth-context";
import type { IUser } from "@/types/user";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<IAuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(() => {
    try {
      const storedUser = localStorage.getItem("app_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentUserQuery = useGetCurrentUser(setUser);
  const loginMutation = useLogin(setUser, setError);
  const registerMutation = useRegister(setError);
  const logoutMutation = useLogout(setUser, setError);

  useEffect(() => {
    const fetchUser = async () => {
      const { access_token } = authTokenManagement.getTokens();
      if (access_token) {
        await getCurrentUserQuery.refetch();
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    setIsAuthLoading(
      loginMutation.isPending ||
        registerMutation.isPending ||
        logoutMutation.isPending
    );
  }, [
    loginMutation.isPending,
    registerMutation.isPending,
    logoutMutation.isPending,
  ]);

  const login = async (email: string, password: string) => {
    return await loginMutation.mutateAsync({ email, password });
  };

  const register = async (
    email: string,
    password: string,
    full_name?: string
  ) => {
    return await registerMutation.mutateAsync({ email, password, full_name });
  };

  const logout = async () => {
    return await logoutMutation.mutateAsync();
  };

  const getCurrentUser = async () => {
    return await getCurrentUserQuery.refetch();
  };

  const checkCurrentUser = (userId: string): boolean => {
    return user?.id.toString() === userId.toString();
  };

  const clearError = () => setError(null);

  const isAuthenticated = !!user;

  const value: IAuthContextType = {
    user,
    isAuthenticated,
    checkCurrentUser,
    isLoading: isAuthLoading,
    login,
    logout,
    register,
    getCurrentUser,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
