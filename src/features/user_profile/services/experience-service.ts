import { apiClient } from "@/lib/fetch";
import type { IExperience } from "../utils/types";
import { USER_PROFILE_ENDPOINTS } from "./endpoints";

export interface IExperienceResponse {
  success: boolean;
  payload: IExperience[];
}

export interface IExperienceDTO extends Omit<IExperience, "id"> {}

export const experienceService = {
  getExperience: async (): Promise<IExperienceResponse> => {
    const response = await apiClient.get(USER_PROFILE_ENDPOINTS.EXPERIENCE);
    return response as IExperienceResponse;
  },

  postExperience: async (
    payload: IExperienceDTO
  ): Promise<IExperienceResponse> => {
    const response = await apiClient.post(
      USER_PROFILE_ENDPOINTS.EXPERIENCE,
      payload
    );
    return response as IExperienceResponse;
  },

  putExperience: async (payload: IExperience): Promise<IExperienceResponse> => {
    const response = await apiClient.put(
      USER_PROFILE_ENDPOINTS.EXPERIENCE,
      payload
    );
    return response as IExperienceResponse;
  },

  deleteExperience: async (id: string): Promise<IExperienceResponse> => {
    const response = await apiClient.delete(
      `${USER_PROFILE_ENDPOINTS.EXPERIENCE}`,
      {
        id,
      }
    );
    return response as IExperienceResponse;
  },
};
