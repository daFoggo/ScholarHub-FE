import { apiClient } from "@/lib/fetch";
import { authTokenManagement } from "@/lib/utils";
import type { IUser } from "@/types/user";
import {
  BACKEND_API,
  GET_USER_API,
  LOGIN_API,
  REGISTER_API,
} from "@/utils/endpoints";

export interface ILoginResponse {
  success: boolean;
  message: string;
  payload: {
    access_token: string;
    refresh_token: string;
    token_type: string;
  };
}

export interface IRegisterResponse {
  success: boolean;
  message: string;
  payload: {
    user: IUser | null;
  };
}

export interface IRefreshTokenResponse {
  success: boolean;
  message: string;
  payload: {
    access_token: string;
    refresh_token: string;
    token_type: string;
  };
}

export interface IUserResponse {
  success: boolean;
  message: string;
  payload: {
    user: IUser;
  };
}

export interface IAuthCheckResponse {
  success: boolean;
  payload: {
    isAuthenticated: boolean;
    user: IUser | null;
  };
}

export interface ILogoutResponse {
  success: boolean;
}

export const authService = {
  checkAuth: async (): Promise<IAuthCheckResponse> => {
    const { access_token } = authTokenManagement.getTokens();

    if (!access_token) {
      return {
        success: false,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      };
    }

    try {
      const response = await apiClient.get<IUserResponse>(REGISTER_API);

      return {
        success: true,
        payload: {
          isAuthenticated: true,
          user: response.payload.user,
        },
      };
    } catch (error) {
      return {
        success: false,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      };
    }
  },

  login: async (
    username: string,
    password: string
  ): Promise<ILoginResponse> => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch(`${BACKEND_API}${LOGIN_API}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (
      data.payload &&
      data.payload.access_token &&
      data.payload.refresh_token
    ) {
      const { access_token, refresh_token } = data.payload;
      authTokenManagement.setTokens(access_token, refresh_token);
    }

    return data;
  },

  register: async (userData: {
    email: string;
    password: string;
    full_name?: string;
  }): Promise<IRegisterResponse> => {
    const response = await apiClient.post<IRegisterResponse>(
      REGISTER_API,
      userData
    );
    return response;
  },

  getCurrentUser: async (): Promise<IUserResponse> => {
    const response = await apiClient.get<IUserResponse>(GET_USER_API);
    return response;
  },

  logout: (): ILogoutResponse => {
    authTokenManagement.removeTokens();
    return {
      success: true,
    };
  },
};
