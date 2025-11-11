import { apiClient } from "@/lib/fetch";
import type { IPersonalInfo } from "../utils/types";
import { USER_PROFILE_ENDPOINTS } from "./endpoints";

export interface IPersonalResponse {
  success: boolean;
  payload: IPersonalInfo;
}

export interface IPersonalDTO extends Omit<IPersonalInfo, "id"> {}
export const personalService = {
  getPersonal: async (): Promise<IPersonalResponse> => {
    const response = await apiClient.get(USER_PROFILE_ENDPOINTS.PERSONAL);
    return response as IPersonalResponse;
  },

  postPersonal: async (payload: IPersonalDTO): Promise<IPersonalResponse> => {
    const response = await apiClient.post(
      USER_PROFILE_ENDPOINTS.PERSONAL,
      payload
    );
    return response as IPersonalResponse;
  },

  putPersonal: async (payload: IPersonalDTO): Promise<IPersonalResponse> => {
    const response = await apiClient.put(
      USER_PROFILE_ENDPOINTS.PERSONAL,
      payload
    );
    return response as IPersonalResponse;
  },

  deletePersonal: async (): Promise<IPersonalResponse> => {
    const response = await apiClient.delete(USER_PROFILE_ENDPOINTS.PERSONAL);
    return response as IPersonalResponse;
  },
};
