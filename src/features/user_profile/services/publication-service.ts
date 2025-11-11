import { apiClient } from "@/lib/fetch";
import type { IPublication } from "../utils/types";
import { USER_PROFILE_ENDPOINTS } from "./endpoints";

export interface IPublicationResponse {
  success: boolean;
  payload: IPublication[];
}

export interface IPublicationDTO extends Omit<IPublication, "id"> {}

export const publicationService = {
  getPublication: async (): Promise<IPublicationResponse> => {
    const response = await apiClient.get(USER_PROFILE_ENDPOINTS.PUBLICATION);
    return response as IPublicationResponse;
  },

  postPublication: async (
    payload: IPublicationDTO
  ): Promise<IPublicationResponse> => {
    const response = await apiClient.post(
      USER_PROFILE_ENDPOINTS.PUBLICATION,
      payload
    );
    return response as IPublicationResponse;
  },

  putPublication: async (
    payload: IPublication
  ): Promise<IPublicationResponse> => {
    const response = await apiClient.put(
      USER_PROFILE_ENDPOINTS.PUBLICATION,
      payload
    );
    return response as IPublicationResponse;
  },

  deletePublication: async (id: string): Promise<IPublicationResponse> => {
    const response = await apiClient.delete(
      `${USER_PROFILE_ENDPOINTS.PUBLICATION}`,
      {
        id,
      }
    );
    return response as IPublicationResponse;
  },
};
