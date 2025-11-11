import { apiClient } from "@/lib/fetch";
import type { IEducation } from "../utils/types";
import { USER_PROFILE_ENDPOINTS } from "./endpoints";

export interface IEducationResponse {
  success: boolean;
  payload: IEducation[];
}

export interface IEducationDTO extends Omit<IEducation, "id"> {}

export const educationService = {
  getEducation: async (): Promise<IEducationResponse> => {
    const response = await apiClient.get(USER_PROFILE_ENDPOINTS.EDUCATION);
    return response as IEducationResponse;
  },

  postEducation: async (
    payload: IEducationDTO
  ): Promise<IEducationResponse> => {
    const response = await apiClient.post(
      USER_PROFILE_ENDPOINTS.EDUCATION,
      payload
    );
    return response as IEducationResponse;
  },

  putEducation: async (payload: IEducation): Promise<IEducationResponse> => {
    const response = await apiClient.put(
      USER_PROFILE_ENDPOINTS.EDUCATION,
      payload
    );
    return response as IEducationResponse;
  },

  deleteEducation: async (id: string): Promise<IEducationResponse> => {
    const response = await apiClient.delete(
      `${USER_PROFILE_ENDPOINTS.EDUCATION}`,
      {
        id,
      }
    );
    return response as IEducationResponse;
  },
};
