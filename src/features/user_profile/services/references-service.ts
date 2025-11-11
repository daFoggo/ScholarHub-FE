import { apiClient } from "@/lib/fetch";
import type { IReference } from "../utils/types";
import { USER_PROFILE_ENDPOINTS } from "./endpoints";

export interface IReferenceResponse {
  success: boolean;
  payload: IReference[];
}

export interface IReferenceDTO extends Omit<IReference, "id"> {}

export const referenceService = {
  getReference: async (): Promise<IReferenceResponse> => {
    const response = await apiClient.get(USER_PROFILE_ENDPOINTS.REFERENCE);
    return response as IReferenceResponse;
  },

  postReference: async (
    payload: IReferenceDTO
  ): Promise<IReferenceResponse> => {
    const response = await apiClient.post(
      USER_PROFILE_ENDPOINTS.REFERENCE,
      payload
    );
    return response as IReferenceResponse;
  },

  putReference: async (payload: IReference): Promise<IReferenceResponse> => {
    const response = await apiClient.put(
      USER_PROFILE_ENDPOINTS.REFERENCE,
      payload
    );
    return response as IReferenceResponse;
  },

  deleteReference: async (id: string): Promise<IReferenceResponse> => {
    const response = await apiClient.delete(
      `${USER_PROFILE_ENDPOINTS.REFERENCE}`,
      {
        id,
      }
    );
    return response as IReferenceResponse;
  },
};
