import { apiClient } from "@/lib/fetch";
import type { IAchievement } from "../utils/types";
import { USER_PROFILE_ENDPOINTS } from "./endpoints";

export interface IAchievementResponse {
  success: boolean;
  payload: IAchievement[];
}

export interface IAchievementDTO extends Omit<IAchievement, "id"> {}

export const achievementService = {
  getAchievement: async (): Promise<IAchievementResponse> => {
    const response = await apiClient.get(USER_PROFILE_ENDPOINTS.ACHIEVEMENT);
    return response as IAchievementResponse;
  },

  postAchievement: async (
    payload: IAchievementDTO
  ): Promise<IAchievementResponse> => {
    const response = await apiClient.post(
      USER_PROFILE_ENDPOINTS.ACHIEVEMENT,
      payload
    );
    return response as IAchievementResponse;
  },

  putAchievement: async (
    payload: IAchievement
  ): Promise<IAchievementResponse> => {
    const response = await apiClient.put(
      USER_PROFILE_ENDPOINTS.ACHIEVEMENT,
      payload
    );
    return response as IAchievementResponse;
  },

  deleteAchievement: async (id: string): Promise<IAchievementResponse> => {
    const response = await apiClient.delete(
      `${USER_PROFILE_ENDPOINTS.ACHIEVEMENT}`,
      {
        id,
      }
    );
    return response as IAchievementResponse;
  },
};
