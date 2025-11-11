import { ReactNode } from "react";
import type { IUser } from "./User";
import type { IUserResponse } from "@/features/auth/services/auth-service";

export interface IAuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  checkCurrentUser: (userId: string) => boolean;
  isLoading: boolean;
  login: (email: string, password: string) => any;
  logout: () => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  getCurrentUser: () => Promise<IUser, Error>;
  error: string | null;
  clearError: () => void;
}

export interface IAuthProviderProps {
  children: ReactNode;
}