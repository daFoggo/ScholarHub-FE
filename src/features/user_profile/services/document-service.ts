import { apiClient } from "@/lib/fetch";
import type { IDocument } from "../utils/types";
import { USER_PROFILE_ENDPOINTS } from "./endpoints";

export interface DocumentCreateRequest {
  type: "resume" | "cover_letter" | "other";
  file_path: string;
  file_name?: string;
}

export interface DocumentUpdateRequest {
  id: string;
  type?: "resume" | "cover_letter" | "other";
  file_path?: string;
  file_name?: string;
}

export interface DocumentResponse {
  success: boolean;
  message: string;
  payload?: IDocument[];
}

export const documentService = {
  // Lấy danh sách documents
  getDocuments: async (): Promise<DocumentResponse> => {
    return apiClient.get(USER_PROFILE_ENDPOINTS.DOCUMENT);
  },

  // Tạo document mới
  createDocument: async (
    data: DocumentCreateRequest
  ): Promise<DocumentResponse> => {
    return apiClient.post(USER_PROFILE_ENDPOINTS.DOCUMENT, data);
  },

  // Cập nhật document
  updateDocument: async (
    data: DocumentUpdateRequest
  ): Promise<DocumentResponse> => {
    return apiClient.put(USER_PROFILE_ENDPOINTS.DOCUMENT, data);
  },

  // Xóa document
  deleteDocument: async (id: string): Promise<DocumentResponse> => {
    return apiClient.delete(USER_PROFILE_ENDPOINTS.DOCUMENT, { id });
  },
};
