import { useMutation } from "@tanstack/react-query";
import { uploadService, type IUploadResponse } from "../services/upload";

export const useUploadFile = () => {
  return useMutation({
    mutationFn: async (file: File): Promise<IUploadResponse> => {
      const validation = uploadService.validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      return uploadService.uploadFile(file);
    },
    onError: (error) => {
      console.error("Upload error:", error);
    },
  });
};

export const useUploadMultipleFiles = () => {
  return useMutation({
    mutationFn: async (files: File[]): Promise<IUploadResponse[]> => {
      for (const file of files) {
        const validation = uploadService.validateFile(file);
        if (!validation.valid) {
          throw new Error(`${file.name}: ${validation.error}`);
        }
      }

      const uploadPromises = files.map((file) =>
        uploadService.uploadFile(file)
      );
      return Promise.all(uploadPromises);
    },
    onError: (error) => {
      console.error("Multiple upload error:", error);
    },
  });
};
