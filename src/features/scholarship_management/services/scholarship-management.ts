import { apiClient } from "@/lib/fetch";
import type { IScholarship } from "@/types/scholarship";

export interface IPostScholarshipDTO extends Omit<IScholarship, "id"> {}

export interface IPostScholarshipResponse {
  success: boolean;
  message: string;
  payload: {
    scholarship: IScholarship;
  };
}

export interface IGetMyScholarshipsResponse {
  success: boolean;
  message: string;
  payload: {
    scholarships: IScholarship[];
  };
}

export interface IUpdateScholarshipDTO extends Partial<IScholarship> {
  id: string;
}

export interface IUpdateScholarshipResponse {
  success: boolean;
  message: string;
  payload: {
    scholarship: IScholarship;
  };
}

export interface IDeleteScholarshipResponse {
  success: boolean;
  message: string;
}

import { SCHOLARSHIP_MANAGEMENT_ENDPOINTS } from "./endpoints";

export const scholarshipManagementServices = {
  createScholarship: async (
    payload: IPostScholarshipDTO
  ): Promise<IPostScholarshipResponse> => {
    const response = await apiClient.post(
      SCHOLARSHIP_MANAGEMENT_ENDPOINTS.DEFAULT,
      payload
    );
    return response as IPostScholarshipResponse;
  },

  getMyScholarships: async (): Promise<IGetMyScholarshipsResponse> => {
    const response = await apiClient.get(SCHOLARSHIP_MANAGEMENT_ENDPOINTS.ME);
    return response as IGetMyScholarshipsResponse;
  },

  updateScholarship: async (
    payload: IUpdateScholarshipDTO
  ): Promise<IUpdateScholarshipResponse> => {
    const { id, ...data } = payload;
    const response = await apiClient.put(
      `${SCHOLARSHIP_MANAGEMENT_ENDPOINTS.DEFAULT}/${id}`,
      data
    );
    return response as IUpdateScholarshipResponse;
  },

  deleteScholarship: async (
    id: string
  ): Promise<IDeleteScholarshipResponse> => {
    const response = await apiClient.delete(
      `${SCHOLARSHIP_MANAGEMENT_ENDPOINTS.DEFAULT}/${id}`
    );
    return response as IDeleteScholarshipResponse;
  },
};
