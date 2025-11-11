import { apiClient } from "@/lib/fetch";
import type { ICertification } from "../utils/types";
import { USER_PROFILE_ENDPOINTS } from "./endpoints";

export interface ICertificationResponse {
  success: boolean;
  payload: ICertification[];
}

export interface ICertificationDTO extends Omit<ICertification, "id"> {}

export const certificationService = {
  getCertification: async (): Promise<ICertificationResponse> => {
    const response = await apiClient.get(USER_PROFILE_ENDPOINTS.CERTIFICATION);
    return response as ICertificationResponse;
  },

  postCertification: async (
    payload: ICertificationDTO
  ): Promise<ICertificationResponse> => {
    const response = await apiClient.post(
      USER_PROFILE_ENDPOINTS.CERTIFICATION,
      payload
    );
    return response as ICertificationResponse;
  },

  putCertification: async (
    payload: ICertification
  ): Promise<ICertificationResponse> => {
    const response = await apiClient.put(
      USER_PROFILE_ENDPOINTS.CERTIFICATION,
      payload
    );
    return response as ICertificationResponse;
  },

  deleteCertification: async (id: string): Promise<ICertificationResponse> => {
    const response = await apiClient.delete(
      `${USER_PROFILE_ENDPOINTS.CERTIFICATION}`,
      {
        id,
      }
    );
    return response as ICertificationResponse;
  },
};
